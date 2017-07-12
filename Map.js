function Map(rows, collumns) {
  this.SIZE = 32;
  this.bombs = [];
  this.cells = [];
  this.powerups = [];
  for (var r = 0; r < rows; r++) {
    this.cells[r] = [];
    for (var c = 0; c < collumns; c++) {
      this.cells[r][c] = 0;
    }
  }
}

Map.prototype.desenhar = function (ctx) {
  for (var r = 0; r < this.cells.length; r++) {
    for (var c = 0; c < this.cells[0].length; c++) {
      if(this.cells[r][c]==1){
        ctx.fillStyle = "brown";
        ctx.fillRect(c*this.SIZE, r*this.SIZE, this.SIZE, this.SIZE);
      }
      else if(this.cells[r][c]==2) {
      	ctx.fillStyle = "darkgreen";
		ctx.fillRect(c*this.SIZE, r*this.SIZE, this.SIZE, this.SIZE);
	  }
	  else if(this.cells[r][c]==3) {
		ctx.fillStyle = "black";
		ctx.fillRect(c*this.SIZE, r*this.SIZE, this.SIZE, this.SIZE);
		ctx.fillStyle = "yellow";
		ctx.fillRect(c*this.SIZE+this.SIZE/4, r*this.SIZE+this.SIZE/4, this.SIZE/2, this.SIZE/2);
	  }
	  else if(this.cells[r][c]==4) {
		ctx.fillStyle = "brown";
		ctx.fillRect(c*this.SIZE, r*this.SIZE, this.SIZE, this.SIZE);
		ctx.fillStyle = "orange";
		ctx.fillRect(c*this.SIZE, r*this.SIZE, this.SIZE, this.SIZE/4);
	  }
	  else if(this.cells[r][c]==5) {
		ctx.fillStyle = "darkgreen";
		ctx.fillRect(c*this.SIZE, r*this.SIZE, this.SIZE, this.SIZE);
		ctx.fillStyle = "blue";
		ctx.fillRect(c*this.SIZE+this.SIZE/4, r*this.SIZE+this.SIZE/4, this.SIZE/2, this.SIZE/2);
	  }
	  else {
      		ctx.fillStyle = "black";
		ctx.fillRect(c*this.SIZE, r*this.SIZE, this.SIZE, this.SIZE);
      }
    }
  }
};

Map.prototype.setCells = function (newCells) {
  for (var i = 0; i < newCells.length; i++) {
    for (var j = 0; j < newCells[i].length; j++) {
	this.cells[i][j] = newCells[i][j];
    }
  }
};

function byTime(bomb_a, bomb_b) {
    return bomb_a.time > bomb_b.time;
}

Map.prototype.mover = function (dt) {
	var i = 0;
	this.bombs.sort(byTime);
	while (i < this.bombs.length){
		var gx = Math.floor(this.bombs[i].x/this.SIZE);
		var gy = Math.floor(this.bombs[i].y/this.SIZE);
		this.bombs[i].time = this.bombs[i].time - 1;
		if(this.bombs[i].time > timeexplode && this.bombs[i].time <= 2*timeexplode) {
			if(this.cells[gy][gx] == 4) {
				this.bombs[i].time = timeexplode;
			}
			else{
				this.cells[gy][gx] = 3;
				i++;
			}
		}
		else if(this.bombs[i].time <= 0) {
			var bombs_power = this.bombs[i].power;
			this.bombs.splice(i,1);
			var min_x = Math.max(0,gx-bombs_power);
			var max_x = Math.min(Math.floor(canvas.width/40),gx+bombs_power);
			var min_y = Math.max(0,gy-bombs_power);
			var max_y = Math.min(Math.floor(canvas.width/40),gy+bombs_power);
			for(var k = gy; k >= min_y; --k){
				if(this.cells[k][gx] == 1)
					break;
				else {
					this.cells[k][gx] = 2;
					var index = (Math.floor(canvas.width/40)*k) + gx;
					var findindex = this.powerups.indexOf(index);
					if(findindex == -1)
						this.powerups.push(index);
				}
			}
			for(var k = gy + 1; k <= max_y; ++k){
				if(this.cells[k][gx] == 1)
					break;
				else {
					this.cells[k][gx] = 2;
					var index = (Math.floor(canvas.width/40)*k) + gx;
					var findindex = this.powerups.indexOf(index);
					if(findindex == -1)
						this.powerups.push(index);
				}
			}
			for(var k = gx; k >= min_x; --k){
				if(this.cells[gy][k] == 1)
					break;
				else {
					this.cells[gy][k] = 2;
					var index = (Math.floor(canvas.width/40)*gy) + k;
					var findindex = this.powerups.indexOf(index);
					if(findindex == -1)
						this.powerups.push(index);
				}
			}
			for(var k = gx + 1; k <= max_x; ++k){
				if(this.cells[gy][k] == 1)
					break;
				else {
					this.cells[gy][k] = 2;
					var index = (Math.floor(canvas.width/40)*gy) + k;
					var findindex = this.powerups.indexOf(index);
					if(findindex == -1)
						this.powerups.push(index);
				}
			}
			/*for(var k = min_y; k <= max_y; ++k){
				if(this.cells[k][gx] != 1)
					this.cells[k][gx] = 2;
			}
			for(var j = min_x; j <= max_x; ++j) {
				if(this.cells[gy][j] != 1) {
					this.cells[gy][j] = 2;
				}
			}*/
			//retirar circulos de colisao da bomba
		}
		else {
			//calcular a colisao bolada dos blocos
			this.bombs[i].time = this.bombs[i].time - 1;
			var min_x = Math.max(0,gx-this.bombs[i].power);
			var max_x = Math.min(Math.floor(canvas.width/40),gx+this.bombs[i].power);
			var min_y = Math.max(0,gy-this.bombs[i].power);
			var max_y = Math.min(Math.floor(canvas.width/40),gy+this.bombs[i].power);
			for(var k = gy; k >= min_y; --k){
				if(this.cells[k][gx] == 1)
					break;
				else
					this.cells[k][gx] = 4;
			}
			for(var k = gy + 1; k <= max_y; ++k){
				if(this.cells[k][gx] == 1)
					break;
				else
					this.cells[k][gx] = 4;
			}
			for(var k = gx; k >= min_x; --k){
				if(this.cells[gy][k] == 1)
					break;
				else
					this.cells[gy][k] = 4;
			}
			for(var k = gx + 1; k <= max_x; ++k){
				if(this.cells[gy][k] == 1)
					break;
				else
					this.cells[gy][k] = 4;
			}
			/*for(var k = min_y; k <= max_y; ++k){
				if(this.cells[k][gx] != 1)
					this.cells[k][gx] = 4;
				else
			}
			for(var j = min_x; j <= max_x; ++j) {
				if(this.cells[gy][j] != 1) {
					this.cells[gy][j] = 4;
				}
			}*/
			i++;
		}
	}
	if(time <= 0){
		time = 4000;
		if(this.powerups.length != 0) {
			var rand =  Math.floor((Math.random() * this.powerups.length) + 1);
			rand = rand - 1;
			var y = Math.floor(this.powerups[rand] / Math.floor(canvas.width/40));
			var x = this.powerups[rand] % Math.floor(canvas.width/40);
			this.cells[y][x] = 5;	
		}
	}
	else {
		time = time - 1;
	}
};
