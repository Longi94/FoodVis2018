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

    var chart = donut()
                  .$el(d3.select("#donut"+j))
                  .data(getData())
                  .render();
}

$.ajax({
    dataType: "json",
    url: 'json/categories.json',
    mimeType: "application/json",
    success: function(categories){
      $("#search-input").autocomplete({
        source: categories,
        minLength: 3
      });
    },
    error: function(error) {
      console.error(error);
    }
});

function search() {
    var query = $("#search-input").val();

    query = query.split(" ").join("-");

    $.get(
        "http://localhost:3000/api/Products/search",
        {category: query, limit: 50},
        function (result) {
            setBarChartData(result);
        }
    );
}

function getFilterValues() {
  let ingredients = {};
  $(".slider").each(function(){
    let range = {"gt": $(this)[0].noUiSlider.get()[0], "lt": $(this)[0].noUiSlider.get()[1]};
    ingredients[$(this).attr('id')] = range;
  });
  console.log(ingredients);
  return ingredients;
}

function initSliders() {
  $(".slider").each(function(){
    var slider = $(this)[0];

    noUiSlider.create(slider, {
      start: [20, 80],
      connect: true,
      step: 1,
      tooltips: true,
      range: {
        'min': 0,
        'max': 100
      }
    });
  });
}
initSliders();