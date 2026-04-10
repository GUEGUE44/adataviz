(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=document.querySelector(`#arbresCard`),t=document.querySelector(`#parisCard`),n=document.querySelector(`#welcome`),r=document.querySelector(`.list`),i=document.querySelector(`#searchBtn`),a=document.querySelector(`#searchInput`),o=document.querySelector(`#homeBtn`),s=document.querySelector(`#mainContent`),c=``,l=`https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/les-arbres/records?limit=100`,u=`https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=100`;o.style.display=`none`,s.style.display=`none`;var d=(e,t,i)=>{n.style.display=`none`,s.style.display=`block`,r.innerHTML=``,h(e),o.style.display=`inline-block`,a.placeholder=t,c=i};e.addEventListener(`click`,()=>{d(l,`Rechercher un arbre`,`arbres`)}),t.addEventListener(`click`,()=>{d(u,`Rechercher une activité`,`paris`)});var f=e=>{let t=document.createElement(`div`);t.classList.add(`card`,`arbres-card`),t.innerHTML=`
  <div class="card-header">
    <h2>${e.libellefrancais??`Arbre inconnu`}</h2>
    <button class="click-btn">▼ voir plus</button>
  </div>
  <div class="card-body cacher">
    <p><strong>Espèce :</strong> ${e.espece??`inconnue`}</p>
    <p><strong>Genre :</strong> ${e.genre??`inconnu`}</p>
    <p><strong>Arrondissement :</strong> ${e.arrondissement??`inconnu`}</p>
    <p><strong>Adresse :</strong> ${e.adresse??`inconnue`}</p>
  </div>
  `,m(t),r.appendChild(t)},p=e=>{let t=document.createElement(`div`);t.classList.add(`card`,`paris-card`),t.innerHTML=`
  <div class="card-header">
    <h2>${e.title??`Événement`}</h2>
    <button class="click-btn">▼ voir plus</button>
  </div>
  <div class="card-body cacher">
    <p><strong>Description :</strong> ${e.description??`inconnue`}</p>
    <p><strong>Lieu :</strong> ${e.address_street??`inconnu`}</p>
    <p><strong>URL :</strong> ${e.contact_url_text??`inconnu`}</p>
    
    <p><strong>Coordonnées :</strong>
    ${e.lat_lon?`<a href="https://www.google.com/maps?q=${e.lat_lon.lat},${e.lat_lon.lon}" target="_blank">
        ${e.lat_lon.lat}, ${e.lat_lon.lon}
        </a>`:`inconnues`}
    </p>

    ${e.cover_url?`<img src="${e.cover_url}" 
            alt="${e.title}" 
            style="max-width:100%; margin-top:5px;">`:``}
  </div>
  `,m(t),r.appendChild(t)},m=e=>{let t=e.querySelector(`.click-btn`),n=e.querySelector(`.card-body`);t.addEventListener(`click`,()=>{n.classList.toggle(`cacher`),t.textContent=n.classList.contains(`cacher`)?`▼ voir plus`:`▲ voir moins`})},h=async(e,t=!1)=>{try{let n=(await(await fetch(e)).json()).results;if(t&&n.length===0){alert(`Aucun résultat trouvé`);return}r.innerHTML=``,n.forEach(t=>{e.includes(`les-arbres`)?f(t):p(t)})}catch(e){console.error(e)}};i.addEventListener(`click`,()=>{let e=a.value;if(!e.trim())return;let t;t=c===`arbres`?`https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/les-arbres/records?limit=10&where=libellefrancais like "%${e}%"`:`https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=10&where=title like "%${e}%"`,h(t,!0)}),o.addEventListener(`click`,()=>{s.style.display=`none`,n.style.display=`flex`,r.innerHTML=``,o.style.display=`none`,a.value=``}),document.querySelectorAll(`.welcome-card`).forEach(e=>{let t=e.querySelector(`video`);e.addEventListener(`mouseenter`,()=>{t.play()}),e.addEventListener(`mouseleave`,()=>{t.pause(),t.currentTime=0})});