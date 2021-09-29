var renderer, scene, mainCamera, cenitalCamera;
var robot, base, brazo, antebrazo, mano;
var robotController;
var stats;

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
    cenitalCamera.position.set(0, 200, 0);
    cenitalCamera.lookAt(new THREE.Vector3(0, 0, 0));
    
    cameraControls = new THREE.OrbitControls( mainCamera, renderer.domElement );
    cameraControls.target.set( 0, 120, 0 );
    
    window.addEventListener('resize', updateAspectRatio);
    window.addEventListener('keydown', onKeyDown);
}

function updateAspectRatio()
{
  renderer.setSize(window.innerWidth, window.innerHeight);
  mainCamera.aspect = window.innerWidth / window.innerHeight;
  mainCamera.updateProjectionMatrix();
}

function onKeyDown(event) {
    switch (event.keyCode) {
        case 37: //Left
            robot.position.x = robot.position.x + 1.0;
            break;
        case 38: //Up
            robot.position.z = robot.position.z + 1.0;
            break;
        case 39: //Right
            robot.position.x = robot.position.x - 1.0;
            break;
        case 40: //Down
            robot.position.z = robot.position.z - 1.0;
            break;
    }
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
        0, 1, 3,
        1, 2, 3,
        0, 3, 7,
        0, 7, 4,
        4, 7, 5,
        5, 7, 6,
        0, 4, 1,
        4, 5, 1,
        3, 2, 7,
        2, 6, 7,
        1, 8, 2,
        8, 9, 2,
        5, 6, 10,
        6, 11, 10,
        1, 5, 8,
        5, 10, 8,
        8, 10, 9,
        10, 11, 9,
        2, 9, 6,
        6, 9, 11
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

    var material = new THREE.MeshBasicMaterial({color: 0x00FFFF, wireframe: true});
    var dedoDerecho = new THREE.Mesh(malla, material);
    var dedoIzquierdo = new THREE.Mesh(malla, material);
    mano.add(dedoDerecho);
    mano.add(dedoIzquierdo);
    dedoDerecho.position.z = 18;
    dedoIzquierdo.position.z = -18;
    dedoIzquierdo.rotation.x = - Math.PI;
}

function loadRobot() {
    robot = new THREE.Object3D();
    loadBase()
    robot.add(base);
    loadBrazo()
    base.add(brazo);
    robot.rotation.y = - Math.PI / 4
    loadAntebrazo();
    antebrazo.position.y = 120;
    brazo.add(antebrazo);
}

function loadScene() {
    var geometry = new THREE.PlaneGeometry(1000, 1000, 10, 10)
    var material = new THREE.MeshBasicMaterial({color: 0xFFA044, wireframe: true});
    var plane = new THREE.Mesh(geometry, material);
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
        aperturaPinza: 15.0
    };
    var gui = new dat.GUI();
    var h = gui.addFolder("Control Robot");
    h.add(robotController, "giroBase", -180.0, 180.0, 0.025).name("Giro Base");
    h.add(robotController, "giroBrazo", -45.0, 45.0, 0.025).name("Giro Brazo");
    h.add(robotController, "giroAntebrazoY", -180.0, 180.0, 0.025).name("Giro Antebrazo Y");
    h.add(robotController, "giroAntebrazoZ", -90.0, 90.0, 0.025).name("Giro Antebrazo Z");
    h.add(robotController, "giroPinza", -40.0, 220.0, 0.025).name("Giro Pinza");
    h.add(robotController, "aperturaPinza", 0.0, 15.0, 0.025).name("Separacion Pinza");
    
    stats = new Stats();
    stats.showPanel(0);
    document.getElementById('container').appendChild(stats.domElement);
}

var antes = Date.now();
function update() {
    var ahora = Date.now();
    antes = ahora;
    
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
