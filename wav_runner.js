
//Audio Context
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var audio_file = document.querySelector('audio');
var source = audioCtx.createMediaElementSource(audio_file)

//Analyzer context
var analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;

//Canvas context
var canvas = document.querySelector('#scope');
var canvasCtx = canvas.getContext("2d");
var intendedWidth = document.querySelector('.wrapper').clientWidth;
var drawVisual;
canvas.setAttribute('width',intendedWidth);

//main block for RECORDING INPUT SIGNAL
 source.connect(analyser);
 analyser.connect(audioCtx.destination);
 draw();

//general purpose draw() function
function draw() {
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    analyser.fftSize = 2048;
    var dataArray = new Uint8Array(analyser.fftSize);
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    drawVisual = requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);
    canvasCtx.fillStyle = 'rgb(0, 0, 0)'; //Foreground
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.lineWidth = 2.5;
    canvasCtx.strokeStyle = 'rgb(124,252,0)'; //Line color
    canvasCtx.beginPath();
    var sliceWidth = WIDTH * 1.0 / analyser.fftSize;
    var x = 0;
    for(var i = 0; i < analyser.fftSize; i++) {
      var v = dataArray[i] / 128.0;
      var y = v * HEIGHT/2;
      if(i === 0) {canvasCtx.moveTo(x, y);}
      else {canvasCtx.lineTo(x, y);}
      x += sliceWidth;
    }
    canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.stroke();
};
