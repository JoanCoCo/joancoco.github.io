var VSHADER_SOURCE = null;
var FSHADER_SOURCE = null;
var clicks = [];
var lastIndex = 0;
var bufferVertices = null;
var coordenadas = null;
var gl = null;

function main() {
	var canvas = document.getElementById("canvas");
	if(!canvas) {
		console.log("Fallo al recuperar el canvas.");
		return;
	}

	gl = getWebGLContext(canvas);

	if(!gl) {
		console.log("Fallo al iniciar WebGL.");
		return;
	}

	loadShaderFile(gl, "shaders/vsPuntos.glsl", gl.VERTEX_SHADER);
	loadShaderFile(gl, "shaders/fsColorBrillo.glsl", gl.FRAGMENT_SHADER);

	if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log("Fallo al iniciar los shaders.");
	}
    
    coordenadas = gl.getAttribLocation(gl.program, 'posicion');
    var size = gl.getUniformLocation(gl.program, 'canvas_size');
    gl.uniform2f(size, canvas.width, canvas.height);
    
    canvas.onmousedown = function(evento) {click(evento, gl, canvas);};
    loadEscene();
}

function loadEscene() {
    gl.clearColor(0.0, 0.0, 0.3, 1.0);
    
    bufferVertices = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferVertices);
    gl.vertexAttribPointer(coordenadas, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coordenadas);

    gl.clear(gl.COLOR_BUFFER_BIT);
}

function click(evento, gl, canvas) {
    console.log("Click registered.");
    
	var x = evento.clientX;
	var y = evento.clientY;
	var rect = evento.target.getBoundingClientRect();

	x = ((x - rect.left) - canvas.width/2) * 2/canvas.width;
	y = (canvas.height/2 - (y - rect.top)) * 2/canvas.height;
         
    if(clicks.length / 3 > 1) {
        var lastX = clicks[clicks.length - 3];
        var lastY = clicks[clicks.length - 2];
        
        clicks.push(lastX);
        clicks.push(lastY);
        clicks.push(0.0);
    }
    
    clicks.push(x);
    clicks.push(y);
    clicks.push(0.0);
         
    var puntos = new Float32Array(clicks);

	gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bufferData(gl.ARRAY_BUFFER, puntos, gl.STATIC_DRAW);
    
    gl.drawArrays(gl.LINES, 0, puntos.length / 3);
    gl.drawArrays(gl.POINTS, 0, puntos.length / 3);
}
