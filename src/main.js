import "./style.css";

const arbresCard = document.querySelector("#arbresCard");
const parisCard = document.querySelector("#parisCard");
const welcome = document.querySelector("#welcome");
const list = document.querySelector(".list");
const searchBtn = document.querySelector("#searchBtn");
const searchInput = document.querySelector("#searchInput");
const homeBtn = document.querySelector("#homeBtn");
const mainContent = document.querySelector("#mainContent");

let currentApi = "";

const api_arbres =
  "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/les-arbres/records?limit=100";

const api_paris =
  "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=100";

homeBtn.style.display = "none";
mainContent.style.display = "none";

const openMain = (api, placeholder, type) => {
  welcome.style.display = "none";
  mainContent.style.display = "block";

  list.innerHTML = "";
  requestApi(api);

  homeBtn.style.display = "inline-block";
  searchInput.placeholder = placeholder;

  currentApi = type;
};

arbresCard.addEventListener("click", () => {
  openMain(api_arbres, "Rechercher un arbre", "arbres");
});

parisCard.addEventListener("click", () => {
  openMain(api_paris, "Rechercher une activité", "paris");
});

const createCard = (result) => {
  const div = document.createElement("div");
  div.classList.add("card");

  div.innerHTML = `
  <div class="card-header">
    <h2>${result.libellefrancais ?? "Arbre inconnu"}</h2>
    <button class="click-btn">▼ voir plus</button>
  </div>
  <div class="card-body cacher">
    <p><strong>Espèce :</strong> ${result.espece ?? "inconnue"}</p>
    <p><strong>Genre :</strong> ${result.genre ?? "inconnu"}</p>
    <p><strong>Arrondissement :</strong> ${result.arrondissement ?? "inconnu"}</p>
    <p><strong>Adresse :</strong> ${result.adresse ?? "inconnue"}</p>
  </div>
  `;

  toggleCard(div);
  list.appendChild(div);
};

const createParisCard = (result) => {
  const div = document.createElement("div");
  div.classList.add("card", "paris-card");

  div.innerHTML = `
  <div class="card-header">
    <h2>${result.title ?? "Événement"}</h2>
    <button class="click-btn">▼ voir plus</button>
  </div>
  <div class="card-body cacher">
    <p><strong>Description :</strong> ${result.description ?? "inconnue"}</p>
    <p><strong>Lieu :</strong> ${result.address_street ?? "inconnu"}</p>
    <p><strong>URL :</strong> ${result.contact_url_text ?? "inconnu"}</p>
    
    <p><strong>Coordonnées :</strong>
    ${
      result.lat_lon
        ? `<a href="https://www.google.com/maps?q=${result.lat_lon.lat},${result.lat_lon.lon}" target="_blank">
        ${result.lat_lon.lat}, ${result.lat_lon.lon}
        </a>`
        : "inconnues"
    }
    </p>

    ${
      result.cover_url
        ? `<img src="${result.cover_url}" 
            alt="${result.title}" 
            style="max-width:100%; margin-top:5px;">`
        : ""
    }
  </div>
  `;

  toggleCard(div);
  list.appendChild(div);
};

const toggleCard = (card) => {
  const btn = card.querySelector(".click-btn");
  const body = card.querySelector(".card-body");

  btn.addEventListener("click", () => {
    body.classList.toggle("cacher");

    btn.textContent = body.classList.contains("cacher")
      ? "▼ voir plus"
      : "▲ voir moins";
  });
};

const requestApi = async (url, isSearch = false) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const results = data.results;

    if (isSearch && results.length === 0) {
      alert("Aucun résultat trouvé");
      return;
    }

    list.innerHTML = "";

    results.forEach((result) => {
      url.includes("les-arbres") ? createCard(result) : createParisCard(result);
    });
  } catch (error) {
    console.error(error);
  }
};

searchBtn.addEventListener("click", () => {
  const value = searchInput.value;

  if (!value.trim()) return;

  let searchApi;

  if (currentApi === "arbres") {
    searchApi = `https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/les-arbres/records?limit=10&where=libellefrancais like "%${value}%"`;
  } else {
    searchApi = `https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=10&where=title like "%${value}%"`;
  }

  requestApi(searchApi, true);
});

homeBtn.addEventListener("click", () => {
  mainContent.style.display = "none";
  welcome.style.display = "flex";

  list.innerHTML = "";
  homeBtn.style.display = "none";
  searchInput.value = "";
});

document.querySelectorAll(".welcome-card").forEach((card) => {
  const video = card.querySelector("video");

  card.addEventListener("mouseenter", () => {
    video.play();
  });

  card.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
  });
});
