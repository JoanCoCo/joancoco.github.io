var dessert;
var spawnPoints = [];
var totalNumberOfSpawnPoints = 0;

function loadDessert() {
    var loader = new THREE.ObjectLoader();
    loader.load('models/dessert.json',
                function(obj) {
                    obj.traverse(function(child) {
                        if(child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                        
                        switch(child.name) {
                            case "spawn_point":
                                spawnPoints.push(child);
                                totalNumberOfSpawnPoints += 1;
                                break;
                            default:
                                break;
                        }
                    });
                    obj.name = 'dessert';
                    obj.position.set(-10, 0, 5);
                    var s = (1 / MODELS_SCALE) * 3;
                    obj.scale.set(s, s, s);
                    obj.receiveShadow = true;
                    obj.castShadow = true;
                    dessert = obj;
                    scene.add(dessert);
                    modelsLoaded += 1;
                });
}

