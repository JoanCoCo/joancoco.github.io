var renderer, scene, camera;
var cat;

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x000000), 1.0);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    var aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    camera.position.set(0, 50, 50);
    //camera.position.set(0, 300, 100);
    camera.rotation.x = - Math.PI / 6;
}

function loadModel() {
    var light = new THREE.AmbientLight(0xFFFFFF);
    scene.add(light);
    var loader = new THREE.ObjectLoader();
    loader.load('models/gato.json',
                function(obj) {
                    //var tx = new THREE.ImageUtils.loadTexture('models/soldado/soldado.png');
                    //tx.minFilter = tx.magFilter = THREE.LinearFilter;
                    obj.traverse(function(child) {
                        if(child instanceof THREE.Mesh) {
                            //child.material.setValues({map: tx});
                        }
                    });
                    obj.name = 'cat';
                    obj.position.set(0, -1, 0);
                    cat = obj;
                    scene.add(cat);
                });
    scene.add(new THREE.AxesHelper(1));
}

function loadScene() {
    loadModel();
}

var antes = Date.now();
var angulo = 0;
function update() {
    var ahora = Date.now();
    angulo += Math.PI / 15 * (ahora - antes) / 1000;
    antes = ahora;
    cat.rotation.y = angulo;
}

function render() {
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}

init();
loadScene();
render();
