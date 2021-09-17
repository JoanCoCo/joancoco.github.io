var cannon, shooter, leftWeel, rightWeel, seat;

function loadCannon() {
    var loader = new THREE.ObjectLoader();
    loader.load('models/canon.json',
                function(obj) {
                    obj.traverse(function(child) {
                        switch(child.name) {
                            case 'shooter':
                                shooter = child;
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
                    obj.position.set(0, 0.055, 0);
                    var s = 1 / MODELS_SCALE;
                    obj.scale.set(s, s, s);
                    obj.receiveShadow = true;
                    obj.castShadow = true;
                    cannon = obj;
                    scene.add(cannon);
                    render();
                });
}

