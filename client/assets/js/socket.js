var socket = io('ws://localhost:3000');
var color = '';
var $mycolor = document.querySelector('#my-color');
var $info = document.querySelector('#info');
var $reset = document.querySelector('#reset');
var gaming = false;

var cvs = document.getElementById('cvs');
var ctx = cvs.getContext('2d');

var GRID_SIZE = 40;
var HORIZONTAL_SIZE = null;
var VERTICAL_SIZE = null;

var checkerBoard = [];
var turn = '';

socket.on('conn', function (data) {
  color = data.color;
  $mycolor.innerText = color === 'null' ? '游客' : color;
  // 设置画板宽高
  HORIZONTAL_SIZE = data.hs;
  VERTICAL_SIZE = data.vs;

  cvs.width = HORIZONTAL_SIZE * GRID_SIZE;
  cvs.height = VERTICAL_SIZE * GRID_SIZE;

  if (data.num === 2) init();

  // console.log(data);
});

socket.on('getCheckerBoard', function (data) {
  checkerBoard = data.checkerboard;
  turn = data.turn;
  drawCheckerBoard();

  $info.innerText = '轮到 ' + (turn === 'black' ? '黑棋' : '白棋') + '落子';

  if (!cvs.onclick) cvs.onclick = putChess;
  // console.log(data);
});

socket.on('gameover', function (data) {
  $info.innerText = (data === 'black' ? '黑棋' : '白棋') + '胜';
  cvs.onclick = null;
});


function init() {
  drawCheckerBoard();
  if (color === 'null') return;
  cvs.onclick = putChess;
  $reset.onclick = function () {
    socket.emit('reset');
  }
}

function drawCheckerBoard() {
  for (var i = 0; i < HORIZONTAL_SIZE; i++) {
    for (var j = 0; j < VERTICAL_SIZE; j++) {
      ctx.beginPath();
      ctx.strokeStyle = '#000';
      ctx.fillStyle = '#ffc0cb';
      ctx.fillRect(i * GRID_SIZE, j * GRID_SIZE, GRID_SIZE, GRID_SIZE);
      ctx.strokeRect(i * GRID_SIZE, j * GRID_SIZE, GRID_SIZE, GRID_SIZE);
      ctx.closePath();
    }
  }

  for (var i = 0; i < HORIZONTAL_SIZE; i++) {
    for (var j = 0; j < VERTICAL_SIZE; j++) {
      if (checkerBoard[i][j].state) {
        drawArc(i, j);
      }
    }
  }
}

/**
 * 放置棋子事件
 * @param {*} e 
 */
function putChess(e) {
  if (turn !== color) return;

  var x = e.pageX - cvs.offsetLeft;
  var y = e.pageY - cvs.offsetTop;

  x = parseInt(x / GRID_SIZE);
  y = parseInt(y / GRID_SIZE);

  if (checkerBoard[x][y].state) return;

  socket.emit('putchess', x, y);
}

/**
 * 绘制棋子
 * @param {*} x 
 * @param {*} y 
 */
function drawArc(x, y) {
  ctx.beginPath();
  ctx.fillStyle = (checkerBoard[x][y].type === 'white' ? '#fff' : '#000');
  ctx.arc(x * GRID_SIZE + GRID_SIZE / 2, y * GRID_SIZE + GRID_SIZE / 2, (GRID_SIZE / 2) * 0.8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
}