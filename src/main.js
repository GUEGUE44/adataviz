//charge mon fichier css
import "./style.css";
//sert a stocker les données(évenements Paris, arbres, nombre de cartes affiché a la fois(50), ou on en est dans la liste et "paris" ou "arbres" (mode actuel))
let parisData = [];
let arbresData = [];
let itemsPerPage = 50;
let currentIndex = 0;
let currentApi = "";
//les 2 cartes de l'acceuil
const arbresCard = document.querySelector("#arbresCard");
const parisCard = document.querySelector("#parisCard");
//la page d'acceuil
const welcome = document.querySelector("#welcome");
//la zone ou les cartes sont affichées
const list = document.querySelector(".list");
//barre de recherche
const searchBtn = document.querySelector("#searchBtn");
const searchInput = document.querySelector("#searchInput");
//bouton de navigation
const returnBtn = document.querySelector("#returnBtn");
const accueilBtn = document.querySelector("#accueilBtn");
//contenu principal + bouton charger + filtres
const mainContent = document.querySelector("#mainContent");
const loadMoreBtn = document.querySelector("#loadMoreBtn");
const categories = document.querySelector("#categories");
//configure les boutons au départ:bouton retour = caché et bouton charger plus = caché

returnBtn.textContent = "Retour";
returnBtn.style.display = "none";
loadMoreBtn.style.display = "none";
//tout est caché au début (a l'acceuil)
categories.style.display = "none";
searchInput.style.display = "none";
searchBtn.style.display = "none";
accueilBtn.style.display = "none";
mainContent.style.display = "none";

//fonction async(récupère les données de l'API)
const load150Paris = async () => {
  //récupère 2 pages d'API en meme temps
  const [res1, res2] = await Promise.all([
    fetch(
      "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=100&offset=0",
    ),
    fetch(
      "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=100&offset=100",
    ),
  ]);
  //transform les réponse en JSON
  const [d1, d2] = await Promise.all([res1.json(), res2.json()]);
  //combine les 2 résultatsen 1 tableau
  parisData = [...d1.results, ...d2.results];
  //reset affichage + affiche les cartes
  currentIndex = 0;
  list.innerHTML = "";
  displayParisData();
};
//fonction pour appeler une API(arbres ou recherche)
const requestApi = async (url, isSearch = false) => {
  try {
    //récupère les données dans l'API
    const res = await fetch(url);
    const data = await res.json();
    //si la recherche est mauvaise alors un messages s'affiche
    if (isSearch && data.results.length === 0) {
      alert("Aucun résultat trouvé");
      return;
    }
    //je vide les cartes affichés
    list.innerHTML = "";
    currentIndex = 0;
    //si mode Paris
    if (currentApi === "paris") {
      //j'affiche les événements
      parisData = data.results;
      displayParisData();
      //sinon j'affiche les arbres
    } else {
      arbresData = data.results;
      displayArbresData();
    }
  } catch (e) {
    console.error(e);
  }
};

//gère le bouton "charger plus"
const updateLoadMore = (data) => {
  //cache le bouton sin tout est afficher
  loadMoreBtn.style.display = currentIndex >= data.length ? "none" : "block";
};

