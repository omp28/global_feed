document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const resultsDiv = document.getElementById("results");

  const search = async (query) => {
    try {
      const response = await fetch("http://localhost:3000/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ q: query }),
      });
      const data = await response.json();

      // Display the results
      resultsDiv.innerHTML = "";
      data.forEach((item) => {
        const videoElement = document.createElement("div");
        videoElement.innerHTML = `
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <ul>
            ${item.comments
              .map(
                (comment) =>
                  `<li>${comment.authorDisplayName}: ${comment.textDisplay}</li>`
              )
              .join("")}
          </ul>
        `;
        resultsDiv.appendChild(videoElement);
      });
    } catch (error) {
      console.error("Error fetching data from API:", error);
      resultsDiv.innerHTML = `<p>Error fetching data</p>`;
    }
  };

  searchButton.addEventListener("click", () => {
    const query = searchInput.value;
    if (query) {
      search(query);
    }
  });

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const query = searchInput.value;
      if (query) {
        search(query);
      }
    }
  });
});
