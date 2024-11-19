let selectedMode = null;
let selectedDifficulty = null;

function selectMode(mode) {
    selectedMode = mode;
    document.getElementById('gameModeSelector').style.display = 'none';
    document.getElementById('difficultySelector').style.display = 'flex';
}

function startGame(difficulty) {
    selectedDifficulty = difficulty;
    document.getElementById('difficultySelector').style.display = 'none';
    //initializeGame(selectedMode, difficulty);
}

/*
function initializeGame(mode, difficulty) {

}
*/