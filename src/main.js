import "./style.css";
import javascriptLogo from "./assets/javascript.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import { setupCounter } from "./counter.js";

setupCounter(document.querySelector("#counter"));

const api_url =
  "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/les-arbres/records?limit=10";
const list = document.querySelector(".list");
const createCard = (result) => {
  const div = document.createElement("div");
  div.innerHTML = `${result.arrondissement} - ${result.espece}`;
  list.appendChild(div);
};

const requestApi = async () => {
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

requestApi();
