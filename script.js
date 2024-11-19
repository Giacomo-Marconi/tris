let selectedMode = null;
let selectedDifficulty = null;


const game = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]]
const player = ["X", "O"];
let currentPlayer = 0;
let win = [0, 0]
let accetMosse = true;

function selectMode(mode) {
    selectedMode = mode;
    console.log(selectedMode);
    document.getElementById('gameModeSelector').style.display = 'none';
    document.getElementById('difficultySelector').style.display = 'flex';
}

function startGame(difficulty) {
    selectedDifficulty = difficulty;
    document.getElementById('difficultySelector').style.display = 'none';
    //initializeGame(selectedMode, difficulty);
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function clicked(r, c) {
    if(!accetMosse){
        return;
    }
    if(game[r-1][c-1] === -1 && currentPlayer === 0) {
        game[r-1][c-1] = currentPlayer;
        document.getElementById(`${r}${c}`).innerHTML = player[0];
        currentPlayer = 1 - currentPlayer;
        await sleep(100);

        const winner = checkWin();
        console.log("winner: " + winner);
        if(winner==-1){
            if(checkPatta()){
                alert('Patta');
                accetMosse = false;
                clearGame();
                return;
            }
            await computerMove();
        }else{
            win[winner-1]++;
            console.log("score"+winner);
            document.getElementById('score'+(winner)).innerHTML = win[winner-1];
            await sleep(100);
            if(win[winner-1]>=selectedMode/2){
                accetMosse = false;
                alert('Player ' + winner + ' wins THE GAME');
                window.location.reload();
            }else{
                alert('Player ' + winner + ' wins');
                clearGame();
            }
        }
    } else {
        alert('Invalid Move');
    }
}

async function computerMove() {
    if(selectedDifficulty === 'easy') {
        const [r, c] = randomGame();
        game[r][c] = currentPlayer;
        document.getElementById(`${r+1}${c+1}`).innerHTML = player[1];
        currentPlayer = 1 - currentPlayer;

        await sleep(100);

        const winner = checkWin();
        if(winner!=-1){
            console.log("winner: " + winner);
            win[winner-1]++;
            document.getElementById('score'+(winner)).innerHTML = win[winner-1];
            await sleep(100);
            console.log("win: " + win[0] + " " + win[1]);
            if(win[winner-1]>=selectedMode/2){
                accetMosse = false;
                alert('Player ' + winner + ' wins THE GAME');
                window.location.reload();
            }else{
                alert('Player ' + winner + ' wins');
                clearGame();
            }
        }else{
            if(checkPatta()){
                alert('Patta');
                accetMosse = false;
                clearGame();
            }
        }
    }
}



function checkWin() {
    for(let i = 0; i < 3; i++) {
        if(game[i][0] === game[i][1] && game[i][1] === game[i][2] && game[i][0] !== -1) {
            //alert('Player ' + (game[i][0] + 1) + ' wins');
            return (game[i][0] + 1);
        }
        if(game[0][i] === game[1][i] && game[1][i] === game[2][i] && game[0][i] !== -1) {
            //alert('Player ' + (game[0][i] + 1) + ' wins');
            return (game[0][i] + 1);
        }
    }

    if(game[0][0] === game[1][1] && game[1][1] === game[2][2] && game[0][0] !== -1) {
        //alert('Player ' + (game[0][0] + 1) + ' wins');
        return (game[0][0] + 1);
    }

    if(game[0][2] === game[1][1] && game[1][1] === game[2][0] && game[0][2] !== -1) {
        //alert('Player ' + (game[0][2] + 1) + ' wins');
        return (game[0][2] + 1);
    }
    return -1;
}

function checkPatta() {
    for (let i = 0; i < game.length; i++) {
        for (let j = 0; j < game[i].length; j++) {
            if(game[i][j] === -1) {
                return false;
            }
        }
    }
    return true;
}



function randomGame(){
    let r;
    let c;
    do{
        c = Math.floor(Math.random() * 3);
        r = Math.floor(Math.random() * 3);
    }while (game[r][c] !== -1);
    return [r, c];
}



function clearGame() {
    for (let i = 0; i < game.length; i++) {
        for (let j = 0; j < game[i].length; j++) {
            game[i][j] = -1;
            document.getElementById(`${i+1}${j+1}`).innerHTML = '';
        }
    }
    accetMosse = true;
    currentPlayer = 0;
}