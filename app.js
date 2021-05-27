//I used a separated script to save all the personal keys and avoid pushing them to the Git 
//repository. Replace this const with your own keys so the app can work.
const APIPublicKey = config.API_PUBLIC_KEY;
const APIts = config.API_TS;
const APIHash = config.API_HASH;
//-----------------------------------------------------------------------------------------


let APIOffset = 0;
let totalCount;
let searchQuery;

const inputSearch = document.getElementById("input-search");
const outputList = document.getElementById("output-list");
const tabs = document.getElementsByClassName("tabs");

window.addEventListener("load", () => {
  fetchCharacters();
});

inputSearch.addEventListener("change", () => {
  searchQuery = inputSearch.value;
  fetchCharacters(searchQuery);
});

const next = async () => {
  if (APIOffset >= 0 && APIOffset < Math.floor(totalCount / 20) * 20) {
    APIOffset += 20;
    fetchCharacters(searchQuery);
  }
};

const previous = async () => {
  if (APIOffset < Math.floor(totalCount / 20) * APIOffset || APIOffset > 0) {
    APIOffset -= 20;
    fetchCharacters(searchQuery);
  }
};

const first = async () => {
  if (APIOffset !== 0) {
    APIOffset = 0;
    fetchCharacters(searchQuery);
  }
};

const last = async () => {
  if (APIOffset !== Math.floor(totalCount / 20) * 20) {
    APIOffset = Math.floor(totalCount / 20) * 20;
    fetchCharacters(searchQuery);
  }
};

const setData = (data) => {
  outputList.innerHTML = "";

  if (data.length !== 0) {
    data.map((character) => {
      const contentHTML = `<li class="character-card">
      <a href=${character.urls[0].url} target="_blanck">
        <div class="card-wrapper">
          <div class="card-img">
            <img src="${character.thumbnail.path}.${
        character.thumbnail.extension
      }" alt="${character.name}" class="img-thumbnail" />
          </div>
          <div class="back-img">
            <p>${
              character.description !== "" && character.description.length > 140
                ? `${character.description.substring(0, 137)}...`
                : "No description available for this character."
            }</p>
            <p class="cta">CLICK FOR MORE INFO!</p>
          </div>
          <div class="card-title">
            <h3 class="title">${character.name}</h3>
          </div>
        </div>
      </a>
    </li>`;

      let outputString = document.createElement("div");
      outputString.innerHTML = contentHTML;
      outputList.appendChild(outputString);
    });
  } else {
    const notFoundHTML = `<h3 class="not-found">SORRY, NOTHING TO SEE HERE</h3>`;

    let outputString = document.createElement("div");
    outputString.innerHTML = notFoundHTML;
    outputList.appendChild(outputString);
  }
};

const fetchCharacters = async (query) => {
  let res;

  if (query) {
    res = await fetch(
      `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${query}&limit=20&offset=${APIOffset}&ts=${APIts}&apikey=${APIPublicKey}&hash=${APIHash}`
    );
  } else {
    res = await fetch(
      `https://gateway.marvel.com:443/v1/public/characters?limit=20&offset=${APIOffset}&ts=${APIts}&apikey=${APIPublicKey}&hash=${APIHash}`
    );
  }

  let results = await res.json();
  totalCount = results.data.total;

  let characters = results.data.results;
  totalCount = results.data.total;
  setData(characters);
};
