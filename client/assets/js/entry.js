var GRID_SIZE = 40;
var HORIZONTAL_SIZE = 10;
var VERTICAL_SIZE = 10;

var cvs = document.getElementById('cvs');
var ctx = cvs.getContext('2d');

var checkerBoard = [];
var whiteTrun = true;

cvs.width = HORIZONTAL_SIZE * GRID_SIZE;
cvs.height = VERTICAL_SIZE * GRID_SIZE;

document.getElementById('restart').onclick = function(){
  init();
}

init();
