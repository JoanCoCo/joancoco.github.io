var bullets = [];
var timers = [];
const BULLETS_POOL_SIZE = 20;
var nextToShoot = 0;
const LOCAL_SPAWN_POINT = new THREE.Vector3(0, 120, -80);
const LIFE_TIME = 10.0;

function loadBullets() {
    var loader = new THREE.ObjectLoader();
    loader.load('models/bullet.json',
                function(obj) {
                    obj.traverse(function(child) {
                        if(child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    obj.name = 'bullet';
                    obj.position.set(-10, 0, 5);
                    var s = (1 / MODELS_SCALE) * 3;
                    obj.scale.set(s / 4, s / 4, s / 4);
                    obj.receiveShadow = true;
                    obj.castShadow = true;
                    
                    for(var i = 0; i < BULLETS_POOL_SIZE; i++) {
                        bullets.push(obj.clone(true));
                        timers.push(-1);
                        modelsLoaded += 1;
                    }
                });
}

function shootBullet() {
    var spawnPosition = new THREE.Vector3();
    var spawnRotation = new THREE.Quaternion();
    shooterCamera.getWorldPosition(spawnPosition);
    shooterCamera.getWorldQuaternion(spawnRotation);
    bullets[nextToShoot].position.set(spawnPosition.x, spawnPosition.y, spawnPosition.z);
    bullets[nextToShoot].quaternion.copy(spawnRotation);
    timers[nextToShoot] = LIFE_TIME;
    scene.add(bullets[nextToShoot]);
    nextToShoot = (nextToShoot + 1) % BULLETS_POOL_SIZE;
}

function updateBullets() {
    for(var i = 0; i < BULLETS_POOL_SIZE; i++) {
        if(timers[i] < 0) {
            scene.remove(bullets[i]);
        } else {
            timers[i] = timers[i] - elapsedTime;
        }
    }
}
