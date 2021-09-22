var cannon, shooter, leftWeel, rightWeel, seat;
const CANNON_SPEED = 5.0;

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
                    obj.position.set(0, 0.55, 0);
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
                    modelsLoaded += 1;
                });
}

function updateCannonRotation() {
    var xr = (- Math.PI / 10) - mouse.y * (Math.PI / 4);
    shooter.rotation.x = xr;
    if(Math.abs(mouse.x) > 0.2) {
        var yr = cannon.rotation.y - mouse.x * Math.PI / 2 * elapsedTime;
        cannon.rotation.y = yr;
    }
}

function updateCannonPosition() {
    var mag = CANNON_SPEED * pullDirection * elapsedTime;
    var z = Math.cos(cannon.rotation.y) * mag;
    var x = Math.sin(cannon.rotation.y) * mag;
    cannon.position.x += x;
    cannon.position.z += z;
    
}
