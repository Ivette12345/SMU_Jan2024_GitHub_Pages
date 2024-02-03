// Store our API endpoints as queryUrl 
let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson'

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (earthquakeData) {
    console.log(earthquakeData);

//Once we get a response send the data features object to the createFeatures function
    createFeatures(earthquakeData.features);
});
// Create markers/circles whose size increases with magnitude and color with depth
function createMarker(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        weight: 0.5,
        opacity: 0.5,
        fillOpacity: 1
    })};

function createFeatures(earthquakeData) {
// Define a function that we want to run once for each feature in the features array
// Give each feature a popup that describes the location and magnitude of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location:</h3> ${feature.properties.place}<h3> Magnitude:</h3> ${feature.properties.mag}<h3> Depth:</h3> ${feature.geometry.coordinates[2]}`);
    }

//Create a GeoJSON layer that contains the features array on the earthquakeData object.
//Run the onEachFeature function once for each piece of data in the array.
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createMarker
    });

//Send our earthquakes layer to the createMap function
    createMap(earthquakes);
}
function createMap(earthquakes) {
// Step 1: Define the base layers

// Define variables for tile layers (the background map image)

    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

// Step 2: Create the MAP object and set default layers
    let myMap = L.map("map", { 
        center: [64.4971, -146.9675],
        zoom: 8,
        layers: [street, earthquakes]
    });
// Step 3: Add the layer controls 
//Create a baseMaps object
    let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
    };
// Create an overlay object to hold our overlay
    let overlayMaps = {
    "Earthquakes": earthquakes
};

// Pass in baseMaps and overlayMaps
// Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(myMap);

// Create a legend
    let legend = L.control({position: 'bottomright'});
    legend.onAdd = function (myMap) {
        let div = L.DomUtil.create('div', 'info legend');
        grades = [5, 10, 20, 60, 200, 600];
        labels = [];
        // loop through our density intervals and generate a label with a colored square        
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
            '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }  
        return div;
    };
    legend.addTo(myMap);
}
// Increase marker size based on magnitude
function markerSize(magnitude) {
    return magnitude * 5;
}
// Change marker color based on depth
function markerColor(depth) {
    return  depth > 600 ? '#005a32' :
            depth > 200 ? '#238b45' :
            depth > 60 ? '#41ab5d' :            depth > 20 ? '#74c476' :
            depth >= 10 ? '#a1d99b' :
            depth >= 5 ? '#c7e9c0' :
                            '#edf8e9';
} 

