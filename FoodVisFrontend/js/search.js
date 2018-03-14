$.ajax({
    dataType: "json",
    url: 'json/categories.json',
    mimeType: "application/json",
    success: function (categories) {
        $("#search-input").autocomplete({
            source: categories,
            minLength: 3
        });
    },
    error: function (error) {
        console.error(error);
    }
});

selectedProducts = [];
prodList = [];

function search() {
    let query = $("#search-input").val();

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

            $("#product-list").empty().show();
            $(".graphs").hide();
            setProductsBrowserData(result);
            setProductsList(result);
        }
    );
}

function setVisualization(){
    if(selectedProducts.length > 2){
        $("#product-list").hide();
        $(".graphs").show();

        setBarChartData(selectedProducts);
        setHeatmapData(selectedProducts);
    }
}

function setProductsList(list) {
    prodList = $.extend(true, {}, list);
    $("#middle").append("<div id='product-list'></div>");
    let $productView = $("#product-list");
    $productView.html("");
    $productView.append(
        '<button onclick="setVisualization()">Visualize these products</button>'+
        '<h2>Select products you are interested in by clicking on their icons.</h2>' +
        '<div class="row">'
    );

    // Create the container for the product images
    let $row = $(".row");
    // Loop through products
    for (let key in prodList) {
        // create one product image element
        let img = document.createElement("img");
        img.style.width = "150px";
        img.style.height = "150px";

        // create container for product
        $row.append('<div id="c' + prodList[key]["id"] + '" class="product">');

        // select product container
        let $col = $("#c" + prodList[key]["id"]);

        // add image or placeholder
        if (prodList[key]["image_url"]) {
            img.src = prodList[key]["image_url"].toString();
        } else {
            img.src = "./images/Placeholder-food.jpg";
        }

        // Add image to container
        $col.html(img);

        // Add name to container
        $col.append('<p class="hover-text">'+prodList[key]["product_name"]+'</p>');
        $row.append('</div>');

        $col.click(function(){
            selectProduct(prodList[key]);
        });
    }
    $row.append("</div>");
}

function selectProduct(product){
    if(selectedProducts.indexOf(product) === -1) {
        selectedProducts.push(product);
        $("#c" + product["id"]).addClass("selected");
    } else {
        selectedProducts = selectedProducts.filter(function(x){ return x === product});
        $("#c" + product["id"]).removeClass("selected");
    }

    // function from products-browser (left bar):
    toggleProductSelection(product.id);
}

function getFilterValues() {
    let ingredients = {and: []};
    $(".slider").each(function () {
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