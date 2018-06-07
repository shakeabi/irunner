const wall = function(wall, xpos, ypos, length, speed, pos, ctx){
	this.xpos = xpos;
	this.ypos = ypos;
	this.ctx = ctx;
	this.length = length;
	this.speed = speed;
	this.wall = wall;
	this.thickness =56;
	this.pos = pos; // 0 is top, 1 is bottom
}

wall.prototype.update = function(wallS){
	this.speed = wallS;
	this.xpos -= this.speed;
}

wall.prototype.render = function(){
		this.ctx.save();

		this.ctx.fillStyle = "#000000";
		this.ctx.fillRect(this.xpos, this.ypos, this.thickness, this.length);
		this.ctx.drawImage(this.wall, 0, 0, 98, this.length-3, this.xpos+3, this.ypos+3, this.thickness-6, this.length-6);


		this.ctx.restore();
}

wall.prototype.entityCollision = function(entity, mouse){
//Basic
	// switch(this.pos){
	// 	case 0:{	if(mouse.mouseX+entity.pwidth/2>=this.xpos && mouse.mouseX-entity.pwidth/2<this.xpos+this.thickness && mouse.mouseY<=this.ypos+this.length){
	// 					mouse.mouseY = entity.y;
	// 				}

	// 				if(mouse.mouseX+entity.pwidth/2>=this.xpos && mouse.mouseX-entity.pwidth/2<this.xpos+this.thickness-10 && mouse.mouseY>=this.ypos && mouse.mouseY+entity.pheight<=this.ypos+this.length ){
	// 					mouse.mouseX = this.xpos-entity.pwidth/2;

	// 				}
				
	// 				return mouse;
	// 			}
	// 			break;

	// 	case 1:{	if(mouse.mouseX+entity.pwidth/2>=this.xpos && mouse.mouseX-entity.pwidth/2<this.xpos+this.thickness && mouse.mouseY+entity.pheight/2>=this.ypos){
	// 					mouse.mouseY = entity.y;
	// 				}

	// 				if(mouse.mouseX+entity.pwidth/2>=this.xpos && mouse.mouseX-entity.pwidth/2<this.xpos+this.thickness-10 && mouse.mouseY>=this.ypos && mouse.mouseY+entity.pheight<=this.ypos+this.length ){
	// 					mouse.mouseX = this.xpos-entity.pwidth/2;

	// 				}
				
	// 				return mouse;
	// 			} 
	// 			break;

	// }

//Hacker Mode
	switch(this.pos){
		case 0:{	if(entity.x+entity.pwidth/2>=this.xpos+5 && entity.x-entity.pwidth/2<this.xpos+this.thickness && entity.y<=this.ypos+this.length){
						mouse.mouseY = this.ypos + this.length + entity.pheight/2 +1;
					}

					if(entity.x+entity.pwidth/2>=this.xpos && entity.x-entity.pwidth/2<this.xpos+this.thickness-10 && entity.y>=this.ypos && entity.y<=this.ypos+this.length ){
						mouse.mouseX = this.xpos - entity.pwidth/2 - 5;
					
					}
				
					return mouse;
				}
				break;

		case 1:{	if(entity.x+entity.pwidth/2>=this.xpos+5 && entity.x-entity.pwidth/2<this.xpos+this.thickness && entity.y+entity.pheight/2>=this.ypos){
						mouse.mouseY = this.ypos - entity.pheight/2 -1;
					}

					if(entity.x+entity.pwidth/2+5>=this.xpos && entity.x-entity.pwidth/2<this.xpos+this.thickness-10 && entity.y+entity.pwidth/2>=this.ypos && entity.y+entity.pheight<=this.ypos+this.length ){
						mouse.mouseX = this.xpos - entity.pwidth/2 - 1;

					}
				
					return mouse;
				}
				break;

	}

	return mouse;

	
}