// api info
const LASTFM_API_URL = "http://ws.audioscrobbler.com/2.0/?method=";
const LASTFM_API_KEY = "5e7443ce206de81a5b342b82bcd4096b";

// get html elements
const userTextbox = document.getElementById("user-txt");
const displayLog = document.getElementById("log");
const table = document.getElementById("artistTable");
const getTopArtistsBtn = document.getElementById("get-top-artists");

// stores array of json objects fetched from api
let artistsData = [];

// return
function getURL(method, user) {
  var url = LASTFM_API_URL +
    method +
    "&format=json&api_key=" +
    LASTFM_API_KEY;
  if (method === "user.getTopArtists") url += "&user=" + user;
  return url;
}

// fetch top artists from last.fm charts
async function getTopArtists() {
  displayLog.innerHTML = "Request processing...";
  try {
    const res = await fetch(getURL("chart.getTopArtists"));
    const data = await res.json();
    addArtists(data.artists.artist);
    updateTable();
  }
  catch (err) {
    displayLog.innerHTML = "Request failed. " + err;
    table.innerHTML="";
  }
}


// fetch top artists for user (default WojPaint; havent implemented user select)
async function getUserTopArtists() {
  displayLog.innerHTML = "Request processing...";
  try {
    const user = document.getElementById("user-txt").value;
    if (!user) getTopArtists();
    else {
      const res = await fetch(getURL("user.getTopArtists", user));
      if(res.statusText === "Not Found") throw Error('User not found');
      const data = await res.json();
      addArtists(data.topartists.artist);
      updateTable();
    }
  }
  catch (err) {
    displayLog.innerHTML = "Request failed. " + err;
    table.innerHTML="";
  }
}

// clear artists array, then push provided json artists to array
function addArtists(artists) {
  artistsData = [];
  artists.forEach((artist) => {
    artistsData.push(artist);
  });
}

// update table DOM to display stored artist data/
function updateTable(providedData = artistsData) {
  displayLog.innerHTML = "";
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
