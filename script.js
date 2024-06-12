// Initialize the map centered on the northeast of Thailand
const map = L.map("map").setView([16.1, 103.7], 8);

// Add transport map tiles
L.tileLayer(
  "https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=4a98d80f4fbc47d7a4582e9f9dc26709",
  {
    attribution: "&copy; OpenStreetMap contributors & Thunderforest",
    apikey: "4a98d80f4fbc47d7a4582e9f9dc26709",
  }
).addTo(map);

// Define custom marker icons
const customIcon = L.icon({
  iconUrl: "Asset 55map-icon.svg",
  iconSize: [38, 38],
  iconAnchor: [22, 38],
  popupAnchor: [-3, -38],
});

const currentLocationIcon = L.icon({
  iconUrl: "Asset 1map-icon.svg",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

// Add markers to the map from CSV data
const addMarkers = (data) => {
  data.forEach((row) => {
    const { lat, lon, province, band_name, popup: otherDetails } = row;

    const popupContent = `
      <strong>ชื่อวงดนตรี:</strong> ${band_name || "N/A"}<br>
      <strong>จังหวัด:</strong> ${province || "N/A"}<br>
      <strong>รายละเอียดอื่นๆ:</strong> ${otherDetails || "N/A"}<br>
      <button class="get-directions" data-lat="${lat}" data-lon="${lon}">Get Directions</button>
    `;

    L.marker([parseFloat(lat), parseFloat(lon)], { icon: customIcon })
      .addTo(map)
      .bindPopup(popupContent);
  });
};

// Load CSV data and parse it
const loadCSVData = (url) => {
  Papa.parse(url, {
    download: true,
    header: true,
    complete: (results) => addMarkers(results.data),
    error: (err) => console.error("Error loading CSV data:", err),
  });
};

// Load and add markers from the CSV
loadCSVData("data/Mor Lum data - test.csv");

// Routing control
let control;
try {
  control = L.Routing.control({
    waypoints: [],
    routeWhileDragging: true,
    createMarker: () => null, // Prevent default marker creation for route
    addWaypoints: false,
  }).addTo(map);
} catch (e) {
  console.error("Failed to initialize routing control:", e);
}

// Variable to store user's current location
let userLocation = null;

// Handle locating the user
const locateUser = () => {
  map.locate({ setView: true, maxZoom: 16 });
};

const onLocationFound = (e) => {
  userLocation = e.latlng;

  L.marker(e.latlng, { icon: currentLocationIcon })
    .addTo(map)
    .bindPopup("คุณอยู่ที่นี่")
    .openPopup();

  L.circle(e.latlng, {
    radius: 100000, // 100 km
    color: "#aacfce",
    fillColor: "#3388ff",
    fillOpacity: 0.1,
    weight: 2,
    interactive: false,
  }).addTo(map);

  document.getElementById("locate-btn").style.display = "none";
};

const onLocationError = (e) => {
  alert(e.message);
};

map.on("locationfound", onLocationFound);
map.on("locationerror", onLocationError);

document.getElementById("locate-btn").addEventListener("click", locateUser);

// Event listener for "Get Directions" buttons
map.on("popupopen", function (e) {
  const popupNode = e.popup.getElement();
  const button = popupNode.querySelector(".get-directions");

  if (button) {
    button.addEventListener("click", function () {
      const lat = this.getAttribute("data-lat");
      const lon = this.getAttribute("data-lon");

      if (userLocation) {
        control.setWaypoints([
          L.latLng(userLocation.lat, userLocation.lng),
          L.latLng(lat, lon),
        ]);
      } else {
        alert("Please locate yourself first by clicking the locate button.");
      }
    });
  }
});
