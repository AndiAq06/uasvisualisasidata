// Data untuk 34 provinsi
const data = [
  { provinsi: "Aceh", wisatawan: 7989477, pdb_perkapita: 41424.37, kamar_hotel_terpakai: 337.21 },
  { provinsi: "Sumatera Utara", wisatawan: 27006445, pdb_perkapita: 68305.71, kamar_hotel_terpakai: 3047.03 },
  { provinsi: "Sumatera Barat", wisatawan: 14771986, pdb_perkapita: 54326.76, kamar_hotel_terpakai: 1464.72 },
  { provinsi: "Riau", wisatawan: 10782083, pdb_perkapita: 154522.3, kamar_hotel_terpakai: 1938.5 },
  { provinsi: "Jambi", wisatawan: 4582629, pdb_perkapita: 79835.78, kamar_hotel_terpakai: 623.75 },
  { provinsi: "Sumatera Selatan", wisatawan: 10574598, pdb_perkapita: 71950.37, kamar_hotel_terpakai: 1965.45 },
  { provinsi: "Bengkulu", wisatawan: 2502836, pdb_perkapita: 46285.28, kamar_hotel_terpakai: 276.33 },
  { provinsi: "Lampung", wisatawan: 13461095, pdb_perkapita: 48194.22, kamar_hotel_terpakai: 781.49 },
  { provinsi: "Bangka Belitung", wisatawan: 2179148, pdb_perkapita: 67885.26, kamar_hotel_terpakai: 503.96 },
  { provinsi: "Kepulauan Riau", wisatawan: 2212232, pdb_perkapita: 154179, kamar_hotel_terpakai: 2016.75 },
  { provinsi: "DKI Jakarta", wisatawan: 61237700, pdb_perkapita: 322615.1, kamar_hotel_terpakai: 11289.24 },
  { provinsi: "Jawa Barat", wisatawan: 152510552, pdb_perkapita: 52651.45, kamar_hotel_terpakai: 14004.09 },
  { provinsi: "Jawa Tengah", wisatawan: 117335456, pdb_perkapita: 45198.51, kamar_hotel_terpakai: 7291.69 },
  { provinsi: "Yogyakarta", wisatawan: 30761919, pdb_perkapita: 48358.22, kamar_hotel_terpakai: 5682.98 },
  { provinsi: "Jawa Timur", wisatawan: 207813619, pdb_perkapita: 71121.93, kamar_hotel_terpakai: 8771.53 },
  { provinsi: "Banten", wisatawan: 43129799, pdb_perkapita: 66147.39, kamar_hotel_terpakai: 3241.9 },
  { provinsi: "Bali", wisatawan: 20672537, pdb_perkapita: 62293.23, kamar_hotel_terpakai: 7535.83 },
  { provinsi: "Nusa Tenggara Barat", wisatawan: 13274308, pdb_perkapita: 29925.6, kamar_hotel_terpakai: 922.82 },
  { provinsi: "Nusa Tenggara Timur", wisatawan: 4795981, pdb_perkapita: 23078.03, kamar_hotel_terpakai: 498.53 },
  { provinsi: "Kalimantan Barat", wisatawan: 4359110, pdb_perkapita: 48808.92, kamar_hotel_terpakai: 1145.31 },
  { provinsi: "Kalimantan Tengah", wisatawan: 3470037, pdb_perkapita: 75293.97, kamar_hotel_terpakai: 462.55 },
  { provinsi: "Kalimantan Selatan", wisatawan: 6705075, pdb_perkapita: 63779.06, kamar_hotel_terpakai: 1170.14 },
  { provinsi: "Kalimantan Timur", wisatawan: 7388614, pdb_perkapita: 215761.4, kamar_hotel_terpakai: 1937.94 },
  { provinsi: "Kalimantan Utara", wisatawan: 532791, pdb_perkapita: 201748.8, kamar_hotel_terpakai: 103.76 },
  { provinsi: "Sulawesi Utara", wisatawan: 5145398, pdb_perkapita: 64130.96, kamar_hotel_terpakai: 788.96 },
  { provinsi: "Sulawesi Tengah", wisatawan: 5911627, pdb_perkapita: 112461.1, kamar_hotel_terpakai: 205.78 },
  { provinsi: "Sulawesi Selatan", wisatawan: 23913021, pdb_perkapita: 69702.4, kamar_hotel_terpakai: 2822.39 },
  { provinsi: "Sulawesi Tenggara", wisatawan: 11173548, pdb_perkapita: 64088.4, kamar_hotel_terpakai: 410.22 },
  { provinsi: "Gorontalo", wisatawan: 1710997, pdb_perkapita: 42346.82, kamar_hotel_terpakai: 112.49 },
  { provinsi: "Sulawesi Barat", wisatawan: 3509810, pdb_perkapita: 39533.27, kamar_hotel_terpakai: 62.1 },
  { provinsi: "Maluku", wisatawan: 852721, pdb_perkapita: 30456.11, kamar_hotel_terpakai: 154.26 },
  { provinsi: "Maluku Utara", wisatawan: 1649077, pdb_perkapita: 63676.84, kamar_hotel_terpakai: 120.67 },
  { provinsi: "Papua Barat", wisatawan: 602494, pdb_perkapita: 108101.5, kamar_hotel_terpakai: 69.91 },
  { provinsi: "Papua", wisatawan: 1278581, pdb_perkapita: 78061.39, kamar_hotel_terpakai: 432.35 },
];

