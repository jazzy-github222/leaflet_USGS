// Define the URL for the earthquake data
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

// Function to determine marker size based on magnitude
const markerSize = magnitude => magnitude * 4;

// Function to determine marker color based on depth
const fillColor = depth => {
  if (depth > 90) return "#ea2c2c";
  if (depth > 70) return "#ea822c";
  if (depth > 50) return "#ee9c00";
  if (depth > 30) return "#eecc00";
  if (depth > 10) return "#d4ee00";
  return "#98ee00";
};

// Use D3 to fetch the data from the earthquake URL
d3.json(url).then(data => {
  // Initialize the map
  const myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });

  // Add a tile layer (the background map image) to our map using OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(myMap);

  // Create a marker for each earthquake
  data.features.forEach(feature => {
    if (feature.geometry && feature.geometry.coordinates) {
      const coordinates = feature.geometry.coordinates;
      const mag = feature.properties.mag;
      const place = feature.properties.place;
      const time = feature.properties.time;
      const depth = coordinates[2];

      // Create a circle marker
      const circle = L.circleMarker([coordinates[1], coordinates[0]], {
        color: fillColor(depth),
        fillColor: fillColor(depth),
        fillOpacity: 0.8,
        radius: markerSize(mag)
      }).addTo(myMap);

      // Bind a popup to the marker
      circle.bindPopup(`<h3>${place}</h3><hr><p>${new Date(time).toLocaleString()}</p><hr><p>Magnitude: ${mag}</p><hr><p>Depth: ${depth}</p>`);
    }
  });

  // Add legend to the map
  const legend = L.control({position: 'bottomright'});

  legend.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'info legend');
    const grades = [0, 10, 30, 50, 70, 90];

    // loop through our depth intervals and generate a label with a colored square for each interval
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            `<i style="background:${fillColor(grades[i] + 1)}"></i> ${grades[i]}${grades[i + 1] ? '-' + grades[i + 1] + '<br>' : '+'}`;
    }

    return div;
  };

  legend.addTo(myMap);
});
