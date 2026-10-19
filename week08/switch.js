"use strict";

function myfunction() {
    var myV;

    var fruitType = prompt("Please enter the fruit name: ")

    switch (fruitType) {
        case "Oranges":
            myV = "Oranges are $3.0 a kilo.\n";
            break;
        case "Apples":
            myV = "Apples are $1.99 a kilo.\n";
            break;
        case "Mangoes":
            myV = "Mangoes are $2.0 a kilo.\n";
            break;
        case "Avocadoes":
            myV = "Avocadoes are $2.0 a kilo.\n";
            break;
        default:
            myV = "Sorry we are out of stock." + fruitType;

    }
}