const width = 800;
const height = 700;
const padding = 50;
const cellSize = (width - padding * 2) / 3;

const columns = ["wisatawan", "pdb_perkapita", "kamar_hotel_terpakai"];

const svg = d3.select("#chart").append("svg").attr("width", width).attr("height", height);

// Tambahkan div untuk tooltip
const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("position", "absolute")
  .style("background-color", "white")
  .style("border", "1px solid #ddd")
  .style("padding", "10px")
  .style("border-radius", "5px");

const scales = {};
columns.forEach((col) => {
  scales[col] = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d[col]))
    .range([padding, cellSize - padding]);
});

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Fungsi untuk menggambar scatter plot matrix
function drawScatterPlotMatrix(selectedData) {
  svg.selectAll("*").remove();

  selectedData.forEach((d, i) => {
    colorScale(d.provinsi);
  });

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      plotCell(i, j, selectedData);
    }
  }

  // Tambahkan border tebal
  //   svg.append("rect").attr("width", width).attr("height", height).attr("fill", "none").attr("stroke", "black").attr("stroke-width", 2);

  // Tambahkan legend
  const legend = svg.append("g").attr("transform", `translate(${width - 90}, 20)`);

  legend
    .selectAll("rect")
    .data(selectedData)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", (d, i) => i * 20)
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", (d) => colorScale(d.provinsi));

  legend
    .selectAll("text")
    .data(selectedData)
    .enter()
    .append("text")
    .attr("x", 15)
    .attr("y", (d, i) => i * 20 + 9)
    .text((d) => d.provinsi)
    .attr("font-size", "16px");
}

function plotCell(i, j, selectedData) {
  const cell = svg.append("g").attr("transform", `translate(${j * cellSize}, ${i * cellSize})`);

  cell.append("rect").attr("class", "cell").attr("width", cellSize).attr("height", cellSize).attr("fill", "none").attr("stroke", "black").attr("stroke-width");

  const xCol = columns[j];
  const yCol = columns[i];

  if (i !== j) {
    const points = cell
      .selectAll(".point")
      .data(selectedData)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", (d) => scales[xCol](d[xCol]))
      .attr("cy", (d) => cellSize - scales[yCol](d[yCol]))
      .attr("r", 5)
      .attr("fill", (d) => colorScale(d.provinsi))
      .attr("opacity", 0.9)
      .on("mouseover", showTooltip)
      .on("mouseout", hideTooltip);
  } else {
    cell
      .append("text")
      .attr("class", "label")
      .attr("x", cellSize / 2)
      .attr("y", cellSize / 2)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text(xCol);
  }

  // Add y-axis
  if (j === 0) {
    const yAxis = d3
      .axisLeft(
        d3
          .scaleLinear()
          .domain(scales[yCol].domain())
          .range([cellSize - padding, padding])
      )
      .ticks(5);
    cell.append("g").attr("transform", `translate(0, 0)`).call(yAxis);
  }
}

function showTooltip(event, d) {
  tooltip.transition().duration(200).style("opacity", 0.9);
  tooltip
    .html(
      `<strong>${d.provinsi}</strong><br/>
      Wisatawan: ${d.wisatawan}<br/>
      PDB per Kapita: ${d.pdb_perkapita}<br/>
      Kamar Hotel Terpakai: ${d.kamar_hotel_terpakai}`
    )
    .style("left", event.pageX + 10 + "px")
    .style("top", event.pageY - 28 + "px");
}

function hideTooltip() {
  tooltip.transition().duration(500).style("opacity", 0);
}

// Fungsi untuk membuat dropdown dengan checkbox
function createProvinsiDropdownCheckbox() {
  const container = d3.select("#provinsi-selector");

  const dropdownCheckList = container.append("div").attr("class", "dropdown-check-list").attr("tabindex", "100");

  dropdownCheckList
    .append("span")
    .attr("class", "anchor")
    .text("Pilih Provinsi")
    .on("click", function () {
      if (dropdownCheckList.classed("visible")) {
        dropdownCheckList.classed("visible", false);
      } else {
        dropdownCheckList.classed("visible", true);
      }
    });

  const ul = dropdownCheckList.append("ul").attr("class", "items");

  ul.selectAll("li")
    .data(data)
    .enter()
    .append("li")
    .append("input")
    .attr("type", "checkbox")
    .attr("id", (d, i) => `provinsi-${i}`)
    .attr("value", (d) => d.provinsi)
    .property("checked", (d, i) => i < 10)
    .on("change", updateSelectedProvinsi);

  ul.selectAll("li")
    .append("label")
    .attr("for", (d, i) => `provinsi-${i}`)
    .text((d) => d.provinsi);
}

// Fungsi untuk memperbarui provinsi yang dipilih
function updateSelectedProvinsi() {
  const selectedProvinsi = d3
    .selectAll("input:checked")
    .nodes()
    .map((node) => node.value);

  if (selectedProvinsi.length < 10) {
    alert("Minimal 10 provinsi harus dipilih!");
    this.checked = true;
    return;
  }

  const selectedData = data.filter((d) => selectedProvinsi.includes(d.provinsi));
  drawScatterPlotMatrix(selectedData);
}

// Inisialisasi
createProvinsiDropdownCheckbox();
const initialSelectedData = data.slice(0, 10);
drawScatterPlotMatrix(initialSelectedData);
