var aliens = [];
var alienRightWingsDown = [];
var alienRightWingsUp = [];
var alienLeftWingsDown = [];
var alienLeftWingsUp = [];
var alienEyes = []
var alienTails = [];

var aliensBussy = [];

const ALIENS_POOL_SIZE = 3;

var alienRightWingsDownRotation = [];
var alienRightWingsUpRotation = [];
var alienLeftWingsDownRotation = [];
var alienLeftWingsUpRotation = [];

var alienTailsRotation = [];

const WINGS_SPEED = 500;

const ALIEN_BOUNDING_BOX_SIZE = {x: 58.682, y: 41.773, z: 27.124};
const ALIEN_BOUNDING_BOX_DISPLACEMENT = {x: 0.0, y: 11.773, z: 0.0}

var phyAliens = [];

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
                                    alienTailsRotation.push({x: child.rotation.x});
                                    break;
                                case 'eye':
                                    alienEyes.push(child);
                                    break;
                                case 'right_wing_down':
                                    alienRightWingsDown.push(child);
                                    alienRightWingsDownRotation.push({x: child.rotation.x, y: child.rotation.y, z: child.rotation.z});
                                    break;
                                case 'right_wing_up':
                                    alienRightWingsUp.push(child);
                                    alienRightWingsUpRotation.push({x: child.rotation.x, y: child.rotation.y, z: child.rotation.z});
                                    break;
                                case 'left_wing_down':
                                    alienLeftWingsDown.push(child);
                                    alienLeftWingsDownRotation.push({x: child.rotation.x, y: child.rotation.y, z: child.rotation.z});
                                    break;
                                case 'left_wing_up':
                                    alienLeftWingsUp.push(child);
                                    alienLeftWingsUpRotation.push({x: child.rotation.x, y: child.rotation.y, z: child.rotation.z});
                                    break;
                                default:
                                    break;
                            }
                        })
                        aliens[i].rotation.z = aliens[i].rotation.z + Math.PI;
                        
                        var shape = new CANNON.Box(new CANNON.Vec3(ALIEN_BOUNDING_BOX_SIZE.x * s / 2, ALIEN_BOUNDING_BOX_SIZE.y * s / 2, ALIEN_BOUNDING_BOX_SIZE.z * s / 2));
                        
                        console.log(shape);
                        
                        var mass = 1;
                        var phyBody = new CANNON.Body({mass: mass, type: CANNON.Body.KINEMATIC, shape: shape});
                        
                        defineCollisionEvent(phyBody, i);
                        
                        phyAliens.push(phyBody);
                        
                        modelsLoaded += 1;
                    }
        
                    setUpAlienAnimation();
                });
}

var senses = [-1, 1, 1, -1];
var angles = [Math.PI / 4, Math.PI / 8, Math.PI / 4, Math.PI / 8]


function updateAlienPhysics() {
    var s = 1 / MODELS_SCALE;
    for(var i = 0; i < ALIENS_POOL_SIZE; i++) {
        if(aliensBussy[i] >= 0) {
            aliens[i].position.set(phyAliens[i].position.x - ALIEN_BOUNDING_BOX_DISPLACEMENT.x * s, phyAliens[i].position.y - ALIEN_BOUNDING_BOX_DISPLACEMENT.y * s, phyAliens[i].position.z - ALIEN_BOUNDING_BOX_DISPLACEMENT.z * s);
            aliens[i].quaternion.copy(phyAliens[i].quaternion);
            //console.log(phyAliens[i].position);
        }
    }
}

function spawnAlien() {
    var s = 1 / MODELS_SCALE;
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
            
            phyAliens[i].position.copy(new CANNON.Vec3(aliens[i].position.x + ALIEN_BOUNDING_BOX_DISPLACEMENT.x * s, aliens[i].position.y + ALIEN_BOUNDING_BOX_DISPLACEMENT.y * s, aliens[i].position.z + ALIEN_BOUNDING_BOX_DISPLACEMENT.z * s));
            phyAliens[i].quaternion.copy(aliens[i].quaternion);
            phyWorld.add(phyAliens[i]);
            
            break;
        }
    }
}


