var renderer, scene, camera, cameraControls, aspectRatio, uiCamera;
var shooterCamera;
var mouse = new THREE.Vector2();

const MODELS_SCALE = 50.0;

var elapsedTime = 0;

const NUMBER_OF_MODELS_TO_LOAD = 3 + ALIENS_POOL_SIZE + BULLETS_POOL_SIZE;
var modelsLoaded = 0;

var splash = true;

var background, progressBar, loadingPage, text;

var keyboard;
var stats;

var pullDirection = 0;

var scoreDisplay;
var gameOver = false;

const THIRD_PERSON_VIEW = 2;
const FIRST_PERSON_VIEW = 1;
const COMBINED_VIEW = 0;

var viewMode = THIRD_PERSON_VIEW;

var skyBox;

var aKeyIsPressed = false;

var directionalLight2;

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0xFFFFFF), 1.0);
    document.getElementById('container').appendChild(renderer.domElement);
    
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    scene = new THREE.Scene();

    aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1500);
    
    shooterCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1500);
    
    var width = 2;
    var height = 2 / aspectRatio;
    uiCamera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 0.1, 1000)
    uiCamera.position.set(2000, 2000, 2000);
    uiCamera.lookAt(2000, 2000, 2001);
    //var helper = new THREE.CameraHelper(shooterCamera);
    //scene.add(helper);

    //cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
    //cameraControls.target.set( 0, 0, 0 );
    
    //scene.fog = new THREE.Fog(0xEFD1D5, 100, 1000);
    
    keyboard = new THREEx.KeyboardState(renderer.domElement);
    renderer.domElement.setAttribute("tabIndex", "0");
    renderer.domElement.focus();
    
    keyboard.domElement.addEventListener('keydown', function(event) {
        if(keyboard.eventMatches(event, 'z')) {
            pullDirection = 1;
            if(!cannonWasMoved) {
                cannonWasMoved = true;
            }
        } else if(keyboard.eventMatches(event, 'x')) {
            pullDirection = -1;
            if(!cannonWasMoved) {
                cannonWasMoved = true;
            }
        }
        
        if(keyboard.eventMatches(event, 'a')) {
            if(!aKeyIsPressed) {
                viewMode = (viewMode + 1) % 3;
                updateAspectRatio();
                aKeyIsPressed = true;
            }
        }
        
        if(keyboard.eventMatches(event, 's')) {
            if(!aKeyIsPressed) {
                renderer.shadowMap.enabled = ! renderer.shadowMap.enabled;
                directionalLight2.castShadow = ! directionalLight2.castShadow;
                aKeyIsPressed = true;
            }
        }
    })
    
    keyboard.domElement.addEventListener('keyup', function(event) {
        if(keyboard.eventMatches(event, 'z')) {
            pullDirection = 0;
        } else if(keyboard.eventMatches(event, 'x')) {
            pullDirection = 0;
        }
        
        if((keyboard.eventMatches(event, 's') || keyboard.eventMatches(event, 'a')) && aKeyIsPressed) {
            aKeyIsPressed = false;
        }
    })
    
    window.addEventListener('resize', updateAspectRatio);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onClick);
    
    stats = new Stats();
    stats.showPanel(0);
    document.getElementById('container').appendChild(stats.domElement);
    
    initPhysics();
}

