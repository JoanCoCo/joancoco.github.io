var renderer, scene, camera;
var robot, base, brazo, antebrazo, mano

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x000000), 1.0);
    document.getElementById('container').appendChild(renderer.domElement);

    scene = new THREE.Scene();

    var aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    camera.position.set(0, 220, 150);
    //camera.position.set(0, 300, 100);
    camera.rotation.x = - Math.PI / 6;
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

var antes = Date.now();
var angulo = 0;
function update() {
    var ahora = Date.now();
    angulo += Math.PI / 15 * (ahora - antes) / 1000;
    antes = ahora;
    robot.rotation.y = angulo;
}

function render() {
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}

init();
loadScene();
render();
