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
        {category: query, limit: 50, ingredients: JSON.stringify(getFilterValues())},
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
    let rangeGt = {"gt": parseInt($(this)[0].noUiSlider.get()[0])};
    let rangeLt = {"lt": parseInt($(this)[0].noUiSlider.get()[1])};
    
    let asd1 = {};
    let asd2 = {};
    asd1[$(this).attr('id')] = rangeGt;
    asd2[$(this).attr('id')] = rangeLt;

    ingredients['and'].push(asd1, asd2);
  });
  return ingredients;
}