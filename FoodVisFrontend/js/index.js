for(var j = 0; j < 4; j++){
    var getData = function(){
      var size = 2;
      var data = {};
      var text = "";
      data["data-1"] = Math.round(Math.random()*100);
      data["data-2"] = 100 - data["data-1"]
      text += "data-1 = "+data[1]+"<br/>";
      text += "data-2 = "+data[2]+"<br/>";
    
      d3.select("#data").html(text);
      return data;
    };

    /*var chart = donut()
                  .$el(d3.select("#donut"+j))
                  .data(getData())
                  .render();*/
}

function getFilterValues() {
  let ingredients = {};
  $(".slider").each(function(){
    let range = {"gt": $(this)[0].noUiSlider.get()[0], "lt": $(this)[0].noUiSlider.get()[1]};
    ingredients[$(this).attr('id')] = range;
  });
  return ingredients;
}

function resetFilterValues() {
  $(".slider").each(function(){
    $(this)[0].noUiSlider.reset();
  });
}

function initSliders() {
  $(".slider").each(function(){
    var slider = $(this)[0];

    noUiSlider.create(slider, {
      start: [0, 100],
      connect: true,
      step: 1,
      tooltips: true,
      range: {
        'min': 0,
        'max': 100
      }
    });
    slider.noUiSlider.on('end', function(){
      console.log('hoi');
      search();
    });
  });
}
initSliders();

