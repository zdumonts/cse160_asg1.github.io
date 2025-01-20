// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position; 
  uniform float u_Size;
  void main() {
    gl_Position = a_Position; 
    gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_size=5;
let g_selectedType=POINT;
let g_selectedsegmentCount = 10;

function addActionsForHtmlUI() {
  // Button Events
  document.getElementById('green').onclick = function() {
    g_selectedColor = [0.0,1.0,0.0,1.0];
  };
  document.getElementById('red').onclick = function() {
    g_selectedColor = [1.0,0.0,0.0,1.0];
  };
  document.getElementById('clear').onclick = function() {
    g_shapesList=[];
    renderAllShapes();
  };
  document.getElementById('draw').onclick = function() {
    drawPicture();
  }
  document.getElementById('pointButton').onclick = function() { g_selectedType = POINT };
  document.getElementById('triButton').onclick = function () { g_selectedType = TRIANGLE };
  document.getElementById('cirButton').onclick = function () { g_selectedType = CIRCLE };
  // Slider Events
  document.getElementById('redS').addEventListener('mouseup', function() {
    g_selectedColor[0] = this.value/100;
  });
  document.getElementById('greenS').addEventListener('mouseup', function() {
    g_selectedColor[1] = this.value/100;
  });
  document.getElementById('blueS').addEventListener('mouseup', function() {
    g_selectedColor[2] = this.value/100;
  });
  document.getElementById('sizeS').addEventListener('mouseup', function() {
    g_size = this.value;
  });
  document.getElementById('alphaS').addEventListener('mouseup', function() {
    g_selectedColor[3] = this.value/100;
  });
  document.getElementById('scS').addEventListener('mouseup', function() {
    g_selectedsegmentCount = this.value;
  });
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_Size
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}

function main() {

  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  drawPicture();
}

var g_shapesList = []; 

function click(ev) {
  [x,y] = convertCoordinatesEventToGL(ev);

  let point;
  if (g_selectedType==POINT) {
    point = new Point();
  } else if (g_selectedType==TRIANGLE) {
    point = new Triangle();
  } else {
    point = new Circle();
  } 
  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = g_size;
  g_shapesList.push(point);

  // Draw all shapes on canvas
  renderAllShapes();
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

function renderAllShapes() {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;

  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }
}

function drawPicture() {
  g_shapesList=[];
  renderAllShapes();
  gl.uniform4f(u_FragColor, 0,1,0,1);
  drawTriangle([0,0,.6,0,.6,.1]);
  drawTriangle([0,0,0,.1,.6,.1]);
  gl.uniform4f(u_FragColor, 0.7,0.4,0.2,1);
  drawTriangle([.1,.1,.1,.4,.2,.4]);
  drawTriangle([.1,.1,.2,.1,.2,.4]);
  gl.uniform4f(u_FragColor, 1,0,0,1);
  drawTriangle([.4,.1,.4,.2,.5,.2]);
  drawTriangle([.4,.1,.5,.1,.5,.2]);
  gl.uniform4f(u_FragColor, 0,1,0,1);
  drawTriangle([0.3,0.3,.3,.4,.4,.4]);
  drawTriangle([0.3,0.3,.4,.3,.4,.4]);
  drawTriangle([.3,.3,.3,.4,.2,.4]);
  drawTriangle([.4,.5,.4,.4,.2,.4]);
  drawTriangle([.2,.5,.4,.5,.2,.4]);
  drawTriangle([0,.4,0,.6,.2,.6]);
  drawTriangle([0,.4,.2,.4,.2,.6]);
  drawTriangle([.2,.5,.2,.6,.3,.6]);
  drawTriangle([.2,.5,.3,.5,.3,.6]);
  drawTriangle([.3,.5,.4,.5,.3,.6]);
  drawTriangle([0.1,0.6,0.1,0.7,0.2,0.6]);
  drawTriangle([0,0.4,0,0.3,-0.1,0.4]);
  drawTriangle([0,0.3,0,0.4,0.1,0.4]);
  drawTriangle([0,0.4,-0.1,0.4,0,0.5]);
  drawTriangle([-0.1,0.4,0,0.5,-0.1,0.5]);
  drawTriangle([0,0.5,0,0.6,-0.1,.5]);

}
