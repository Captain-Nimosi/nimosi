const searchContainer = document.querySelector(".search-container");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const searchResults = document.getElementById("search-results");

let posts = [];

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getSnippet(content, query) {
  const flatContent = content.replace(/\s+/g, " ").trim();
  const lowerContent = flatContent.toLowerCase();
  const idx = lowerContent.indexOf(query);
  if (idx === -1) return "";

  const start = Math.max(0, idx - 20);
  const end = Math.min(flatContent.length, idx + query.length + 60);

  let snippet = flatContent.substring(start, end);
  if (start > 0) snippet = "…" + snippet;
  if (end < flatContent.length) snippet = snippet + "…";

  snippet = escapeHtml(snippet);
  const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
  return snippet.replace(regex, "<mark>$1</mark>");
}

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

  searchResults.innerHTML = results.map(post => {
  const snippet = getSnippet(post.content, query);
  return `
    <article class="search-result">
      <div>
        <a href="${post.url}">
          ${post.date} ${post.title}
        </a>
      </div>
      ${snippet ? `<div class="search-snippet">${snippet}</div>` : ""}
      <div>
        ${post.category}
      </div>
    </article>
  `;
}).join("");
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
