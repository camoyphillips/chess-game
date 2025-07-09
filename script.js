
const board = document.getElementById('board');
const status = document.getElementById('status');

const POWER_UP_TYPES = {
  DOUBLE_MOVE: 'doubleMove',
  HEAL: 'heal',
  TELEPORT: 'teleport'
};

let selected = null;
let suggestedMove = null;
let turn = 'white';
let powerUpSquares = [];
const NUM_POWER_UPS = 3;
let whiteScore = parseInt(localStorage.getItem('chess_white_score')) || 0;
let blackScore = parseInt(localStorage.getItem('chess_black_score')) || 0;

const initialSetup = [
  ['♜','♞','♝','♛','♚','♝','♞','♜'],
  ['♟','♟','♟','♟','♟','♟','♟','♟'],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['♙','♙','♙','♙','♙','♙','♙','♙'],
  ['♖','♘','♗','♕','♔','♗','♘','♖'],
];

const colors = [
  'black','black','black','black','black','black','black','black',
  'black','black','black','black','black','black','black','black',
  '','','','','','','','',
  '','','','','','','','',
  '','','','','','','','',
  '','','','','','','','',
  'white','white','white','white','white','white','white','white',
  'white','white','white','white','white','white','white','white',
];

const pieces = [].concat(...initialSetup);
const colorMap = [...colors];

function initializePowerUps() {
  powerUpSquares = [];
  const availableSquares = [];
  for (let i = 16; i < 48; i++) {
    if (pieces[i] === '') availableSquares.push(i);
  }
  for (let i = 0; i < NUM_POWER_UPS; i++) {
    if (availableSquares.length === 0) break;
    const randomIndex = Math.floor(Math.random() * availableSquares.length);
    const squareIndex = availableSquares.splice(randomIndex, 1)[0];
    const randomType = Object.values(POWER_UP_TYPES)[Math.floor(Math.random() * Object.values(POWER_UP_TYPES).length)];
    powerUpSquares.push({ index: squareIndex, type: randomType });
  }
}

function drawBoard() {
  board.innerHTML = '';
  for (let i = 0; i < 64; i++) {
    const square = document.createElement('div');
    square.className = 'square ' + ((Math.floor(i / 8) + i) % 2 === 0 ? 'light' : 'dark');
    square.dataset.index = i;
    square.textContent = pieces[i];
    if (i === selected) square.classList.add('selected');
    if (suggestedMove && (i === suggestedMove.from || i === suggestedMove.to)) {
      square.classList.add('suggested');
    }
    const powerUp = powerUpSquares.find(pu => pu.index === i);
    if (powerUp) {
      square.classList.add('power-up-' + powerUp.type);
      if (!square.textContent) {
        square.innerHTML += `<span class="power-up-icon">${getPowerUpIcon(powerUp.type)}</span>`;
      }
    }
    square.onclick = () => select(i);
    board.appendChild(square);
  }
}

function getPowerUpIcon(type) {
  switch (type) {
    case POWER_UP_TYPES.DOUBLE_MOVE: return '⚡';
    case POWER_UP_TYPES.HEAL: return '➕';
    case POWER_UP_TYPES.TELEPORT: return '✨';
    default: return '';
  }
}

function select(index) {
  if (selected === null) {
    if (colorMap[index] === turn) {
      selected = index;
      suggestedMove = null;
      drawBoard();
    }
  } else {
    if (index === selected) {
      selected = null;
    } else {
      movePiece(selected, index);
      selected = null;
    }
    drawBoard();
  }
}

function updateStatus() {
  document.getElementById('status').textContent = `${turn.charAt(0).toUpperCase() + turn.slice(1)}'s Turn`;
  document.getElementById('score').textContent = `White: ${whiteScore} | Black: ${blackScore}`;
}

function saveScores() {
  localStorage.setItem('chess_white_score', whiteScore);
  localStorage.setItem('chess_black_score', blackScore);
}

function resetGame() {
  const setup = [].concat(...initialSetup);
  for (let i = 0; i < 64; i++) {
    pieces[i] = setup[i];
    colorMap[i] = colors[i];
  }
  whiteScore = 0;
  blackScore = 0;
  selected = null;
  suggestedMove = null;
  turn = 'white';
  document.getElementById('winner').textContent = '';
  initializePowerUps();
  updateStatus();
  drawBoard();
}

