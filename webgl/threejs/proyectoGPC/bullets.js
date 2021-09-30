var bullets = [];
var timers = [];
const BULLETS_POOL_SIZE = 8;
var nextToShoot = 0;
const LOCAL_SPAWN_POINT = new THREE.Vector3(0, 120, -80);
const LIFE_TIME = 3.0;

const BULLET_SPEED = 10.0;

var phyBullets = []

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
        
                    //var box = obj.geometry.computeBoundingBox();
                    //var boxSize = box.max - box.min;
                    
                    for(var i = 0; i < BULLETS_POOL_SIZE; i++) {
                        var shape = new CANNON.Box(new CANNON.Vec3(8.284 * (s / 4), 13.819 * (s / 4), 7.788 * (s / 4)));
                        var mass = 1;
                        var phyBody = new CANNON.Body({mass: mass, shape: shape});
                        
                        phyBullets.push(phyBody);
                        
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
    
    phyBullets[nextToShoot].position.copy(bullets[nextToShoot].position);
    phyBullets[nextToShoot].quaternion.copy(bullets[nextToShoot].quaternion);
    phyWorld.add(phyBullets[nextToShoot]);
    
    phyBullets[nextToShoot].applyLocalImpulse(new CANNON.Vec3(0, 0, - BULLET_SPEED), new CANNON.Vec3(0, 0, 0));
    
    nextToShoot = (nextToShoot + 1) % BULLETS_POOL_SIZE;
}

function updateBullets() {
    for(var i = 0; i < BULLETS_POOL_SIZE; i++) {
        if(timers[i] < 0) {
            scene.remove(bullets[i]);
            phyWorld.remove(phyBullets[i]);
            resetPhsyicBody(phyBullets[i]);
        } else {
            timers[i] = timers[i] - elapsedTime;
        }
    }
}

function updateBulletsPhysics() {
    for(var i = 0; i < BULLETS_POOL_SIZE; i++) {
        if(timers[i] >= 0) {
            bullets[i].position.copy(phyBullets[i].position);
            bullets[i].quaternion.copy(phyBullets[i].quaternion);
        }
    }
}
