var svg = d3.select("body").select(".container").select("#sankey").append("svg");

var formatNumber = d3.format(".2f"),
    format = function(d) { return formatNumber(d)},
    color = d3.scaleOrdinal(d3.schemeCategory10);

var sankey = d3.sankey()
    .nodeWidth(15)
    .nodePadding(10)
    .extent([[1, 1], [width - 1, height - 6]]);

var link = svg.append("g")
    .attr("class", "links")
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("stroke-opacity", 0.2)
  .selectAll("path");

var node = svg.append("g")
    .attr("class", "nodes")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
  .selectAll("g");

d3.json("./json/sankey.json", function(error, energy) {
  if (error) throw error;

  sankey(energy);

  link = link
    .data(energy.links)
    .enter().append("path")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke-width", function(d) { return Math.max(1, d.width); });

  link.append("title")
      .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

  node = node
    .data(energy.nodes)
    .enter().append("g");

  node.append("rect")
      .attr("x", function(d) { return d.x0; })
      .attr("y", function(d) { return d.y0; })
      .attr("height", function(d) { return d.y1 - d.y0; })
      .attr("width", function(d) { return d.x1 - d.x0; })
      .attr("fill", function(d) { return color(d.name.replace(/ .*/, "")); })
      .attr("stroke", "#000");

  node.append("text")
      .attr("x", function(d) { return d.x0 - 6; })
      .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x0 < width / 2; })
      .attr("x", function(d) { return d.x1 + 6; })
      .attr("text-anchor", "start");

  node.append("title")
      .text(function(d) { return d.name + "\n" + format(d.value); });
});