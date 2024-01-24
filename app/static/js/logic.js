let myMap; // global, has to be defined for the helper function

// Helper functions
function chooseColor(borough) {
  if (borough === "Brooklyn") {
    return "yellow";
  } else if (borough === "Bronx") {
    return "red";
  } else if (borough === "Manhattan") {
    return "orange";
  } else if (borough === "Queens") {
    return "green";
  } else if (borough === "Staten Island") {
    return "purple";
  } else {
    return "black";
  }
}

function onEachFeature(feature, layer) {
  // create a popup
  layer.bindPopup(`<h1>${feature.properties.neighborhood}</h1><hr><h2>${feature.properties.borough}</h2>`);

  // event listeners
  layer.on({
    // on hover
    mouseover: function (event) {
      layer = event.target;
      layer.setStyle({
        fillOpacity: 0.9
      });
    },
    mouseout: function (event) {
      layer = event.target;
      layer.setStyle({
        fillOpacity: 0.5
      });
    },
    click: function (event) {
      myMap.fitBounds(event.target.getBounds()); // this is why the global myMap needs to be defined
    },
  })
}


// CREATE A MAP
function makeMap(data1, data2) {
  // Step 1: Define your BASE Layers

  // Define variables for our tile layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Step 2: Create the OVERLAY (DATA) Layers

  // Create a new marker cluster group.
  let markerLayer = L.markerClusterGroup();
  let markers = [];

   // Loop through the data.
  for (let i = 0; i < data1.length; i++){

    // Set the data location property to a variable.
    let row = data1[i];
    console.log(row)

    // Check for the location property.
    if (row.location) {
      let latitude = row.location.coordinates[1];
      let longitude = row.location.coordinates[0];
      let location = [latitude, longitude];

      // Add a new marker to the cluster group, and bind a popup.
      let marker = L.marker(location).bindPopup(`<h1>${row.descriptor}</h1><hr><h2>${row.incident_address}</h2>`);
      markerLayer.addLayer(marker);

      // for the heatmap
      markers.push(location);
    }
  }

  let heatLayer = L.heatLayer(markers);

  let boroughs = L.geoJSON(data2, {
    style: function (feature) {
      let mapStyle = {
        color: "white",
        fillColor: chooseColor(feature.properties.borough),
        fillOpacity: 0.5,
        weight: 1.5
      };

      return mapStyle;
    },
    onEachFeature: onEachFeature
  });

  // Step 3: Create the MAP object

  // Create a map object, and set the default layers.
  myMap = L.map("map", {
    center: [40.7, -73.95],
    zoom: 11,
    layers: [street, markerLayer, boroughs]
  });

  // Step 4: Add the Layer Controls (Legend goes here too)

  // Only one base layer can be shown at a time.
  let baseMaps = {
    Street: street,
    Topography: topo
  };

  // Overlays that can be toggled on or off
  let overlayMaps = {
    Boroughs: boroughs,
    Markers: markerLayer,
    HeatMap: heatLayer
  };

  // Pass our map layers into our layer control.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);

}

// Store the API query variables.
// For docs, refer to https://dev.socrata.com/docs/queries/where.html.
// And, refer to https://dev.socrata.com/foundry/data.cityofnewyork.us/erm2-nwe9.
let baseURL = "https://data.cityofnewyork.us/resource/fhrw-4uyv.json?";
let date = "$where=created_date between'2016-01-01T00:00:00' and '2017-01-01T00:00:00'";
let complaint = "&complaint_type=Rodent";
let limit = "&$limit=10000";

// Assemble the API query URL.
let url1 = baseURL + date + complaint + limit;
console.log(url1);

let url2 = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/15-Mapping-Web/nyc.geojson";

d3.json(url1).then(function (data1) {
  d3.json(url2).then(function (data2) {
    makeMap(data1, data2);
  });
});
