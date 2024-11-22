let selectedMode = null;
let selectedDifficulty = null;

// Initialize the game board with empty cells represented by -1
const gameBoard = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]];
const players = ["X", "O"]; // Player symbols
let currentPlayer = 0; // Index of the current player
let scores = [0, 0]; // Scores for each player
let allowMoves = true; // Flag to allow or disallow moves

// Function to select the game mode
function selectMode(mode) {
    selectedMode = mode;
    console.log(selectedMode);
    document.getElementById('gameModeSelector').style.display = 'none';
    document.getElementById('difficultySelector').style.display = 'flex';
}

// Function to start the game with the selected difficulty
function startGame(difficulty) {
    selectedDifficulty = difficulty;
    document.getElementById('difficultySelector').style.display = 'none';
}

// Utility function to pause execution for a given time
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to handle a player's move
async function clicked(row, col) {
    if (!allowMoves || gameBoard[row - 1][col - 1] !== -1) {
        return; // Prevent move if not allowed or cell is occupied
    }
    // Make the move
    gameBoard[row - 1][col - 1] = currentPlayer;
    const cell = document.getElementById(`${row}${col}`);
    cell.innerHTML = players[currentPlayer];
    cell.style.cursor = 'default';
    cell.classList.add('no-hover'); // Disable hover effect
    currentPlayer = 1 - currentPlayer; // Switch player
    await sleep(100);

    const winner = checkWin();
    console.log("winner: " + winner);
    // If no winner
    if (winner == -1) {
        if (checkDraw()) {
            applyGlow('draw');
            allowMoves = false;
            clearGame();
            return;
        }
        await computerMove();
    } else {
        scores[winner - 1]++;
        console.log("score" + winner);
        document.getElementById('score' + (winner)).innerHTML = scores[winner - 1];
        await sleep(100);
        // If a player wins the game
        if (scores[winner - 1] >= selectedMode / 2) {
            allowMoves = false;
            showFinalWinner(winner);
        } else {
            applyGlow('win', winner);
            clearGame();
        }
    }
}

async function computerMove() {
    allowMoves = false; // Disable player moves during the computer's turn

    let moves = null;

    const random = Math.random();

    if(random < selectedDifficulty){
        console.log("hard move");
        moves = makeHardMove();
        await sleep(450);
    }
    else{
        console.log("random move");
        moves = randomMove();
        await sleep(450);
    }


    // Get coordinates
    const row = moves[0];
    const col = moves[1];

    // Make the move
    if (gameBoard[row][col] === -1) { // Ensure the move is valid
        gameBoard[row][col] = currentPlayer;
        const cell = document.getElementById(`${row + 1}${col + 1}`);
        cell.innerHTML = players[currentPlayer];
        cell.style.cursor = 'default'; // Change cursor to default
        cell.classList.add('no-hover'); // Disable hover effect
        currentPlayer = 1 - currentPlayer;

        await sleep(100);

        const winner = checkWin();
        // If there is a winner
        if (winner != -1) {
            console.log("winner: " + winner);
            scores[winner - 1]++;
            document.getElementById('score' + (winner)).innerHTML = scores[winner - 1];
            await sleep(100);
            console.log("win: " + scores[0] + " " + scores[1]);
            // If a player wins the game
            if (scores[winner - 1] >= selectedMode / 2) {
                allowMoves = false;
                showFinalWinner(winner);
            } else {
                applyGlow('win', winner);
                clearGame();
            }
        } else {
            // If it's a draw
            if (checkDraw()) {
                applyGlow('draw');
                allowMoves = false;
                clearGame();
                return;
            }
        }
    }

    allowMoves = true; // Re-enable player moves after the computer's turn
}


// Function to handle the computer's move
async function computerMove2() {
    if (!allowMoves) {
        return;
    }

    allowMoves = false; // Disable player moves during the computer's turn

    let moves = null;

    if (selectedDifficulty === 'easy') {
        moves = randomMove();
        await sleep(450);
    } else {
        moves = makeHardMove();
        await sleep(450);
    }

    // Get coordinates
    const row = moves[0];
    const col = moves[1];

    // Make the move
    if (gameBoard[row][col] === -1) { // Ensure the move is valid
        gameBoard[row][col] = currentPlayer;
        const cell = document.getElementById(`${row + 1}${col + 1}`);
        cell.innerHTML = players[currentPlayer];
        cell.style.cursor = 'default'; // Change cursor to default
        cell.classList.add('no-hover'); // Disable hover effect
        currentPlayer = 1 - currentPlayer;

        await sleep(100);

        const winner = checkWin();
        // If there is a winner
        if (winner != -1) {
            console.log("winner: " + winner);
            scores[winner - 1]++;
            document.getElementById('score' + (winner)).innerHTML = scores[winner - 1];
            await sleep(100);
            console.log("win: " + scores[0] + " " + scores[1]);
            // If a player wins the game
            if (scores[winner - 1] >= selectedMode / 2) {
                allowMoves = false;
                showFinalWinner(winner);
            } else {
                applyGlow('win', winner);
                clearGame();
            }
        } else {
            // If it's a draw
            if (checkDraw()) {
                applyGlow('draw');
                allowMoves = false;
                clearGame();
                return;
            }
        }
    }

    allowMoves = true; // Re-enable player moves after the computer's turn
}


