
/******************
// collectiveBodyApp.js
// 2020
// miles.thorogood at UBC.ca
// for the 2020 Living Things Festival
*******************/


"use strict";


var presets ; // keep track of containers here
var preset =[]; // current preset
var back_preset = [] ; // previous preset
var presetIndex = 0 ;
var nextPreset; // for transition
//var speed = 'slow' ; // the speed of the movement
var preferences =[] ;
var tTheta = 0 ;
var tLock = false;
//var transitionInterval;
var canvas ;

/*********************
/
/ Screen Presets
/
*********************/
// width and height of screen are in mm
var canvasSize = {
    "width":1920,
    "height":1080
}

function centreScreen() {
  let h = canvasSize.height ;
  let hm = h / 197.5  ; // height multiplier
  let w = 213.0 * hm ; // width of this screen
  //console.log(w);
  let data = {
    "height": h,
    "width": w,
    "xPos": canvasSize.width/2,
    "yPos": 0
  }
  return data ;
};

function leftScreen() {
  let h = canvasSize.height ;
  let hm = h / 197.5  ;
  let w = 34.29 * hm ;
  let data = {
    "height": h,
    "width": w,
    "xPos": 0,
    "yPos": 0
  }
  return data ;
};


function rightScreen() {
  let h = canvasSize.height ;
  let hm = h / 197.5  ;
  let w = 34.29 * hm ;
  let data = {
    "height": h,
    "width": w,
    "xPos": canvasSize.width,
    "yPos": 0
  }
  return data ;
};

/******************
// RUNNING
*******************/
function runProgram() {
  //window.addEventListener('resize', resizeCanvas, true);
  document.addEventListener('mozfullscreenchange', on_fullscreen_change);
  document.addEventListener('webkitfullscreenchange', on_fullscreen_change);

  presetPopup() ; // poup preset window

  //canvas = document.getElementById('canvas');
  let h = 1080
  let hm = 1080 / 197.5  ;
  let w = 213 * hm ;

  canvas.width  = canvasSize.width;//w;//window.innerWidth;
  canvas.height = canvasSize.height;//h//;window.innerHeight;
  let cw=canvas.width;
  let ch=canvas.height;
  let context = canvas.getContext('2d');


  // get the animation loop going here
  window.setInterval(function() {
    context.clearRect(0,0,cw,ch);
    if(preset) {
      for (let i = preset.length-1; i >= 0; i--) {
        renderBox(preset[i]) ;
      }
    }
    if(back_preset) {
      for (let i = back_preset.length-1; i >= 0; i--) {
        renderBox(back_preset[i]) ;
      }
    }
  },41.66); // end set interval

  // render a video onto the canvas
  function renderBox(box) {
    let w = parseInt(box['width']);
    let h = parseInt(box['height']);
    let x = parseInt(box['x']);
    let y = parseInt(box['y']);
    let vx = parseInt(box['vOffsetX']) ;
    let vy = parseInt(box['vOffsetY']) ;
    let mx = parseInt(box['mOffsetX']) ;
    let my = parseInt(box['mOffsetY']) ;
    let mh = parseInt(box['mHeight']) ;
    let mw = parseInt(box['mWidth']) ;
    let video = box['video'] ;
    if(video.src) {
      context.save();
      let cx = x + 0.5 * w;   // x of shape center
      let cy = y + 0.5 * h;  // y of shape center
      context.translate(cx,cy);
      // rotate the canvas to the specified degrees
      context.rotate(box.rotation);
      context.translate(-cx,-cy);

      context.globalAlpha = box.opacity;

      context.beginPath();
      context.moveTo(x+mx, y+my);
      context.lineTo(x+mx+mw, y+my);
      context.lineTo(x+mx+mw, y+my+mh);
      context.lineTo(x+mx, y+my+mh);
      context.closePath();
      // Clip to the current path
      context.clip();
      //context.globalCompositeOperation = 'source-in';
      context.drawImage(video,x+vx,y+vy,w,h);
      //context.globalCompositeOperation = 'source-over';
      // ImageData object
      let imageData = context.getImageData(x+mx, y+my, mw, mh);
      // One-dimensional array containing the data in the RGBA order
      let data = imageData;
      // if(box.process){
      //   let adjusted = processImage(data, box) ;
      //   //context.putImageData(adjusted, x+mx+vx, y+my+vy);
      // } else {
      //   context.putImageData(data, x+mx+vx, y+my+vy);
      // }
      context.restore();
    }
  } // end renderBox
}

