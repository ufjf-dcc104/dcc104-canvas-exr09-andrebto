function Sprite(){
  this.x = 0;
  this.y = 0;
  this.vx = 0;
  this.vy = 100;
  this.g = 300;
  this.SIZE = 16;
  this.pose = 0;
  this.frame = 0;
  this.poses = [
    {row: 11, col:1, frames:8, v: 4},
    {row: 10, col:1, frames:8, v: 4},
    {row: 9, col:1, frames:8, v: 4},
    {row: 8, col:1, frames:8, v: 4},
    {row: 11, col:0, frames:1, v: 4},
  ];
  this.images = null;
  this.imgKey = "pc";
  this.w = 0;
  this.h = 0;
  this.time = 90000;
  this.points = 0;
  this.alive = true;
}

Sprite.prototype.desenhar = function (ctx) {
  this.desenharQuadrado(ctx);
  this.desenharPose(ctx);
}

Sprite.prototype.desenharQuadrado = function (ctx) {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  //ctx.fillRect(-this.SIZE/2, -this.SIZE/2, this.SIZE, this.SIZE);
  ctx.arc(0, 0, this.SIZE/2, 0, 2*Math.PI);
  ctx.fill();
  ctx.closePath;
  ctx.restore();
};

Sprite.prototype.desenharPose = function (ctx) {
  ctx.save();
  ctx.translate(this.x, this.y);
  this.images.drawFrame(ctx,
    this.imgKey,
    this.poses[this.pose].row,
    Math.floor(this.frame),
    -32,-56, 64
  );
  ctx.restore();
};

Sprite.prototype.mover = function (map, dt) {
  this.gx = Math.floor(this.x/map.SIZE);
  this.gy = Math.floor(this.y/map.SIZE);
  if((this.vx>0 && map.cells[this.gy][this.gx+1]==1)||(this.vx>0 && map.cells[this.gy][this.gx+1]==4)){
    this.x += Math.min((this.gx+1)*map.SIZE - (this.x+this.SIZE/2),this.vx*dt);
  } else if((this.vx <0 && map.cells[this.gy][this.gx-1]==1)||(this.vx <0 && map.cells[this.gy][this.gx-1]==4)){
      this.x += Math.max((this.gx)*map.SIZE - (this.x-this.SIZE/2),this.vx*dt);
    }
  else {
    this.x = this.x + this.vx*dt;
  }
  console.log(this.vy);
  incolision = false;
  if((this.vy >0 && map.cells[this.gy+1][this.gx]==1)||(this.vy >0 && map.cells[this.gy+1][this.gx]==4)){
    this.vy = this.vy + this.g*dt;
    this.y += Math.min((this.gy+1)*map.SIZE - (this.y+this.SIZE/2),this.vy*dt);
    incolision = true;
  } else if((this.vy<0 && map.cells[this.gy-1][this.gx]==1)||(this.vy<0 && map.cells[this.gy-1][this.gx]==4)){
      this.vy = -this.vy;
      this.y += Math.max((this.gy)*map.SIZE - (this.y-this.SIZE/2),this.vy*dt);
    }
  else {
    this.vy = this.vy + this.g*dt;
    this.y = this.y + this.vy*dt;
  }
  
  if(map.cells[this.gy][this.gx] == 3) {
	map.cells[this.gy][this.gx] = 0;
	this.points = this.points + 1;	
  }

  if(map.cells[this.gy+1][this.gx] == 4) {
	if(life > 0)
		life = life - 1;	
  }
	
  if(this.vx != 0 || this.vy != 0)
  	this.frame += this.poses[this.pose].v*dt;
  if(this.frame>this.poses[this.pose].frames-1){
    this.frame = 0;
  }
};

Sprite.prototype.perseguir = function (alvo) {
    var dx = alvo.x - this.x;
    var dy = alvo.y - this.y;
    var h = Math.sqrt(dx*dx+dy*dy);
    this.vx = 50*dx/h;
    this.vy = 50*dy/h;
    if(this.vy<0) this.pose = 3;
    if(this.vy>0) this.pose = 4;
    if(this.vx>0) this.pose = 0;
    if(this.vx<0) this.pose = 2;
};
