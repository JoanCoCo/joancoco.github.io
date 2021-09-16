var renderer, scene, camera, cameraControls;
var cat;
var canon, shooter, leftWeel, rightWeel, seat;

const SCALE = 50.0;

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0xFFFFFF), 1.0);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    var aspectRatio = window.innerWidth / window.innerHeight;
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

function loadCat() {
    var loader = new THREE.ObjectLoader();
    loader.load('models/gato.json',
                function(obj) {
                    //var tx = new THREE.ImageUtils.loadTexture('models/soldado/soldado.png');
                    //tx.minFilter = tx.magFilter = THREE.LinearFilter;
                    obj.traverse(function(child) {
                        if(child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    obj.name = 'cat';
                    obj.position.set(0, 0, 0);
                    //var s = 1 / SCALE;
                    //obj.scale.set(s, s, s);
                    cat = obj;
                    scene.add(cat);
                    loadCanon();
                });
}

function loadCanon() {
    var loader = new THREE.ObjectLoader();
    loader.load('models/canon.json',
                function(obj) {
                    obj.traverse(function(child) {
                        switch(child.name) {
                            case 'shooter':
                                shooter = child;
                                break;
                            case 'left_wheel':
                                leftWeel = child;
                                break;
                            case 'right_wheel':
                                rightWeel = child;
                                break;
                            case 'seat':
                                seat = child;
                                seat.add(cat);
                                break;
                            default:
                                break;
                        }
                        
                        if(child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    obj.name = 'canon';
                    obj.position.set(0, 0.055, 0);
                    var s = 1 / SCALE;
                    obj.scale.set(s, s, s);
                    obj.receiveShadow = true;
                    obj.castShadow = true;
                    canon = obj;
                    scene.add(canon);
                    render();
                });
}


function loadScene() {
    const light = new THREE.AmbientLight(0xAFAFAF);
    var directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
    directionalLight.castShadow = true;
    directionalLight.rotation.x = -Math.PI / 3;
    directionalLight.rotation.y = Math.PI / 3;
    scene.add(light);
    scene.add(directionalLight);
    const geometry = new THREE.PlaneGeometry(1000, 1000, 50);
    const material = new THREE.MeshBasicMaterial({color: 0xAFAFAF})
    var floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = - Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    loadCat();
    scene.add(new THREE.AxesHelper(1));
    const helper = new THREE.DirectionalLightHelper(directionalLight);
    scene.add(helper);
}

var antes = Date.now();
var sense = -1;

function update() {
    var ahora = Date.now();
    var incr = Math.PI / 15 * (ahora - antes) / 1000;
    antes = ahora;
    
    if(shooter.rotation.x >= 0.0) {
        sense = -1;
    } else if(shooter.rotation.x <= - Math.PI / 4) {
        sense = 1;
    }
    shooter.rotation.x += sense * incr;
    
    cameraControls.update();
}

function render() {
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}

init();
loadScene();
