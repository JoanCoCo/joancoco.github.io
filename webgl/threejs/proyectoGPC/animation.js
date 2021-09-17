const POSITION = 0;
const ROTATION = 1;
const SCALE = 2;

function animate(parameter, object, speed, x, y, z) {
    if(object instanceof THREE.Object3D || object instanceof THREE.Mesh) {
        var speedX = speed;
        var speedY = speed;
        var speedZ = speed;
        
        if(parameter == POSITION) {
            var speeds = modulateSpeeds(speed, object.position.x, object.position.y, object.position.z, x, y, z);
            speedX = speeds[0];
            speedY = speeds[1];
            speedZ = speeds[2];
            var newX = interpolate(x, object.position.x, speedX);
            var newY = interpolate(y, object.position.y, speedY);
            var newZ = interpolate(z, object.position.z, speedZ);
            object.position.set(newX, newY, newZ);
            return Math.abs(newX - x) < 0.1  && Math.abs(newY - y) < 0.1 && Math.abs(newZ - z) < 0.1;
        } else if(parameter == ROTATION) {
            var speeds = modulateSpeeds(speed, object.rotation.x, object.rotation.y, object.rotation.z, x, y, z);
            speedX = speeds[0];
            speedY = speeds[1];
            speedZ = speeds[2];
            var newX = interpolate(x, object.rotation.x, speedX);
            var newY = interpolate(y, object.rotation.y, speedY);
            var newZ = interpolate(z, object.rotation.z, speedZ);
            object.rotation.set(newX, newY, newZ);
            return Math.abs(newX - x) < 0.01  && Math.abs(newY - y) < 0.01 && Math.abs(newZ - z) < 0.01;
        } else if(parameter == SCALE) {
            var speeds = modulateSpeeds(speed, object.scale.x, object.scale.y, object.scale.z, x, y, z);
            speedX = speeds[0];
            speedY = speeds[1];
            speedZ = speeds[2];
            var newX = interpolate(x, object.scale.x, speedX);
            var newY = interpolate(y, object.scale.y, speedY);
            var newZ = interpolate(z, object.scale.z, speedZ);
            object.scale.set(newX, newY, newZ);
            return Math.abs(newX - x) < 0.1  && Math.abs(newY - y) < 0.1 && Math.abs(newZ - z) < 0.1;
        }
    }
    return false
}

function modulateSpeeds(baseSpeed, currentX, currentY, currentZ, targetX, targetY, targetZ) {
    var speedX = baseSpeed;
    var speedY = baseSpeed;
    var speedZ = baseSpeed;
    
    var diffX = Math.abs(currentX - targetX);
    var diffY = Math.abs(currentY - targetY);
    var diffZ = Math.abs(currentZ - targetZ);
    
    if(diffX >= diffY && diffX >= diffZ) {
        var time = diffX / speedX;
        speedY = diffY / time;
        speedZ = diffZ / time;
    } else if(diffY >= diffX && diffY >= diffZ) {
        var time = diffY / speedY;
        speedX = diffX / time;
        speedZ = diffZ / time;
    } else {
        var time = diffZ / speedZ;
        speedY = diffY / time;
        speedX = diffX / time;
    }
    
    return [speedX, speedY, speedZ];
}

function interpolate(target, current, speed) {
    var result = 0;
    var reached = true;
    
    if(target > current) {
        result = current + speed * elapsedTime;
        reached = (target <= current);
    } else if(target < current) {
        result = current - speed * elapsedTime;
        reached = (target >= current);
    }
    
    if(reached) { result = target; }
    return result;
}
