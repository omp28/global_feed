import fetch from "node-fetch";

const key = process.env.API_KEY;
const apiUrl = "https://www.googleapis.com/youtube/v3/search";

export default async (req, res) => {
  const { q } = req.body;

  if (!q) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  try {
    const response = await fetch(
      `${apiUrl}?part=snippet&maxResults=15&q=${q}&key=${key}`
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data from YouTube API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
