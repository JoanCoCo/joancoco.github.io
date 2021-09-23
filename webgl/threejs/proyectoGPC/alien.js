var aliens = [];
var alienRightWingsDown = [];
var alienRightWingsUp = [];
var alienLeftWingsDown = [];
var alienLeftWingsUp = [];
var alienEyes = []
var alienTails = [];

var aliensBussy = [];

const ALIENS_POOL_SIZE = 3;

function loadAlien() {
    var loader = new THREE.ObjectLoader();
    loader.load('models/alien.json',
                function(obj) {
                    obj.traverse(function(child) {
                        if(child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    obj.name = 'alien';
                    var s = 1 / MODELS_SCALE;
                    obj.scale.set(s, s, s);
                    obj.receiveShadow = true;
                    obj.castShadow = true;
                    
                    for(var i = 0; i < ALIENS_POOL_SIZE; i++) {
                        aliens.push(obj.clone(true));
                        aliensBussy.push(-1);
                        aliens[i].traverse(function(child) {
                            switch(child.name) {
                                case 'tail':
                                    alienTails.push(child);
                                    break;
                                case 'eye':
                                    alienEyes.push(child);
                                    break;
                                case 'right_wing_down':
                                    alienRightWingsDown.push(child);
                                    break;
                                case 'right_wing_up':
                                    alienRightWingsUp.push(child);
                                    break;
                                case 'left_wing_down':
                                    alienLeftWingsDown.push(child);
                                    break;
                                case 'left_wing_up':
                                    alienLeftWingsUp.push(child);
                                    break;
                                default:
                                    break;
                            }
                        })
                        aliens[i].rotation.z = aliens[i].rotation.z + Math.PI;
                        modelsLoaded += 1;
                    }
                });
}

var senses = [-1, 1, 1, -1];
var angles = [Math.PI / 4, Math.PI / 8, Math.PI / 4, Math.PI / 8]


function updateAlien() {
    
}

function spawnAlien() {
    for(var i = 0; i < ALIENS_POOL_SIZE; i++) {
        if(aliensBussy[i] < 0) {
            var point = Math.floor(Math.random() * totalNumberOfSpawnPoints);
            while(aliensBussy.includes(point)) {
                point = (point + 1) % totalNumberOfSpawnPoints;
            }
            var position = new THREE.Vector3();
            spawnPoints[point].getWorldPosition(position);
            aliens[i].position.set(position.x, position.y, position.z);
            aliensBussy[i] = point;
            scene.add(aliens[i]);
            break;
        }
    }
}
