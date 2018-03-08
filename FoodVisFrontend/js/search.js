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

    let body = {category: query, limit: 50};
    let filterValues = getFilterValues();
    if (filterValues) {
        body['ingredients'] = JSON.stringify(filterValues);
    }

    $.get(
        "http://localhost:3000/api/Products/search",
        body,
        function (result) {
            setBarChartData(result);
        }
    );
}

function searchIndex2() {
    
}

function getFilterValues() {
  let ingredients = {and: []};
  $(".slider").each(function(){
    // {$and: [{fat_100g: {$gt: 0}}, {fat_100g: {$lt: 100}}]}
    let slider = $(this)[0].noUiSlider;
    let min = parseInt(slider.get()[0]);
    let max = parseInt(slider.get()[1]);
    if (min === slider.options.range.min &&
        max === slider.options.range.max) {
        return;
    }

    let rangeGt = {"gt": min};
    let rangeLt = {"lt": max};
    
    let asd1 = {};
    let asd2 = {};
    asd1[$(this).attr('id')] = rangeGt;
    asd2[$(this).attr('id')] = rangeLt;

    ingredients['and'].push(asd1, asd2);
  });
  return ingredients['and'].length > 0 ? ingredients : null;
}