function setUpAlienAnimation() {
    for(var i = 0; i < ALIENS_POOL_SIZE; i++) {
        var tweenRightUp1 = new TWEEN.Tween(alienRightWingsUpRotation[i]).to({x: Math.PI / 10, y: Math.PI / 10, z: -Math.PI / 8}, WINGS_SPEED).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(onUpdateRightWingUpRotation);
        var tweenRightUp2 = new TWEEN.Tween(alienRightWingsUpRotation[i]).to({x: -Math.PI / 10, y: - Math.PI / 10, z: Math.PI / 8}, WINGS_SPEED).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(onUpdateRightWingUpRotation);
        tweenRightUp1.chain(tweenRightUp2);
        tweenRightUp2.chain(tweenRightUp1);
        tweenRightUp1.start();
        
        var tweenLeftUp1 = new TWEEN.Tween(alienLeftWingsUpRotation[i]).to({x: Math.PI / 10, y: -Math.PI / 10, z: Math.PI / 8}, WINGS_SPEED).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(onUpdateLeftWingUpRotation);
        var tweenLeftUp2 = new TWEEN.Tween(alienLeftWingsUpRotation[i]).to({x: -Math.PI / 10, y: Math.PI / 10, z: -Math.PI / 8}, WINGS_SPEED).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(onUpdateLeftWingUpRotation);
        tweenLeftUp1.chain(tweenLeftUp2);
        tweenLeftUp2.chain(tweenLeftUp1);
        tweenLeftUp1.start();
        
        var tweenRightDown1 = new TWEEN.Tween(alienRightWingsDownRotation[i]).to({x: Math.PI / 20, y: Math.PI / 20, z: -Math.PI / 16}, WINGS_SPEED).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(onUpdateRightWingDownRotation);
        var tweenRightDown2 = new TWEEN.Tween(alienRightWingsDownRotation[i]).to({x: -Math.PI / 20, y: - Math.PI / 20, z: Math.PI / 16}, WINGS_SPEED).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(onUpdateRightWingDownRotation);
        tweenRightDown1.chain(tweenRightDown2);
        tweenRightDown2.chain(tweenRightDown1);
        tweenRightDown1.start();
        
        var tweenLeftDown1 = new TWEEN.Tween(alienLeftWingsDownRotation[i]).to({x: Math.PI / 20, y: -Math.PI / 20, z: Math.PI / 16}, WINGS_SPEED).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(onUpdateLeftWingDownRotation);
        var tweenLeftDown2 = new TWEEN.Tween(alienLeftWingsDownRotation[i]).to({x: -Math.PI / 20, y: Math.PI / 20, z: -Math.PI / 16}, WINGS_SPEED).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(onUpdateLeftWingDownRotation);
        tweenLeftDown1.chain(tweenLeftDown2);
        tweenLeftDown2.chain(tweenLeftDown1);
        tweenLeftDown1.start();
        
        var tweenTail1 = new TWEEN.Tween(alienTailsRotation[i]).to({x: Math.PI / 10}, 1000).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(onUpdateTailRotation);
        var tweenTail2 = new TWEEN.Tween(alienTailsRotation[i]).to({x: -Math.PI / 10}, 1000).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(onUpdateTailRotation);
        tweenTail1.chain(tweenTail2);
        tweenTail2.chain(tweenTail1);
        tweenTail1.start();
    }
}

function onUpdateRightWingUpRotation() {
    for(var i = 0; i < ALIENS_POOL_SIZE; i++) {
        alienRightWingsUp[i].rotation.set(alienRightWingsUpRotation[i].x, alienRightWingsUpRotation[i].y, alienRightWingsUpRotation[i].z);
    }
}

function onUpdateLeftWingUpRotation() {
    for(var i = 0; i < ALIENS_POOL_SIZE; i++) {
        alienLeftWingsUp[i].rotation.set(alienLeftWingsUpRotation[i].x, alienLeftWingsUpRotation[i].y, alienLeftWingsUpRotation[i].z);
    }
}

function onUpdateRightWingDownRotation() {
    for(var i = 0; i < ALIENS_POOL_SIZE; i++) {
        alienRightWingsDown[i].rotation.set(alienRightWingsDownRotation[i].x, alienRightWingsDownRotation[i].y, alienRightWingsDownRotation[i].z);
    }
}

function onUpdateLeftWingDownRotation() {
    for(var i = 0; i < ALIENS_POOL_SIZE; i++) {
        alienLeftWingsDown[i].rotation.set(alienLeftWingsDownRotation[i].x, alienLeftWingsDownRotation[i].y, alienLeftWingsDownRotation[i].z);
    }
}

function onUpdateTailRotation() {
    for(var i = 0; i < ALIENS_POOL_SIZE; i++) {
        alienTails[i].rotation.x = alienTailsRotation[i].x;
    }
}

function alienWasHit(i) {
    console.log("Hit on " + i);
    if(aliensBussy[i] >= 0) {
        scene.remove(aliens[i]);
        phyWorld.remove(phyAliens[i]);
        resetPhsyicBody(phyAliens[i]);
        aliensBussy[i] = -1;
        score = score + 1;
        spawnAlien();
    }
}

function defineCollisionEvent(object, index) {
    object.addEventListener("collide", function(e) {
        alienWasHit(index);
    })
}
