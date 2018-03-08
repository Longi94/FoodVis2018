const selectedIngredients = [
    /*"energy_100g",*/ //it's too large
    "fat_100g",
    "cholesterol_100g",
    "carbohydrates_100g",
    "sugars_100g",
    "starch_100g",
    "polyols_100g",
    "fiber_100g",
    "proteins_100g",
    "casein_100g",
    "serum-proteins_100g",
    "nucleotides_100g",
    "salt_100g",
    "sodium_100g",
    "alcohol_100g",
    "vitamin-a_100g",
    "beta-carotene_100g",
    "vitamin-d_100g",
    "vitamin-e_100g",
    "vitamin-k_100g",
    "vitamin-c_100g",
    "vitamin-b1_100g",
    "vitamin-b2_100g",
    "vitamin-pp_100g",
    "vitamin-b6_100g",
    "vitamin-b9_100g",
    "folates_100g",
    "vitamin-b12_100g",
    "biotin_100g",
    "pantothenic-acid_100g",
    "silica_100g",
    "bicarbonate_100g",
    "potassium_100g",
    "chloride_100g",
    "calcium_100g",
    "phosphorus_100g",
    "iron_100g",
    "magnesium_100g",
    "zinc_100g",
    "copper_100g",
    "manganese_100g",
    "fluoride_100g",
    "selenium_100g",
    "chromium_100g",
    "molybdenum_100g",
    "iodine_100g",
    "caffeine_100g",
    "taurine_100g",
    "ph_100g",
    "fruits-vegetables-nuts_100g",
    "cocoa_100g",
    "chlorophyl_100g",
    "carbon-footprint_100g",
    "glycemic-index_100g",
    "choline_100g",
    "phylloquinone_100g",
    "beta-glucan_100g",
    "inositol_100g",
    "carnitine_100g",
    "product_name",
    "id"
];

(function(window) {
    var barTooltip = d3.select("body").append("div")
        .attr("class", "bar-tooltip")
        .style("opacity", "0");


    var currentMousePos = {x: -1, y: -1};
    $(document).mousemove(function (event) {
        currentMousePos.x = event.pageX;
        currentMousePos.y = event.pageY;
        barTooltip
            .style("left", currentMousePos.x - 100 + "px")
            .style("top", currentMousePos.y - 65 + "px");
    });

    var svg = d3.select("#norm-bar > svg"),
        margin = {top: 20, right: 60, bottom: 30, left: 40},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1)
        .align(0.1);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var z = d3.scaleOrdinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var stack = d3.stack()
        .offset(d3.stackOffsetExpand);

    window.setBarChartData = function(products) {
        if (products.length === 0) {
            return;
        }
        Object.keys(products[0]).forEach(function (key) {
            var removeKey = true;

            if ($.inArray(key, selectedIngredients) !== -1) {
                for (var i = 0; i < products.length; i++) {
                    if (products[i][key] !== "") {
                        removeKey = false;
                        break;
                    }
                }
            }

            if (removeKey) {
                products.forEach(function (product) {
                    delete product[key];
                });
            }
        });

        products.forEach(function (product) {
            Object.keys(product).forEach(function (key) {
                if (typeof product[key] !== "number" && key !== "id" && key !== "product_name") {
                    product[key] = 0
                }
            });
        });

        /*const sortKey = Object.keys(products[0])[0];

        products.sort(function (a, b) {
            return a[sortKey] - b[sortKey]
        });*/

        var keys = Object.keys(products[0]).filter(function (k) {
            return k !== "id" && k !== "product_name"
        });

        x.domain(products.map(function (d) {
            return d.id
        }));
        z.domain(keys);

        g.html("");

        var serie = g.selectAll(".serie")
            .data(stack.keys(keys)(products))
            .enter().append("g")
            .attr("class", "serie")
            .attr("fill", function (d) {
                return z(d.key);
            });

        serie.selectAll("rect")
            .data(function (d) {
                d.forEach(function (value) {
                    value.key = d.key;
                });
                return d;
            })
            .enter().append("rect")
            .attr("x", function (d) {
                return x(d.data.id);
            })
            .attr("y", function (d) {
                return y(d[1]);
            })
            .attr("height", function (d) {
                return y(d[0]) - y(d[1]);
            })
            .attr("width", x.bandwidth())
            .on("mouseover", function (d) {
                barTooltip.style("opacity", .75);
                barTooltip.html("<span>" + d.data.product_name + "</span>" + "<span>" + d.key + " - " + d.data[d.key] + "</span>");
            })
            .on("mouseout", function (d) {
                barTooltip.style("opacity", 0);
            });

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(10, "%"));

        var legend = serie.append("g")
            .attr("class", "legend")
            .attr("transform", function (d) {
                var d = d[d.length - 1];
                return "translate(" + (x(d.data.id) + x.bandwidth()) + "," + ((y(d[0]) + y(d[1])) / 2) + ")";
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
            .text(function (d) {
                return d.key;
            });
    }

    function type(d, i, columns) {
        for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
        d.total = t;
        return d;
    }
})(window);