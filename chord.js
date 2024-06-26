async function drawChord() {
  // Load the CSV data
  const data = await d3.csv("data.csv");

  // Process the CSV data
  const names = Array.from(new Set(data.flatMap((d) => [d.source, d.target])));
  const index = new Map(names.map((name, i) => [name, i]));
  const matrix = Array.from(index, () => new Array(names.length).fill(0));

  for (const { source, target, value } of data) {
    matrix[index.get(source)][index.get(target)] = +value;
  }

  // Define the dimensions of the chart
  const width = 450;
  const height = 450;
  const outerRadius = Math.min(width, height) * 0.5 - 60;
  const innerRadius = outerRadius - 20;

  // Create a color scale
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Create the chord layout
  const chord = d3.chord().padAngle(0.05).sortSubgroups(d3.descending);

  const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

  const ribbon = d3.ribbon().radius(innerRadius);

  // Create a SVG container
  const svg = d3
    .select("#chord-diagram")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

  const chords = chord(matrix);

  // Create the groups
  const group = svg.append("g").selectAll("g").data(chords.groups).join("g");

  group
    .append("path")
    .attr("fill", (d) => color(names[d.index]))
    .attr("d", arc);

  group
    .append("text")
    .each((d) => (d.angle = (d.startAngle + d.endAngle) / 2))
    .attr("dy", "0.35em")
    .attr(
      "transform",
      (d) => `
                rotate(${(d.angle * 180) / Math.PI - 90})
                translate(${outerRadius + 5})
                ${d.angle > Math.PI ? "rotate(180)" : ""}
            `
    )
    .attr("text-anchor", (d) => (d.angle > Math.PI ? "end" : null))
    .text((d) => names[d.index]);

  // Create the chords
  const chordPaths = svg
    .append("g")
    .attr("fill-opacity", 0.75)
    .selectAll("path")
    .data(chords)
    .join("path")
    .attr("d", ribbon)
    .attr("fill", (d) => color(names[d.source.index]))
    .attr("class", "chord");

  chordPaths.append("title").text((d) => `${names[d.source.index]} → ${names[d.target.index]} ${d.source.value}`);

  // Add interactivity
  chordPaths.on("mouseover", highlightChord).on("mouseout", resetChords);

  function highlightChord(event, d) {
    chordPaths
      .transition()
      .duration(200)
      .attr("opacity", (chord) => (chord === d ? 1 : 0.1));
  }

  function resetChords() {
    chordPaths.transition().duration(200).attr("opacity", 0.75);
  }
}

drawChord();
