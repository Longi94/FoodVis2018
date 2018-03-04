for(var j = 1; j < 5; j++){
    var getData = function(){
      var size = 3;
      var data = {};
      var text = "";
      for(var i=0; i<size; i++){
        data["data-"+(i+1)] = Math.round(Math.random() * 100);
        text += "data-"+ (i+1) +" = " + data["data-"+(i+1)] + "<br/>";
      };
      d3.select("#data").html(text);
      return data;
    };

    var chart = donut()
                  .$el(d3.select("#donut"+j))
                  .data(getData())
                  .render();
}

$.get('json/categories.json', function (categories) {
    $("#search-input").autocomplete({
        source: categories,
        minLength: 3
    })
}).fail(function (xhr, error) {
    console.log(error)
});

function search() {
    var query = $("#search-input").val();

    query = query.split(" ").join("-");

    $.get(
        "http://localhost:3000/api/Products/search",
        {category: query, limit: 50},
        function (result) {
            console.log(result);
        }
    );
}