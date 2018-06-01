const upgrade = function(x, y, speed, type, c, ctx){
	this.x = x;
	this.y = y;
	this.vel = speed;
	this.ctx = ctx;
	this.pwidth = 40;
	this.pheight = 40;
	this.c = c;
	this.category = type;// 0-health, 1-shield, 2-speed reset
	this.img = new Image();
	switch(this.category){
		case 0: 	this.img.src = 'assets/img/heart.png';break;
		case 1: 	this.img.src = 'assets/img/shield.png';break;
		case 2: 	this.img.src = 'assets/img/time.png';break;
		
	}

}

upgrade.prototype.update = function(){
	
	this.x -= this.vel;
	
}

upgrade.prototype.render = function(){
	

	this.ctx.drawImage(this.img, this.x-this.pwidth/2, this.y-this.pheight/2, this.pwidth, this.pheight);

}