async function drawSankey() {
  // Load the CSV data
  const data = await d3.csv("data.csv");

  // Process the CSV data
  const links = data.map((d) => ({
    source: d.source,
    target: d.target,
    value: +d.value,
  }));

  const nodes = Array.from(new Set(links.flatMap((l) => [l.source, l.target])), (name) => ({ name }));

  // Define the dimensions of the chart
  const width = 700;
  const height = 500;
  const format = d3.format(",.0f");

  // Create a SVG container
  const svg = d3.select("#sankey-diagram").append("svg").attr("width", width).attr("height", height).attr("viewBox", [0, 0, width, height]).attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

  // Constructs and configures a Sankey generator
  const sankey = d3
    .sankey()
    .nodeId((d) => d.name)
    .nodeAlign(d3.sankeyCenter)
    .nodeWidth(15)
    .nodePadding(10)
    .extent([
      [1, 5],
      [width - 1, height - 5],
    ]);

  const { nodes: graphNodes, links: graphLinks } = sankey({
    nodes: nodes.map((d) => Object.assign({}, d)),
    links: links.map((d) => Object.assign({}, d)),
  });

  // Defines a color scale
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Creates the rects that represent the nodes
  const rect = svg
    .append("g")
    .attr("stroke", "#000")
    .selectAll("rect")
    .data(graphNodes)
    .enter()
    .append("rect")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("fill", (d) => color(d.name));

  // Adds a title on the nodes
  rect.append("title").text((d) => `${d.name}\n${format(d.value)}`);

  // Creates the paths that represent the links
  const link = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.5)
    .selectAll("g")
    .data(graphLinks)
    .enter()
    .append("path")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke", (d) => color(d.source.name))
    .attr("stroke-width", (d) => Math.max(1, d.width));

  link.append("title").text((d) => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);

  // Adds labels on the nodes
  svg
    .append("g")
    .selectAll("text")
    .data(graphNodes)
    .enter()
    .append("text")
    .attr("x", (d) => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
    .attr("y", (d) => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", (d) => (d.x0 < width / 2 ? "start" : "end"))
    .text((d) => d.name);
}

drawSankey();
