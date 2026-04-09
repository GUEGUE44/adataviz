import "./style.css";

let api_url =
  "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/les-arbres/records?limit=100";
const list = document.querySelector(".list");
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

const requestApi = async (api_url) => {
  try {
    const response = await fetch(api_url);
    const data = await response.json();
    const results = data.results;

    results.forEach((result) => {
      createCard(result);
      console.log(result);
    });
  } catch (error) {
    console.error(error);
  }
};

requestApi(api_url);

// récupérer le bouton rechercher
const searchBtn = document.querySelector("#searchBtn");
const searchInput = document.querySelector("#searchInput");

// écouter le click du bouton rechercher
searchBtn.addEventListener("click", () => {
  const value = searchInput.value;

  api_url = `https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/les-arbres/records?limit=10&where=libellefrancais like"${value}"`;

  list.innerHTML = "";
  requestApi(api_url);
});

//récupérer le bouton rechercher
//écouter le click du bouton rechercher
