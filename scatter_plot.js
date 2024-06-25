// Dimensi dan margin
const margin = { top: 20, right: 20, bottom: 50, left: 70 };
// const width = 800 - margin.left - margin.right;
// const height = 600 - margin.top - margin.bottom;

// Skala untuk sumbu x dan y
const x = d3.scaleLinear().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

// Skala untuk ukuran lingkaran
const radius = d3.scaleSqrt().range([2, 20]);

// Skala warna
const colorScatter = d3.scaleOrdinal(d3.schemeCategory10);

// Variabel untuk mengontrol animasi
let animationInterval;
let isPaused = false;
let currentYear = 2020;

// Function to load CSV data
function loadData(callback) {
  d3.dsv(";", "uas1.csv").then(function (data) {
    // Process the data
    data.forEach(function (d) {
      d["Wisatawan 2020"] = +d["Wisatawan 2020"];
      d["Wisatawan 2021"] = +d["Wisatawan 2021"];
      d["Wisatawan 2022"] = +d["Wisatawan 2022"];
      d["PDRB 2020"] = +d["PDRB 2020"].replace(",", ".");
      d["PDRB 2021"] = +d["PDRB 2021"].replace(",", ".");
      d["PDRB 2022"] = +d["PDRB 2022"].replace(",", ".");
    });
    callback(data);
  });
}

// Fungsi untuk membuat chart
function createChart(dataScatter) {
  const svg = d3
    .select("#chart_scatter")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  const xAxis = g.append("g").attr("class", "x-axis").attr("transform", `translate(0,${height})`);

  const yAxis = g.append("g").attr("class", "y-axis");

  xAxis.append("text").attr("x", width).attr("y", 40).attr("fill", "black").attr("text-anchor", "end").text("PDRB →");

  yAxis
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", -height / 2)
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .text("↑ Jumlah Wisatawan");

  const circlesGroup = g.append("g");

  const yearText = g
    .append("text")
    .attr("x", width - 50)
    .attr("y", height - 20)
    .attr("font-size", "24px")
    .attr("font-weight", "bold");

  function update(year) {
    const filteredData = dataScatter.filter((d) => d.year === year);

    x.domain([0, d3.max(dataScatter, (d) => d.pdrb)]);
    y.domain([0, d3.max(dataScatter, (d) => d.wisatawan)]);
    radius.domain([0, d3.max(dataScatter, (d) => d.wisatawan)]);

    xAxis.transition().duration(750).call(d3.axisBottom(x));
    yAxis
      .transition()
      .duration(750)
      .call(d3.axisLeft(y).tickFormat(d3.format(".2s")));

    const circles = circlesGroup.selectAll("circle").data(filteredData, (d) => d.name);

    circles
      .enter()
      .append("circle")
      .attr("fill", (d) => colorScatter(d.name))
      .attr("r", 0)
      .merge(circles)
      .transition()
      .duration(750)
      .attr("cx", (d) => x(d.pdrb))
      .attr("cy", (d) => y(d.wisatawan))
      .attr("r", (d) => radius(d.wisatawan));

    circles.exit().transition().duration(750).attr("r", 0).remove();

    circlesGroup
      .selectAll("circle")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("stroke", "black").attr("stroke-width", 2);
        svg
          .append("text")
          .attr("class", "tooltip")
          .attr("x", x(d.pdrb) + margin.left)
          .attr("y", y(d.wisatawan) + margin.top - 10)
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .text(`${d.name}: Wisatawan ${d3.format(",")(d.wisatawan)}, PDRB ${d3.format(",")(d.pdrb)}`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke", null);
        svg.selectAll(".tooltip").remove();
      });

    yearText.text(year);
  }

  return Object.assign(svg.node(), { update });
}

// Fungsi untuk mengontrol animasi
function toggleAnimation(chart) {
  if (isPaused) {
    startAnimation(chart);
    d3.select("#pauseButton").text("Pause");
  } else {
    pauseAnimation();
    d3.select("#pauseButton").text("Resume");
  }
  isPaused = !isPaused;
}

function startAnimation(chart) {
  animationInterval = setInterval(() => {
    currentYear = currentYear === 2022 ? 2020 : currentYear + 1;
    chart.update(currentYear);
  }, 1000);
}

function pauseAnimation() {
  clearInterval(animationInterval);
}

// Load data and create chart
loadData(function (data) {
  const years = [2020, 2021, 2022];

  // Reformat the data for the scatter plot
  const dataScatter = [];
  data.forEach(function (d) {
    years.forEach(function (year) {
      dataScatter.push({
        year: year,
        name: d.Provinsi,
        wisatawan: d[`Wisatawan ${year}`],
        pdrb: d[`PDRB ${year}`],
      });
    });
  });

  // Create chart
  const chart = createChart(dataScatter);

  // Add pause button
  d3.select("#chart_scatter")
    .append("button")
    .attr("id", "pauseButton")
    .text("Pause")
    .on("click", () => toggleAnimation(chart));

  // Start animation
  startAnimation(chart);
});
