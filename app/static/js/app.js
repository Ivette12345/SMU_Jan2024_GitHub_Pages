// Define a variable to hold the URL
let url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

// Create a function to plot bar chart (function #1 of 6)
function Bar(sampleID) {
  console.log('Bar(${sampleID})');

// Fetch the JSON data and console log it
d3.json(url).then(data => {
  console.log(data);

// Define samples and filter by sampleID
  let samples = data.samples;
  let metadata = data.metadata;
  let result1 = metadata.filter(meta => meta.id == sampleID)[0];
  let resultArray = samples.filter(s => s.id == sampleID);
  let result = resultArray[0];

  let otu_ids = result.otu_ids;
  let otu_labels = result.otu_labels;
  let sample_values = result.sample_values;

  // Create a trace object for bar chart
let barData = {
  x: sample_values.slice(0,10).reverse(),
  y: otu_ids.slice(0,10).map(otuId => `OTU ${otuId}`).reverse(),
  type: 'bar',
  text: otu_labels.slice(0,10).reverse(),
  orientation: 'h'
};

// Put the trace object into an array
let barArray = [barData];

// Set the layout object
let layout = {
  title: "Top 10 Microbial Species Found",
  xaxis: { title: "Bacteria Sample Values" },
  margin: {t: 25, l: 150},
};
// Invoke the plot creating function
Plotly.newPlot('bar', barArray, layout);
})
}
// Create a function to plot bubble chart
function Bubble(sampleID) {
  console.log('Bubble(${sampleID})');

d3.json(url).then(data => {
  console.log(data);
  let samples = data.samples;
  let metadata = data.metadata;
  let result1 = metadata.filter(meta => meta.id == sampleID)[0];
  let resultArray = samples.filter(s => s.id == sampleID);
  let result = resultArray[0];
  
  let otu_ids = result.otu_ids;
  let otu_labels = result.otu_labels;
  let sample_values = result.sample_values;

// Create a trace object for bubble chart
let bubbleData = {
  x: otu_ids,
  y: sample_values,
  text: otu_labels,
  mode: 'markers',
  marker: {
  size: sample_values,
  color: otu_ids,
  colorscale: 'Earth'
}
}
// Put the trace object into an array
let bubbleArray = [bubbleData];

// Set the layout object
let layout = {
  title: 'Microbial Species Per Sample',
  margin: {t: 30},
  hovermode: 'closest',
  xaxis: {title: "OTU IDs"},
  yaxis: {title: "Bacteria Sample Values"},
};

// Invoke the plot creating function 
Plotly.newPlot('bubble', bubbleArray, layout);
})
}

// Create function for gauge chart
function Gauge(sampleID) {
  console.log('Gauge(${sampleID})');

d3.json(url).then(data => {
  console.log(data);

let samples = data.samples;
let metadata = data.metadata;
let result1 = metadata.filter(meta => meta.id == sampleID)[0];
let resultArray = samples.filter(s => s.id == sampleID);
let result = resultArray[0];

let washFreq = result1.wfreq;

// Create the trace for gauge chart
let gaugeData = [{
  domain: { x: [0,1], y: [0,1] },
  value: washFreq,
  text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9', ''],
  title: {text:"Weekly Washing Frequency)"},
  type: 'indicator',
  mode: 'gauge+number',
  rotation: 90,
  gauge: {
  bar: {color: 'black'},
  axis: { range: [0, 9], tickmode: "linear", tickwidth: 1},
  steps: [
    { range: [0, 1], color: "rgba(255,255,255,0)"},
    { range: [1, 2], color: "rgba(240,230, 215,.5)"},
    { range: [2, 3], color: "rgba(232,226,202,.5)"},
    { range: [3, 4], color: "rgba(210,206,145,.5)"},
    { range: [4, 5], color: "rgba(170,202,42,.5)"},
    { range: [5, 6], color: "rgba(110,154,22,.5)"},
    { range: [6, 7], color: "rgba(14, 127,0,.5)"},
    { range: [7, 8], color: "rgba(10, 120,22,.5)"},
    { range: [8, 9], color: "rgba(0, 105,11,.5)"},],
    threshold: {
      line: { color: "red", width: 4 },
      thickness: 0.75,
      value: washFreq,
}
}
}];

let gaugeArray = [gaugeData];

// Define gauge plot layout
let layout = { width: 500, height: 400, margin: { t: 0, b: 0 } 
};

// Invoke the plot creating function 
Plotly.newPlot('gauge', gaugeData, layout);
}
)}

// Create a function for demographic info
function Metadata(sampleID) {
  console.log(`Metadata(${sampleID})`);

d3.json(url).then((data) => {
  let metadata = data.metadata;
  console.log(metadata);

// Filter data
  let result1 = metadata.filter(meta => meta.id == sampleID)[0];
  let demographicInfo = d3.select('#sample-metadata');

// Clear existing data in demographic Info panel
demographicInfo.html('');

// Add key and value pair to the demographicInfo panel
Object.entries(result1).forEach(([key, value]) => {
  demographicInfo.append('h6').text(`${key}: ${value}`);
});
});
}
// Create function for the change to grab new object
// Update the demographic info panel
function optionChanged(sampleID) {
  console.log(`optionChanged, new value: ${sampleID}`);

Bar(sampleID);
Bubble(sampleID);
Gauge(sampleID);
Metadata(sampleID);
}
// Create function for dashboard
function InitDashboard(){
console.log('InitDashboard');

// Get a handle to the dropdown
let dropdown = d3.select('#selDataset');

d3.json(url).then(data => {
  console.log('data');

  let sampleNames = data.names;
  console.log('sample names:', sampleNames);

// Populate the dropdown
for (let i = 0; i < sampleNames.length; i++) {
  let sampleID = sampleNames[i];
  dropdown.append('option').text(sampleID).property('value', sampleID);
};

// Read the current value from the dropdown
let initialId = dropdown.property('value');
console.log(`initialId = ${initialId}`);

// Draw the bar graph for the selected sample id
Bar(initialId);

// Draw the bubble chart for the selected sample id
Bubble(initialId);

// // Draw gauge chart
Gauge(initialId);
// Show the metadata for the selected sample id
Metadata(initialId);

});
};
InitDashboard();