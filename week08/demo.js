"use strict";
function display() {

    var x;

    var age = prompt("Please enter your age: ");

    if (age = 18 && age <= 28)
        x = " You can Join the Climbing Club";
    else
        x = " Sorry, you cannot join the Climbing Club";


    var hd1 = document.getElementById("hd1");
    hd1.textContent = x;
}

function init() {
    var clickme = document.getElementById("clickme");
    clickme.onclick = display;
}

window.onload = init