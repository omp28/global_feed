import React, { useState } from "react";

const Index = () => {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = async (searchQuery) => {
    try {
      const response = await fetch("/api/hello", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ q: searchQuery }),
      });
      const data = await response.json();
      console.log("data", data);
      setVideos(data.items);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-2 border-gray-400 p-2 rounded-l"
          placeholder="Search for videos"
        />
        <button
          onClick={() => fetchData(search)}
          className="bg-blue-500 text-white p-2 rounded-r"
        >
          Search
        </button>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <li key={video.id.videoId} className="border rounded overflow-hidden">
            <img
              src={video.snippet.thumbnails.default.url}
              alt={video.snippet.title}
              className="w-full"
            />
            <div className="p-2">
              <p className="font-bold">{video.snippet.title}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Index;
