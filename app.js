import { getData, getHeadlines } from "./api";

import { partialOnce } from "./fp.js";

//  cached variables
const getElmById = (el) => document.getElementById(el);

const submit = getElmById("submit-button");
const politicsButton = getElmById("politics-button");
const mainDiv = getElmById("main-div");
const sportsDiv = getElmById("sports-button");
const entertainmentDiv = getElmById("entertainment-button");
const technologyDiv = getElmById("technology-button");
const moviesDiv = getElmById("movies-button");
const inputValue = getElmById("search-for");
const section = getElmById("section");

//  cached variables

const handleSubmit = e => {
  const searchValue = inputValue.value;
  e.preventDefault();
  if (!inputValue.value) {
    mainDiv.innerHTML = "<h1>NOTHING TYPED.PLEASE ENTER SOMETHING</h1>";
    return;
  }
  mainDiv.innerHTML = "";
  section.innerHTML = `RESULTS for "${inputValue.value.toUpperCase()}"`;
  getServerData(searchValue, mainDiv);
  inputValue.value = "";
};


const loadPolitics = () => {
  mainDiv.innerHTML = "";
  section.innerHTML = `<i class="fas fa-marker" class="icons"></i> POLITICS`;
  getServerData("politics", mainDiv);
};
const loadSports = () => {
  mainDiv.innerHTML = "";
  document.body.className = "";
  section.innerHTML = `<i class="fas fa-football-ball" class="icons"></i> SPORTS`;
  getServerData("sports", mainDiv);
};
const loadEntertainment = () => {
  mainDiv.innerHTML = "";
  section.innerHTML = `<i class="fas fa-play" class="icons"></i> ENTERTAINMENT`;
  getServerData("entertainment", mainDiv);
};
const loadTechnology = () => {
  mainDiv.innerHTML = "";
  section.innerHTML = `<i class="fas fa-mobile" class="icons"></i> TECHNOLOGY`;
  getServerData("technology", mainDiv);
};
const loadMovies = () => {
  mainDiv.innerHTML = "";
  section.innerHTML = `<i class="fas fa-film" class="icons"></i> MOVIES`;
  getServerData("movies", mainDiv);
};


const parseAndAppendTo = appendTo => data => {
  data.articles.map(el => {
    const output = `<div id="news-html">
    <a target="_blank" href="${el.url}"><img src="${
      el.urlToImage
      }" alt="Link to Content"></a>
    <h3 id="title">${el.title}</h3>
    <h5>Description: ${el.description || "read full story"}</h5>
    <p>Author: ${el.author || "author not available"}</p> 
      </div>
      <hr>`;
    appendTo.innerHTML += output;
  });
};

const getJson = (data) => data.json();

const headlinesData = appendTo => {
  getHeadlines()
    .then(getJson)
    .then(parseAndAppendTo(appendTo));
};

const getServerData = (inputValue, appendTo) => {
  getData(inputValue)
    .then(getJson)
    .then(parseAndAppendTo(appendTo));
};

const appEventHandlers = [
  {
    eventOn: window,
    eventFn: partialOnce(headlinesData, mainDiv),
    eventType: "load"
  },
  {
    eventOn: submit,
    eventFn: handleSubmit,
    eventType: "click"
  },
  {
    eventOn: politicsButton,
    eventFn: loadPolitics,
    eventType: "click"
  },
  {
    eventOn: sportsDiv,
    eventFn: loadSports,
    eventType: "click"
  },
  {
    eventOn: entertainmentDiv,
    eventFn: loadEntertainment,
    eventType: "click"
  },
  {
    eventOn: technologyDiv,
    eventFn: loadTechnology,
    eventType: "click"
  },
  {
    eventOn: moviesDiv,
    eventFn: loadMovies,
    eventType: "click"
  },

  {
    eventOn: inputValue,
    eventFn: e => {
      e.keyCode === 13 ? handleSubmit(e) : "";
    },
    eventType: "keyup"
  }
];

appEventHandlers.forEach(el => {
  el.eventOn.addEventListener(el.eventType, el.eventFn);
});