function updateAspectRatio() {
    aspectRatio = window.innerWidth / window.innerHeight;
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();
    
    if(viewMode == FIRST_PERSON_VIEW) {
        shooterCamera.aspect = aspectRatio;
        shooterCamera.updateProjectionMatrix();
    } else {
        shooterCamera.aspect = 1;
        shooterCamera.updateProjectionMatrix();
    }
    
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

function loadScene() {
    const light = new THREE.AmbientLight(0xAFAFAF);
    scene.add(light);
    
    var d = 20;
    
    var directionalLight1 = new THREE.DirectionalLight(0xFFFFFF, 0.55);
    scene.add(directionalLight1);
    
    directionalLight2 = new THREE.DirectionalLight(0xFFAAFF, 0.4);
    directionalLight2.castShadow = true;
    
    //directionalLight2.shadow.radius = 2;
    directionalLight2.shadow.camera.left = -d;
    directionalLight2.shadow.camera.right = d;
    directionalLight2.shadow.camera.top = d;
    directionalLight2.shadow.camera.bottom = -d;
    directionalLight2.shadow.mapSize.width = 2048;
    directionalLight2.shadow.mapSize.height = 2048;
    directionalLight2.shadow.camera.far = 500;
    directionalLight2.shadow.camera.near = 1
    
    directionalLight2.position.set(150, 100, 150);
    directionalLight2.target.position.set(0, 0, 0);
    scene.add(directionalLight2);
    scene.add(directionalLight2.target);
    
    var sun = new THREE.Mesh(new THREE.SphereGeometry(2, 20, 20), new THREE.MeshBasicMaterial({color: 0xFFD100}));
    sun.position.set(10, 10, 10);
    scene.add(sun);
    
    var textureLoader = new THREE.TextureLoader();
    textureLoader.load("images/sea_texture.png", function(texture) {
        texture.repeat.set(80, 100);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        const material = new THREE.MeshPhongMaterial( {map: texture, shininess: 0.1} )
        const geometry = new THREE.PlaneGeometry(1000, 1000, 1);
        var floor = new THREE.Mesh(geometry, material);
        floor.rotation.x = - Math.PI / 2;
        floor.receiveShadow = true;
        scene.add(floor);
    });
    
    var skyBoxLoader = new THREE.CubeTextureLoader();
    skyBoxLoader.setPath("images/sky/");
    skyBox = skyBoxLoader.load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);
    
    scene.background = skyBox;
    
    loadCat();
    loadBullets();
    loadAlien();
    loadDessert();
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
    
    loadingPage = new THREE.Object3D();
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
        text = new THREE.Mesh(geometry, material2);
        text.position.set(0, 0.15, 0.1);
        loadingPage.add(text);
    });
    
    render();
}

var antes = Date.now();
var delta = 0;

function update() {
    var ahora = Date.now();
    elapsedTime = (ahora - antes) / 1000;
    antes = ahora;
    
    if(!splash && !gameOver && elapsedTime < 1.0 && !aKeyIsPressed) {
        updateCat();
        updateCannonPosition();
        updateCannonRotation();
        updateAlienRotation();
        updateBullets();
        TWEEN.update(ahora - delta);
        updatePhysics();
    } else if(!gameOver && splash) {
        updateProgressBar();
        if(modelsLoaded >= NUMBER_OF_MODELS_TO_LOAD) {
            splash = false;
            background.clear();
            loadingPage.remove(text);
            
            scoreDisplay = new Score();
            document.getElementById('container').appendChild(scoreDisplay.domElement);
            
            var material2 = new THREE.MeshBasicMaterial({color: 0x983e65, side: THREE.DoubleSide});
            var loader = new THREE.FontLoader();
            loader.load('fonts/helvetiker_regular.typeface.json', function(font) {
                var geometry = new THREE.TextGeometry('Game over', {
                    font: font,
                    size: 0.1,
                    height: 0.1,
                    curveSegments: 12,
                    bevelEnabled: false
                })
                geometry.computeBoundingBox();
                geometry.center();
                text = new THREE.Mesh(geometry, material2);
                text.position.set(0, 0.15, 0.1);
                loadingPage.add(text);
            });
            
            updateScoreDisplay();
            spawnAlien();
        } else {
            console.log("Models loaded: " + modelsLoaded.toString());
        }
    } else {
        delta += elapsedTime * 1000;
        //console.log(delta);
    }
}

function updateProgressBar() {
    progressBar.scale.set((0.5 / NUMBER_OF_MODELS_TO_LOAD) * modelsLoaded, 0.05, 1);
    progressBar.position.set((0.5 / NUMBER_OF_MODELS_TO_LOAD) * modelsLoaded, 0, 0.1);
}

function render() {
    requestAnimationFrame(render);
    
    stats.begin();
    
    update();
    
    if(!splash && !gameOver) {
        if(viewMode == COMBINED_VIEW) {
            renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
            renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);
            renderer.setScissorTest(true);
            renderer.render(scene, camera);
        
            var size = (window.innerHeight > window.innerWidth) ? window.innerWidth / 4 : window.innerHeight / 4;
            renderer.setViewport(0, window.innerHeight - size, size, size);
            renderer.setScissor(0, window.innerHeight - size, size, size);
            renderer.setScissorTest(true);
            renderer.render(scene, shooterCamera);
        } else if(viewMode == THIRD_PERSON_VIEW) {
            renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
            renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);
            renderer.setScissorTest(true);
            renderer.render(scene, camera);
        } else {
            renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
            renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);
            renderer.setScissorTest(true);
            renderer.render(scene, shooterCamera);
        }
    } else {
        renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);
        renderer.render(scene, uiCamera);
    }
    
    stats.end();
}

function updateScoreDisplay() {
    scoreDisplay.update(score);
}

init();
loadMenu();
