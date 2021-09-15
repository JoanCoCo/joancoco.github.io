var renderer, scene, camera;

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x000000), 1.0);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    var aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    camera.position.set(0, 220, 150);
    //camera.position.set(0, 300, 100);
    camera.rotation.x = - Math.PI / 6;
}

function loadModel() {
    var pointLight = new THREE.PointLight(0xFFFFFF, 0.9);
    pointLight.position.set(1, 3, 1);
    scene.add(pointLight);
    var loader = new THREE.ObjectLoader();
    loader.load('../../models/cat/cat.json',
                function(obj) {
                    var tx = new THREE.ImageUtils.loadTexture('../../models/cat/Cat Eye Texture.001.png');
                    tx.minFilter = tx.magFilter = THREE.LinearFilter;
                    obj.traverse(function(child) {
                        if(child instanceof THREE.Mesh) {
                            child.material.setValues({color: 'white', emissive: 0x444444, map: tx});
                        }
                    });
                    obj.name = 'cat';
                    obj.position.set(0, -1, 0);
                    scene.add(obj);
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

}

function render() {
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}

init();
loadScene();
render();
