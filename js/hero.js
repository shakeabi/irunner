const hero = function(x, y, player, ctx){
	this.x = x;
	this.y = y;
	this.speed = 4;
	this.ctx = ctx;
	this.score = 0;
	this.pwidth = 50;
	this.pheight = 50;
	this.player = player;
	this.hp = 100;
	this.hitx = false;
	this.hity = false;
	this.shield = 10000;
	this.shieldActive = false;
	this.shieldimg = new Image();
	this.shieldimg.src = 'assets/img/shield1.png'
}

hero.prototype.update = function(mouseo, bgSpeed){
	//basic mode
	// this.x = mouseo.mouseX;
	// this.y = mouseo.mouseY;
	if(this.shield>20000)this.shield=20000;
	if(this.shield<=0)this.shieldActive=false;
	if(this.shield>0 && this.shieldActive == true)this.shield-=10;

	if(this.hp>200)this.hp=200;


	this.x += (mouseo.mouseX - this.x)>this.speed ? this.speed : ((mouseo.mouseX - this.x)<-this.speed ? -(bgSpeed) : (mouseo.mouseX - this.x));
    this.y += (mouseo.mouseY - this.y)>this.speed ? this.speed : ((mouseo.mouseY - this.y)<-this.speed ? -this.speed : (mouseo.mouseY - this.y));

    if(this.x<30)deep.hp=0;//spiked
}

hero.prototype.render = function(){
	
	this.ctx.drawImage(this.player, this.x-25, this.y-25, this.pwidth, this.pheight);
	if(this.shieldActive == true)
	this.ctx.drawImage(this.shieldimg, this.x-50, this.y-50, this.pwidth+50, this.pheight+50);

}