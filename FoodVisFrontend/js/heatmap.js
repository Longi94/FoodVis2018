let heatmap = function () {

    let svg = d3.select("#heatmap > svg"),
        margin = {top: 20, right:40, bottom: 30, left:40},
        width = +svg.attr("width"),
        height = +svg.attr("height");
        // g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
        // gg = svg.append("g").attr("transform", "translate(" + margin.left + "," + height + ")");

    let x = d3.scaleBand()
        .rangeRound([margin.left, width - margin.right])
        .padding(0.1)
        .align(0.1);

    let y = d3.scaleBand()
        .domain(selectedIngredients)
        .rangeRound([0, height])
        .padding(0.1)
        .align(0.1);

    let yAxis = d3.axisLeft()
      .scale(y);

    svg.call(yAxis);

    let barTooltip = d3.select("body").append("div")
        .attr("class", "bar-tooltip")
        .style("opacity", "0");

    $(document).mousemove(event => {
        barTooltip
            .style("left", event.pageX - 100 + "px")
            .style("top", event.pageY - 65 + "px");
    });

    let productss, cellWH, heatmapxAxis;
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
            selectedIngredients.forEach(function (value) {
                data.push({
                    id: product.id,
                    ingredient: value,
                    value: parseInt(product[value] || 0),
                    product:product.product_name
                })
            });
        });

        x.domain(products.map(function (d) {
            return d.product_name
        }));

        heatmapxAxis = d3.axisBottom()
          .scale(x);


        cellWH = Math.min((width-margin.left-margin.right) / products.length, height / selectedIngredients.length);

        svg.html("");

        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("id", d => "cell-"+d.id+d.ingredient)
            .attr("width", cellWH-2)
            .attr("height", cellWH-2)
            .attr("rx", 3).attr("ry", 3) // rounded corners
            .attr("fill", function(d) {return colors[d.ingredient]})
            .attr("opacity", function(d) {return Math.sqrt(d.value)/10})
            .attr("x", function(d,i) {return x(d.product) + (x.bandwidth()-cellWH)/2})
            .attr("y", function(d,i) {return y(d.ingredient)})
            .on("mouseover", d => {
                barTooltip.style("opacity", .75);
                barTooltip.html("<span>" + d.product + "</span><span>" + d.ingredient + " - " + d.value + "</span>");
            })
            .on("mouseout", () => {
                barTooltip.style("opacity", 0);
            })
            .on("click", d => {selectHeatmap(d.ingredient); selectBar(d.ingredient)});

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + 0 + "," + height-20 + ")")
            .call(heatmapxAxis)
            .selectAll("text")  
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)");
    }

    returnObj['selectHeatmap'] = function (ingredient) {
        productss.sort((a, b) => a[ingredient] - b[ingredient]);
        x.domain(productss.map(d => d.product_name));

        productss.forEach(p => {
            selectedIngredients.forEach(k => {
                d3.select("#cell-"+p.id+k)
                    .transition()
                    .duration(600)
                    .ease(d3.easeExpOut)
                    .attr("x", function(d,i) {return x(p.product_name) + (x.bandwidth()-cellWH)/2})
            });
        });

        svg.select(".x.axis")
            .transition()
            .duration(600)
            .ease(d3.easeExpOut)
            .call(heatmapxAxis);
    }

    return returnObj;
}();

function setHeatmapData(data) {
    heatmap.setHeatMapData(data);
}

function selectHeatmap(data) {
    heatmap.selectHeatmap(data);
}