// Function to check if there is a winner
function checkWin() {
    for (let i = 0; i < 3; i++) {
        if (gameBoard[i][0] === gameBoard[i][1] && gameBoard[i][1] === gameBoard[i][2] && gameBoard[i][0] !== -1) {
            return (gameBoard[i][0] + 1);
        }
        if (gameBoard[0][i] === gameBoard[1][i] && gameBoard[1][i] === gameBoard[2][i] && gameBoard[0][i] !== -1) {
            return (gameBoard[0][i] + 1);
        }
    }

    if (gameBoard[0][0] === gameBoard[1][1] && gameBoard[1][1] === gameBoard[2][2] && gameBoard[0][0] !== -1) {
        return (gameBoard[0][0] + 1);
    }

    if (gameBoard[0][2] === gameBoard[1][1] && gameBoard[1][1] === gameBoard[2][0] && gameBoard[0][2] !== -1) {
        return (gameBoard[0][2] + 1);
    }
    return -1;
}

// Function to check if the game is a draw
function checkDraw() {
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[i].length; j++) {
            if (gameBoard[i][j] === -1) {
                return false;
            }
        }
    }
    return true;
}

// Function to generate a random move for the computer
function randomMove() {
    let row;
    let col;

    // While is not empty
    do {
        col = Math.floor(Math.random() * 3);
        row = Math.floor(Math.random() * 3);
    } while (gameBoard[row][col] !== -1);
    return [row, col];
}

// Function to clear the game board
function clearGame() {
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[i].length; j++) {
            gameBoard[i][j] = -1;
            const cell = document.getElementById(`${i + 1}${j + 1}`);
            cell.innerHTML = '';
            cell.style.cursor = 'pointer'; // Reset cursor to pointer
            cell.classList.remove('no-hover'); // Re-enable hover effect
        }
    }
    allowMoves = true;
    currentPlayer = 0;
}

// Function to make a strategic move for the computer
function makeHardMove() {
    const PLAYER = 0;
    const CPU = 1;

    function getWinningMove(board, player) {
        const winningLines = [
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
        let move = getWinningMove(board, CPU);
        if (move !== -1) return move;

        move = getWinningMove(board, PLAYER);
        if (move !== -1) return move;

        if (board[4] === -1) return 4;

        const corners = [0, 2, 6, 8];
        for (let corner of corners) {
            if (board[corner] === -1) return corner;
        }

        const sides = [1, 3, 5, 7];
        for (let side of sides) {
            if (board[side] === -1) return side;
        }

        return getFirstAvailableMove(board);
    }

    const flatBoard = gameBoard.flat();

    const bestMove = findBestMove(flatBoard);
    if (bestMove !== -1) {
        flatBoard[bestMove] = CPU;
    }

    const row = Math.floor(bestMove / 3);
    const col = bestMove % 3;
    return [row, col];
}

// Function to apply glow effects based on the result
function applyGlow(result, winner = null) {
    const player1 = document.getElementById('player1');
    const cpu = document.getElementById('cpu');

    switch (result) {
        case 'win':
            if (winner === 1) {
                player1.classList.add('glow-green');
                cpu.classList.add('glow-red');
            } else {
                cpu.classList.add('glow-green');
                player1.classList.add('glow-red');
            }
            break;
        case 'draw':
            player1.classList.add('glow-yellow');
            cpu.classList.add('glow-yellow');
            break;
    }

    setTimeout(() => {
        player1.classList.remove('glow-green', 'glow-yellow', 'glow-red');
        cpu.classList.remove('glow-green', 'glow-yellow', 'glow-red');
    }, 2000);
}

// Function to show the final winner by hiding the grid and enlarging the winner
function showFinalWinner(winner) {
    const player1 = document.getElementById('player1');
    const cpu = document.getElementById('cpu');
    const gameGrid = document.getElementById('gameGrid');

    gameGrid.style.display = 'none';

    if (winner === 1) {
        player1.classList.add('winner');
        cpu.classList.add('loser');
    } else {
        cpu.classList.add('winner');
        player1.classList.add('loser');
    }
}



