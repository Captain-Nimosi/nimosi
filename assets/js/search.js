const searchContainer = document.querySelector(".search-container");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
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


function performSearch() {
  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    searchResults.innerHTML = "";
    searchContainer.classList.remove("search-active");
    return;
  }

  const results = posts
    .filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query)
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  /*
   * 검색이 실행되면
   * hover하지 않아도 검색창을 계속 표시
   */
  searchContainer.classList.add("search-active");

  if (results.length === 0) {
    searchResults.innerHTML = "<p>No results.</p>";
    return;
  }

  searchResults.innerHTML = results.map(post => `
    <article class="search-result">

      <div>
        <a href="${post.url}">
          ${post.date} ${post.title}
        </a>
      </div>

      <div>
        ${post.category}
      </div>

    </article>
  `).join("");
}


/*
 * Enter로 검색
 */
searchInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    performSearch();
  }
});


/*
 * go 버튼으로 검색
 */
searchButton.addEventListener("click", function() {
  performSearch();
});
