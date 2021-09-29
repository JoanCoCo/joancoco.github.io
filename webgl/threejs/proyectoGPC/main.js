var renderer, scene, camera, cameraControls, aspectRatio, uiCamera;
var shooterCamera;
var mouse = new THREE.Vector2();
var pullDirection = 0;

const MODELS_SCALE = 50.0;

var elapsedTime = 0;

const NUMBER_OF_MODELS_TO_LOAD = 26;
var modelsLoaded = 0;

var splash = true;

var background, progressBar;

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0xFFFFFF), 1.0);
    document.getElementById('container').appendChild(renderer.domElement);

    scene = new THREE.Scene();

    aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    
    shooterCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    
    var width = 2;
    var height = 2 / aspectRatio;
    uiCamera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 0.1, 1000)
    uiCamera.position.set(2000, 2000, 2000);
    uiCamera.lookAt(2000, 2000, 2001);
    //var helper = new THREE.CameraHelper(shooterCamera);
    //scene.add(helper);

    //cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
    //cameraControls.target.set( 0, 0, 0 );
    
    scene.fog = new THREE.Fog(0xEFD1D5, 100, 1000);
    
    window.addEventListener('resize', updateAspectRatio);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('click', onClick);
}

function updateAspectRatio() {
    aspectRatio = window.innerWidth / window.innerHeight;
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();
    
    var width = 2;
    var height = 2 / aspectRatio;
    uiCamera.left = width / - 2;
    uiCamera.right = width / 2;
    uiCamera.top = height / 2;
    uiCamera.bottom = height / -2
    uiCamera.updateProjectionMatrix();
    
    background.scale.set(1, 1 / aspectRatio, 1);
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = 1 - (event.clientY / window.innerHeight) * 2;
}

function onClick() {
    if(!splash) {
        shootBullet();
    }
}

function onKeyDown(event) {
    switch (event.keyCode) {
        case 90:
            pullDirection = 1;
            break;
        case 88:
            pullDirection = -1;
            break;
        case 32:
            spawnAlien();
            break;
    }
}

function onKeyUp(event) {
    switch (event.keyCode) {
        case 90:
            pullDirection = 0;
            break;
        case 88:
            pullDirection = 0;
            break;
    }
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
    loadBullets();
    loadAlien();
    loadDessert();
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
    var geometry = new THREE.PlaneGeometry(2, 2, 10);
    var material1 = new THREE.MeshBasicMaterial({color: 0xf48db7, side: THREE.DoubleSide});
    var material2 = new THREE.MeshBasicMaterial({color: 0x983e65, side: THREE.DoubleSide});
    var material3 = new THREE.MeshBasicMaterial({color: 0xcccccc, side: THREE.DoubleSide});
    background = new THREE.Mesh(geometry, material1);
    progressBar = new THREE.Mesh(geometry, material2);
    var backBar = new THREE.Mesh(geometry, material3);
    background.position.set(0, 0, -1);
    background.scale.set(1, 1 / aspectRatio, 1);
    progressBar.position.set(0, 0, 0.1);
    backBar.position.set(0, 0, 0.09);
    backBar.scale.set(0.5, 0.05, 1);
    progressBar.scale.set(0, 0.05, 1);
    //background.add(progressBar);
    background.add(backBar);
    
    var progressBarRoot = new THREE.Object3D();
    progressBarRoot.position.set(-0.5, 0, 0.1);
    background.add(progressBarRoot);
    progressBarRoot.add(progressBar);
    
    var loadingPage = new THREE.Object3D();
    loadingPage.position.set(2000, 2000, 2001);
    loadingPage.rotation.y = Math.PI;
    loadingPage.add(background);
    scene.add(loadingPage);
    
    var loader = new THREE.FontLoader();
    loader.load('fonts/helvetiker_regular.typeface.json', function(font) {
        var geometry = new THREE.TextGeometry('Loading...', {
            font: font,
            size: 0.1,
            height: 0.1,
            curveSegments: 12,
            bevelEnabled: false
        })
        geometry.computeBoundingBox();
        geometry.center();
        var text = new THREE.Mesh(geometry, material2);
        text.position.set(0, 0.15, 0.1);
        loadingPage.add(text);
    });
    
    render();
}

var antes = Date.now();

function update() {
    var ahora = Date.now();
    elapsedTime = (ahora - antes) / 1000;
    antes = ahora;
    
    if(!splash) {
        updateCat();
        updateAlien();
        updateCannonRotation();
        updateCannonPosition();
        updateBullets();
        TWEEN.update(ahora);
    } else {
        updateProgressBar();
        if(modelsLoaded >= NUMBER_OF_MODELS_TO_LOAD) {
            splash = false;
            background.clear();
        } else {
            console.log("Models loaded: " + modelsLoaded.toString());
        }
    }
    //cameraControls.update();
}

function updateProgressBar() {
    progressBar.scale.set((0.5 / NUMBER_OF_MODELS_TO_LOAD) * modelsLoaded, 0.05, 1);
    progressBar.position.set((0.5 / NUMBER_OF_MODELS_TO_LOAD) * modelsLoaded, 0, 0.1);
}

function render() {
    requestAnimationFrame(render);
    update();
    
    if(!splash) {
        renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);
        renderer.setScissorTest(true);
        renderer.render(scene, camera);
        
        var size = (window.innerHeight > window.innerWidth) ? window.innerWidth / 4 : window.innerHeight / 4;
        renderer.setViewport(0, window.innerHeight - size, size, size);
        renderer.setScissor(0, window.innerHeight - size, size, size);
        renderer.setScissorTest(true);
        renderer.render(scene, shooterCamera);
    } else {
        renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);
        renderer.render(scene, uiCamera);
    }
}

init();
loadMenu();
