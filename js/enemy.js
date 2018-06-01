const enemy = function(x, y, player, speed, c, ctx){
	this.x = x;
	this.y = y;
	this.velx = speed;
	this.vely = 2;
	this.ctx = ctx;
	this.pwidth = 50;
	this.pheight = 50;
	this.c = c;
	this.player = player;
}

enemy.prototype.update = function(){
	if(this.y<=this.pheight/2 || this.y>=this.c.height-this.pheight/2)this.vely = -this.vely;
	this.y += this.vely;
	this.x -= this.velx; 

	
}

enemy.prototype.render = function(){
	
	this.ctx.drawImage(this.player, this.x-25, this.y-25, this.pwidth, this.pheight);

}