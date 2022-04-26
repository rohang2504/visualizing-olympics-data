
let margin = { top: 10, right: 30, bottom: 50, left: 60 },
  width = 760 - margin.left - margin.right,
  height = 700 - margin.top - margin.bottom;

let svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


let x = d3.scaleLinear().domain([0, 1.0]).range([0, width]);
svg
  .append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

svg
  .append("text")
  .attr(
    "transform",
    "translate(" + width / 2 + " ," + (height + margin.top + 30) + ")"
  )
  .style("text-anchor", "middle")
  .text("GDP Rate (%)");


let y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
svg.append("g").call(d3.axisLeft(y));


svg
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -40)
  .attr("x", 0 - height / 2)
  .style("text-anchor", "middle")
  .text("Gold Medal");


let color = d3
  .scaleOrdinal()
  .domain([
    "Balochistan",
    "Federal Capital Territory",
    "Khyber Pakhtunkhwa",
    "Punjab",
    "Sindh",
  ])
  .range(["#440154ff", "#21908dff", "#fde725ff", "#129490", "#CE1483"]);


let promises = [d3.csv("data/scatterplottestdata.csv")];
let allData = [];

Promise.all(promises).then(function (data) {
  data.forEach(function (eachDataset) {
    eachDataset.forEach(function (d) {
      d["Gold Medal (%)"] = +d["Gold Medal (%)"];
      d["Year"] = new Date(d["Year"]);
      if (
        d.hasOwnProperty(
          "Adult literacy, 25 or more years old (% of population aged 25 or more)"
        )
      ) {
        d[
          "Adult literacy, 25 or more years old (% of population aged 25 or more)"
        ] = +d[
          "Adult literacy, 25 or more years old (% of population aged 25 or more)"
        ];
      }
    });
  });

  allData = data;

  updateChart(allData);
});


$("#geographicChoice").on("change", function () {
  updateChart(allData);
});


$("#yearChoice").on("change", function () {
  updateChart(allData);
});


function updateChart(someData) {
  let dataAdultLit = d3
    .nest()
    .key(function (d) {
      return d["Year"];
    })
    .entries(someData[0]);

  let selectedDate = new Date($("#yearChoice").val()).toString();

  let filteredData = dataAdultLit.filter(
    (each) => each.key === selectedDate
  )[0];

  filteredData =
    $("#geographicChoice").val() === "allProv"
      ? filteredData["values"]
      : filteredData["values"].filter(
          (each) => each["Country"] === $("#geographicChoice").val()
        );

  
  let circles = svg.selectAll("circle").data(filteredData, function (d) {
    return d["District"];
  });

  console.log(circles);

  circles.exit().remove();

  
  circles
    .attr("cy", function (d) {
      return y(d["Gold Medal (%)"]);
    })
    .attr("cx", function (d) {
      return x(
        d[
          "Adult literacy, 25 or more years old (% of population aged 25 or more)"
        ]
      );
    });

  
  circles
    .enter()
    .append("circle")
    .attr("class", "enter")
    .attr("fill", function (d) {
      return color(d["Country"]);
    })
    .attr("cy", function (d) {
      return y(d["Gold Medal(%)"]);
    })
    .attr("cx", function (d) {
      return x(
        d[
          "Adult literacy, 25 or more years old (% of population aged 25 or more)"
        ]
      );
    })
    .attr("r", 5);
}
