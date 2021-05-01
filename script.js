// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const submit = document.querySelector("button[type=submit]");
const memeform = document.querySelector("form");
const c = document.getElementById('user-image');
const ctx = c.getContext('2d');
const clear = document.querySelector("button[type=reset]");
const read = document.querySelector("button[type=button]");
const fileimg = document.querySelector("#image-input");
const volume = document.getElementById('volume-group');
var voiceSelect = document.getElementById('voice-selection');
var synth = window.speechSynthesis;
var voices = [];


function populateVoiceList() {
  voiceSelect.remove(0);
  voices = synth.getVoices();
  voiceSelect.disabled = false;

  for(var i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}


// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  submit.disabled = false;
  clear.disabled = true;
  read.disabled = true;
  ctx.fillStyle = "black";
  ctx.clearRect(0,0,400,400);
  ctx.fillRect(0,0,400,400);
  ctx.drawImage(img, getDimmensions(400, 400, img.width, img.height).startX, getDimmensions(400, 400, img.width, img.height).startY, getDimmensions(400, 400, img.width, img.height).width, getDimmensions(400, 400, img.width, img.height).height);
  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});


fileimg.addEventListener('change', function(e) {
  const imgURL = URL.createObjectURL(e.target.files[0])
  img.src = imgURL;
  img.alt = fileimg.name;
});


memeform.addEventListener('submit', function(e) {
  e.preventDefault();
  var top = document.getElementById("text-top").value;
  var bottom = document.getElementById("text-bottom").value;
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(top, 200, 50);
  ctx.fillText(bottom, 200, 375);
  submit.disabled = true;
  clear.disabled = false;
  read.disabled = false;
});


clear.addEventListener('click', function(e) {
  submit.disabled = false;
  clear.disabled = true;
  read.disabled = true;
  ctx.clearRect(0,0,400,400);
})


read.addEventListener('click', function(e) {
  e.preventDefault();
  var top = document.getElementById("text-top").value;
  var bottom = document.getElementById("text-bottom").value;
  var utterance = new SpeechSynthesisUtterance(top);
  var utterance1 = new SpeechSynthesisUtterance(bottom);
  var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
  for(var i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectedOption) {
      utterance.voice = voices[i];
      utterance1.voice = voices[i];
    }
  }
  const vol = document.querySelector("input[type=range]")
  utterance.volume = vol.value/100;
  utterance1.volume = vol.value/100;
  speechSynthesis.speak(utterance);
  speechSynthesis.speak(utterance1);
})


volume.addEventListener('input', function(e) {
  const vol = document.querySelector("input[type=range]")
  if(vol.value == 0){
    document.querySelector("div>img").src = 'icons/volume-level-0.svg';
  }else if(vol.value <= 33){
    document.querySelector("div>img").src = 'icons/volume-level-1.svg';
  }else if(vol.value <= 66){
    document.querySelector("div>img").src = 'icons/volume-level-2.svg';
  }else{
    document.querySelector("div>img").src = 'icons/volume-level-3.svg';
  }
})

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
