const enemy = function(x, y, player, speed, c, ctx){
	this.x = x;
	this.y = y;
	this.velx = speed;
	this.vely = 2;
	this.ctx = ctx;
	this.pwidth = 60;
	this.pheight = 60;
	this.c = c;
	this.player = player;
	this.spriteAniCounter = 0;
}

enemy.prototype.update = function(){
	if(this.y<=this.pheight/2 || this.y>=this.c.height-this.pheight/2)this.vely = -this.vely;
	this.y += this.vely;
	this.x -= this.velx; 
	this.spriteAniCounter += 0.1;

	
}

enemy.prototype.render = function(){

	var frameWidth = this.player.width/10;
	var frameHeight = this.player.height/4;
	
	

	if(this.vely>0)
		var walkingMod = Math.floor(this.spriteAniCounter) % 3;
	else 
		var walkingMod = 3+ Math.floor(this.spriteAniCounter) % 3;

	this.ctx.drawImage(this.player,
	walkingMod*frameWidth, 0, frameWidth, frameHeight, 
	this.x-25, this.y-25, this.pwidth, this.pheight);
	
	// this.ctx.drawImage(this.player, this.x-25, this.y-25, this.pwidth, this.pheight);

}