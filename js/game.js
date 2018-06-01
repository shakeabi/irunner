/*
.Started
.init setup
.controlled wall freq using set timeout
*/


    
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var cwidth = canvas.width;
var cheight = canvas.height;

var bgSpeed = 2;
var wallSpeed = 2;
var count = 0;
var playerWidth = 50;
var playerHeight = 50;	


const bg = new Image();
const wallimg = new Image();
const spikey = new Image();
const player = new Image();
const spawn = new Image();

bg.src = 'assets/img/bgtilen.jpg';
wallimg.src = 'assets/img/walltile.jpg';
spikey.src = 'assets/img/spikey.png';
player.src = 'assets/img/player.png';
spawn.src = 'assets/img/enemy.png';

const env = new environment(canvas, bg, ctx);
const walls = [];
// const enemies = [];
var curWalls = [];
const deep = new hero(0, 0, player, ctx);
var mouse = {mouseX:50,mouseY:50};

setInterval(function(){
	var wallSet = generateWall();
	walls.push(wallSet.top, wallSet.bottom);
	// var enemy = generateEnemy();
	// enemies.push(enemy);
	

},5000);

///////////////////////////////////////////////
//real one

// var genwall = function(){
// 	var wallSet = generateWall();
// 	walls.push(wallSet.top, wallSet.bottom);
// 	++count;
// 	console.log(count);
// 	if(count%2 == 0 && wallSpeed<20){
	
// 		wallSpeed++;;
// 		bgSpeed++;
	
// 	}
// 		console.log(wallSpeed);

// 	setTimeout(genwall, Math.floor(20000/wallSpeed));


// }
// setTimeout(genwall, Math.floor(10000/wallSpeed));

/////////////////////////////////////////////////////

canvas.onmousemove = function(mouseTemp){
	
	
	mouse.mouseX = mouseTemp.layerX;
	mouse.mouseY = mouseTemp.layerY;


	if(mouse.mouseX<playerWidth/2)mouse.mouseX=playerWidth/2;
	if(mouse.mouseX>cwidth-playerWidth/2)mouse.mouseX=cwidth-playerWidth/2;
	if(mouse.mouseY<playerHeight/2)mouse.mouseY=playerHeight/2;
	if(mouse.mouseY>cheight-playerHeight/2)mouse.mouseY=cheight-playerHeight/2;
}

window.onload = function(){


    gameLoop();

    function gameLoop(){

        ctx.clearRect(0, 0, cwidth, cheight);
        env.update(bgSpeed);
        env.render();
        walls.forEach(function(wall){
        	wall.update(wallSpeed);
	        wall.render();
        });
       
        walls.forEach(function(wall){
        	console.log(mouse);
        	mouse = wall.entityCollision(deep, mouse);

        });

        deep.update(mouse);
        deep.render();

        ctx.drawImage(spikey, 0, 0, 83, 1120, 0, 0, 40, cheight);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Georgia';
        ctx.fillText('Score:'+deep.score, cwidth-100, 25);
        
        if(walls.length!=0 && walls[0].xpos <= -76){//76 is wall width and this makes sure only walls on screen exist
        	walls.shift();
        	walls.shift();
        	deep.score++;
        }
       	

        window.requestAnimationFrame(gameLoop);
    }

    

}

function generateWall(){
	var lengthTop = Math.round(Math.random()*310+100);
	var lengthBottom = 410 - lengthTop;  
	var returnData = {};
	returnData.top = new wall(wallimg, cwidth, -5, lengthTop, wallSpeed, 0, ctx);
	returnData.bottom = new wall(wallimg, cwidth, cheight+5-lengthBottom, lengthBottom, wallSpeed, 1, ctx);
	return returnData;
}

// function generateEnemy(){
// 	var randx = Math.round(Math.random()*walls[walls.length-1].ypos-20 + walls[walls.length-2].ypos + walls[walls.length-2].thickness + 20);
// 	var randy = Math.round(Math.random()*(cheight-25)+25);  /////////////////////////////////////////////////////////////////////////////////////////////////////////////change it accordingly
// 	var returnData = new enemy(randx, randy, spawn, canvas, ctx);
// }




//define all variables



//images



canvas.setAttribute('tabindex','0');
canvas.focus();