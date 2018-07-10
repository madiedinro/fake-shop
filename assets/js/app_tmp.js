function ready() {

    $('*[data-toggle="cart"]').click(function (e) {
        e.preventDefault();


        var item = $(this).data('target');


        if (item === 'kit') {

            window.openDataLayer.push(['event', 'Product Added', {
                "product": {
                    "id": "1",
                    "name": "SY kit",
                    "brand": 'SY',
                    "category": [
                        "Наборы"
                    ],
                    "currency": "RUB",
                    "price": 4990,
                    "salePrice": 4990,
                    "skuCode": "SY1"
                },
                "quantity": 1
            }]);

        } else if (item === 'german') {


            window.openDataLayer.push(['event', 'Product Added', {
                "product": {
                    "id": "2",
                    "name": "German",
                    "brand": 'SY',
                    "category": [
                        "Готовые изделия"
                    ],
                    "currency": "RUB",
                    "price": 990,
                    "salePrice": 990,
                    "skuCode": "SY2"
                },
                "quantity": 1
            }]);

        }
    });

    $('.show-kit-modal').click(function (e) {
        e.preventDefault();
        $('#modalDetailsPro').modal();

        window.openDataLayer.push(['event', 'Product Viewed', {
            "product": {
                "id": "1",
                "name": "SY kit",
                "brand": 'SY',
                "category": [
                    "Наборы"
                ],
                "currency": "RUB",
                "price": 4990,
                "salePrice": 4990,
                "skuCode": "SY1"
            }
        }]);

    });


    $('.show-german-modal').click(function (e) {

        e.preventDefault();
        $('#modalDetailsGerman').modal();

        window.openDataLayer.push(['event', 'Product Viewed', {
            "product": {
                "id": "2",
                "name": "German",
                "brand": 'SY',
                "category": [
                    "Готовые изделия"
                ],
                "currency": "RUB",
                "price": 990,
                "salePrice": 990,
                "skuCode": "SY2"
            }
        }]);

    });



}

document.addEventListener("DOMContentLoaded", ready);

