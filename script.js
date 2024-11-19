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
    //check move
    if(game[r-1][c-1] === -1 && currentPlayer === 0) {
        //do move
        game[r-1][c-1] = currentPlayer;
        document.getElementById(`${r}${c}`).innerHTML = player[0];
        currentPlayer = 1 - currentPlayer;
        await sleep(100);
        
        const winner = checkWin();
        console.log("winner: " + winner);
        //if no winner
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
            //if win the game
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
    let moves = null

    if(selectedDifficulty === 'easy') {
        moves = randomGame();
    }else{
        moves = makeMoveHard();
    }

    //get coords
    const r = moves[0];
    const c = moves[1];

    //do moves
    game[r][c] = currentPlayer;
    document.getElementById(`${r+1}${c+1}`).innerHTML = player[1];
    currentPlayer = 1 - currentPlayer;

    await sleep(100);

    const winner = checkWin();
    //if winnner
    if(winner!=-1){
        console.log("winner: " + winner);
        win[winner-1]++;
        document.getElementById('score'+(winner)).innerHTML = win[winner-1];
        await sleep(100);
        console.log("win: " + win[0] + " " + win[1]);
        //if win the game
        if(win[winner-1]>=selectedMode/2){
            accetMosse = false;
            alert('Player ' + winner + ' wins THE GAME');
            window.location.reload();
        }else{
            alert('Player ' + winner + ' wins');
            clearGame();
        }
    }else{
        //if draw
        if(checkPatta()){
            alert('Patta');
            accetMosse = false;
            clearGame();
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
    //check if there is a draw
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
    //ger row r and column c random
    let r;
    let c;
    //while is not empty
    do{
        c = Math.floor(Math.random() * 3);
        r = Math.floor(Math.random() * 3);
    }while (game[r][c] !== -1);
    return [r, c];
}



function clearGame() {
    //clear table game
    for (let i = 0; i < game.length; i++) {
        for (let j = 0; j < game[i].length; j++) {
            game[i][j] = -1;
            document.getElementById(`${i+1}${j+1}`).innerHTML = '';
        }
    }
    //accept new moves
    accetMosse = true;
    currentPlayer = 0;
}

function makeMoveHard() {
    const PLAYER = 0;
    const PC = 1;

    function getWinningMove(board, player) {
        const winningLines = [
            // Righe, colonne e diagonali
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]             
        ];
        for (let line of winningLines) {
            const [a, b, c] = line;
            if (board[a] === player && board[b] === player && board[c] === -1) return c;
            if (board[a] === player && board[c] === player && board[b] === -1) return b;
            if (board[b] === player && board[c] === player && board[a] === -1) return a;
        }
        return -1;
    }

    function getFirstAvailableMove(board) {
        return board.findIndex(cell => cell === -1);
    }

    
    function findBestMove(board) {
        //istant wint
        let move = getWinningMove(board, PC);
        if (move !== -1) return move;

        //no win player
        move = getWinningMove(board, PLAYER);
        if (move !== -1) return move;

        //center
        if (board[4] === -1) return 4;

        //angle
        const corners = [0, 2, 6, 8];
        for (let corner of corners) {
            if (board[corner] === -1) return corner;
        }

        //lateral
        const sides = [1, 3, 5, 7];
        for (let side of sides) {
            if (board[side] === -1) return side;
        }

        //first available
        return getFirstAvailableMove(board);
    }

    const flatBoard = game.flat();

    const bestMove = findBestMove(flatBoard);
    if (bestMove !== -1) {
        flatBoard[bestMove] = PC;
    }

    const r = Math.floor(bestMove / 3);
    const c = bestMove % 3;
    return [r, c];
}
