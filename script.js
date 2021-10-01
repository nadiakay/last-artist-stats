//api info
const LASTFM_API_URL = "http://ws.audioscrobbler.com/2.0/?method=";
const LASTFM_API_KEY = "5e7443ce206de81a5b342b82bcd4096b";

//get html elements
const userTextbox = document.getElementById("user-txt");
const table = document.getElementById("artistTable");
const getTopArtistsBtn = document.getElementById("get-top-artists");

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
async function getUserTopArtists() {
  const user = document.getElementById("user-txt").value;
  if (!user) getTopArtists();
  else {
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
  var headRow = `
  <tr class="info">
    <th>Artist</th>`;
  if (providedData[0].listeners) headRow += `<th>Listeners</th>`; //only add listeners column to top charts, not user charts
  headRow += `<th>Scrobbles</th>
  </tr>`;
  table.innerHTML = headRow;

  providedData.forEach((artist) => {
    const row = document.createElement("tr");
    row.classList.add("artist");

    var newRow = `<tr>
    <td>${artist.name}</td>`;
    if (providedData[0].listeners)
      newRow += `<td>${Number(artist.listeners).toLocaleString("en-US")}</td>`; //only add listeners column to top charts, not user charts
    newRow += `<td>${Number(artist.playcount).toLocaleString("en-US")}</td>
    </tr>`;
    row.innerHTML = newRow;

    table.appendChild(row);
  });
}

//event listeners
getTopArtistsBtn.addEventListener("click", getUserTopArtists);
