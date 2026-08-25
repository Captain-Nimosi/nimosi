const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

let posts = [];

fetch("/nimosi/search.json")
  .then(response => response.json())
  .then(data => {
    posts = data;
  })
  .catch(error => {
    console.error("Search data could not be loaded:", error);
  });

searchInput.addEventListener("keydown", function(event) {
  if (event.key !== "Enter") return;

  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    searchResults.innerHTML = "";
    return;
  }

  const results = posts
    .filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query)
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (results.length === 0) {
    searchResults.innerHTML = "<p>No results.</p>";
    return;
  }

  searchResults.innerHTML = results.map(post => `
    <article class="search-result">
      <div>
        ${post.date} <a href="${post.url}">${post.title}</a>
      </div>
      <div>
        ${post.category}
      </div>
    </article>
  `).join("");
});
