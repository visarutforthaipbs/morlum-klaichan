// Initialize the map centered on the northeast of Thailand
const initializeMap = () => {
  const map = L.map("map").setView([16.1, 103.7], 8);

  L.tileLayer(
    "https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=4a98d80f4fbc47d7a4582e9f9dc26709",
    {
      attribution: "&copy; OpenStreetMap contributors & Thunderforest",
      apikey: "4a98d80f4fbc47d7a4582e9f9dc26709",
    }
  ).addTo(map);

  return map;
};

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
const addMarkers = (data, map) => {
  data.forEach((row) => {
    const { lat, lon, province, band_name, popup: otherDetails } = row;

    const popupContent = `
      <strong>ชื่อวงดนตรี:</strong> ${band_name || "N/A"}<br>
      <strong>จังหวัด:</strong> ${province || "N/A"}<br>
      <strong>รายละเอียดอื่นๆ:</strong> ${otherDetails || "N/A"}
    `;

    L.marker([parseFloat(lat), parseFloat(lon)], { icon: customIcon })
      .addTo(map)
      .bindPopup(popupContent);
  });
};

// Load CSV data and parse it
const loadCSVData = (url, map) => {
  Papa.parse(url, {
    download: true,
    header: true,
    complete: (results) => addMarkers(results.data, map),
    error: (err) => console.error("Error loading CSV data:", err),
  });
};

// Handle locating the user
const locateUser = (map) => {
  map.locate({ setView: true, maxZoom: 16 });
};

const onLocationFound = (e) => {
  const radiusKm = 100;
  const radiusMeters = radiusKm * 1000;

  L.marker(e.latlng, { icon: currentLocationIcon })
    .addTo(map)
    .bindPopup(`คุณอยู่ภายใน ${radiusKm} กิโลเมตรจากจุดนี้`)
    .openPopup();

  L.circle(e.latlng, {
    radius: radiusMeters,
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

// Initialize the map and set up event listeners
const map = initializeMap();

map.on("locationfound", onLocationFound);
map.on("locationerror", onLocationError);

document
  .getElementById("locate-btn")
  .addEventListener("click", () => locateUser(map));

// Load and add markers from the CSV
loadCSVData("data/Mor Lum data - test.csv", map);
