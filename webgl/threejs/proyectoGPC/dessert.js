var dessert;
var spawnPoints = [];
var totalNumberOfSpawnPoints = 0;

function loadDessert() {
    var loader = new THREE.ObjectLoader();
    loader.load('models/dessert.json',
                function(obj) {
                    var s = (1 / MODELS_SCALE) * 3;
                    obj.name = 'dessert';
                    obj.position.set(-10, 0, 5);
                    obj.scale.set(s, s, s);
                    obj.receiveShadow = true;
                    obj.castShadow = true;
                    dessert = obj;
                    scene.add(dessert);
                    dessert.traverse(function(child) {
                        if(child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            
                            var box = new THREE.Box3();
                            child.geometry.computeBoundingBox();
                            box.copy(child.geometry.boundingBox);
                            var boxSize = new CANNON.Vec3(box.max.x - box.min.x, box.max.y - box.min.y, box.max.z - box.min.z);
                            
                            var mass = 0;
                            var shape = new CANNON.Box(new CANNON.Vec3((boxSize.x / 2) * s, (boxSize.y / 2) * s, (boxSize.z / 2) * s));
                            var phyBody = new CANNON.Body({mass: mass, shape: shape});
                            
                            var spawnPosition = new THREE.Vector3();
                            var spawnRotation = new THREE.Quaternion();
                            child.getWorldPosition(spawnPosition);
                            child.getWorldQuaternion(spawnRotation);
                            
                            phyBody.position.copy(spawnPosition);
                            phyBody.quaternion.copy(spawnRotation);
                            
                            phyWorld.add(phyBody);
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
                    modelsLoaded += 1;
                });
}

