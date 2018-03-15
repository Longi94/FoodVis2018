let donutData;
let donutSvg; 

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
  
  donutData = selectedProducts.map(function(product){ return {"name": product["product_name"], "value": product[keys[0]] === "" ? 0 : parseInt(product[keys[0]])}});
  console.log(donutData);
  var path = donutSvg.selectAll('path')
    .data(pie(donutData))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d, i) { 
      return color(d.data.name);
    
    });
}

function initDonuts() {
  let width = 360;
  let height = 360;
  let radius = Math.min(width, height) / 2;

  let color = d3.scaleOrdinal(d3.schemeCategory20c);

  donutSvg = d3.select("#donuts")
    .append("svg")
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + (width / 2) + 
      ',' + (height / 2) + ')');

  let donutWidth = 75;

  let arc = d3.arc()
    .innerRadius(radius - donutWidth)
    .outerRadius(radius);

  let pie = d3.pie()
    .value(function(d) { return d.value; })
    .sort(null);

  let legendRectSize = 18;
  let legendSpacing = 4;
}
