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

function searchIndex2() {
    
}