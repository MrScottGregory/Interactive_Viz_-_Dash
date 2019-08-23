function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

    // Use `d3.json` to fetch the metadata for a sample
    let metaUrl = "/metadata/"+sample
    d3.json(metaUrl).then(function(response) {

    console.log(response);

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(response).forEach(function([key, value]) {
      d3.select("#sample-metadata")
      .append("p")
      .text(`${key}: ${value}`);
    });
  });
}

function buildCharts(sample) {

    // @TODO: Use `d3.json` to fetch the sample data for the plots
    let sampleUrl = "/samples/"+sample
    d3.json(sampleUrl).then(function(response) {

    console.log(response);

    // @TODO: Build a Bubble Chart using the sample data
    let trace = {
      x: response.otu_ids,
      y: response.sample_values,
      mode: 'markers',
      text: response.otu_labels,
      marker: {
        size: response.sample_values,
        color: response.otu_ids
      }
    };

    let bubbleData = [trace];

    let bubbleLayout = {
      title: 'Belly Button Biodiversity Bubble Chart',
      labels: response.otu_ids,
      height: 600,
      width: 1000
    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    let topSamples = response.sample_values.slice(0,10);
    let topIds = response.otu_ids.slice(0,10);
    let topLables = response.otu_labels.slice(0,10);
    console.log(topIds);

    let pieData = [{
      values: topSamples,
      labels: topIds,
      type: 'pie',
      hoverinfo: topLables,
    }];
    
    let pieLayout = {
      title: 'Belly Button Biodiversity Pie Chart',
      height: 500,
      width: 800
    };
    
    Plotly.newPlot('pie', pieData, pieLayout);
  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