const displayParisData = () => {
  //prends 50 éléments
  parisData
    .slice(currentIndex, currentIndex + itemsPerPage)
    //créer les cartes
    .forEach(createParisCard);
  currentIndex += itemsPerPage;
  updateLoadMore(parisData);
};
//meme chose que le bloque précédent mais pour les arbres
const displayArbresData = () => {
  arbresData
    .slice(currentIndex, currentIndex + itemsPerPage)
    .forEach(createCard);
  currentIndex += itemsPerPage;
  updateLoadMore(arbresData);
};
//gère l'ouverture et la fermeture
const toggleCard = (card) => {
  const btn = card.querySelector(".click-btn");
  const body = card.querySelector(".card-body");
  btn.addEventListener("click", () => {
    //cache ou affiche les infos
    body.classList.toggle("cacher");
    btn.textContent = body.classList.contains("cacher")
      ? "▼ voir plus"
      : "▲ voir moins";
  });
};
//créer une carte arbre
const createCard = (r) => {
  //créer une div
  const div = document.createElement("div");
  div.classList.add("card", "arbres-card");
  //remplit la carte avec les données
  div.innerHTML = `
    <div class="card-header">
      <h2>${r.libellefrancais ?? "Arbre inconnu"}</h2>
      <button class="click-btn">▼ voir plus</button>
    </div>
    <div class="card-body cacher">
      <p><strong>Espèce :</strong> ${r.espece ?? "inconnue"}</p>
      <p><strong>Genre :</strong> ${r.genre ?? "inconnu"}</p>
      <p><strong>Arrondissement :</strong> ${r.arrondissement ?? "inconnu"}</p>
      <p><strong>Adresse :</strong> ${r.adresse ?? "inconnue"}</p>
    </div>`;
  toggleCard(div);
  //ajoute la carte a la page
  list.appendChild(div);
};
//meme principe que le bloc précédent
const createParisCard = (r) => {
  const div = document.createElement("div");
  div.classList.add("card", "paris-card");
  div.innerHTML = `
    <div class="card-header">
      <h2>${r.title ?? "Événement"}</h2>
      <button class="click-btn">▼ voir plus</button>
    </div>
    <div class="card-body cacher">
      <p><strong>Description :</strong> ${r.description ?? "inconnue"}</p>
      <p><strong>Lieu :</strong> ${r.address_street ?? "inconnu"}</p>
      <p><strong>URL :</strong> ${r.contact_url_text ?? "inconnu"}</p>
      <p><strong>Coordonnées :</strong> ${
        r.lat_lon
          ? `<a href="https://www.google.com/maps?q=${r.lat_lon.lat},${r.lat_lon.lon}" target="_blank">${r.lat_lon.lat}, ${r.lat_lon.lon}</a>`
          : "inconnues"
      }</p>
      ${r.cover_url ? `<img src="${r.cover_url}" alt="${r.title}" style="max-width:100%;margin-top:5px;">` : ""}
    </div>`;
  toggleCard(div);
  list.appendChild(div);
};

//ouvre soit arbres soit Paris
const openMain = (type) => {
  //cache l'accueil et affiche le contenu
  welcome.style.display = "none";
  mainContent.style.display = "block";
  returnBtn.style.display = "inline-block";

  list.innerHTML = "";
  currentIndex = 0;
  //enregistre le mode
  currentApi = type;
  loadMoreBtn.style.display = "none";

  searchInput.style.display = "block";
  searchBtn.style.display = "block";

  if (type === "paris") {
    //ajoute
    searchInput.placeholder = "Rechercher une activité";
    categories.style.display = "flex";
    load150Paris();
  } else {
    searchInput.placeholder = "Rechercher un arbre";
    categories.style.display = "none";
    requestApi(
      "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/les-arbres/records?limit=100",
    );
  }
  accueilBtn.style.display = "inline-block";
};
//ouvre la bonne section
arbresCard.addEventListener("click", () => openMain("arbres"));
parisCard.addEventListener("click", () => openMain("paris"));
//recharge les données initiales
returnBtn.addEventListener("click", () => {
  list.innerHTML = "";
  currentIndex = 0;

  // si filtre/recherche actif → on recharge la liste normale
  if (currentApi === "paris") {
    load150Paris();
  } else if (currentApi === "arbres") {
    requestApi(
      "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/les-arbres/records?limit=100",
    );
  }
});
//retour a l'accueil
accueilBtn.addEventListener("click", () => {
  returnBtn.style.display = "inline-block";
  mainContent.style.display = "none";
  welcome.style.display = "flex";
  list.innerHTML = "";
});

//envoie une requete a l'API avec le texte recherché
searchBtn.addEventListener("click", () => {
  const value = searchInput.value.trim();
  if (!value) return;
  const url =
    currentApi === "arbres"
      ? `https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/les-arbres/records?limit=10&where=libellefrancais like "%${value}%"`
      : `https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=10&where=title like "%${value}%"`;
  requestApi(url, true);
});
//permet de lancer la recherche avec le clavier
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchBtn.click();
});
//affiche plus de cartes
loadMoreBtn.addEventListener("click", () => {
  currentApi === "paris" ? displayParisData() : displayArbresData();
});

//lecture des vidéo au survol sur les cartes de l'accueil
document.querySelectorAll(".welcome-card").forEach((card) => {
  const video = card.querySelector("video");
  card.addEventListener("mouseenter", () => video.play());
  card.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
  });
});

//filtres les événements selon les mots-clés
document.querySelectorAll(".category").forEach((cat) => {
  cat.addEventListener("click", () => {
    const type = cat.dataset.type.toLowerCase();
    const filtered = parisData.filter((item) =>
      [
        ...(item.tags || []),
        item.category || "",
        item.title || "",
        item.description || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(type),
    );
    parisData = filtered;
    currentIndex = 0;
    list.innerHTML = "";
    displayParisData();
  });
});
