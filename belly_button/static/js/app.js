function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var meta = `/metadata/${sample}`;
  console.log(meta)
  d3.json(meta).then(function(data){
    

    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panel.html("");
    panel.append("table")
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new

    Object.entries(data).forEach(([key, value]) => {
      panel.append("tr")
      var cell = panel.append("p");
      cell.text(`${key} : ${value}`);
    })
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
    var sData = `/samples/${sample}`;
    console.log(sData)

    d3.json(sData).then(function(response){
    // @TODO: Build a Bubble Chart using the sample data
    console.log(response)
    var traceBubz = {
      mode: "markers",
      x: response.otu_ids,
      y: response.sample_values.slice(0, 10),
      text: response.otu_labels,
      marker: {
        color: response.otu_ids,
        size: response.sample_values
              },
      
      };

    var data = [traceBubz];

    var layout = {
        title: `Belly Button Results of ${sample}`,
        showlegend: false,
        xaxis: {
          title: "OTUs"
        },
        yaxis: {
          title: "Intensity found in sample"
        },
      };

      Plotly.newPlot("bubble", data, layout);
    

    var tracePie = {

      values: response.sample_values.slice(0, 10),
      labels: response.otu_ids,
      hovertext: response.otu_labels,
      type: 'pie'

      };

      dataPie = [tracePie];

      var layoutPie = {
      height: 400,
      width: 800,
      margin: {
        t: 25,
      }
    };
  

   Plotly.newPlot("pie", dataPie, layoutPie);

  
});
};



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

