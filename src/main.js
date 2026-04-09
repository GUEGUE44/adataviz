import "./style.css";

const arbresCard = document.querySelector("#arbresCard");
const parisCard = document.querySelector("#parisCard");
const welcome = document.querySelector("#welcome");
const list = document.querySelector(".list");
const searchBtn = document.querySelector("#searchBtn");
const searchInput = document.querySelector("#searchInput");
const homeBtn = document.querySelector("#homeBtn");
const mainContent = document.querySelector("#mainContent");
let api_arbres =
  "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/les-arbres/records?limit=100";
const api_paris =
  "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=100";
homeBtn.style.display = "none";
mainContent.style.display = "none";
arbresCard.addEventListener("click", () => {
  welcome.style.display = "none";
  mainContent.style.display = "block";
  list.innerHTML = "";
  requestApi(api_arbres);
  homeBtn.style.display = "inline-block";
  searchInput.placeholder = "Rechercher un arbre";
});

parisCard.addEventListener("click", () => {
  welcome.style.display = "none";
  mainContent.style.display = "block";
  list.innerHTML = "";
  requestApi(api_paris);
  homeBtn.style.display = "inline-block";
  searchInput.placeholder = "Rechercher une activité";
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
    <p><strong>genre :</strong> ${result.genre ?? "inconnue"}</p>
    <p><strong>Arrondissement :</strong> ${result.arrondissement ?? "inconnue"}</p>
    <p><strong>Adresse :</strong> ${result.adresse ?? "inconnue"}</p>
    </div>
  `;

  const btn = div.querySelector(".click-btn");
  const body = div.querySelector(".card-body");

  btn.addEventListener("click", () => {
    body.classList.toggle("cacher");
    btn.textContent = body.classList.contains("cacher")
      ? "▼ voir plus"
      : "▲ voir moins";
  });
  list.appendChild(div);
};
const createParisCard = (result) => {
  const div = document.createElement("div");
  div.classList.add("card");

  div.innerHTML = `
  <div class="card-header">
    <h2>${result.title ?? "Événement"}</h2>
    <button class="click-btn">▼ voir plus</button>
  </div>
  <div class="card-body cacher">
    <p><strong>Description :</strong> ${result.description ?? ""}</p>
    <p><strong>Lieu :</strong> ${result.address_name ?? ""}</p>
    <p><strong>URL :</strong> ${result.contact_url_text ?? ""}</p>
  </div>
  `;

  const btn = div.querySelector(".click-btn");
  const body = div.querySelector(".card-body");

  btn.addEventListener("click", () => {
    body.classList.toggle("cacher");
    btn.textContent = body.classList.contains("cacher")
      ? "▼ voir plus"
      : "▲ voir moins";
  });

  list.appendChild(div);
};

const requestApi = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const results = data.results;

    results.forEach((result) => {
      if (url.includes("les-arbres")) {
        createCard(result);
      } else {
        createParisCard(result);
        console.log(result);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

// récupérer le bouton rechercher

// écouter le click du bouton rechercher
searchBtn.addEventListener("click", () => {
  const value = searchInput.value;
  if (value.trim() !== "") {
    homeBtn.style.display = "inline-block"; // afficher le bouton
  } else {
    homeBtn.style.display = "none";
  }

  const searchApi = `https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/les-arbres/records?limit=10&where=libellefrancais like"${value}"`;

  list.innerHTML = "";
  requestApi(searchApi);
});

homeBtn.addEventListener("click", () => {
  mainContent.style.display = "none";
  welcome.style.display = "flex";

  list.innerHTML = "";

  homeBtn.style.display = "none";

  searchInput.value = "";
  searchInput.placeholder = "Rechercher arbres";
});
//récupérer le bouton rechercher
//écouter le click du bouton rechercher
