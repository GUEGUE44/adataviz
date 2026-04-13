//on importe le fichier
import "./style.css";

//Tableau qui va stocker les données des activités à Paris
let parisData = [];
//On récupère la carte "Les arbres a Paris" dans le HTML
const arbresCard = document.querySelector("#arbresCard");
//On récupère la carte "Que faire à Paris"
const parisCard = document.querySelector("#parisCard");
//écran d'accueil
const welcome = document.querySelector("#welcome");
//endroit où les cartes seront affichées
const list = document.querySelector(".list");
//recherche du bouton
const searchBtn = document.querySelector("#searchBtn");
//barre de recherche
const searchInput = document.querySelector("#searchInput");
//bouton retour a l'acceuil
const homeBtn = document.querySelector("#homeBtn");
//contenue principal
const mainContent = document.querySelector("#mainContent");

//sa sert a a savoir si ont est dans les arbres a Paris ou que faire a Paris.
let currentApi = "";

//Fonction asynchrone (API)
const load150Paris = async () => {
  //Première API (100 résultats)
  const url1 =
    "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=100&offset=0";

  // Première API (100 résultats)(utilisation de offset)
  const url2 =
    "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=100&offset=100";

  //ont appelle la première API
  const res1 = await fetch(url1);
  //on la transform en json
  const data1 = await res1.json();

  //ont appell la deuxième API
  const res2 = await fetch(url2);
  //ont la transform en json
  const data2 = await res2.json();

  // on combine les 2 résultats
  parisData = [...data1.results, ...data2.results];
  console.log("Données reçues :", parisData);

  // on vide l'affichage
  list.innerHTML = "";

  // on affiche 150 max
  parisData.slice(0, 150).forEach((item) => {
    //ont crée une carte pour chaaque activité
    createParisCard(item);
  });
};

//API arbres (les arbres a Paris)
const api_arbres =
  "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/les-arbres/records?limit=100";

//API activités (que faire a Paris)
const api_paris =
  "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=100&offset=0";

//ont cache le bouton acceuil
homeBtn.style.display = "none";
//ont cache le contenu principal
mainContent.style.display = "none";

//fonction qui ouvre l'écran principal
const openMain = (api, placeholder, type) => {
  //ont cache acceuil
  welcome.style.display = "none";
  //ont affiche le contenu
  mainContent.style.display = "block";

  //ont change le texte recherche
  searchInput.placeholder = placeholder;
  //ont affiche le bouton acceuil
  homeBtn.style.display = "inline-block";

  //ont vide liste
  list.innerHTML = "";

  //ont récupère les catégories
  const categories = document.getElementById("categories");
  const parisView = document.getElementById("parisView");
  const arbresView = document.getElementById("arbresView");

  //on sauvegarde les API actuelle
  currentApi = type;
  //si activités Paris
  if (type === "paris") {
    //affiche les catégories
    categories.style.display = "flex";
    parisView.style.display = "block";
    arbresView.style.display = "none";
    //charge 150 activités
    load150Paris();
  } else {
    //cache les catégories + appel les API
    categories.style.display = "none";
    requestApi(api);
  }
};

//click sur la carte les arbres a Paris
arbresCard.addEventListener("click", () => {
  //ont ouvre les arbres a Paris
  openMain(api_arbres, "Rechercher un arbre", "arbres");
});

//click sur le que faire a Paris
parisCard.addEventListener("click", () => {
  //ont ouvre que faire a Paris
  openMain(api_paris, "Rechercher une activité", "paris");
});

//créer la carte les arbres a Paris
const createCard = (result) => {
  //création div
  const div = document.createElement("div");
  //ajout de la class css
  div.classList.add("card", "arbres-card");

  //HTML dynamique
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

const createParisCard = (result, container) => {
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
      //vérifie les coordonnées
      result.lat_lon
        ? //liens google maps
          `<a href="https://www.google.com/maps?q=${result.lat_lon.lat},${result.lat_lon.lon}" target="_blank">
        ${result.lat_lon.lat}, ${result.lat_lon.lon}
        </a>`
        : "inconnues"
    }
    </p>

    ${
      //affiche une image si il y en a une de disponible
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

//fonction ouvrir / fermer carte
const toggleCard = (card) => {
  const btn = card.querySelector(".click-btn");
  const body = card.querySelector(".card-body");

  //click bouton
  btn.addEventListener("click", () => {
    //affiche / cache
    body.classList.toggle("cacher");

    btn.textContent = body.classList.contains("cacher")
      ? "▼ voir plus"
      : "▲ voir moins";
  });
};

//fonction qui appel l'API
const requestApi = async (url, isSearch = false) => {
  try {
    //fetch API
    const response = await fetch(url);
    const data = await response.json();
    //récupération du résultat
    const results = data.results;

    //si activités / sinon arbres
    if (currentApi === "paris") {
      parisData = results;

      list.innerHTML = "";

      results.forEach((item) => {
        createParisCard(item);
      });

      return;
    }

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

//click du bouton rechercher
searchBtn.addEventListener("click", () => {
  //les vcaleurs rechercher
  const value = searchInput.value;

  //si vide stop
  if (!value.trim()) return;

  let searchApi;

  //recherche arbres
  if (currentApi === "arbres") {
    //where=libellefrancais like dans le liens recherche dans nom les arbres a Paris
    searchApi = `https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/les-arbres/records?limit=10&where=libellefrancais like "%${value}%"`;
    //where=title like dans le liens recherche que faire a Paris
  } else {
    searchApi = `https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=10&where=title like "%${value}%"`;
  }

  requestApi(searchApi, true);
});

// retour a l'accueil
homeBtn.addEventListener("click", () => {
  //affichage de l'accueil
  mainContent.style.display = "none";
  welcome.style.display = "flex";

  list.innerHTML = "";
  homeBtn.style.display = "none";
  searchInput.value = "";
});

document.querySelectorAll(".welcome-card").forEach((card) => {
  const video = card.querySelector("video");

  //la vidéo joue au survol
  card.addEventListener("mouseenter", () => {
    video.play();
  });

  card.addEventListener("mouseleave", () => {
    //la vidéo se stop quand la souris part
    video.pause();
    video.currentTime = 0;
  });
});

//récupére la catégories
const categories = document.querySelectorAll(".category");

categories.forEach((cat) => {
  //click sur la catégorie
  cat.addEventListener("click", () => {
    const type = cat.dataset.type.toLowerCase();

    list.innerHTML = "";

    //filtrage des activités
    const filtered = parisData.filter((item) => {
      const text = [
        ...(item.tags || []),
        item.category || "",
        item.title || "",
        item.description || "",
      ]
        //regroupe le texte
        .join(" ")
        .toLowerCase();

      //filtre selon la catégorie
      return text.includes(type);
    });

    filtered.forEach((item) => {
      //affiche le résultat
      createParisCard(item);
    });
  });
});