function movePiece(from, to) {
  if (colorMap[from] !== turn || colorMap[to] === turn) return;
  if (!isValidMove(from, to)) return;
  const capturedPiece = pieces[to];
  if (capturedPiece !== '') {
    if (turn === 'white') whiteScore++;
    else blackScore++;
    if (capturedPiece === '♔' || capturedPiece === '♚') {
      pieces[to] = pieces[from];
      colorMap[to] = colorMap[from];
      pieces[from] = '';
      colorMap[from] = '';
      drawBoard();
      updateStatus();
      document.getElementById('winner').textContent = `${turn.charAt(0).toUpperCase() + turn.slice(1)} Wins! 🎉`;
      saveScores();
      return;
    }
  }
  pieces[to] = pieces[from];
  colorMap[to] = colorMap[from];
  pieces[from] = '';
  colorMap[from] = '';
  const landedOnPowerUp = powerUpSquares.find(pu => pu.index === to);
  if (landedOnPowerUp) {
    applyPowerUp(to, landedOnPowerUp.type);
    powerUpSquares = powerUpSquares.filter(pu => pu.index !== to);
  }
  turn = turn === 'white' ? 'black' : 'white';
  suggestedMove = null;
  updateStatus();
  drawBoard();
  if (turn === 'black') {
    setTimeout(makeAIMove, 500);
  }
}

function applyPowerUp(squareIndex, type) {
  const pieceOnSquare = pieces[squareIndex];
  const pieceColor = colorMap[squareIndex];
  status.textContent = `${pieceColor.charAt(0).toUpperCase() + pieceColor.slice(1)}'s ${pieceOnSquare} triggered a ${type} power-up!`;
  switch (type) {
    case POWER_UP_TYPES.DOUBLE_MOVE:
      alert("Double Move! Select another square for this piece.");
      selected = squareIndex;
      break;
    case POWER_UP_TYPES.HEAL:
      alert("Piece is temporarily invulnerable!");
      break;
    case POWER_UP_TYPES.TELEPORT:
      alert("Teleport! Select any empty square to move this piece.");
      break;
    default:
      console.warn("Unknown power-up type:", type);
  }
}

function isValidMove(from, to) {
  const piece = pieces[from];
  const dx = to % 8 - from % 8;
  const dy = Math.floor(to / 8) - Math.floor(from / 8);
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  const isEnemy = colorMap[to] && colorMap[to] !== colorMap[from];
  switch (piece) {
    case '♙': return dx === 0 && dy === -1 && !pieces[to] || absDx === 1 && dy === -1 && isEnemy;
    case '♟': return dx === 0 && dy === 1 && !pieces[to] || absDx === 1 && dy === 1 && isEnemy;
    case '♖':
    case '♜': return (dx === 0 || dy === 0) && clearPath(from, to);
    case '♗':
    case '♝': return absDx === absDy && clearPath(from, to);
    case '♕':
    case '♛': return (dx === 0 || dy === 0 || absDx === absDy) && clearPath(from, to);
    case '♘':
    case '♞': return (absDx === 2 && absDy === 1) || (absDx === 1 && absDy === 2);
    case '♔':
    case '♚': return absDx <= 1 && absDy <= 1;
  }
  return false;
}

function clearPath(from, to) {
  const dx = Math.sign(to % 8 - from % 8);
  const dy = Math.sign(Math.floor(to / 8) - Math.floor(from / 8));
  let x = from % 8 + dx;
  let y = Math.floor(from / 8) + dy;
  while ((y * 8 + x) !== to) {
    if (pieces[y * 8 + x] !== '') return false;
    x += dx;
    y += dy;
  }
  return true;
}

function getPieceValue(piece) {
  switch (piece) {
    case '♙': case '♟': return 1;
    case '♘': case '♞': return 3;
    case '♗': case '♝': return 3;
    case '♖': case '♜': return 5;
    case '♕': case '♛': return 9;
    case '♔': case '♚': return 1000;
    default: return 0;
  }
}

function makeAIMove() {
  let validMoves = [];
  for (let from = 0; from < 64; from++) {
    if (colorMap[from] !== 'black') continue;
    for (let to = 0; to < 64; to++) {
      if (from !== to && isValidMove(from, to) && colorMap[to] !== 'black') {
        const capturedPiece = pieces[to];
        const value = getPieceValue(capturedPiece);
        validMoves.push({ from, to, value });
      }
    }
  }
  if (validMoves.length === 0) {
    document.getElementById('winner').textContent = `White Wins! (Black has no valid moves)`;
    return;
  }
  validMoves.sort((a, b) => b.value - a.value);
  const bestMoves = validMoves.filter(m => m.value === validMoves[0].value);
  const move = bestMoves[Math.floor(Math.random() * bestMoves.length)];
  movePiece(move.from, move.to);
}

function suggestMove() {
  if (turn !== 'white') return;
  let suggestions = [];
  for (let from = 0; from < 64; from++) {
    if (colorMap[from] !== 'white') continue;
    for (let to = 0; to < 64; to++) {
      if (from !== to && isValidMove(from, to) && colorMap[to] !== 'white') {
        const value = getPieceValue(pieces[to]);
        suggestions.push({ from, to, value });
      }
    }
  }
  if (suggestions.length === 0) {
    suggestedMove = null;
    alert("No valid moves available.");
    drawBoard();
    return;
  }
  suggestions.sort((a, b) => b.value - a.value);
  const best = suggestions.filter(m => m.value === suggestions[0].value);
  suggestedMove = best[Math.floor(Math.random() * best.length)];
  drawBoard();
}

updateStatus();
drawBoard();
initializePowerUps();
