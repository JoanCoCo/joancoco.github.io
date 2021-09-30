var score = 0;
var lastUpdate = Date.now();

const MIN_ELAPSED_TIME = 500;

function updateScore() {
    var currentTime = Date.now();
    if(currentTime - lastUpdate > MIN_ELAPSED_TIME) {
        lastUpdate = currentTime;
        score = score + 1;
        updateScoreDisplay();
    }
}
