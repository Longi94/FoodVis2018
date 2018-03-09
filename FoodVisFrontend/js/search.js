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
            setProductsBrowserData($.extend(true, [], result));
            setBarChartData($.extend(true, [], result));

            let prodList = $.extend(true, {}, result);
            let $productView = $("#product-list");
            $productView.html("");
            let i = 0;
            for(let key in prodList){

                  //console.log(result[key])
                  let img = document.createElement("img");
                  img.style.width="150px";
                  img.style.height = "150px"
                  if((i%3)===0){
                    if(!(i===0)){
                      $productView.append("</div>");
                    }
                    $productView.append('<div class="row" id="r'+i+'">');
                    var $row = $("#r"+i);
                    $row.append('<div class="col-sm-3" id="c'+i+'">');
                    let $col = $("#c"+i);
                    if(prodList[key]["image_url"]){
                      img.src = prodList[key]["image_url"].toString();
                    }else{
                       img.src = "./images/Placeholder-food.jpg";
                    }
                    $col.html(img);
                    $row.append("</div>");
                    i = i + 1;
                }else{
                    $row.append('<div class="col-sm-3" id="c'+i+'">');
                    let $col = $("#c"+i);
                    
                    if(prodList[key]["image_url"]){
                      img.src = prodList[key]["image_url"].toString();
                    }else{
                       img.src = "./images/Placeholder-food.jpg";
                    }

                    $col.html(img);
                    $row.append("</div>");
                    i = i + 1;
              }
            }
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