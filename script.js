const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const playerScoreEl = document.getElementById('playerScore');
const computerScoreEl = document.getElementById('computerScore');
const drawScoreEl = document.getElementById('drawScore');

let board = Array(9).fill(null);
let currentPlayer = 'X'; // Player always "X"
let gameOver = false;
let scores = { player: 0, computer: 0, draw: 0 };

const winningCombinations = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// check winner
function checkWinner(b = board) {
  for (let [a,bIndex,c] of winningCombinations) {
    if (b[bIndex] && b[bIndex] === b[a] && b[a] === b[c]) {
      return b[a];
    }
  }
  return b.every(cell => cell) ? 'Draw' : null;
}

// minimax algorithm
function minimax(newBoard, isMaximizing) {
  const result = checkWinner(newBoard);
  if (result === 'X') return -10;
  if (result === 'O') return 10;
  if (result === 'Draw') return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    newBoard.forEach((cell, i) => {
      if (!cell) {
        newBoard[i] = 'O';
        let score = minimax(newBoard, false);
        newBoard[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    newBoard.forEach((cell, i) => {
      if (!cell) {
        newBoard[i] = 'X';
        let score = minimax(newBoard, true);
        newBoard[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    });
    return bestScore;
  }
}

// computer move (uses minimax)
function computerMove() {
  let bestScore = -Infinity;
  let move;
  board.forEach((cell, i) => {
    if (!cell) {
      board[i] = 'O';
      let score = minimax(board, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  });

  board[move] = 'O';
  const cell = document.querySelector(`.cell[data-index='${move}']`);
  cell.textContent = 'O';
  cell.classList.add('taken');

  let result = checkWinner();
  if (result) {
    endGame(result);
  } else {
    currentPlayer = 'X';
    statusText.textContent = "Your turn (X)";
  }
}

function playerMove(e) {
  const index = e.target.dataset.index;
  if (board[index] || gameOver) return;

  board[index] = 'X';
  e.target.textContent = 'X';
  e.target.classList.add('taken');

  let result = checkWinner();
  if (result) {
    endGame(result);
  } else {
    currentPlayer = 'O';
    statusText.textContent = "Computer's turn (O)";
    setTimeout(computerMove, 500);
  }
}

function endGame(result) {
  gameOver = true;
  if (result === 'X') {
    statusText.textContent = "You win! 🎉";
    scores.player++;
  } else if (result === 'O') {
    statusText.textContent = "Computer wins! 🤖";
    scores.computer++;
  } else {
    statusText.textContent = "It's a draw!";
    scores.draw++;
  }
  updateScores();
}

function updateScores() {
  playerScoreEl.textContent = scores.player;
  computerScoreEl.textContent = scores.computer;
  drawScoreEl.textContent = scores.draw;
}

function resetGame() {
  board = Array(9).fill(null);
  gameOver = false;
  currentPlayer = 'X';
  statusText.textContent = "Your turn (X)";
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken');
  });
}

cells.forEach(cell => cell.addEventListener('click', playerMove));
resetBtn.addEventListener('click', resetGame);
