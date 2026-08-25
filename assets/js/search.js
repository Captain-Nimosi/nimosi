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

function buildQueryVariants(query) {
  const variants = new Set([query]);
  if (query.length > 1) {
    if (query.endsWith("y")) {
      variants.add(query.slice(0, -1) + "ies");
    }
    variants.add(query + "s");
    variants.add(query + "es");
  }
  return Array.from(variants);
}

function buildHighlightRegex(variants) {
  const pattern = variants
    .map(escapeRegExp)
    .sort((a, b) => b.length - a.length)
    .join("|");
  return new RegExp(`(${pattern})`, "gi");
}

function highlight(text, regex) {
  return escapeHtml(text).replace(regex, "<mark>$1</mark>");
}

function findEarliestMatch(text, variants) {
  const lowerText = text.toLowerCase();
  let best = null;
  variants.forEach(v => {
    const idx = lowerText.indexOf(v.toLowerCase());
    if (idx !== -1 && (best === null || idx < best)) {
      best = idx;
    }
  });
  return best;
}

function getSnippet(content, variants, regex) {
  const flatContent = content.replace(/\s+/g, " ").trim();
  const idx = findEarliestMatch(flatContent, variants);
  if (idx === null) return "";

  const start = Math.max(0, idx - 20);
  const end = Math.min(flatContent.length, idx + 80);

  let snippet = flatContent.substring(start, end);
  if (start > 0) snippet = "…" + snippet;
  if (end < flatContent.length) snippet = snippet + "…";

  return highlight(snippet, regex);
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

  const variants = buildQueryVariants(query);
  const regex = buildHighlightRegex(variants);

  const results = posts
    .filter(post =>
      findEarliestMatch(post.title, variants) !== null ||
      findEarliestMatch(post.content, variants) !== null
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  searchContainer.classList.add("search-active");

  if (results.length === 0) {
    searchResults.innerHTML = "<p>No results.</p>";
    return;
  }

  searchResults.innerHTML = results.map(post => {
    const snippet = getSnippet(post.content, variants, regex);
    const highlightedTitle = highlight(post.title, regex);
    return `
      <article class="search-result">
        <div class="search-result-header">
          <a href="${post.url}">${post.date} ${highlightedTitle}</a>
          <span class="search-result-category">| ${post.category}</span>
        </div>
        ${snippet ? `<div class="search-snippet">${snippet}</div>` : ""}
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
