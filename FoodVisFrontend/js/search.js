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
    // selectedProducts = [];
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

            $("#middle").children().hide();
            $("#product-list").show().find(".row").empty();

            result = result.filter(res => {
              return selectedIngredients.some(ing => {return res[ing] > 0;})
            });
            setProductsBrowserData(result);
            setProductsList(result);
        }
    );
}

function setDetailVisualization(){
    let dataMap = {};
    let dataArray = [];

    for(let prod in selectedProducts){
        dataMap[selectedProducts[prod].id] = selectedProducts[prod]
    }
    for(let key in dataMap){
        dataArray.push(dataMap[key]);
    }

    console.log("DATA ARRAY ", dataArray);

    if(dataArray.length ===1){
        $("#middle").children().hide();
        $("#product_view").show();
        $("#back-button").show();
        drawProductView(dataArray);
    }
}

function setDonutVisualization(){
    let dataMap = {};
    let dataArray = [];

    for(let prod in selectedProducts){
        dataMap[selectedProducts[prod].id] = selectedProducts[prod]
    }
    for(let key in dataMap){
        dataArray.push(dataMap[key]);
    }

    console.log(dataArray);

    if(dataArray.length === 2){
        $("#middle").children().hide();

        $("#donuts >div").remove();
        $("#donuts").show();
        $("#back-button").show();
        setDonutData(dataArray);
    }
}

function setBarchartVisualization(){
    if(selectedProducts.length > 2){
        $("#middle").children().hide();
        $(".graphs").show();
        $("#back-button").show();

        setBarChartData(selectedProducts);
        setHeatmapData(selectedProducts);
    }
}

/*
function setProductViewVisualization(){
    let dataMap = {};
    let dataArray = [];

    for(let prod in selectedProducts){
        dataMap[selectedProducts[prod].id] = selectedProducts[prod]
    }
    for(let key in dataMap){
        dataArray.push(dataMap[key]);
    }
    if(dataArray.length ===1){
        $("#product-list").hide();
        $(".graphs").show();

        drawProductView(dataArray);
    }
}*/

function setProductsList(list) {
    prodList = $.extend(true, {}, list);
    $("#product-list").show();

    // Create the container for the product images
    let $row = $(".row");
    // Loop through products
    for (let key in prodList) {
        // create one product image element
        let img = document.createElement("img");
        img.style.width = "150px";
        img.style.height = "150px";

        // create container for product
        $row.append('<div id="' + prodList[key]["id"] + '" class="product">');

        // select product container
        let $col = $("#" + prodList[key]["id"]);

        // add image or placeholder
        if (prodList[key]["image_small_url"]) {
            img.src = prodList[key]["image_small_url"].toString();
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

    Object.values(prodList)
      .filter(product => selectedProducts.some(e => e.id === product.id))
      .forEach(product => {
        toggleCategory(product);
      });

    checkButtonAvailability();
}

function selectProduct(product){
    let index = selectedProducts
      .findIndex(d => d.id === product.id);
    if(index === -1) {
        selectedProducts.push(product);
    } else {
        selectedProducts.splice(index, 1);
    }
    toggleCategory(product);
    checkButtonAvailability();

    // function from products-browser (left bar):
    toggleProductSelectionBrowser(product.id);
}

function selectAll() {
    productList.forEach(product => {
        let index = selectedProducts.findIndex(d => d.id === product.id);
        if(index === -1) {
            selectedProducts.push(product);
            toggleCategory(product);
            toggleProductSelectionBrowser(product.id);
        }
    });
    checkButtonAvailability();
    refreshData();
}

function selectNone() {
    selectedProducts.forEach(product => {
        toggleCategory(product);
        toggleProductSelectionBrowser(product.id);
    });
    selectedProducts = [];
    checkButtonAvailability();
    refreshData();
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

function checkButtonAvailability(){
    let count = selectedProducts.length;
    console.log(count);

    if(count < 1){
        $('#product-list').find('div:first-child .visualize_button').addClass('disabled');
    }
    if(count === 1){
        $('#detailVisualizeButton').removeClass('disabled');
        $('#donutVisualizationButton').addClass('disabled');
        $('#barchartVisualizationButton').addClass('disabled');
    }
    if(count === 2){
        $('#detailVisualizeButton').addClass('disabled');
        $('#donutVisualizationButton').removeClass('disabled');
        $('#barchartVisualizationButton').removeClass('disabled');
    }
    if(count > 2){
        $('#detailVisualizeButton').addClass('disabled');
        $('#donutVisualizationButton').addClass('disabled');
        $('#barchartVisualizationButton').removeClass('disabled');
    }
}

function showProductList() {
    $("#middle").children().hide();
    $("#product-list").show();
}