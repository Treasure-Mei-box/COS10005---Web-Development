"use strict";

var running;
var currentImg = 0; //start position with 0
var theImages = new Array("img0.jpg","img1.jpg","img0.jpg")
var theTexts = new Array("text0","text0","text0")

function cycleImage(){
var figImg = document.getElementById("picImage");
var figCap = document.getElementById("picText");
if(document.images){
currentImg++;
currentImg = currentImg % 3; //by 3 if u have 3 images in total
figImg.src = theImages[currentImg];
}
}

function startSlideShow(){
running = setInterval("cycleImage()", 2000); //2secs
}
function stopSlideShow(){
window.clearInterval(running);
}

function init(){
document.getElementById("start").onclick = startSlideShow;
document.getElementById("stop").onclick = stopSlideShow;
}

window.onload = init;