//api info
const LASTFM_API_URL = "http://ws.audioscrobbler.com/2.0/?method=";
const LASTFM_API_KEY = "5e7443ce206de81a5b342b82bcd4096b";

//get html elements
const main = document.getElementById("main");
const table = document.getElementById("artistTable");
const getTopArtistsBtn = document.getElementById("get-top-artists");
const getUserTopArtistsBtn = document.getElementById("get-user-top-artists");
const sortBtn = document.getElementById("sort");

/*
 *array of json objects
 *stores artist objects from json returned by lastfm api requests
 */
let artistsData = [];

// fetch top artists from last.fm charts
async function getTopArtists() {
  const url =
    LASTFM_API_URL +
    "chart.getTopArtists&api_key=" +
    LASTFM_API_KEY +
    "&format=json";
  const res = await fetch(url);
  const artistsData = await res.json();
  addArtists(artistsData.artists);
  updateTable();
}

//fetch top artists for user (default WojPaint; havent implemented user select)
async function getUserTopArtists(user) {
  const url =
    LASTFM_API_URL +
    "user.getTopArtists&api_key=" +
    LASTFM_API_KEY +
    "&format=json&user=" +
    user;
  const res = await fetch(url);
  const artistsData = await res.json();
  addArtists(artistsData.topartists);
  updateTable();
}

//sort top artists by playcount, descending
function sortScrobblesDescending() {
  artistsData.sort((a, b) => b.playcount - a.playcount);

  updateTable();
}

/*
 *clear artists array
 *then push provided json artists to array
 */
function addArtists(artists) {
  artistsData = [];
  artists.artist.forEach((artist) => {
    artistsData.push(artist);
  });
}

/*
 *update table DOM to display stored artist data
 */
function updateTable(providedData = artistsData) {
  //clear table and add a header row
  table.innerHTML = `
  <tr class="info">
    <th>Artist</th>
    <th>Listeners</th>
    <th>Scrobbles</th>
  </tr>`;

  providedData.forEach((artist) => {
    const row = document.createElement("tr");
    row.classList.add("artist");
    row.innerHTML = `<tr>
    <td>${artist.name}</td>
    <td>${Number(artist.listeners).toLocaleString("en-US")}</td>
    <td>${Number(artist.playcount).toLocaleString("en-US")}</td>
    </tr>`;
    table.appendChild(row);
  });
}

//event listeners
getTopArtistsBtn.addEventListener("click", getTopArtists);
sortBtn.addEventListener("click", sortScrobblesDescending);
getUserTopArtistsBtn.addEventListener("click", () =>
  getUserTopArtists("WojPaint")
);
