var currentWidth = $('#map').width();
var width = 938;
var height = 620;

var mapProjection = d3
    .geoMercator()
    .scale(140)
    .translate([width / 2, height / 1.41]);

var mapPath = d3.geoPath()
    .pointRadius(2)
    .projection(mapProjection);

var mapSvg = d3.select("#map")
    .append("svg")
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("width", currentWidth)
    .attr("height", currentWidth * height / width);

// keep the ratio of the map on screen resize
$(window).resize(function () {
    currentWidth = $("#map").width();
    mapSvg.attr("width", currentWidth);
    mapSvg.attr("height", currentWidth * height / width);
});

var currentMousePos = { x: -1, y: -1 };
$(document).mousemove(function(event) {
    currentMousePos.x = event.pageX;
    currentMousePos.y = event.pageY;
    mapTooltip
        .style("left", currentMousePos.x - 50 + "px")
        .style("top", currentMousePos.y - 35 + "px");
});

var mapTooltip = d3.select("body").append("div")
    .attr("class", "tooltip");

d3.json("json/countries2.topo.json", function (data) {
    console.log(topojson.feature(data, data.objects.countries).features);
    mapSvg.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(topojson.feature(data, data.objects.countries).features)
        .enter()
        .append("path")
        .attr("id", function (d) {
            return d.id;
        })
        .attr("d", mapPath)
        .on("mouseover", function (d) {
            mapTooltip.style("opacity", .75);
            mapTooltip.html(d.properties.name);
        })
        .on("mouseout", function (d) {
            mapTooltip.style("opacity", 0);
        });
});
