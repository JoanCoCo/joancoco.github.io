var renderer, scene, camera, cameraControls, aspectRatio;

const MODELS_SCALE = 50.0;

var elapsedTime = 0;

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0xFFFFFF), 1.0);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    camera.position.set(0, 5, 5);

    cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
    cameraControls.target.set( 0, 0, 0 );
    
    window.addEventListener('resize', updateAspectRatio);
}

function updateAspectRatio()
{
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function loadScene() {
    const light = new THREE.AmbientLight(0xAFAFAF);
    var directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
    directionalLight.castShadow = true;
    directionalLight.rotation.x = -Math.PI / 3;
    directionalLight.rotation.y = Math.PI / 3;
    directionalLight.target.position.set(-10, -10, -20);
    scene.add(light);
    scene.add(directionalLight);
    scene.add(directionalLight.target);
    const geometry = new THREE.PlaneGeometry(1000, 1000, 50);
    const material = new THREE.MeshBasicMaterial({color: 0xAFAFAF})
    var floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = - Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    loadCat();
    scene.add(new THREE.AxesHelper(1));
}

function loadMenu() {
    loadGame();
}

function loadGame() {
    showLoading();
    loadScene();
}

function showLoading() {
    var geometry = new THREE.PlaneGeometry(10, 10 * aspectRatio);
    var material = new THREE.MeshBasicMaterial({color: 0xF40AB7, side: THREE.DoubleSide});
    var background = new THREE.Mesh(geometry, material);
    background.position.set(0, 0, -1);
    camera.add(background);
}

var antes = Date.now();

function update() {
    var ahora = Date.now();
    elapsedTime = (ahora - antes) / 1000;
    antes = ahora;
    
    updateCat();
    
    cameraControls.update();
}

function render() {
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}

init();
loadMenu();