function processImage(pixelArray, box) {
    var gain = box.colorGain/100.0;
    var gamma = box.colorGamma/100.0;//document.getElementById('gamma').value  / 100.0;
    var gainR = box.redGain/100.0;//document.getElementById('redGain').value / 100;
    var gainG = box.greenGain/100.0;//document.getElementById('greenGain').value / 100;
    var gainB = box.blueGain/100.0;//document.getElementById('blueGain').value / 100;

    for (var i = 0; i < pixelArray.data.length; i += 4) {
        pixelArray.data[i] *= gainR * gain;
        pixelArray.data[i + 1] *= gainG *gain;
        pixelArray.data[i + 2] *= gainB *gain;

        pixelArray.data[i] = 255 * Math.pow(pixelArray.data[i] / 255, 1 / gamma);
        pixelArray.data[i + 1] = 255 * Math.pow(pixelArray.data[i + 1] / 255, 1 / gamma);
        pixelArray.data[i + 2] = 255* Math.pow(pixelArray.data[i + 2] / 255, 1 / gamma);

        // pixelArray.data[i] = 255 * (pixelArray.data[i]/255 + offset);
        // pixelArray.data[i + 1] = 255 * (pixelArray.data[i + 1] / 255 + offset);
        // pixelArray.data[i + 2] = 255 * (pixelArray.data[i + 2] / 255 + offset);
    }
    return pixelArray ;
    //ctx.putImageData(pixelArray, 0, 0);
}

