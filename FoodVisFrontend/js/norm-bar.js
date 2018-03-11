const selectedIngredients = [
    "fat_100g",
    "carbohydrates_100g",
    "sugars_100g",
    "fiber_100g",
    "proteins_100g",
    "salt_100g"
];

const colors = {
    fat_100g: "#ECD078",
    carbohydrates_100g: "#D95B43",
    sugars_100g: "#C02942",
    fiber_100g: "#542437",
    proteins_100g: "#53777A",
    salt_100g: "#53777A",
};

let barTooltip = d3.select("body").append("div")
    .attr("class", "bar-tooltip")
    .style("opacity", "0");


let currentMousePos = {x: -1, y: -1};
$(document).mousemove(event => {
    currentMousePos.x = event.pageX;
    currentMousePos.y = event.pageY;
    barTooltip
        .style("left", currentMousePos.x - 100 + "px")
        .style("top", currentMousePos.y - 65 + "px");
});

let svg = d3.select("#norm-bar > svg"),
    margin = {top: 20, right: 60, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1)
    .align(0.1);

let y = d3.scaleLinear()
    .rangeRound([height, 0]);

let stack = d3.stack()
    .offset(d3.stackOffsetExpand);

function setBarChartData(products) {
    if (products.length === 0) {
        return;
    }

    let filtered = products.filter(product => {
        for (let i = 0; i < selectedIngredients.length; i++) {
            if (product[selectedIngredients[i]] > 0) {
                return true;
            }
        }
        return false;
    });

    filtered.sort((a, b) => a.fat_100g - b.fat_100g);

    x.domain(filtered.map(d => d.id));

    g.html("");

    let serie = g.selectAll(".serie")
        .data(stack.keys(selectedIngredients)(filtered))
        .enter().append("g")
        .attr("class", "serie")
        .attr("fill", d => colors[d.key]);

    serie.selectAll("rect")
        .data(d => {
            d.forEach(value => {
                value.key = d.key;
            });
            return d;
        })
        .enter().append("rect")
        .attr("x", d => x(d.data.id))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())
        .on("mouseover", d => {
            barTooltip.style("opacity", .75);
            barTooltip.html("<span>" + d.data.product_name + "</span>" + "<span>" + d.key + " - " + d.data[d.key] + "</span>");
        })
        .on("mouseout", () => {
            barTooltip.style("opacity", 0);
        })
        .on("click", d => console.log(d));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(10, "%"));

    let legend = serie.append("g")
        .attr("class", "legend")
        .attr("transform", d => {
            let d2 = d[d.length - 1];
            return "translate(" + (x(d2.data.id) + x.bandwidth()) + "," + ((y(d2[0]) + y(d2[1])) / 2) + ")";
        });

    legend.append("line")
        .attr("x1", -6)
        .attr("x2", 6)
        .attr("stroke", "#000");

    legend.append("text")
        .attr("x", 9)
        .attr("dy", "0.35em")
        .attr("fill", "#000")
        .style("font", "10px sans-serif")
        .text(d => d.key);
};

function type(d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
}