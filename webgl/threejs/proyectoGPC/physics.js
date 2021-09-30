var phyWorld;

function initPhysics() {
    phyWorld = new CANNON.World();
    phyWorld.gravity.set(0, -10, 0);
    phyWorld.broadphase = new CANNON.NaiveBroadphase();
    // phyWorld.broadphase = new CANNON.GridBroadphase(new CANNON.Vec3(-12, -2, -20), new CANNON.Vec3(12, 20, 20), 15, 15, 15);
    phyWorld.solver.iterations = 10;
}

function updatePhysics() {
    phyWorld.step(elapsedTime);
    updateBulletsPhysics();
    updateCannonPhysics();
}

function resetPhsyicBody(body) {
    // Position
    body.position.setZero();
    body.previousPosition.setZero();
    body.interpolatedPosition.setZero();
    body.initPosition.setZero();

    // orientation
    body.quaternion.set(0,0,0,1);
    body.initQuaternion.set(0,0,0,1);
    //body.previousQuaternion.set(0,0,0,1);
    body.interpolatedQuaternion.set(0,0,0,1);

    // Velocity
    body.velocity.setZero();
    body.initVelocity.setZero();
    body.angularVelocity.setZero();
    body.initAngularVelocity.setZero();

    // Force
    body.force.setZero();
    body.torque.setZero();

    // Sleep state reset
    body.sleepState = 0;
    body.timeLastSleepy = 0;
    body._wakeUpAfterNarrowphase = false;
}
