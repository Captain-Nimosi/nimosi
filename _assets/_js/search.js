const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

let posts = [];

fetch("/nimosi/search.json")
  .then(response => response.json())
  .then(data => {
    posts = data;
  });

searchInput.addEventListener("keydown", function(event) {
  if (event.key !== "Enter") return;

  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    searchResults.innerHTML = "";
    return;
  }

  const results = posts.filter(post =>
    post.title.toLowerCase().includes(query) ||
    post.content.toLowerCase().includes(query)
  );

  if (results.length === 0) {
    searchResults.innerHTML = "<p>No results.</p>";
    return;
  }

  searchResults.innerHTML = results.map(post => `
    <article class="search-result">
      <div>
        <a href="${post.url}">${post.title}</a>
      </div>

      <div>
        ${post.date} ${post.category}
      </div>
    </article>
  `).join("");
});
