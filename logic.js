

var kolekcijaPolja = document.getElementsByClassName("box");
var pobednik;
var nereseno = false;

let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  
  const AI_PLAYER = 'O'; //maximizing
  const HUMAN_PLAYER = 'X';
  //scores: 
  //ai: 10
  //human -10
  //tie: 0


  function proveriPobedu() {
    // provera redova
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] !== '' &&
        board[i][0] === board[i][1] &&
        board[i][0] === board[i][2]
      ) {
        pobednik = board[i][0];
        return true;
      }
    }
  
    // provera kolona
    for (let i = 0; i < 3; i++) {
      if (
        board[0][i] !== '' &&
        board[0][i] === board[1][i] &&
        board[0][i] === board[2][i]
      ) {
        pobednik = board[0][i];
        return true;
      }
    }
  
    // provera dijagonala
    if (
      board[0][0] !== '' &&
      board[0][0] === board[1][1] &&
      board[0][0] === board[2][2]
    ) {
      pobednik = board[0][0];
      return true;
    }
  
    if (
      board[0][2] !== '' &&
      board[0][2] === board[1][1] &&
      board[0][2] === board[2][0]
    ) {
      pobednik = board[0][2];
      return true;
    }
  
    // provera za slucaj 'nereseno'
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === '') {
          return false; // tabla jos nije popunjena
        }
      }
    }
    nereseno = true;
    return true; // Nereseno je
  }
  
  function evaluate(board) {
    // redovi
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] !== '' &&
        board[i][0] === board[i][1] &&
        board[i][0] === board[i][2]
      ) {
        return board[i][0] === AI_PLAYER ? 10 : -10;
      }
    }
  
    // kolone
    for (let i = 0; i < 3; i++) {
      if (
        board[0][i] !== '' &&
        board[0][i] === board[1][i] &&
        board[0][i] === board[2][i]
      ) {
        return board[0][i] === AI_PLAYER ? 10 : -10;
      }
    }
  
    // dijagonale
    if (
      board[0][0] !== '' &&
      board[0][0] === board[1][1] &&
      board[0][0] === board[2][2]
    ) {
      return board[0][0] === AI_PLAYER ? 10 : -10;
    }
  
    if (
      board[0][2] !== '' &&
      board[0][2] === board[1][1] &&
      board[0][2] === board[2][0]
    ) {
      return board[0][2] === AI_PLAYER ? 10 : -10;
    }
  
    return 0; // nereseno je
  }
  
  // Minimax algorithm with alpha-beta pruning
  function minimax(board, depth, isMaximizingPlayer, alpha, beta) {
    if (proveriPobedu()) {
      return evaluate(board);
    }
  
    if (isMaximizingPlayer) {
      let maxEval = -Infinity;
      let bestMove;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] === '') {
            board[i][j] = AI_PLAYER;
            let eval = minimax(board, depth + 1, false, alpha, beta);
            board[i][j] = '';
            if (eval > maxEval) {
              maxEval = eval;
              bestMove = { i, j };
            }
            alpha = Math.max(alpha, eval);
            if (beta <= alpha) {
              break;
            }
          }
        }
      }
      if (depth === 0) {
        return bestMove;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      let bestMove;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] === '') {
            board[i][j] = HUMAN_PLAYER;
            let eval = minimax(board, depth + 1, true, alpha, beta);
            board[i][j] = '';
            if (eval <= minEval) {
              minEval = eval;
              bestMove = { i, j };
            }
            beta = Math.min(beta, eval);
            if (beta <= alpha) {
              break;
            }
          }
        }
      }
      if (depth === 0) {
        return bestMove;
      }
      return minEval;
    }
  }
  
  // function sledeciPotezAi() {
  //   let bestMove = minimax(board, 0, true, -Infinity, Infinity);
  //   board[bestMove.i][bestMove.j] = AI_PLAYER;
  //   setTimeout(() => {
  //   crtajZnak(AI_PLAYER, bestMove.i, bestMove.j);
  //   }, 300);
  // }

  function sledeciPotezAi() {
    let bestMove;

    var encodedData = encodeURIComponent(JSON.stringify(board));
    // var url = 'http://localhost:8000/minimax/tabla/?board=' + encodedData;
    var url = 'https://web-production-afa3.up.railway.app/minimax/tabla/?board=' + encodedData;
    getData(url);
  }

  function getData(url) {
    fetch(url)
    .then(response => response.json())
    .then(responseData => {
      bestMove = responseData;
      console.log(responseData);
      board[bestMove[0]][bestMove[1]] = AI_PLAYER;

      setTimeout(() => {
      crtajZnak(AI_PLAYER, bestMove[0], bestMove[1]);
      if (proveriPobedu() && nereseno == false) {
        document.getElementById("poruka").innerHTML = "Pobedio je " + pobednik;
      } else if (nereseno == true){
        document.getElementById("poruka").innerHTML = "Nereseno je!";
      }
      }, 300);
    })
    .catch(error => {
      console.error(error);
    });
  }

  
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
  
  function sledeciPotezHuman(i, j) {
    if(!proveriPobedu()) {
      if (board[i][j] === '') {
        board[i][j] = HUMAN_PLAYER;
        crtajZnak(HUMAN_PLAYER, i, j);

        if (proveriPobedu() && nereseno == false) {
          document.getElementById("poruka").innerHTML = "Pobedio je " + pobednik;
        } else if (nereseno == true){
          document.getElementById("poruka").innerHTML = "Nereseno je";
        }

        sledeciPotezAi();
        printBoard();
      }
    } else alert("Igra je zavrsena, pokrenite novu igru");
  }

  function crtajZnak(znak, red, kolona) {
    var oznaka = document.createElement("h1");
    oznaka.innerHTML = znak;
    [...kolekcijaPolja][red*3+kolona].append(oznaka);
  }

  function newGame() {
		document.location.reload();
	}
  