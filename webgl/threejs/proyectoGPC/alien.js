var alien, alienRightWingDown, alienRightWingUp, alienLeftWingDown, alienLeftWingUp, alienEye, alienTail;

var wingsFound = 0;

function loadAlien() {
    var loader = new THREE.ObjectLoader();
    loader.load('models/alien.json',
                function(obj) {
                    obj.traverse(function(child) {
                        switch(child.name) {
                            case 'tail':
                                alienTail = child;
                                break;
                            case 'eye':
                                alienEye = child;
                                break;
                            case 'right_wing_down':
                                alienRightWingDown = child;
                                wingsFound++;
                                break;
                            case 'right_wing_up':
                                alienRightWingUp = child;
                                wingsFound++;
                                break;
                            case 'left_wing_down':
                                alienLeftWingDown = child;
                                wingsFound++;
                                break;
                            case 'left_wing_up':
                                alienLeftWingUp = child;
                                wingsFound++;
                                break;
                            default:
                                break;
                        }
                        if(child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                        if(wingsFound == 4) {
                            wings = [alienLeftWingUp, alienLeftWingDown, alienRightWingUp, alienRightWingDown];
                        }
                    });
                    obj.name = 'alien';
                    var s = 1 / MODELS_SCALE;
                    obj.scale.set(s, s, s);
                    obj.receiveShadow = true;
                    obj.castShadow = true;
                    alien = obj;
                    scene.add(alien);
                    alien.position.set(0, 2, 2);
                    alien.rotation.z = alien.rotation.z + Math.PI;
                    render();
                });
}

var wings = [];
var senses = [-1, 1, 1, -1];
var angles = [Math.PI / 4, Math.PI / 8, Math.PI / 4, Math.PI / 8]

var maxDiffHeight = 0.05;
var fallDirection = 1;

function updateAlien() {
    for(var i = 0; i < wings.length; i++) {
        if(animate(ROTATION, wings[i], Math.PI * 1.5, 0, senses[i] * angles[i], 0)) {
            senses[i] = -1 * senses[i];
        }
    }
    if(animate(POSITION, alien, 0.5, 0, 2 + fallDirection * maxDiffHeight, 2)) {
        fallDirection *= -1;
    }
}