// open as full screen
function openFullscreen() {
  var elem = document.getElementById("canvas");
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function on_fullscreen_change() {
  let rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}


/******************
// SOUND -  needs work
*******************/
var mySound;
mySound = new sound("audios/eno and the organ.mp3");
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

/******************
// LOADING
*******************/
var canvas = document.getElementById('canvas');

window.onload= function(){
  loadPreferences(); // loadPresets after this
}


function loadPreferences(){
  let oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", "/preferences/fetch");
  oReq.send();
  //console.log(oReq);
  function reqListener(data) {
    preferences = JSON.parse(this.responseText);
    console.log(preferences);
    runProgram() ;
  }
}

// load video from JSON box data
function loadPreset(data) {
  if(data){
    for (let i = 0; i < data.length; i++) {
      loadBoxVid(data[i]);
      //console.log(data[i]);
    }
    //console.log(preset);
  }
}


function copyPreset(data) {
  let tPreset =JSON.parse(JSON.stringify(data)) ;
  return tPreset;
}

function loadBoxVid(box) {
  let video = document.createElement('video');
  let vid_size = box['size'] ;
  let vid_type = box['type'] ;
  // if(!preferences[vid_type]) vid_type = Object.keys(preferences[speed])[0];
  let vid_path = preferences['path']+vid_size+'/';
  let vid_name ='';
  if(box['videoName']) {
    vid_name = box['videoName'];
  } else {
    vid_name = preferences.parts[vid_type][0] ;
    box['videoName'] = vid_name;
  }
  //source.type = "video/mp4";
  video.src = vid_path+vid_name;
  video.muted = true ;
  video.crossorigin = "anonymous" ;
  video.loop = true ;
  video.play() ;

  video.onloadeddata = function() {
    if(box.opacity != 1) fadeIn(box);
  };
  box.video = video ;
}

function reloadBoxType(box) {
  box.video.pause();
  box.video.removeAttribute('src') ;
  box.video.load() ;
  // let video = document.createElement('video');
  let vid_size = box['size'] ;
  let vid_type = box['type'] ;
  let vid_path = preferences['path']+vid_size+'/';
  let vid_name = preferences.parts[vid_type][0] ;
  //source.type = "video/mp4";
  box.video.src = vid_path+vid_name;
  box.videoName = vid_name ;
  box.video.muted = true ;
  box.video.loop = true ;
  box.video.play() ;
  //box.video = video ;
}

function reloadBoxVid(box) {
  box.video.pause();
  box.video.removeAttribute('src') ;
  box.video.load() ;
  // let video = document.createElement('video');
  let vid_size = box['size'] ;
  let vid_type = box['type'] ;
  let vid_path = preferences['path']+vid_size+'/';
  let vid_name = box['videoName'] ;
  //source.type = "video/mp4";
  box.video.src = vid_path+vid_name;
  box.video.muted = true ;
  box.video.loop = true ;
  box.video.play() ;
  //box.video = video ;
}


// garbage DOM data
function destroyVideo(data) {
  if(data) {
      data.video.pause();
      data.video.removeAttribute('src') ;
      data.video.load() ;
  }
}

function destroyVideos(data) {
  if(data) {
    for (let i = 0; i < data.length; i++) {
      data[i].video.pause();
      data[i].video.removeAttribute('src') ;
      data[i].video.load() ;
    }
  }
}

/*************
// Box manipulation
**************/
function setBoxSize(box) {
  // box.width = preferences['sizes'][box['size']]['width'];
  box.width = parseInt(box['size']);
  box.height = box.width/(16/9) ;
}

function incrementBoxSize(box) {
  box.width = box.width+10 ;
  box.height = box.width/(16/9) ;
}
function decrementBoxSize(box) {
  box.width = box.width-10 ;
  box.height = box.width/(16/9) ;
}

// mask manipulation
function incrementMaskWidth(box) {
  box.mWidth += 1 ;
}
function decrementMaskWidth(box) {
  box.mWidth -= 1 ;
}
function incrementMaskHeight(box) {
  box.mHeight += 1 ;
}
function decrementMaskHeight(box) {
  box.mHeight -= 1 ;
}
function incrementMaskOffsetX(box) {
  box.mOffsetX += 1 ;
}
function decrementMaskOffsetX(box) {
  box.mOffsetX -= 1 ;
}
function incrementMaskOffsetY(box) {
  box.mOffsetY += 1 ;
}
function decrementMaskOffsetY(box) {
  box.mOffsetY -= 1 ;
}

function addNewBox() {
  let box = {"x":0,"y":0,"type":Object.keys(preferences.parts)[1],
  "video":"","size":preferences.sizes[3], "rotation":0, "opacity":1,
  "vOffsetX":0, "vOffsetY":0, "mOffsetX":0, "mOffsetY":0, "mWidth":0, "mHeight":0,
  "colorGain":100, "colorGamma":100, "redGain":100, "greenGain":100, "blueGain":100,
  "process":false};
  //console.log(box);
  setBoxSize(box) ;
  box.mWidth = box.width ;
  box.mHeight = box.height ;
  loadBoxVid(box) ;
  if(preset) preset.push(box) ;
  else preset = [box];
}



/******************
// TRANSITION BETWEEN PRESETS
*******************/

// adds one, removes one
// if |L| > |R| cont. to remove from L
// if |L| < |R| cont. to add to R
function gotoPreset(data) {
  back_preset = preset ;
  preset = data ;
  let left = back_preset ;
  let right = preset ;
  let lIndex = 0 ;
  let rIndex = 0 ;
  // loadPreset(preset) ;
  // if(!tLock) {
  //   tTheta = 0 ;
  //   tLock = true ;
  let transitionInterval = setInterval(switchBox, 500);
  function switchBox() {
    if(lIndex < left.length) {
      //destroyVideo(left[0]) ;
      fadeOut(left[lIndex])
      //left.splice(0,1);
      lIndex += 1;
    }
    if(rIndex < right.length) {
      loadBoxVid(right[rIndex]);
      //fadeIn(right[rIndex]) ;
       rIndex += 1 ;
   }
   if(rIndex >= right.length && lIndex >= left.length) {
     clearInterval(transitionInterval) ;
     //back_preset = [] ;
     //preset = right ;
   }
 } // end switchBox
}

function fadeIn(element) {
    var op = 0;
    var timer = setInterval(function() {
        if (op >= 1) clearInterval(timer);
        element.opacity = op;
        op += op * 0.1 || 0.1;
    }, 100);
}
function fadeOut(element) {
    var op = 1;
    var timer = setInterval(function() {
        if (op <= 0) {
          clearInterval(timer);
          destroyVideo(element) ;
        }
        element.opacity = op;
        op -= 0.1;
    }, 50);
}

function transition() {
  let cBoxes = preset ;
  let nBoxes = nextPreset ;
  for (let i = 0; i < cBoxes.length; i++) {
    cBoxes[i].x = smoothstep(cBoxes[i].x, nBoxes[i].x,tTheta);
    cBoxes[i].y = smoothstep(cBoxes[i].y, nBoxes[i].y,tTheta);
    cBoxes[i].width = smoothstep(cBoxes[i].width, nBoxes[i].width,tTheta);
    cBoxes[i].height = cBoxes[i].width / (16/9);
    cBoxes[i].rotation = smoothstep(cBoxes[i].rotation, nBoxes[i].rotation,tTheta);

  }
  tTheta += 0.001;
  if(tTheta>=1) {
    clearInterval(transitionInterval) ;
    tLock = false ;
  }
}

function smoothstep(a,b,t) {
  t =  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;;
  return a + (b-a)*t ;
}

/******************
// Mouse Interaction
*******************/
// used to calc canvas position relative to window

// drag related vars
var isDragging=false;
var startX,startY;
// hold the index of the shape being dragged (if any)
var selectedBoxIndex;

function reOffset(){
    let BB=canvas.getBoundingClientRect();
    offsetX=BB.left;
    offsetY=BB.top;
}
var offsetX,offsetY;
reOffset();
window.onscroll=function(e){ reOffset(); }
window.onresize=function(e){ reOffset(); }
canvas.onresize=function(e){ reOffset(); }

// listen for mouse events
canvas.onmousedown=handleMouseDown;
canvas.onmousemove=handleMouseMove;
canvas.onmouseup=handleMouseUp;
canvas.onmouseout=handleMouseOut;

// return true/false whether mouse is in circle
//
function isMouseInShape(mx,my,shape){
  // this is a rectangle
  let x = parseInt(shape.x);
  let y = parseInt(shape.y);
  let ox=shape.x+shape.mOffsetX+shape.mWidth/2;
  let oy = shape.y+shape.mOffsetY+shape.mHeight/2;
  let dist = Math.sqrt(Math.pow(ox-mx,2)+Math.pow(oy-my,2)) ;
  console.log(dist);
  if(dist<=shape.mHeight/2) {
    return true;
  } else return false;

}
function handleMouseDown(e){
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // calculate the current mouse position
    startX=parseInt(e.clientX-offsetX);
    startY=parseInt(e.clientY-offsetY);
    // test mouse position against all shapes
    // post result if mouse is in a shape
    if(preset) {
      for(let i=0;i<preset.length;i++){
          if(isMouseInShape(startX,startY,preset[i])){
            //console.log(preset[i]);
              // the mouse is inside this shape
              // select this shape
              selectedBoxIndex=i;
              // set the isDragging flag
              isDragging=true;
              editorChannel.postMessage(JSON.stringify(preset[selectedBoxIndex])) ;
              // and return (==stop looking for
              //     further shapes under the mouse)
              return;
          }
      }
    }
}
function handleMouseUp(e){
    // return if we're not dragging
    if(!isDragging){return;}
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // the drag is over -- clear the isDragging flag
    isDragging=false;
}
function handleMouseOut(e){
    // return if we're not dragging
    if(!isDragging){return;}
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // the drag is over -- clear the isDragging flag
    isDragging=false;
}
function handleMouseMove(e){
    // return if we're not dragging
    if(!isDragging){return;}
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // calculate the current mouse position
    let mouseX=parseInt(e.clientX-offsetX);
    let mouseY=parseInt(e.clientY-offsetY);
    // how far has the mouse dragged from its previous mousemove position?
    let dx=mouseX-startX;
    let dy=mouseY-startY;
    // move the selected shape by the drag distance
    let selectedBox=preset[selectedBoxIndex];
    selectedBox.x+=dx;
    selectedBox.y+=dy;
    // update the starting drag position (== the current mouse position)
    startX=mouseX;
    startY=mouseY;
    editorChannel.postMessage(JSON.stringify(preset[selectedBoxIndex])) ;
}


/******************
// POP UPS
*******************/

function presetPopup() {
  let popup = window.open('/html/presets-pop.html', 'presets',"resizable,scrollbars,status,width=320,height=700");
}

function editorPop() {
  let popup = window.open('/html/edit-pop.html', 'presets',"resizable,scrollbars,status,width=320,height=700");

}


/******************
// Broadcast channels
*******************/

// hi popup, let me give you the data
const bc = new BroadcastChannel('current_preset');
bc.onmessage = (eventMessage) => {
 //console.log(eventMessage.data);
 let tPreset = copyPreset(preset) ;
 // canas coords to relative
 for (var i = 0; i < preset.length; i++) {
   tPreset[i].x = tPreset[i].x/canvas.width;
   tPreset[i].y = tPreset[i].y/canvas.height;
  }
 bc.postMessage(JSON.stringify(tPreset)) ;
 //console.log(tPreset);
}

// tell me what to play popup
const playPresetChannel = new BroadcastChannel('play_preset');
playPresetChannel.onmessage = (eventMessage) => {
  let tPreset = eventMessage.data.boxes ;
  //speed = eventMessage.data.speed;
  for (var i = 0; i < tPreset.length; i++) {
    tPreset[i].opacity = 0;
    tPreset[i].x = tPreset[i].x*canvas.width;
    tPreset[i].y = tPreset[i].y*canvas.height;
  }
  gotoPreset(tPreset) ;
}


// channel gets edit values
const editorChannel = new BroadcastChannel('editorChannel');
editorChannel.onmessage = (eventMessage) => {
 let data = eventMessage.data;
 //console.log(data);
 let box=preset[selectedBoxIndex] ;
 box.x = parseInt(data.x);
 box.y  = parseInt(data.y);
 box.width = parseInt(data.width) ;
 box.height = parseInt(data.height) ;
 //document.getElementById("size").value = data.w ;
 box.vOffsetX = parseInt(data.vOffsetX) ;
 box.vOffsetY = parseInt(data.vOffsetY) ;
 // box.mOffsetX = parseInt(data.mOffsetX) ;
 // box.mOffsetY = parseInt(data.mOffsetY) ;
 box.mWidth = parseInt(data.mWidth) ;
 box.mHeight = parseInt(data.mHeight) ;
 // box.colorGain = parseInt(data.colorGain);
 // box.colorGamma = parseInt(data.colorGamma) ;
 // box.redGain = parseInt(data.redGain);
 // box.greenGain = parseInt(data.greenGain);
 // box.blueGain = parseInt(data.blueGain);
 // box.process = data.process ;
 //console.log(box);
}

/******************
// KEYBOARD ENTRY
*******************/
document.addEventListener('keyup', (event) => {
  let theta = 0.0001*(Math.PI*2);
  const keyName = event.key;
  let selectedBox=preset[selectedBoxIndex];

  switch (keyName) {
    case '1':
    { // go to previous body part
      ////console.log(speed);
      let keys = Object.keys(preferences.parts) ;
      let currentIndex = keys.indexOf(selectedBox.type) ;
      if(currentIndex>0) currentIndex-=1
      selectedBox.type = keys[currentIndex];
      //console.log(selectedBox.type);
      reloadBoxType(selectedBox);
    }
    break;
    case '2':
    { // go to next body part
      let keys = Object.keys(preferences.parts) ;
      let currentIndex = keys.indexOf(selectedBox.type) ;
      if(currentIndex<keys.length-1) currentIndex+=1 ;
      selectedBox.type = keys[currentIndex];
      //console.log(selectedBox.type);
      reloadBoxType(selectedBox);

    }
    break;
    case '3':
    { // previous video in group
      let vids = preferences.parts[selectedBox.type] ;
      let vname = selectedBox['videoName'] ;
      let currentIndex = vids.indexOf(vname) ;
      if(currentIndex>0) currentIndex -= 1 ;
      selectedBox['videoName'] = vids[currentIndex] ;
      //console.log(selectedBox);
      reloadBoxVid(selectedBox);
    }
    break;
    case '4':
    { // next video in group
      let vids = preferences.parts[selectedBox.type] ;
      let vname = selectedBox['videoName'] ;
      let currentIndex = vids.indexOf(vname) ;
      if(currentIndex<vids.length-1) currentIndex += 1 ;
      selectedBox['videoName'] = vids[currentIndex] ;
      reloadBoxVid(selectedBox);
      //console.log(selectedBox);

    }
    break;
    case '0':
      incrementBoxSize(selectedBox) ;
    break;
    case '9':
      decrementBoxSize(selectedBox) ;
    break;
    case 'r':
      preset.splice(selectedBoxIndex,1);
    break;

    case '5':
     { // reduce vid size
       let sizes = preferences.sizes ;
       let currentSize = sizes.indexOf(selectedBox.size) ;
       if(currentSize>0) currentSize -= 1 ;
       selectedBox.size = sizes[currentSize] ;
       //console.log(selectedBox.size);
       setBoxSize(selectedBox) ;
       reloadBoxVid(selectedBox) ;
     }
     case '6':
     { // increase vid sizes
       let sizes = preferences.sizes ;
       let currentSize = sizes.indexOf(selectedBox.size) ;
       if(currentSize<sizes.length-1) currentSize += 1 ;
       selectedBox.size = sizes[currentSize] ;
       setBoxSize(selectedBox) ;
       reloadBoxVid(selectedBox) ;
     }
    break;
    case 'z':
      selectedBox.rotation = (selectedBox.rotation+theta)%(Math.PI*2);
    break;
    case 'x':
      selectedBox.rotation = (selectedBox.rotation-theta)%(Math.PI*2);
    break;
    case 'c':
      selectedBox.height = leftScreen().height ;
      selectedBox.width = selectedBox.height*(16/9) ;
      selectedBox.mWidth = leftScreen().width ;
      selectedBox.mHeight = leftScreen().height ;
      selectedBox.vOffsetX = -selectedBox.width/2
      //selectedBox.vOffsetY =
      selectedBox.x = leftScreen().xPos ;
      selectedBox.y = leftScreen().yPos ;
      selectedBox.rotation = 0 ;
      console.log([selectedBox.x,selectedBox.y]);

    break;
    case 'v':
      selectedBox.height = centreScreen().height ;
      selectedBox.width = selectedBox.height*(16/9) ;
      selectedBox.vOffsetX = -selectedBox.width/2;
      selectedBox.mWidth = centreScreen().width ;
      selectedBox.mHeight = centreScreen().height ;
      selectedBox.x = centreScreen().xPos-selectedBox.mWidth/2 ;
      selectedBox.y = centreScreen().yPos;
      selectedBox.rotation = 0 ;
      console.log([selectedBox.x,selectedBox.y]);

    break;
    case 'b':
      selectedBox.height = rightScreen().height ;
      selectedBox.width = selectedBox.height*(16/9) ;
      selectedBox.vOffsetX = -selectedBox.width/2;
      selectedBox.mWidth = rightScreen().width ;
      selectedBox.mHeight = rightScreen().height ;
      selectedBox.x = rightScreen().xPos-selectedBox.mWidth;
      selectedBox.y = rightScreen().yPos ;
      selectedBox.rotation = 0 ;
      console.log([selectedBox.x,selectedBox.y, selectedBox.width]);
    break;
    case 'a':
      addNewBox() ;
    break;
    case 'g':
      let aFile = preferences['audio'][Math.floor(Math.random()*preferences['audio'].length)] ;
      mySound.stop();
      mySound = new sound("audio/"+aFile);
      mySound.play() ;
    break;
    case 'r':
      var stream = canvas.captureStream(25);
      //console.log(stream);
      var options = { mimeType: 'video/webm;codecs:vp9' };
      mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorder.ondataavailable = handleDataAvailable;
      recordedChunks = 0;
      recordedChunks = [];
      mediaRecorder.start();
    break;
    case 's':
       mediaRecorder.stop();
       //download() ;
    break;
    case 'p':
      presetPopup() ;
    break;
    case 'e':
      editorPop() ;
    break;
    case 'f':
      openFullscreen() ;
    break;
    default:
  }
});

/*********************
Recorder
*********************/
var mediaRecorder ;
var recordedChunks = [];
function handleDataAvailable(event) {
  //console.log("data-available");
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
    //console.log(recordedChunks);
    download();
  } else {
    // ...
  }
}
function download() {
  var blob = new Blob(recordedChunks, {
    type: "video/webm"
  });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  a.download = "test.webm";
  a.click();
  window.URL.revokeObjectURL(url);
}
