const app = require('http').createServer();
const io  = require('socket.io')(app);
const Gobang = require('./lib/base');

app.listen(3000, '127.0.0.1');

let gobang = new Gobang();

io.on('connection', socket => {
  if (gobang.createPlayer(socket)) {
    if (gobang.getPlayerNumber() === 2) {
      gobang.init();
      boardcast();
    }
    socket.emit('conn', {
      color: socket.player.color, 
      num: gobang.getPlayerNumber(),
      hs: gobang.HORIZONTAL_SIZE,
      vs: gobang.VERTICAL_SIZE
    });    
  } else {
    socket.emit('conn', {color: 'null', hs: gobang.HORIZONTAL_SIZE, vs: gobang.VERTICAL_SIZE});   
    boardcast();
  }

  socket.on('setCheckerBoard', () => {
    boardcast();
  });

  socket.on('disconnect', () => {
    gobang.leftGame(socket);
    let playerName = !!socket.player
      ? socket.player.color
      : '游客';
    console.log(`${playerName}离开了`);
  });

  socket.on('putchess', (x, y) => {
    x = parseInt(x);
    y = parseInt(y);
    gobang.putChess(x, y);
    boardcast();
    if (gobang.gameover(x, y)) io.sockets.emit('gameover', gobang.turn === 'black' ? 'white' : 'black');
  });

  socket.on('reset', () => {
    if (!socket.player) return;
    console.log('reset');
    
    if (gobang.reset(socket.player.color)) boardcast();
  });
});

function boardcast() {
    io.sockets.emit('getCheckerBoard', {
      checkerboard: gobang.checkerBoard,
      turn: gobang.turn
    });
}
