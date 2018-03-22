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
  if(!($("#donuts-title").length)){
    $("#donuts").append("<h1 id='donuts-title' style='text-align:center;font-weight:bold;font-size:40px;margin:0'>Common Ingredients Donut Comparison</h1>");
  }
  $("#donuts").append("<div id='legendContainer'></div>");
  $("#donuts").append("<div id='donutListContainer'></div>");

  for(let i = 0; i < productNames.length; i++){
    $("#legendContainer").append("<div class='legendDonuts'><div class='coloredBox' style='background-color: "+pColors[i]+"''></div><p class='legendTitle' style='font-size:20px;font-weight:bold;'>"+productNames[i]+"</p></div>");
  }

  keys.forEach(key => {
    donutData = products.map(function(product){ return {"name": product["product_name"], "value": parseInt(product[key] || 0)}});

  if(donutData[0].value !== 0 && donutData[1] !== 0){              
    var width = 360;
    var height = 360;
    var radius = Math.min(width, height) / 2;

    var container = d3.select('#donutListContainer').append('div')
    container.attr('id', key).append('h2').text(key.split("_")[0].toUpperCase())
    
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
    console.log("DONUT DATA ", pie(donutData));
    var path = svg.selectAll('path')
      .data(pie(donutData))
      .enter();

     let pathArcs = path.append('path')
      .attr('d', arc)
      .attr("id", function(d){ return d.data.name+"-"+key;})
      .attr('fill', function(d, i) { 
        return pColors[i];
      });

/*path.append("text")
          .attr("font-size",20)
          .attr("font-weight","bold")
          .attr("y",20)
          .attr("x",20)
          .append("textPath")
          .attr("xlink:href", function(d){ return "#"+d.data.name+"-"+key;}) //place the ID of the path here
          .style("text-anchor","middle") //place the text halfway on the arc
          .attr("startOffset","50%")
          .attr("fill")
          .text(function(d){
            return d.data.value;
            //return d.data.name+"-"+d.data.value+"g\n";
          });*/


    pathArcs.on('mouseover', function(d) {
      tooltip_donut.style("opacity", .75);
      tooltip_donut.html("<span>"+d.data.name+"</span><span>" + key.split("_")[0] + "</span><span>" + d.data.value + "g per 100g</span>");
    });
            
    pathArcs.on('mouseout', function() {  
      tooltip_donut.style("opacity", 0);
    });  
  }  
});        
}
