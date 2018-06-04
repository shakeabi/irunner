const hero = function(x, y, player, ctx){
	this.x = x;
	this.y = y;
	this.speed = 4;
	this.ctx = ctx;
	this.score = 0;
	this.pwidth = 70;
	this.pheight = 70;
	this.player = player;
	this.hp = 100;
	this.shield = 10000;
	this.shieldActive = false;
	this.shieldimg = new Image();
	this.shieldimg.src = 'assets/img/shield1.png';
	this.angle = 0;
	this.spriteAniCounter = 0;
}

hero.prototype.update = function(mouseo, bgSpeed){
	//basic mode
	// this.x = mouseo.mouseX;
	// this.y = mouseo.mouseY;
	if(this.shield>10000)this.shield=10000;
	if(this.shield<=0)this.shieldActive=false;
	if(this.shield>0 && this.shieldActive == true)this.shield-=25;

	if(this.hp>100)this.hp=100;

	//if((mouseo.mouseY - this.y)!=0 || (mouseo.mouseX - this.x)!=0){
	this.spriteAniCounter+=0.2;
	//}


	this.x += (mouseo.mouseX - this.x)>this.speed ? this.speed : ((mouseo.mouseX - this.x)<-this.speed ? -(bgSpeed) : (mouseo.mouseX - this.x));
    this.y += (mouseo.mouseY - this.y)>this.speed ? this.speed : ((mouseo.mouseY - this.y)<-this.speed ? -this.speed : (mouseo.mouseY - this.y));

    var tan = Math.atan((mouseo.mouseY - this.y)/(mouseo.mouseX - this.x));
    if((mouseo.mouseY - this.y)>0 && (mouseo.mouseX - this.x)<0) tan += Math.PI;
    if((mouseo.mouseY - this.y)<0 && (mouseo.mouseX - this.x)<0) tan += Math.PI;
    if((mouseo.mouseY - this.y)<0 && (mouseo.mouseX - this.x)>0) tan += 2*Math.PI;
    this.angle = tan/Math.PI*180;

    if(this.x<30)deep.hp=0;//spiked
}

hero.prototype.render = function(){
	var frameWidth = this.player.width/3;
	var frameHeight = this.player.height/4;
	
	
    var directionMod = 3;	//draw right
	if(this.angle >= 45 && this.angle < 135)	//down
		directionMod = 2;
	else if(this.angle >= 135 && this.angle < 225)	//left
		directionMod = 1;
	else if(this.angle >= 225 && this.angle < 315)	//up
		directionMod = 0;

	var walkingMod = Math.floor(this.spriteAniCounter) % 3;

	this.ctx.drawImage(this.player,
	walkingMod*frameWidth, directionMod*frameHeight, frameWidth, frameHeight, 
	this.x-25, this.y-25, this.pwidth, this.pheight);

	if(this.shieldActive == true)
	this.ctx.drawImage(this.shieldimg, this.x-50, this.y-50, this.pwidth+50, this.pheight+50);

}