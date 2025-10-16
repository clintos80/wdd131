/* main.js - used across pages
   features:
   - render attractions & food via arrays (template literals)
   - toggle mobile nav
   - favorites stored in localStorage
   - populate footer year/lastModified
*/

document.addEventListener("DOMContentLoaded", init);

function init() {
  setupNavToggle();
  populateFooter();
  renderPageContent();
  restoreFavoritesUI();
}

/* ---------------- NAV ---------------- */
function setupNavToggle() {
  const btn = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("show");
  });

  // close nav on link click (mobile)
  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("show");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------------- Footer ---------------- */
function populateFooter() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const lmEl = document.getElementById("lastModified");
  if (lmEl) lmEl.textContent = `Last Modification: ${document.lastModified}`;
}

/* ---------------- Data arrays ----------------
   These arrays are objects used to render content on pages.
   You may replace image URLs with your optimized images.
*/
const attractions = [
  {
    id: "lander-anchorage",
    name: "Lander Brothers Anchorage (Asaba)",
    desc: "Historic anchorage and riverside views at Asaba.",
    image: "images/lander-small.jpg",
    yearEstablished: 1900,
    area: 5000
  },
  {
    id: "abraka",
    name: "Abraka Turf & Country Club",
    desc: "Natural springs, resort and golf course.",
    image: "images/abraka-small.jpg",
    yearEstablished: 1955,
    area: 12000
  },
  {
    id: "otuogu-beach",
    name: "Otuogu Beach",
    desc: "Coastal beach spots with fishing communities.",
    image: "images/otuogu-small.jpg",
    yearEstablished: 2002,
    area: 9000
  },
  {
    id: "nana-museum",
    name: "Nana Living History Museum (Koko)",
    desc: "Museum showcasing regional history and artifacts.",
    image: "images/nana-small.jpg",
    yearEstablished: 1998,
    area: 3000
  },
  {
    id: "warri-palace",
    name: "Warri Kingdom Palace",
    desc: "Historic palace and cultural center in Warri.",
    image: "images/warri-small.jpg",
    yearEstablished: 1870,
    area: 15000
  },
  {
    id: "isoko-forest",
    name: "Isoko Forest & Trails",
    desc: "Trails, birdwatching, and traditional villages.",
    image: "images/isoko-small.jpg",
    yearEstablished: 2010,
    area: 8000
  }
];

const foods = [
  { id: "banga", name: "Banga Soup", image: "images/banga-small.jpg", desc: "Rich palm-nut based soup, often with fresh fish." },
  { id: "owho", name: "Owho Soup", image: "images/owho-small.jpg", desc: "Traditional soup served with starch or fufu." },
  { id: "freshfish", name: "Fresh River Fish", image: "images/fish-small.jpg", desc: "Seafood specialties around the coast." }
];

const festivals = [
  "Iwu Festival (Anioma)",
  "Okere Juju Festival (Warri)",
  "Ogwa Festival (Isoko)",
  "River Blessing Ceremonies"
];

/* ---------------- Rendering functions ---------------- */

/* Renders attractions into #attractionGrid (home) or #attractionList (culture page) */
function renderPageContent() {
  // Home: attractionGrid
  const grid = document.getElementById("attractionGrid");
  if (grid) {
    grid.innerHTML = attractions.map(a => attractionCardHTML(a)).join("");
    attachFavoriteHandlers(grid);
  }

  // Culture page: render as list with more detail
  const list = document.getElementById("attractionList");
  if (list) {
    list.innerHTML = attractions.map(a => {
      return `<article class="card" id="${a.id}">
        <div style="display:flex; gap:0.75rem; align-items:flex-start;">
          <img src="${a.image}" alt="${a.name}" loading="lazy" style="width:120px; height:auto; border-radius:8px;">
          <div>
            <h3>${a.name}</h3>
            <p>${a.desc}</p>
            <p><small>Established: ${a.yearEstablished} • Area: ${a.area.toLocaleString()} sq m</small></p>
          </div>
        </div>
      </article>`;
    }).join("");
  }

  // Food page: grid of foods
  const foodGrid = document.getElementById("foodGrid");
  if (foodGrid) {
    foodGrid.innerHTML = foods.map(f => {
      return `<article class="card">
        <img src="${f.image}" alt="${f.name}" loading="lazy">
        <div class="card-content"><h3>${f.name}</h3><p>${f.desc}</p></div>
      </article>`;
    }).join("");
  }

  // Festivals list
  const festList = document.getElementById("festivalList");
  if (festList) {
    festList.innerHTML = festivals.map(s => `<li>${s}</li>`).join("");
  }
}

/* Template for attraction card (uses template literals) */
function attractionCardHTML(a) {
  return `
    <article class="card">
      <img src="${a.image}" alt="${a.name}" loading="lazy">
      <div class="card-content">
        <h3>${a.name}</h3>
        <p>${a.desc}</p>
        <p><small>Established: ${a.yearEstablished}</small></p>
        <div style="display:flex;gap:.5rem;margin-top:.5rem;align-items:center;">
          <button class="btn favorite-btn" data-id="${a.id}">♡ Favorite</button>
          <a class="btn" href="culture.html">Details</a>
        </div>
      </div>
    </article>
  `;
}

/* ---------------- Favorites (localStorage) ---------------- */
function getFavorites() {
  try {
    const raw = localStorage.getItem("deltaFavorites");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveFavorites(list) {
  localStorage.setItem("deltaFavorites", JSON.stringify(list));
}

function toggleFavorite(id, btn) {
  const favs = getFavorites();
  const index = favs.indexOf(id);
  if (index === -1) {
    favs.push(id);
    if (btn) btn.textContent = "♥ Favorited";
  } else {
    favs.splice(index, 1);
    if (btn) btn.textContent = "♡ Favorite";
  }
  saveFavorites(favs);
}

/* Attach event listeners for favorite buttons inside a container */
function attachFavoriteHandlers(container) {
  container.querySelectorAll(".favorite-btn").forEach(btn => {
    const id = btn.getAttribute("data-id");
    // set initial state
    if (getFavorites().includes(id)) {
      btn.textContent = "♥ Favorited";
    } else {
      btn.textContent = "♡ Favorite";
    }
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      toggleFavorite(id, btn);
    });
  });
}

/* After rendering, update any displayed favorites UI */
function restoreFavoritesUI() {
  const favs = getFavorites();
  document.querySelectorAll(".favorite-btn").forEach(btn => {
    const id = btn.getAttribute("data-id");
    if (favs.includes(id)) btn.textContent = "♥ Favorited";
  });
}
