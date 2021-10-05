var cannon, shooter, leftWeel, rightWeel, seat;
const CANNON_SPEED = 2.0;

var phyCannon;

const CANNON_BOUNDING_BOX = {x: 42.349, y: 4.717, z: 34.640};
const SPHERE_EXTRA_SIZE = 30;

var cannonHasBeenLoaded = false

const CANNON_WARM_UP_TIME = 5.5
var cannonWarmUp = 0

function loadCannon() {
    var loader = new THREE.ObjectLoader();
    loader.load('models/canon.json',
                function(obj) {
                    obj.traverse(function(child) {
                        switch(child.name) {
                            case 'shooter':
                                shooter = child;
                                shooter.add(shooterCamera);
                                shooterCamera.position.set(0, 22.5, 35);
                                shooterCamera.rotation.y = Math.PI;
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
                    obj.name = 'cannon';
                    obj.position.set(0, 0.5, 0);
                    var s = 1 / MODELS_SCALE;
                    obj.scale.set(s, s, s);
                    obj.receiveShadow = true;
                    obj.castShadow = true;
                    cannon = obj;
                    scene.add(cannon);
                    cannon.add(camera);
                    camera.position.set(0, 120, -100);
                    camera.rotation.x = Math.PI / 6;
                    camera.rotation.y = Math.PI;
                    
                    //var shape = new CANNON.Box(new CANNON.Vec3(CANNON_BOUNDING_BOX.x * s / 2, CANNON_BOUNDING_BOX.y * s / 2, CANNON_BOUNDING_BOX.z * s / 2));
                    var shape = new CANNON.Sphere((CANNON_BOUNDING_BOX.y + SPHERE_EXTRA_SIZE) * s / 2);
                    var mass = 3;
                    phyCannon = new CANNON.Body({mass: mass, shape: shape, linearDamping: 0.9, angularDamping: 0.9});
        
                    phyCannon.position.copy(cannon.position);
                    phyCannon.position.y = phyCannon.position.y + SPHERE_EXTRA_SIZE * s / 2;
                    phyCannon.quaternion.copy(cannon.quaternion);
        
                    phyWorld.add(phyCannon);
        
                    cannonHasBeenLoaded = true;
                    
                    modelsLoaded += 1;
                });
}

function updateCannonRotation() {
    var xr = (- Math.PI / 10) - mouse.y * (Math.PI / 4);
    shooter.rotation.x = xr;
    if(Math.abs(mouse.x) > 0.2) {
        var yr = cannon.rotation.y - mouse.x * Math.PI / 2 * elapsedTime;
        cannon.rotation.y = yr;
        //phyCannon.quaternion.copy(cannon.quaternion);
    }
}

function updateCannonPosition() {
    if(pullDirection != 0) {
        var mag = CANNON_SPEED * pullDirection;
        var z = Math.cos(cannon.rotation.y) * mag;
        var x = Math.sin(cannon.rotation.y) * mag;
        phyCannon.applyImpulse(new CANNON.Vec3(x, 0, z), phyCannon.position);
        
        //leftWeel.rotation.x = leftWeel.rotation.x + (Math.PI / 10) * elapsedTime;
        //rightWeel.rotation.x = rightWeel.rotation.x + (Math.PI / 10) * elapsedTime;
    }
}

function updateCannonPhysics() {
    if(cannonWarmUp >= CANNON_WARM_UP_TIME) {
        cannon.position.copy(phyCannon.position);
        var s = 1 / MODELS_SCALE;
        cannon.position.y = cannon.position.y - SPHERE_EXTRA_SIZE * s / 2;
        if(cannon.position.y < -2 && !gameOver) {
            gameOver = true;
            document.getElementById('container').removeChild(scoreDisplay.domElement);
        }
    } else {
        keepCannonPhysicsStill();
        cannonWarmUp += elapsedTime;
    }
}

function keepCannonPhysicsStill() {
    if(cannonHasBeenLoaded) {
        var s = 1 / MODELS_SCALE;
        resetPhsyicBody(phyCannon);
        phyCannon.position.copy(cannon.position);
        phyCannon.position.y = phyCannon.position.y + SPHERE_EXTRA_SIZE * s / 2;
        phyCannon.quaternion.copy(cannon.quaternion);
    }
}
