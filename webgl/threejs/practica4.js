var renderer, scene, mainCamera, cenitalCamera;
var robot, base, brazo, antebrazo, mano, dedoDerecho, dedoIzquierdo;
var robotController;
var stats;
var keyboard;
var plane;

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x000000), 1.0);
    document.getElementById('container').appendChild(renderer.domElement);

    scene = new THREE.Scene();

    var aspectRatio = window.innerWidth / window.innerHeight;
    
    mainCamera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    mainCamera.position.set(0, 220, 150);
    
    cenitalCamera = new THREE.OrthographicCamera(-150, 150, 150, -150, 0.1, 1000);
    cenitalCamera.position.set(0, 260, 0);
    cenitalCamera.lookAt(new THREE.Vector3(0, 0, 0));
    
    cameraControls = new THREE.OrbitControls( mainCamera, renderer.domElement );
    cameraControls.target.set( 0, 120, 0 );
    cameraControls.keys = {
        LEFT: '',
        UP: '',
        RIGHT: '',
        BOTTOM: ''
    }
    
    keyboard = new THREEx.KeyboardState(renderer.domElement);
    renderer.domElement.setAttribute("tabIndex", "0");
    renderer.domElement.focus();
    
    window.addEventListener('resize', updateAspectRatio);
}

function updateAspectRatio()
{
  renderer.setSize(window.innerWidth, window.innerHeight);
  mainCamera.aspect = window.innerWidth / window.innerHeight;
  mainCamera.updateProjectionMatrix();
}

function loadBase() {
    var geometry = new THREE.CylinderGeometry(50, 50, 15, 20);
    var material = new THREE.MeshBasicMaterial({color:0x00FFFF, wireframe: true});
    base = new THREE.Mesh(geometry, material);
    base.position.x = 0
    base.position.y = 7.5
    base.position.z = 0
}

function loadBrazo() {
    brazo = new THREE.Object3D()
    var material = new THREE.MeshBasicMaterial({color:0x00FFFF, wireframe: true});
    var lowEndG = new THREE.CylinderGeometry(20, 20, 18, 20);
    var highEndG = new THREE.SphereGeometry(20, 32, 16);
    var middle = new THREE.CubeGeometry(18, 120, 12);
    var eje = new THREE.Mesh(lowEndG, material);
    var rotula = new THREE.Mesh(highEndG, material);
    var esparrago = new THREE.Mesh(middle, material);
    eje.position = new THREE.Vector3(0, 0, 0);
    eje.rotation.x = Math.PI / 2;
    brazo.add(eje);
    esparrago.position.y = 60;
    brazo.add(esparrago);
    rotula.position.y = 120;
    brazo.add(rotula);
}

function loadAntebrazo() {
    antebrazo = new THREE.Object3D();
    var material = new THREE.MeshBasicMaterial({color:0x00FFFF, wireframe: true});
    var discoG = new THREE.CylinderGeometry(22, 22, 6, 20);
    var disco = new THREE.Mesh(discoG, material);
    antebrazo.add(disco);
    var nervioG = new THREE.CubeGeometry(4, 80, 4);
    var nervio1 = new THREE.Mesh(nervioG, material);
    antebrazo.add(nervio1);
    nervio1.position.x = 7
    nervio1.position.y = 40
    nervio1.position.z = 7
    var nervio2 = new THREE.Mesh(nervioG, material);
    antebrazo.add(nervio2);
    nervio2.position.x = -7
    nervio2.position.y = 40
    nervio2.position.z = 7
    var nervio3 = new THREE.Mesh(nervioG, material);
    antebrazo.add(nervio3);
    nervio3.position.x = 7
    nervio3.position.y = 40
    nervio3.position.z = -7
    var nervio4 = new THREE.Mesh(nervioG, material);
    antebrazo.add(nervio4);
    nervio4.position.x = -7
    nervio4.position.y = 40
    nervio4.position.z = -7
    loadMano();
    mano.position.y = 80;
    antebrazo.add(mano);
}

function loadMano() {
    var material = new THREE.MeshBasicMaterial({color:0x00FFFF, wireframe: true});
    var manoG = new THREE.CylinderGeometry(15, 15, 40, 20);
    mano = new THREE.Object3D();
    var palma = new THREE.Mesh(manoG, material);
    palma.rotation.x = Math.PI / 2;
    mano.add(palma);
    loadPinza();
}

function loadPinza() {
    var coordenadas = [
        0, 10, 2,
        19, 10, 2,
        19, -10, 2,
        0, -10, 2,
        0, 10, -2,
        19, 10, -2,
        19, -10, -2,
        0, -10, -2,
        38, 6, 0,
        38, -6, 0,
        38, 6, -2,
        38, -6, -2 
    ];

    var indices = [
        3, 1, 0,
        3, 2, 1,
        7, 3, 0,
        4, 7, 0,
        5, 7, 4,
        6, 7, 5,
        1, 4, 0,
        1, 5, 4,
        7, 2, 3,
        7, 6, 2,
        2, 8, 1,
        2, 9, 8,
        10, 6, 5,
        10, 11, 6,
        8, 5, 1,
        8, 10, 5,
        9, 10, 8,
        9, 11, 10,
        6, 9, 2,
        11, 9, 6
    ];
    var malla = new THREE.Geometry();

    for(var i = 0; i < coordenadas.length; i += 3) {
        var vertice = new THREE.Vector3(coordenadas[i], coordenadas[i+1], coordenadas[i+2]);
        malla.vertices.push(vertice);
    }

    for(var i = 0; i < indices.length; i += 3) {
        var triangulo = new THREE.Face3(indices[i], indices[i+1], indices[i+2]);
        malla.faces.push(triangulo);
    }
    
    malla.computeFaceNormals();

    var material = new THREE.MeshBasicMaterial({color: 0x00FFFF, wireframe: true});
    dedoDerecho = new THREE.Mesh(malla, material);
    dedoIzquierdo = new THREE.Mesh(malla, material);
    mano.add(dedoDerecho);
    mano.add(dedoIzquierdo);
    dedoDerecho.position.z = 17;
    dedoIzquierdo.position.z = -17;
    dedoIzquierdo.rotation.x = - Math.PI;
}

