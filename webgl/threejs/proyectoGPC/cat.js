var cat, catTail, catLeftMustache, catRightMustache, catTail, catLeftEye, catRightEye;

var tailRotation = {z: 0};
var bodyPositionRotation = {px: 0, py: 0, pz: 0, rx: 0, ry: 0, rz: 0};

function updateCat() {
    
}

function setUpCatAnimation() {
    console.log("Setting up cat animation...");
    
    tailRotation.z = catTail.rotation.z;
    
    var tailTweenGo = new TWEEN.Tween(tailRotation).to({z: Math.PI / 8}, 2000).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(onUpdateCatTailRotation);
    var tailTweenBack = new TWEEN.Tween(tailRotation).to({z: - Math.PI / 8}, 2000).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(onUpdateCatTailRotation);
    
    tailTweenGo.chain(tailTweenBack);
    tailTweenBack.chain(tailTweenGo);
    
    tailTweenGo.start();
    
    bodyPositionRotation = {px: cat.position.x, py: cat.position.y, pz: cat.position.z, rx: cat.rotation.x, ry: cat.rotation.y, rz: cat.rotation.z};
    
    var bodyTween1 = new TWEEN.Tween(bodyPositionRotation).to({px: 0, py: 0, pz: 0, rx: Math.PI / 10, ry: Math.PI / 3, rz: 0}, 1000).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(onUpdateCatPositionRotation).delay(10000);
    var bodyTween2 = new TWEEN.Tween(bodyPositionRotation).to({px: 0, py: 0, pz: 0, rx: 0, ry: 0, rz: 0}, 1000).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(onUpdateCatPositionRotation);
    var bodyTween3 = new TWEEN.Tween(bodyPositionRotation).to({px: 0, py: 0, pz: 0, rx: Math.PI / 10, ry: - Math.PI / 3, rz: 0}, 1000).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(onUpdateCatPositionRotation);
    var bodyTween4 = new TWEEN.Tween(bodyPositionRotation).to({px: 0, py: 0, pz: 0, rx: 0, ry: 0, rz: 0}, 1000).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(onUpdateCatPositionRotation);
    
    bodyTween1.chain(bodyTween2);
    bodyTween2.chain(bodyTween3);
    bodyTween3.chain(bodyTween4);
    bodyTween4.chain(bodyTween1);
    
    bodyTween1.start();
}

function onUpdateCatPositionRotation() {
    cat.position.set(bodyPositionRotation.px, bodyPositionRotation.py, bodyPositionRotation.pz);
    cat.rotation.set(bodyPositionRotation.rx, bodyPositionRotation.ry, bodyPositionRotation.rz);
}

function onUpdateCatTailRotation() {
    //console.log(tailRotation);
    catTail.rotation.z = tailRotation.z;
}

function loadCat() {
    var loader = new THREE.ObjectLoader();
    loader.load('models/gato.json',
                function(obj) {
                    //var tx = new THREE.ImageUtils.loadTexture('models/soldado/soldado.png');
                    //tx.minFilter = tx.magFilter = THREE.LinearFilter;
                    obj.traverse(function(child) {
                        switch(child.name) {
                            case 'tail':
                                catTail = child;
                                break;
                            case 'right_eye':
                                catRightEye = child;
                                break;
                            case 'left_eye':
                                catLeftEye = child;
                                break;
                            case 'right_mustache':
                                catRightMustache = child;
                                break;
                            case 'left_mustache':
                                catLeftMustache = child;
                                break;
                            default:
                                break;
                        }
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
                    modelsLoaded += 1;
                    loadCannon();
                    
                    setUpCatAnimation();
                });
}
