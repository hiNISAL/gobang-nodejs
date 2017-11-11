/**
 * 初始化
 */
function init() {
  // 初始化棋盘
  for (var i = -5; i < HORIZONTAL_SIZE + 5; i++) {
    checkerBoard[i] = [];
    for (var j = -5; j < VERTICAL_SIZE + 5; j++) {
      checkerBoard[i][j] = {
        state: false,
        type: true
      }
    }
  }
  drawCheckerBoard();
  cvs.onclick = putChess;
}

/**
 * 画棋盘
 */
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
}

/**
 * 绘制棋子
 * @param {*} x 
 * @param {*} y 
 */
function drawArc(x, y) {
  ctx.beginPath();
  ctx.fillStyle = (whiteTrun === true ? '#fff' : '#000');
  ctx.arc(x * GRID_SIZE + GRID_SIZE / 2, y * GRID_SIZE + GRID_SIZE / 2, (GRID_SIZE / 2) * 0.8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();

  checkerBoard[x][y].state = true;
  checkerBoard[x][y].type = whiteTrun;
  whiteTrun = !whiteTrun;
}

/**
 * 放置棋子事件
 * @param {*} e 
 */
function putChess(e) {
  var x = e.pageX - cvs.offsetLeft;
  var y = e.pageY - cvs.offsetTop;

  x = parseInt(x / GRID_SIZE);
  y = parseInt(y / GRID_SIZE);

  if (checkerBoard[x][y].state) return;

  drawArc(x, y);

  document.getElementById('tips').innerText = '现在轮到' + (whiteTrun === true ? '白棋' : '黑棋') + '落子';

  gameover(x, y);
}

/**
 * 判断游戏是否结束
 * @param {*} x 
 * @param {*} y 
 */
function gameover(x, y) {
  if (!checkAllDirectionChess(x, y)) return;

  var chess = (whiteTrun === true ? '黑色' : '白色');
  document.getElementById('tips').innerText = chess + '胜';

  cvs.onclick = null;
}

/**
 * 判断一个棋子所有方向上是否有满足五子棋胜利条件的情况
 * @param {*} x 
 * @param {*} y 
 */
function checkAllDirectionChess(x, y) {
  // 左上到右下
  if (checkOneLineChess(x - 5, y - 5, 1, 1, checkerBoard[x][y].type)) return true;
  // 从上到下
  if (checkOneLineChess(x, y - 5, 0, 1, checkerBoard[x][y].type)) return true;
  // 从右上到坐下
  if (checkOneLineChess(x + 5, y - 5, -1, 1, checkerBoard[x][y].type)) return true;
  // 从左到右
  if (checkOneLineChess(x - 5, y, 1, 0, checkerBoard[x][y].type)) return true;

  return false;
}

/**
 * 判断一个方向上是否满足五子棋胜利的条件
 * @param {*} tpx 
 * @param {*} tpy 
 * @param {*} xPlus 
 * @param {*} yPlus 
 * @param {*} type 
 */
function checkOneLineChess(tpx, tpy, xPlus, yPlus, type) {
  var count = 0;
  for (i = 0; i < 10; i++) {
    if (checkerBoard[tpx][tpy].type === type && checkerBoard[tpx][tpy].state === true) {
      count++;
      if (count >= 5) return true;
    } else {
      count = 0;
    }
    tpx += xPlus;
    tpy += yPlus;
  }
  return false;
}

// /**
//  * 判断一个棋子所有方向上是否有满足五子棋胜利条件的情况
//  * @param {*} x 
//  * @param {*} y 
//  */
// function checkAllDirectionChess(x, y){
//   var tpx = x, tpy = y;
//   var type = checkerBoard[x][y].type;
//   var count = 0;
//   var i = 0;

//   // 左上到右下
//   tpx -= 5;
//   tpy -= 5;
//   for(i = 0; i < 10; i ++){
//     if(checkerBoard[tpx][tpy].type === type && checkerBoard[tpx][tpy].state === true){
//       count ++;
//       if(count >= 5) return true;
//     }else{
//       count = 0;
//     }
//     tpx ++;
//     tpy ++;
//   }

//   // 从上到下
//   tpx = x;
//   tpy = y - 5;
//   count = 0;

//   for(i = 0; i < 10; i ++){
//     if(checkerBoard[tpx][tpy].type === type && checkerBoard[tpx][tpy].state === true){
//       count ++;
//       if(count >= 5) return true;
//     }else{
//       count = 0;
//     }
//     tpy ++;
//   }

//   // 从右上到坐下
//   tpx = x + 5;
//   tpy = y - 5;
//   count = 0;

//   for(i = 0; i < 10; i ++){
//     if(checkerBoard[tpx][tpy].type === type && checkerBoard[tpx][tpy].state === true){
//       count ++;
//       if(count >= 5) return true;
//     }else{
//       count = 0;
//     }
//     tpx --;
//     tpy ++;
//   }

//   // 从左到右
//   tpx = x - 5;
//   tpy = y;
//   count = 0;

//   for(i = 0; i < 10; i ++){
//     if(checkerBoard[tpx][tpy].type === type && checkerBoard[tpx][tpy].state === true){
//       count ++;
//       if(count >= 5) return true;
//     }else{
//       count = 0;
//     }
//     tpx ++;
//   }

//   return false;
// }

// 00 10 20 30 40 50 60
// 01 11 21 31 41 51 61
// 02 12 22 32 42 52 62  
// 03 13 23 33 43 53 63