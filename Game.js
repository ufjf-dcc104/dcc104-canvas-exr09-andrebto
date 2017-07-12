var canvas;
var ctx;
var map;
var pc;
var dt;
var images;
var images_bomb;
var anterior = 0;
var frame = 0;
var running = true;
var life = 100;
var time = 2000;
var timeexplode = 300;
var incolision = false;
function init(){
  canvas = document.getElementsByTagName('canvas')[0];
  canvas.width = 520;
  canvas.height = 480;
  ctx = canvas.getContext("2d");
  images = new ImageLoader();
  images_bomb = new ImageLoader();
  images.load("pc","pc.png");
  images_bomb.load("bomb","bomb.png");
  map = new Map(Math.floor(canvas.height/40), Math.floor(canvas.width/40));
  map.images = images;
  map.setCells([
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,3,1,1,0,0,3,0,3,0,1],
    [1,1,1,1,1,1,0,0,3,0,3,0,1],
    [1,0,0,0,0,0,0,0,1,4,1,1,1],
    [1,3,3,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,0,0,0,0,1],
    [1,0,0,0,3,3,0,0,0,0,0,3,1],
    [1,0,0,0,0,0,0,0,1,1,4,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,4,1,1,1,1,1,1,1,1,1,1],
  ]);
  pc = new Sprite();
  pc.x = 50;
  pc.y = 320;
  time_bar = new Sprite();
  pc.images = images;
  initControls();
  requestAnimationFrame(passo);
}


function passo(t){
	if(running){
		dt = (t-anterior)/1000;
		requestAnimationFrame(passo);
	  //ctx.rotate(Math.PI/4);
		ctx.clearRect(0,0, canvas.width, canvas.height);
		if((time <= 0) || (life <= 0) || pc.points == 10)
			running = false;
		pc.mover(map, dt);
		map.mover(dt);
		map.desenhar(ctx);
		pc.desenhar(ctx);
		ctx.font = "15px Arial";
		ctx.fillStyle = "white";
		ctx.fillText("Points: "+pc.points,40,20);
		ctx.fillText("Lifes: "+life,120,20);
		ctx.fillText("Tempo: "+time,300,20);
		anterior = t;
	}
	else{
		ctx.clearRect(0,0, canvas.width, canvas.height);
		ctx.font = "15px Arial";
		map.desenhar(ctx);
		ctx.fillStyle = "white";
		if(life == 0 || time <= 0)
			ctx.fillText("Você perdeu",100,200);
		else {
			ctx.fillText("Você ganhou:",150,200);
			ctx.fillText(pc.points+" points / Tempo: "+time,130,220);
		}	
	}
}


function initControls(){
  addEventListener('keydown', function(e){
    switch (e.keyCode) {
      case 37:
        pc.vx = -100;
        pc.pose = 2;
        e.preventDefault();
        break;
      case 39:
        pc.vx = 100;
        pc.pose = 0;
        e.preventDefault();
        break;
      case 16:
	if(incolision)
		pc.vy = -200;
      default:

    }
  });
  addEventListener('keyup', function(e){ 
    switch (e.keyCode) {
      case 37:
      case 39:
        pc.vx = 0;
        pc.pose = 4;
        break;
      default:

    }
  });
}
