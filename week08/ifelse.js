"use strict";

function myfunction() {
    var myV;

    var t = prompt("Please enter the time: ")
    if ((t < 0) || (t > 23)) {
        myV = "wront time";
    }
    else {
        if (t < 12)
            myV = "Good Morning.";
        else if (t < 18)
            myV = "Good Afternoon";
        else
            myV = "Good evening";
    }

    var myH1 = document.getElementById("Welcome");
    myH1.innerHTML = myV; //text content
}

function init() {
    document.getElementById("button").onclick = myFunction;
}

