const mapWidth = 1200; // Perbaikan: menghapus 'x' di akhir
const mapHeight = 600;
const titleHeight = 50; // Tinggi untuk judul

// Dummy data untuk jumlah wisatawan mancanegara per provinsi
const visitorData = {
  ACEH: 7989477,
  "SUMATERA UTARA": 27006445,
  "SUMATERA BARAT": 14771986,
  RIAU: 10782083,
  JAMBI: 4582629,
  "SUMATERA SELATAN": 10574598,
  BENGKULU: 2502836,
  LAMPUNG: 13461095,
  "KEPULAUAN BANGKA BELITUNG": 2179148,
  "KEPULAUAN RIAU": 2212232,
  "DKI JAKARTA": 61237700,
  "JAWA BARAT": 152510552,
  "JAWA TENGAH": 117335456,
  "DI YOGYAKARTA": 30761919,
  "JAWA TIMUR": 207813619,
  BANTEN: 43129799,
  BALI: 20672537,
  "NUSA TENGGARA BARAT": 13274308,
  "NUSA TENGGARA TIMUR": 4795981,
  "KALIMANTAN BARAT": 4359110,
  "KALIMANTAN TENGAH": 3470037,
  "KALIMANTAN SELATAN": 6705075,
  "KALIMANTAN TIMUR": 7388614,
  "KALIMANTAN UTARA": 532791,
  "SULAWESI UTARA": 5145398,
  "SULAWESI TENGAH": 5911627,
  "SULAWESI SELATAN": 23913021,
  "SULAWESI TENGGARA": 11173548,
  GORONTALO: 1710997,
  "SULAWESI BARAT": 3509810,
  MALUKU: 852721,
  "MALUKU UTARA": 1649077,
  "PAPUA BARAT": 1278581,
  PAPUA: 1278581,
};

const mapSvg = d3
  .select("#map")
  .append("svg")
  .attr("width", mapWidth)
  .attr("height", mapHeight + titleHeight)
  .attr("viewBox", [0, 0, mapWidth, mapHeight + titleHeight])
  .attr("style", "max-width: 100%; height: auto;");

// Tambahkan judul
mapSvg
  .append("text")
  .attr("x", mapWidth / 2)
  .attr("y", titleHeight / 2)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "middle")
  .style("font-size", "30px")
  .style("font-weight", "bold")
  .text("Jumlah Wisatawan Mancanegara yang Datang di Tiap Provinsi Tahun 2023");

// Buat grup untuk peta dan geser ke bawah untuk memberi ruang pada judul
const mapGroup = mapSvg.append("g").attr("transform", `translate(0, ${titleHeight})`);

const projection = d3
  .geoMercator()
  .center([118, -2])
  .scale(1350)
  .translate([mapWidth / 2, mapHeight / 3]);

const path = d3.geoPath().projection(projection);

// Skala warna baru dengan gradien biru
const color = d3.scaleThreshold().domain([1000000, 5000000, 10000000, 20000000, 50000000, 100000000, 150000000, 200000000, 250000000]).range([
  "#e6f2ff", // Biru sangat muda untuk nilai terkecil
  "#cce5ff",
  "#99ccff",
  "#66b3ff",
  "#3399ff",
  "#0080ff",
  "#0066cc",
  "#004d99",
  "#003366", // Biru gelap untuk nilai tertinggi
]);

// Load GeoJSON data
d3.json("prov.geojson")
  .then(function (indonesia) {
    mapGroup
      .selectAll("path")
      .data(indonesia.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "province")
      .attr("fill", function (d) {
        const provinceName = d.properties.name;
        const visitorCount = visitorData[provinceName] || 0;
        return color(visitorCount);
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", "0.5px")
      .on("mouseover", function (event, d) {
        const provinceName = d.properties.name;
        const visitors = visitorData[provinceName] || 0;
        d3.select(this).attr("stroke-width", "2px");
        d3.select("#tooltip")
          .style("opacity", 1)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px")
          .html(`${provinceName} Visitors: ${visitors.toLocaleString()}`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke-width", "0.5px");
        d3.select("#tooltip").style("opacity", 0);
      });

    // Perbaiki legend
    const legendWidth = 500;
    const legendHeight = 20;
    const legend = mapGroup.append("g").attr("transform", `translate(${mapWidth - legendWidth - 20}, ${mapHeight - 150})`);

    const legendScale = d3.scaleLinear().domain([0, 250000000]).range([0, legendWidth]);

    const legendAxis = d3
      .axisBottom(legendScale)
      .tickSize(legendHeight)
      .tickValues([0, 50000000, 100000000, 150000000, 200000000, 250000000])
      .tickFormat((d) => d3.format(".0f")(d / 1000000));

    legend.append("g").call(legendAxis);

    // Membuat gradient untuk legend
    const legendGradient = legend.append("linearGradient").attr("id", "legend-gradient").attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "0%");

    legendGradient
      .selectAll("stop")
      .data(color.range())
      .enter()
      .append("stop")
      .attr("offset", (d, i) => `${(i / (color.range().length - 1)) * 100}%`)
      .attr("stop-color", (d) => d);

    legend.append("rect").attr("width", legendWidth).attr("height", legendHeight).style("fill", "url(#legend-gradient)");
  })
  .catch(function (error) {
    console.error("Error loading GeoJSON:", error);
  });
