
const board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameStatus = 'Game in progress';
let isHumanVsComputer = false;
let playerXName = 'Player X';
let playerOName = 'Player O';
let playerXScore = 0;
let playerOScore = 0;
let round = 0;
let winner = null;
let difficultyLevel = 'medium'; // Default difficulty level

const cells = document.querySelectorAll('.cell');
const status = document.querySelector('.status');
const playerXNameInput = document.getElementById('playerXName');
const playerONameInput = document.getElementById('playerOName');
const playerNamesContainer = document.querySelector('.player-names');
const playerXScoreDisplay = document.getElementById('playerXScore');
const playerOScoreDisplay = document.getElementById('playerOScore');

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const checkWinner = () => {
  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      if (currentPlayer === 'X') {
        playerXScore++;
      } else {
        playerOScore++;
      }
      updateScore();
      if (++round === 3) {
        setTimeout(() => {
          if (playerXScore > playerOScore) {
            winner = 'X';
          } else if (playerXScore < playerOScore) {
            winner = 'O';
          } else {
            winner = 'tie';
          }
          alert(`The winner is Player ${winner}!`);
          celebrateWinner();
          restartGame();
          round = 0;
        }, 1000);
      } else {
        gameStatus = `${currentPlayer === 'X' ? playerXName : playerOName} wins round ${round}!`;
        highlightWinningCells(combination);
        setTimeout(() => {
          restartRound();
        }, 1000);
      }
      return true;
    }
  }
  if (board.every(cell => cell !== '')) {
    gameStatus = 'It\'s a draw!';
    return true;
  }
  return false;
};

const highlightWinningCells = (combination) => {
  for (let index of combination) {
    cells[index].classList.add('winning-cell');
  }

  setTimeout(() => {
    for (let index of combination) {
      cells[index].classList.remove('winning-cell');
    }
  }, 1000);
};

const celebrateWinner = () => {
  const firecrackerCount = 10; // Number of firecrackers
  const container = document.createElement('div');
  container.classList.add('firecracker-container');
  for (let i = 0; i < firecrackerCount; i++) {
    const firecracker = document.createElement('div');
    firecracker.classList.add('firecracker');
    container.appendChild(firecracker);
    setTimeout(() => {
      firecracker.style.animation = 'firecrackers 1s ease-in-out forwards';
    }, i * 100); // Stagger the animation start
  }
  document.body.appendChild(container);
  setTimeout(() => {
    container.remove();
  }, 1500); // Remove after animation completes
};

const restartGame = () => {
  board.fill('');
  currentPlayer = 'X';
  gameStatus = 'Game in progress';
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('winning-cell', 'winning-line');
  });
  status.textContent = '';
  playerXScore = 0;
  playerOScore = 0;
  updateScore();
};

const restartRound = () => {
  board.fill('');
  currentPlayer = 'X';
  gameStatus = 'Game in progress';
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('winning-cell', 'winning-line');
  });
  status.textContent = '';
};

const makeMove = (index) => {
  if (board[index] === '' && gameStatus === 'Game in progress') {
    board[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    if (!checkWinner()) {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      status.textContent = isHumanVsComputer && currentPlayer === 'O' ? 'Computer\'s turn' : `Current Player: ${currentPlayer === 'X' ? playerXName : playerOName}`;
      if (isHumanVsComputer && currentPlayer === 'O') {
        setTimeout(() => {
          makeComputerMove();
        }, 1000);
      }
    } else {
      status.textContent = gameStatus;
    }
  }
};


const makeComputerMove = () => {
  let emptyCells = board.reduce((acc, cell, index) => {
    if (cell === '') {
      acc.push(index);
    }
    return acc;
  }, []);
  let randomIndex;

  if (difficultyLevel === 'easy') {
    randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  } else if (difficultyLevel === 'medium') {
    // Implement medium difficulty level strategy here
    // For example, prioritize center, corners, then edges
    randomIndex = prioritizeMove(emptyCells, [4, 0, 2, 6, 8, 1, 3, 5, 7]);
  } else if (difficultyLevel === 'hard') {
    // Implement hard difficulty level strategy here
    // For example, try to win or block the opponent from winning
    randomIndex = prioritizeMove(emptyCells, [4, 0, 2, 6, 8, 1, 3, 5, 7]);
    if (randomIndex === -1) {
      randomIndex = prioritizeMove(emptyCells, [0, 2, 6, 8, 1, 3, 5, 7, 4]);
    }
  }

  makeMove(randomIndex);
};

const prioritizeMove = (emptyCells, priorityArray) => {
  for (let index of priorityArray) {
    if (emptyCells.includes(index)) {
      return index;
    }
  }
  return -1;
};

const updateScore = () => {
  playerXScoreDisplay.textContent = playerXScore;
  playerOScoreDisplay.textContent = playerOScore;
};

cells.forEach((cell, index) => {
  cell.addEventListener('click', () => {
    makeMove(index);
  });
});

document.querySelector('.restart').addEventListener('click', restartGame);

document.querySelector('.human-vs-human').addEventListener('click', () => {
  isHumanVsComputer = false;
  playerNamesContainer.style.display = 'block';
  restartGame();
});

document.querySelector('.human-vs-computer').addEventListener('click', () => {
  isHumanVsComputer = true;
  playerNamesContainer.style.display = 'none';
  restartGame();
});

document.getElementById('savePlayerXName').addEventListener('click', () => {
  playerXName = playerXNameInput.value.trim() || 'Player X';
  playerXNameInput.value = playerXName;
});

document.getElementById('savePlayerOName').addEventListener('click', () => {
  playerOName = playerONameInput.value.trim() || 'Player O';
  playerONameInput.value = playerOName;
});

document.getElementById('difficultyLevel').addEventListener('change', (event) => {
  difficultyLevel = event.target.value;
  restartGame();
});







