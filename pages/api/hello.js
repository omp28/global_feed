import fetch from "node-fetch";

const key = process.env.API_KEY;
const apiUrl = "https://www.googleapis.com/youtube/v3/search";
const commentsUrl = "https://www.googleapis.com/youtube/v3/commentThreads";

export default async (req, res) => {
  const { q } = req.body;

  if (!q) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  try {
    // Fetch the videos
    const videoResponse = await fetch(
      `${apiUrl}?part=snippet&maxResults=5&q=${q}&key=${key}`
    );
    const videoData = await videoResponse.json();
    console.log("Data fetched from YouTube API:", videoData);

    if (!videoData.items) {
      return res.status(500).json({ error: "Failed to fetch videos" });
    }

    // Extract video IDs
    const videoIds = videoData.items.map((item) => item.id.videoId);

    // Fetch comments for each video
    const commentsPromises = videoIds.map((videoId) =>
      fetch(
        `${commentsUrl}?part=snippet&videoId=${videoId}&maxResults=5&key=${key}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.items) {
            return {
              videoId,
              comments: data.items.map(
                (item) => item.snippet.topLevelComment.snippet
              ),
            };
          } else {
            return {
              videoId,
              comments: [],
            };
          }
        })
    );

    const commentsData = await Promise.all(commentsPromises);
    console.log(
      "Comments data fetched from YouTube API:",
      commentsData[0].comments
    );

    // Combine video details with comments
    const result = videoData.items.map((item, index) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      comments: commentsData[index].comments,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching data from YouTube API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
