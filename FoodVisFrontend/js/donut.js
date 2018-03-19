function setDonutData(products) {
  let keys = [
      "fat_100g",
      "sugars_100g",
      "fiber_100g",
      "proteins_100g",
      "salt_100g"
  ];

  if (products.length === 0) {
      return;
  }

  const ids = new Set([]);

  var pColors = ["#C02942", "#425b94"];
  var productNames = products.map(p => p.product_name);
  
  $("#donuts").append("<div id='legendContainer'></div>");
  $("#donuts").append("<div id='donutListContainer'></div>");
  for(let i = 0; i < productNames.length; i++){
    $("#legendContainer").append("<div class='legendDonuts'><div class='coloredBox' style='background-color: "+pColors[i]+"''></div><p class='legendTitle'>"+productNames[i]+"</p></div>");
  }

  keys.forEach(key => {
    donutData = products.map(function(product){ return {"name": product["product_name"], "value": parseInt(product[key] || 0)}});
  
  if(donutData[0].value !== 0 && donutData[1] !== 0){              
    var width = 360;
    var height = 360;
    var radius = Math.min(width, height) / 2;



    var container = d3.select('#donutListContainer').append('div')
    container.attr('id', key).append('h2').text(key.split("_")[0])
    
    var tooltip_donut = d3.select("body").append("div")
            .attr("class", "bar-tooltip")
            .style("opacity", "0");

    $(document).mousemove(event => {
      tooltip_donut
        .style("left", event.pageX - 100 + "px")
        .style("top", event.pageY - 65 + "px");
    });


    let svg = container.append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) + 
        ',' + (height / 2) + ')');  


    var donutWidth = 75;

    var arc = d3.arc()
      .innerRadius(radius - donutWidth)
      .outerRadius(radius);

    var pie = d3.pie()
      .value(function(d) { return d.value; })
      .sort(null);

    var legendRectSize = 18;
    var legendSpacing = 4;

    var path = svg.selectAll('path')
      .data(pie(donutData))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function(d, i) { 
        return pColors[i];
      });

    path.on('mouseover', function(d) {
      tooltip_donut.style("opacity", .75);
      tooltip_donut.html("<span>"+d.data.name+"</span><span>" + key.split("_")[0] + "</span><span>" + d.data.value + "g per 100g</span>");
    });
            
    path.on('mouseout', function() {  
      tooltip_donut.style("opacity", 0);
    });  
  }  
});        
}
