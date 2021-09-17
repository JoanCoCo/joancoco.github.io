var cat;

const CAT_STATES = {
    IDLE: "idle",
    LOOKING_AROUND: "looking_around",
    STILL: "still",
};

var catCurrentState = CAT_STATES.IDLE;
var catShouldRepeatState = true;

var catReachedPosition = false;
var catReachedRotation = false;

var catCrono = 0;

var catSence = 1;

function updateCat() {
    catCrono += elapsedTime;
    switch(catCurrentState) {
        case CAT_STATES.IDLE:
            catIdleState();
            if(catCrono > 20.0) {
                catCurrentState = CAT_STATES.LOOKING_AROUND;
                catShouldRepeatState = true;
                catSence = 1;
                catCrono = 0;
            }
            break;
        case CAT_STATES.LOOKING_AROUND:
            catLookingAroundState();
            catCrono = 0;
            break;
        case CAT_STATES.STILL:
            catStillState();
            catCrono = 0;
            break;
    }
}

function catIdleState() {
    if(catShouldRepeatState) {
        catReachedRotation = animate(ROTATION, cat, Math.PI / 10, catSence * Math.PI / 40, 0, 0);
        if(catReachedRotation) {
            catReachedRotation = false;
            catSence = -1 * catSence;
        }
    } else { }
}

function catLookingAroundState() {
    if(catShouldRepeatState) {
        if(catSence == 2) {
            catReachedRotation = animate(ROTATION, cat, Math.PI / 4, 0, 0, 0);
        } else {
            catReachedRotation = animate(ROTATION, cat, Math.PI / 4, 0, catSence * Math.PI / 4, 0);
        }
        if(catReachedRotation) {
            catReachedRotation = false;
            if(catSence == 1) {
                catSence = -1;
            } else if(catSence == 2) {
                catCurrentState = CAT_STATES.IDLE;
                catSence = 1;
            } else {
                catSence = 2;
            }
        }
    } else { }
}

function catStillState() {
    if(catShouldRepeatState) {
        if(!catReachedPosition) {
            catReachedPosition = animate(POSITION, cat, 100, 0, 0, 0);
        }
        if(!catReachedRotation) {
            catReachedRotation = animate(ROTATION, cat, 100, 0, 0, 0);
        }
        catShouldRepeatState = !(catReachedRotation && catReachedPosition);
    } else {
        catReachedRotation = false;
        catReachedPosition = false;
    }
}

function loadCat() {
    var loader = new THREE.ObjectLoader();
    loader.load('models/gato.json',
                function(obj) {
                    //var tx = new THREE.ImageUtils.loadTexture('models/soldado/soldado.png');
                    //tx.minFilter = tx.magFilter = THREE.LinearFilter;
                    obj.traverse(function(child) {
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
                    loadCannon();
                });
}
