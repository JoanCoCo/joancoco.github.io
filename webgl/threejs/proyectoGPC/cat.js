var cat, catTail, catLeftMustache, catRightMustache, catTail, catLeftEye, catRightEye;

var tailTweenGo;
var tailTweenBack;
var bodyTween;
var tailRotation = {z: 0};

function updateCat() {
    
}

function setUpCatAnimation() {
    console.log("Setting up cat animation...");
    
    tailRotation.z = catTail.rotation.z;
    tailTweenGo = new TWEEN.Tween(tailRotation).to({z: Math.PI / 8}, 2000).easing(TWEEN.Easing.Quartic.InOut).onUpdate(onUpdateCatTailRotation);
    tailTweenBack = new TWEEN.Tween(tailRotation).to({z: - Math.PI / 8}, 2000).easing(TWEEN.Easing.Quartic.InOut).onUpdate(onUpdateCatTailRotation);
    tailTweenGo.chain(tailTweenBack);
    tailTweenBack.chain(tailTweenGo);
    
    tailTweenGo.start();
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
