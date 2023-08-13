// Tic Tac Toe game with Minimax algorithm

// The game board
let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];

// The AI player and the human player
const AI_PLAYER = 'O';
const HUMAN_PLAYER = 'X';

// Function to check if the game is over
function isGameOver() {
  // Check rows
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] !== '' &&
      board[i][0] === board[i][1] &&
      board[i][0] === board[i][2]
    ) {
      return true;
    }
  }

  // Check columns
  for (let i = 0; i < 3; i++) {
    if (
      board[0][i] !== '' &&
      board[0][i] === board[1][i] &&
      board[0][i] === board[2][i]
    ) {
      return true;
    }
  }

  // Check diagonals
  if (
    board[0][0] !== '' &&
    board[0][0] === board[1][1] &&
    board[0][0] === board[2][2]
  ) {
    return true;
  }

  if (
    board[0][2] !== '' &&
    board[0][2] === board[1][1] &&
    board[0][2] === board[2][0]
  ) {
    return true;
  }

  // Check for tie
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === '') {
        return false; // Game is not over yet
      }
    }
  }

  return true; // It's a tie
}

// Function to evaluate the score of the board
function evaluate(board) {
  // Check rows
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] !== '' &&
      board[i][0] === board[i][1] &&
      board[i][0] === board[i][2]
    ) {
      return board[i][0] === AI_PLAYER ? 1 : -1;
    }
  }

  // Check columns
  for (let i = 0; i < 3; i++) {
    if (
      board[0][i] !== '' &&
      board[0][i] === board[1][i] &&
      board[0][i] === board[2][i]
    ) {
      return board[0][i] === AI_PLAYER ? 1 : -1;
    }
  }

  // Check diagonals
  if (
    board[0][0] !== '' &&
    board[0][0] === board[1][1] &&
    board[0][0] === board[2][2]
  ) {
    return board[0][0] === AI_PLAYER ? 1 : -1;
  }

  if (
    board[0][2] !== '' &&
    board[0][2] === board[1][1] &&
    board[0][2] === board[2][0]
  ) {
    return board[0][2] === AI_PLAYER ? 1 : -1;
  }

  return 0; // It's a tie
}

// Minimax algorithm with alpha-beta pruning
function minimax(board, depth, isMaximizingPlayer, alpha, beta) {
  if (isGameOver()) {
    return evaluate(board);
  }

  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === '') {
          board[i][j] = AI_PLAYER;
          let eval = minimax(board, depth + 1, false, alpha, beta);
          board[i][j] = '';
          maxEval = Math.max(maxEval, eval);
          alpha = Math.max(alpha, eval);
          if (beta <= alpha) {
            break;
          }
        }
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === '') {
          board[i][j] = HUMAN_PLAYER;
          let eval = minimax(board, depth + 1, true, alpha, beta);
          board[i][j] = '';
          minEval = Math.min(minEval, eval);
          beta = Math.min(beta, eval);
          if (beta <= alpha) {
            break;
          }
        }
      }
    }
    return minEval;
  }
}

// Function to make a move for the AI player using the Minimax algorithm
function makeAIMove() {
  let bestEval = -Infinity;
  let bestMove;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === '') {
        board[i][j] = AI_PLAYER;
        let eval = minimax(board, 0, false, -Infinity, Infinity);
        board[i][j] = '';
        if (eval > bestEval) {
          bestEval = eval;
          bestMove = { i, j };
        }
      }
    }
  }

  board[bestMove.i][bestMove.j] = AI_PLAYER;
}

// Function to print the current state of the board
function printBoard() {
  console.log('-------------');
  for (let i = 0; i < 3; i++) {
    let row = '| ';
    for (let j = 0; j < 3; j++) {
      row += board[i][j] + ' | ';
    }
    console.log(row);
    console.log('-------------');
  }
}

// Function to handle the human player's move
function handleHumanMove(i, j) {
  if (board[i][j] === '') {
    board[i][j] = HUMAN_PLAYER;
    makeAIMove();
    printBoard();
    if (isGameOver()) {
      console.log('Game Over');
    }
  }
}

// Example usage
printBoard();

// Human move
handleHumanMove(0, 0);

// Human move
handleHumanMove(1, 2);

// // Human move
handleHumanMove(2, 2);
handleHumanMove(2, 0);

// ...
// Continue making moves until the game is over