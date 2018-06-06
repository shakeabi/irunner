const bullet = function(x, y, spdX, spdY, ctx){
	this.x = x;
	this.y = y;
	this.spdX = spdX;
	this.spdY = spdY;
	this.bwidth = 40;
	this.bheight = 40;
	this.ctx = ctx;
	this.bulletimg = new Image();
	this.bulletimg.src = 'assets/img/spell.png';
}

bullet.prototype.update = function(){
	this.x -= this.spdX;
	this.y -= this. spdY;
}

bullet.prototype.render = function(){

	ctx.drawImage(this.bulletimg, this.x-this.bwidth/2, this.y-this.bheight/2, this.bwidth, this.bheight);

}