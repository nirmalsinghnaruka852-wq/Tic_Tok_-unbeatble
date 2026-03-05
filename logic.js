let n = 3;
let Board = Array.from({ length: n }, () => Array(n).fill(" "));
let GameStack = [];
let human = "X";
let aiPlayer = "O";
let gameOver = false;
let MaxLength = 7;
document.querySelectorAll('.cell').forEach(cell => {
  cell.addEventListener('click', handler);
})
const reset = document.querySelector(".restart-btn");

reset.addEventListener('click', resetFun);


function resetFun() {
  Board = Array.from({ length: n }, () => Array(n).fill(" "));
  gameOver = false;
  GameStack = [];
  for (let i = 0; i <= 9; i++) {

    document.querySelector(`[data-index="${i}"]`).textContent = " "
  }
  return
}
function handler(e) {

  if (gameOver) return;

  let index = Number(e.target.dataset.index)

  let row = Math.floor(index / 3)
  let col = index % 3

  if (Board[row][col] !== " ") return

  makeMove(row, col, human)
}
function makeMove(row, col, player) {
  Board[row][col] = player
  GameStack.push([row, col])
  let index = row * 3 + col
  document.querySelector(`[data-index="${index}"]`).textContent = player
  if (GameStack.length > 7) {
   let  removed = GameStack.shift();
    let [r, c] = removed;
    Board[r][c] = " ";
    let index = r * 3 + c
    document.querySelector(`[data-index="${index}"]`).textContent = " ";
  }

  if (letMeCheck(Board, GameStack)) {
    alert(player + " wins")
    resetFun()
    return
  }


  if (player === human) {
    setTimeout(aiTurn, 200)

  }
}
function makeMove2(row, col, player , Board , GameStack) {

  GameStack.push([row, col]);
  Board[row][col] = player;

  let removed = null;

  if (GameStack.length > 7) {
    removed = GameStack.shift(); 
    let [r, c] = removed;
    let player = Board[r][c];
    Board[r][c] = " ";
    removed = [r ,  c , player];
  }

  return removed;
}
function undoStepBack(row , col ,removed ,borad ,GameStack){
     borad[row][col] = " ";
     GameStack.pop();
     if(removed != null ){
      let [r ,c  , player] = removed;
      borad[r][c] = player;
        GameStack.unshift([r,c]);  
     }
     return ;
}



function aiTurn() {
  let [row, col] = BestMove(Board, GameStack, aiPlayer)
  makeMove(row, col, aiPlayer)
}


function letMeCheck(Board, GameStack) {
  let [row, col] = GameStack[GameStack.length - 1];
  let character = Board[row][col];
  return isWinningMove(row, col, Board, character);
}

function checkBoundary(row, col, Board) {
  return row < 0 || col < 0 || row >= Board.length || col >= Board[row].length;
}
function isWinningMove(row, col, Board, character, k = 3) {
  const directionPairs = [
    [
      [0, 1],
      [0, -1],
    ],
    [
      [1, 0],
      [-1, 0],
    ],
    [
      [1, 1],
      [-1, -1],
    ],
    [
      [1, -1],
      [-1, 1],
    ],
  ];
  for (let pair of directionPairs) {
    let count = 1;
    for (let [dr, dc] of pair) {
      let r = row + dr;
      let c = col + dc;
      while (!checkBoundary(r, c, Board) && Board[r][c] === character) {
        count++;
        r += dr;
        c += dc;
      }
    }

    if (count >= k) return true;
  }
  return false;
}


function BestMove(Board, GameStack, player) {
  let bestScroce = -Infinity;
  let move = [-1, -1];
   let map = new Map();
  for (let i = 0; i < Board.length; i++) {
    for (let j = 0; j < Board[i].length; j++) {
      if (Board[i][j] != " ") continue;
        let removed = makeMove2(i, j, player , Board , GameStack)
      let next = player == "X" ? "O" : "X";
      let scroc = minimax(Board, GameStack, next, aiPlayer, map, 20, -Infinity, Infinity);
      undoStepBack(i , j , removed , Board , GameStack);
      if (scroc > bestScroce) {
        bestScroce = scroc;
        move = [i, j];
      }
    }
  }
  return move;
}

function minimax(Board, GameStack, currentPlayer, aiPlayer , map , depth = 20, alpha = -Infinity, beta = Infinity) {

  if (GameStack.length > 0 && letMeCheck(Board, GameStack)) {
    let [row, col] = GameStack[GameStack.length - 1];
    let last = Board[row][col];
    return last === aiPlayer ? 10 + depth : -10 - depth;
  }
  let key = Board.flat().join('') + currentPlayer;

if(map.has(key)) {
    return map.get(key);
} 
  if (!depth  ) return evaluate(Board);
  
  let bestScore = currentPlayer === aiPlayer ? -Infinity : Infinity;


  for (let i = 0; i < Board.length; i++) {
    for (let j = 0; j < Board[i].length; j++) {

      if (Board[i][j] !== " ") continue;
     let removed = makeMove2(i, j, currentPlayer , Board , GameStack)
      let nextPlayer = currentPlayer === "X" ? "O" : "X";

      let score = minimax(Board, GameStack, nextPlayer, aiPlayer, map , depth - 1, alpha, beta);
       undoStepBack(i , j , removed , Board , GameStack);


      if (currentPlayer === aiPlayer) {
        bestScore = Math.max(bestScore, score);
        alpha = Math.max(alpha, bestScore);
      } else {
        bestScore = Math.min(bestScore, score);
        beta = Math.min(beta, bestScore);
      }

      if (beta <= alpha) return bestScore;
    }
    
  }
  map.set(key, bestScore);  

  return bestScore;
}


function evaluate(borad) {
  let score = 0

  const lines = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],

    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],

    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]]
  ];

  for (let line of lines) {
    let ai = 0;
    let human = 0;
    for (let [r, c] of line) {
      if (borad[r][c] == 'O') ai++;
if (borad[r][c] == 'X') human++;

    }
    if (ai > 0 && human > 0) continue;

    if (ai === 2) score += 3;
    else if (ai === 1) score += 1;

    if (human === 2) score -= 3;
    else if (human === 1) score -= 1;
  }

  return score
}