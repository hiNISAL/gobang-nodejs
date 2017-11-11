const HORIZONTAL_SIZE = 10;
const VERTICAL_SIZE = 10;

class Gobang {
  constructor() {
    this.HORIZONTAL_SIZE = HORIZONTAL_SIZE;
    this.VERTICAL_SIZE = VERTICAL_SIZE;

    this.players = [];
    this.checkerBoard = [];
    this.colorList = ['white', 'black'];
    this.gaming = false;
    this.turn = 'black';

    this.resetList = [];
  }
  
  /**
   * 创建玩家
   * @param {*} socket 
   */
  createPlayer(socket) {
    let playerCount = this.players.length;
    if (playerCount >= 2) return false;

    let player = {
      socket: socket,
      color: this.colorList.pop()
    }

    this.players.push(player);
    socket.player = player;

    return true;
  }

  /**
   * 获取人数
   */
  getPlayerNumber() {
    return this.players.length;
  }

  /**
   * 初始化棋盘
   */
  init() {
    for(var i = -5; i < this.HORIZONTAL_SIZE + 5; i ++){
      this.checkerBoard[i] = [];
      for(var j = -5; j < this.VERTICAL_SIZE + 5; j ++){
        this.checkerBoard[i][j] = {
          state: false,
          type: true
        }
      }
    }
    
    this.gaming = true;
  }

  /**
   * 离开房间
   * @param {*} socket 
   */
  leftGame(socket) {
    if (!socket.player) return;

    for(let i = 0; i < this.players.length; i ++) {
      if (this.players[i].color === socket.player.color) {
        this.colorList.push(this.players[i].color);
        this.players.splice(i, 1);
        break;
      }
    }
  }

  /**
   * 逆转颜色
   */
  toggleTurn() {
    this.turn = (this.turn === 'black' ? 'white' : 'black');
  }

  putChess(x, y) {
    this.checkerBoard[x][y].state = true;
    this.checkerBoard[x][y].type = this.turn;
    this.toggleTurn();
  }

  gameover(x, y) {
    if (!this.checkAllDirectionChess(x, y)) return false;
    return true;
  }

  checkAllDirectionChess(x, y) {
    // 左上到右下
    if (this.checkOneLineChess(x - 5, y - 5, 1, 1, this.checkerBoard[x][y].type)) return true;
    // 从上到下
    if (this.checkOneLineChess(x, y - 5, 0, 1, this.checkerBoard[x][y].type)) return true;
    // 从右上到坐下
    if (this.checkOneLineChess(x + 5, y - 5, -1, 1, this.checkerBoard[x][y].type)) return true;
    // 从左到右
    if (this.checkOneLineChess(x - 5, y, 1, 0, this.checkerBoard[x][y].type)) return true;

    return false;
  }

  checkOneLineChess(tpx, tpy, xPlus, yPlus, type) {
    let count = 0;
    for (let i = 0; i < 10; i++) {
      if (this.checkerBoard[tpx][tpy].type === type && this.checkerBoard[tpx][tpy].state === true) {
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

  reset(color) {
    if(!this.resetList.indexOf(color)) return false;;
    this.resetList.push(color);
    if(this.resetList.length >= 2) {
      this.resetList = [];
      this.init();
      return true;
    }
    return false;
  }
}

module.exports = Gobang;
