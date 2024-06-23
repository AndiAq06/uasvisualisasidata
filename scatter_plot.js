// Data dummy untuk jumlah wisatawan dan PDRB dari 2016-2023
const dataScatter = [
  { year: 2016, name: "Bali", wisatawan: 4000000, pdrb: 500000 },
  { year: 2016, name: "Jakarta", wisatawan: 3000000, pdrb: 70000 },
  { year: 2016, name: "Yogyakarta", wisatawan: 2000000, pdrb: 30000 },
  { year: 2017, name: "Bali", wisatawan: 5000000, pdrb: 550000 },
  { year: 2017, name: "Jakarta", wisatawan: 3200000, pdrb: 75000 },
  { year: 2017, name: "Yogyakarta", wisatawan: 2200000, pdrb: 35000 },
  { year: 2018, name: "Bali", wisatawan: 6000000, pdrb: 60000 },
  { year: 2018, name: "Jakarta", wisatawan: 3400000, pdrb: 80000 },
  { year: 2018, name: "Yogyakarta", wisatawan: 2400000, pdrb: 40000 },
  { year: 2019, name: "Bali", wisatawan: 900000, pdrb: 65000 },
  { year: 2019, name: "Jakarta", wisatawan: 3600000, pdrb: 85000 },
  { year: 2019, name: "Yogyakarta", wisatawan: 2600000, pdrb: 45000 },
  { year: 2020, name: "Bali", wisatawan: 3000000, pdrb: 55000 },
  { year: 2020, name: "Jakarta", wisatawan: 2500000, pdrb: 80000 },
  { year: 2020, name: "Yogyakarta", wisatawan: 1800000, pdrb: 40000 },
  { year: 2021, name: "Bali", wisatawan: 3500000, pdrb: 60000 },
  { year: 2021, name: "Jakarta", wisatawan: 3000000, pdrb: 85000 },
  { year: 2021, name: "Yogyakarta", wisatawan: 2000000, pdrb: 42000 },
  { year: 2022, name: "Bali", wisatawan: 5000000, pdrb: 70000 },
  { year: 2022, name: "Jakarta", wisatawan: 4000000, pdrb: 95000 },
  { year: 2022, name: "Yogyakarta", wisatawan: 2500000, pdrb: 47000 },
  { year: 2023, name: "Bali", wisatawan: 6000000, pdrb: 80000 },
  { year: 2023, name: "Jakarta", wisatawan: 4500000, pdrb: 100000 },
  { year: 2023, name: "Yogyakarta", wisatawan: 3000000, pdrb: 50000 },
];

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
let currentYear = 2016;

// Fungsi untuk membuat chart
function createChart() {
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

// Membuat chart
const chart = createChart();

// Fungsi untuk mengontrol animasi
function toggleAnimation() {
  if (isPaused) {
    startAnimation();
    d3.select("#pauseButton").text("Pause");
  } else {
    pauseAnimation();
    d3.select("#pauseButton").text("Resume");
  }
  isPaused = !isPaused;
}

function startAnimation() {
  animationInterval = setInterval(() => {
    currentYear = currentYear === 2023 ? 2016 : currentYear + 1;
    chart.update(currentYear);
  }, 1000);
}

function pauseAnimation() {
  clearInterval(animationInterval);
}

// Menambahkan tombol pause
d3.select("#chart_scatter").append("button").attr("id", "pauseButton").text("Pause").on("click", toggleAnimation);

// Memulai animasi
startAnimation();
