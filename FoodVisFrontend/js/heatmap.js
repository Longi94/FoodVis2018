let heatmap = function () {
    let keys = [
        "fat_100g",
        //"carbohydrates_100g",
        "sugars_100g",
        "fiber_100g",
        "proteins_100g",
        "salt_100g"
    ];

    let svg = d3.select("#heatmap > svg"),
        margin = {top: 20, right:40, bottom: 30, left:110},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1)
        .align(0.1);

    let y = d3.scaleBand()
        .domain(keys)
        .rangeRound([0, height])
        .padding(0.1)
        .align(0.1);

    let yAxis = d3.axisLeft()
      .scale(y);

    g.call(yAxis);

    let barTooltip = d3.select("body").append("div")
        .attr("class", "bar-tooltip")
        .style("opacity", "0");

    $(document).mousemove(event => {
        barTooltip
            .style("left", event.pageX - 100 + "px")
            .style("top", event.pageY - 65 + "px");
    });

    let productss;
    let returnObj = {};
    returnObj['setHeatMapData'] = function (products) {
        if (products.length === 0) {
            return;
        }

        let ids = new Set([]);
        products = products.filter(product => {
            for (let i = 0; i < selectedIngredients.length; i++) {
                if (product[selectedIngredients[i]] > 0 && !ids.has(product.id)) {
                    ids.add(product.id);
                    return true;
                }
            }
            return false;
        });

        productss = products;
        let data = [];
        products.forEach(function (product) {
            keys.forEach(function (value) {
                data.push({
                    id: product.id,
                    ingredient: value,
                    value: parseInt(product[value] || 0),
                    product:product.product_name
                })
            });
        });

        x.domain(products.map(function (d) {
            return d.id
        }));

        let cellWH = Math.min(width / products.length, height / keys.length);

        g.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("id", d => "cell-"+d.id+d.ingredient)
            .attr("width", cellWH-2)
            .attr("height", cellWH-2)
            .attr("rx", 3).attr("ry", 3) // rounded corners
            .attr("fill", function(d) {return colors[d.ingredient]})
            .attr("opacity", function(d) {return Math.sqrt(d.value)/10})
            .attr("x", function(d,i) {return x(d.id)})
            .attr("y", function(d,i) {return y(d.ingredient)})
            .on("mouseover", d => {
                barTooltip.style("opacity", .75);
                barTooltip.html("<span>" + d.product + "</span><span>" + d.ingredient + " - " + d.value + "</span>");
            })
            .on("mouseout", () => {
                barTooltip.style("opacity", 0);
            })
            .on("click", d => {selectHeatmap(d.ingredient); selectBar(d.ingredient)});
    }

    let trans = d3.transition()
        .duration(600)
        .ease(d3.easeExpOut);

    returnObj['selectHeatmap'] = function (ingredient) {
        productss.sort((a, b) => a[ingredient] - b[ingredient]);
        x.domain(productss.map(d => d.id));

        productss.forEach(p => {
            keys.forEach(k => {
                d3.select("#cell-"+p.id+k)
                    .transition(trans)
                    .attr("x", function(d,i) {return x(p.id)})
            });
        });
    }

    return returnObj;
}();

function setHeatmapData(data) {
    heatmap.setHeatMapData(data);
}

function selectHeatmap(data) {
    heatmap.selectHeatmap(data);
}