function loadRobot() {
    robot = new THREE.Object3D();
    loadBase()
    robot.add(base);
    loadBrazo()
    base.add(brazo);
    //robot.rotation.y = - Math.PI / 4
    loadAntebrazo();
    antebrazo.position.y = 120;
    brazo.add(antebrazo);
}

function loadScene() {
    var geometry = new THREE.PlaneGeometry(1000, 1000, 10, 10)
    var material = new THREE.MeshBasicMaterial({color: 0xFFA044, wireframe: true});
    plane = new THREE.Mesh(geometry, material);
    plane.position.x = 0
    plane.position.y = 0
    plane.position.z = 0
    plane.rotation.x = - Math.PI / 2
    scene.add(plane);
    loadRobot()
    scene.add(robot);
}

function setUpGUI() {
    robotController = {
        giroBase: base.rotation.y,
        giroBrazo: brazo.rotation.z,
        giroAntebrazoY: antebrazo.rotation.y,
        giroAntebrazoZ: antebrazo.rotation.z,
        giroPinza: mano.rotation.z,
        aperturaPinza: 15.0,
        colorRobot: "rgb(0, 255, 255)",
        colorSuelo: "rgb(255, 160, 68)",
        colorFondo: "rgb(0, 0, 0)"
    };
    var gui = new dat.GUI();
    var h = gui.addFolder("Control Robot");
    h.add(robotController, "giroBase", -180.0, 180.0, 0.025).name("Giro Base").onChange(function(value) {
        base.rotation.y = (Math.PI / 180.0) * value;
    });
    h.add(robotController, "giroBrazo", -45.0, 45.0, 0.025).name("Giro Brazo").onChange(function(value) {
        brazo.rotation.z = (Math.PI / 180.0) * value;
    });
    h.add(robotController, "giroAntebrazoY", -180.0, 180.0, 0.025).name("Giro Antebrazo Y").onChange(function(value) {
        antebrazo.rotation.y = (Math.PI / 180.0) * value;
    });
    h.add(robotController, "giroAntebrazoZ", -90.0, 90.0, 0.025).name("Giro Antebrazo Z").onChange(function(value) {
        antebrazo.rotation.z = (Math.PI / 180.0) * value;
    });
;
    h.add(robotController, "giroPinza", -40.0, 220.0, 0.025).name("Giro Pinza").onChange(function(value) {
        mano.rotation.z = (Math.PI / 180.0) * value;
    });
;
    h.add(robotController, "aperturaPinza", 0.0, 15.0, 0.025).name("Separacion Pinza").onChange(function(value) {
        dedoDerecho.position.z = value + 2;
        dedoIzquierdo.position.z = -value - 2;
    });
    
    h.addColor(robotController, "colorRobot").name("Color Robot").onChange(function(color) {
        robot.traverse(function(hijo) {
            if(hijo instanceof THREE.Mesh) {
                hijo.material.color = new THREE.Color(color);
            }
        });
    });
    
    h.addColor(robotController, "colorSuelo").name("Color Suelo").onChange(function(color) {
        plane.material.color = new THREE.Color(color);
    });
    
    h.addColor(robotController, "colorFondo").name("Color Fondo").onChange(function(color) {
        renderer.setClearColor(new THREE.Color(color), 1.0);
    });
    
    stats = new Stats();
    stats.showPanel(0);
    document.getElementById('container').appendChild(stats.domElement);
}

var antes = Date.now();
function update() {
    var ahora = Date.now();
    var elapsedTime = (ahora - antes) / 1000;
    antes = ahora;
    
    if(keyboard.pressed('left')) {
        robot.position.x = robot.position.x - 50.0 * elapsedTime;
    } else if(keyboard.pressed('right')) {
        robot.position.x = robot.position.x + 50.0 * elapsedTime;
    }
    
    if(keyboard.pressed('up')) {
        robot.position.z = robot.position.z - 50.0 * elapsedTime;
    } else if(keyboard.pressed('down')) {
        robot.position.z = robot.position.z + 50.0 * elapsedTime;
    }
    
    cameraControls.update();
}

function render() {
    requestAnimationFrame(render);
    
    stats.begin();
    
    update();
    
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);
    renderer.setScissorTest(true);
    renderer.render(scene, mainCamera);
    
    var size = (window.innerHeight > window.innerWidth) ? window.innerWidth / 4 : window.innerHeight / 4;
    renderer.setViewport(0, window.innerHeight - size, size, size);
    renderer.setScissor(0, window.innerHeight - size, size, size);
    renderer.setScissorTest(true);
    renderer.render(scene, cenitalCamera);
    
    stats.end();
}

init();
loadScene();
setUpGUI();
render();
