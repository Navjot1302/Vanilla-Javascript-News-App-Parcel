const APIKEY = "a84e9f34fa924b8cb6a38f90a1ef9d3b";
const newsAPIDomain = "//newsapi.org/v2";


export const getUrl = search =>
  `${newsAPIDomain}/everything?q=${search}&apiKey=${APIKEY}`;

export const getHeadlines = () =>
  fetch(`${newsAPIDomain}/top-headlines?country=us&apiKey=${APIKEY}`);

export const getData = param => fetch(getUrl(param));

