let n = 3;
let Board = Array.from({ length: n }, () => Array(n).fill(" "));
let GameStack = [];
let human = "X";
let aiPlayer = "O";
let gameOver = false 
document.querySelectorAll('.cell').forEach(cell=>{
  cell.addEventListener('click' , handler);
})
const reset = document.querySelector(".restart-btn");

reset.addEventListener('click',  resetFun ) ;


function resetFun(){
   Board = Array.from({ length: n }, () => Array(n).fill(" "));
   gameOver = false;
   GameStack = [];
    for(let i = 0 ; i<=9 ; i++){
       
document.querySelector(`[data-index="${i}"]`).textContent = " "
    }  
   return 
}
function handler(e){

  if(gameOver) return;

  let index = Number(e.target.dataset.index)

  let row = Math.floor(index / 3)
  let col = index % 3

  if(Board[row][col] !== " ") return

  makeMove(row , col , human)
}
function makeMove(row,col,player){

  Board[row][col] = player
  GameStack.push([row,col])
let index = row * 3 + col
document.querySelector(`[data-index="${index}"]`).textContent = player

  if(letMeCheck(Board,GameStack)){
  alert(player + " wins")
    resetFun()
  return
}

if(isFull(Board)){
  alert("Draw")
  
  resetFun()
  return
}

  if(player === human){
    setTimeout(aiTurn, 200)
    
  }
}

function aiTurn(){
    let [row,col] = BestMove(Board,GameStack,aiPlayer)
    makeMove(row ,col , aiPlayer)
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

  for (let i = 0; i < Board.length; i++) {
    for (let j = 0; j < Board[i].length; j++) {
      if (Board[i][j] != " ") continue;
      Board[i][j] = player;
      GameStack.push([i, j]);
      let next = player == "X" ? "O" : "X";
       let scroc = minimax(Board, GameStack, next, aiPlayer, -Infinity, Infinity);
      Board[i][j] = " ";
      GameStack.pop();
      if (scroc > bestScroce) {
        bestScroce = scroc;
        move = [i, j];
      }
    }
  }
  return move;
}

function isFull(Board) {
  for (let i = 0; i < Board.length; i++) {
    for (let j = 0; j < Board[i].length; j++) {
      if (Board[i][j] === " ") return false;
    }
  }
  return true;
}

function minimax(Board, GameStack, currentPlayer, aiPlayer, alpha = -Infinity, beta = Infinity) {

  if (GameStack.length > 0 && letMeCheck(Board, GameStack)) {
    let [row, col] = GameStack[GameStack.length - 1];
    let last = Board[row][col];
    return last === aiPlayer ? 1 : -1;
  }

  if (isFull(Board)) return 0;

  let bestScore = currentPlayer === aiPlayer ? -Infinity : Infinity;

  for (let i = 0; i < Board.length; i++) {
    for (let j = 0; j < Board[i].length; j++) {

      if (Board[i][j] !== " ") continue;

      Board[i][j] = currentPlayer;
      GameStack.push([i, j]);

      let nextPlayer = currentPlayer === "X" ? "O" : "X";

      let score = minimax(Board, GameStack, nextPlayer, aiPlayer, alpha, beta);

      GameStack.pop();
      Board[i][j] = " ";

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

  return bestScore;
}