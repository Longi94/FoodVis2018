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
  
  keys.forEach(key => {
    donutData = selectedProducts.map(function(product){ return {"name": product["product_name"], "value": parseInt(product[key] || 0)}});

  var tooltip = d3.select('#donuts')            
    .append('div')                             
    .attr('class', 'tooltip');                 

  tooltip.append('div')                        
    .attr('class', 'label');                   

  tooltip.append('div')                        
    .attr('class', 'count');                   

  tooltip.append('div')                        
    .attr('class', 'percent');                 

  var width = 360;
  var height = 360;
  var radius = Math.min(width, height) / 2;

  var color = d3.scaleOrdinal(d3.schemeCategory20c);

  var container = d3.select('#donuts').append('div')
  
  container.attr('id', key).append('h2').text(key)
  
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
      return color(d.data.name);
    });

  path.on('mouseover', function(d) {
    var total = d3.sum(donutData.map(function(d) {
      return d.value;
    }));
    var percent = Math.round(1000 * d.data.value / total) / 10;
    tooltip.select('.label').html(d.data.name);
    tooltip.select('.count').html(d.data.value);
    tooltip.select('.percent').html(percent + '%');
    tooltip.style('display', 'block');
  });
          
          path.on('mouseout', function() {
    tooltip.style('display', 'none');
  });
          
  var legend = svg.selectAll('.legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function(d, i) {
      var height = legendRectSize + legendSpacing;
      var offset =  height * color.domain().length / 2;
      var horz = -2 * legendRectSize;
      var vert = i * height - offset;
      return 'translate(' + horz + ',' + vert + ')';
    });
          
  legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', color)
    .style('stroke', color);
          
  legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) { return d; });
  });

}        

