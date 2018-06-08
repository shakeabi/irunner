/*
.Started
.init setup
.controlled wall freq using set timeout
.added enemies
.hackermode
.prevented moving back wrt bg to prevent suiciding
.added bullets
.added sprites
.added sounds
*/


    
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var cwidth = canvas.width;
var cheight = canvas.height;

var bgSpeed = 3;
var wallSpeed = 3;
var count = 0;
var playerWidth = 50;
var playerHeight = 50;	
var gameStarted = false;
var pause = false;
var level = 0;


const bg = new Image();
const wallimg = new Image();
const spikey = new Image();
const player = new Image();
const spawn = new Image();
const health = new Image();
const shieldimg = new Image();
const timeimg = new Image();
const introimg = new Image();

bg.src = 'assets/img/bgtilen.jpg';
wallimg.src = 'assets/img/walltile.jpg';
spikey.src = 'assets/img/spikey.png';
player.src = 'assets/img/player.png';
spawn.src = 'assets/img/enemys.png';
health.src = 'assets/img/heart.png';
introimg.src = 'assets/img/introimg.jpg';
shieldimg.src = 'assets/img/shield.png';
timeimg.src = 'assets/img/time.png';

const introaud = new Audio();
const bgaud = new Audio();
const gameoveraud = new Audio();
const coin = new Audio();
const hurt = new Audio();

introaud.src = 'assets/audio/intromusic.mp3';
bgaud.src = 'assets/audio/bgmusic.mp3';
gameoveraud.src = 'assets/audio/gameover.mp3';
coin.src = 'assets/audio/coin.mp3';
hurt.src = 'assets/audio/hurt.mp3';

introaud.loop = true;
bgaud.loop = true;

const env = new environment(canvas, bg, ctx);
const walls = [];
const enemies = [];
var curWalls = [];
var enemyBullets = [];
var upgradeList = [];
const deep = new hero(50, 50, player, ctx);
var mouse = {mouseX:50,mouseY:50};

// setInterval(function(){
// 	var wallSet = generateWall();
// 	walls.push(wallSet.top, wallSet.bottom);
// 	if(walls.length>=4){
//         var enemyPlayer = generateEnemy();
//         enemies.push(enemyPlayer);
    
//     }

    	

// },5000);

///////////////////////////////////////////////
//real one

var genwall = function(){//generates walls enemies bullets and upgrades
	var wallSet = generateWall();
	walls.push(wallSet.top, wallSet.bottom);
	++count;

	if(wallSpeed<2){
        wallSpeed = 2;
        bgSpeed = 2;
    }
    if(count%3 == 0 && wallSpeed<20){
	    level++;
		wallSpeed++;;
		bgSpeed++;
	
	}
    if(walls.length>=4){
        var enemyPlayer = generateEnemy();
        enemies.push(enemyPlayer);
        if(enemies.length!=0){

            var bullettemp = generateBullet();
            enemyBullets.push(bullettemp);
       
        }
    }

    if(count%4==0){
        var upgradetemp = generateUpgrade();
        upgradeList.push(upgradetemp);
    }	

    setTimeout(genwall, Math.floor(20000/wallSpeed));


}


/////////////////////////////////////////////////////

canvas.onmousemove = function(mouseTemp){
	
	
	mouse.mouseX = mouseTemp.layerX;
	mouse.mouseY = mouseTemp.layerY;


	if(mouse.mouseX<40)mouse.mouseX=playerWidth/2+40;
	if(mouse.mouseX>cwidth-playerWidth/2)mouse.mouseX=cwidth-playerWidth/2;
	if(mouse.mouseY<playerHeight/2)mouse.mouseY=playerHeight/2;
	if(mouse.mouseY>cheight-playerHeight/2)mouse.mouseY=cheight-playerHeight/2;
}

canvas.onmousedown = function(){
    deep.shieldActive = true;
}

canvas.onmouseup = function(){
    deep.shieldActive = false;
}

window.onload = function(){

    intro();

    document.addEventListener('keydown',function(e){
        if(gameStarted){
            if(e.keyCode == 80){
                if(pause == false){
                    pause = true;
                }
                else {
                    pause = false;
                    gameLoop();
                }
            }
            if(e.keyCode == 82){
                window.location.reload();
            }
        }
        else{
            if(e.keyCode == 13){
                gameStarted = true;
                setTimeout(genwall, Math.floor(10000/wallSpeed));
                gameLoop();
            }
            if(e.keyCode == 82){
                window.location.reload();
            }
        }

    });
    

}


function gameLoop(){
    stopAudio(introaud);
    bgaud.play();

    ctx.clearRect(0, 0, cwidth, cheight);

    bgEntitiesUpdate();
    inGameEntitiesUpdate();
    overlayEntitiesUpdate();
    manageTrash();

    if(pause == true){
        pauseScreen();
        return;
    }


    if(deep.hp>0)
       window.requestAnimationFrame(gameLoop);
    else
       gameOver();

}

function bgEntitiesUpdate(){
        env.update(bgSpeed);
        env.render();
        walls.forEach(function(wall){
            wall.update(wallSpeed);
            wall.render();
        });
       
        walls.forEach(function(wall){
            mouse = wall.entityCollision(deep, mouse);

        });

}

function inGameEntitiesUpdate(){
        enemies.forEach(function(enemytemp){
            enemytemp.update();
            enemytemp.render();
            if(deep.shieldActive == false){
                var isColliding = testCollisionEntity(deep,enemytemp);
                    if(isColliding){
                        deep.hp-=0.2;
                 		hurt.play();
                    }
            }

        });


        enemyBullets.forEach(function(bulletkey){
            bulletkey.update();
            bulletkey.render();
            if(deep.shieldActive == false){
                var isColliding = testCollisionEntity(deep,bulletkey);
                    if(isColliding){
                        deep.hp-=5;
                        hurt.play();
                 		enemyBullets.shift();
                    }

            }

        });

        for(var key in upgradeList){
            upgradeList[key].update();
            upgradeList[key].render();

            var isColliding = testCollisionEntity(deep,upgradeList[key]);
               if(isColliding){
                   switch(upgradeList[key].category){
                    case 0: deep.hp += 30;break;
                    case 1: deep.shield += 2000;break;
                    case 2: bgSpeed = Math.round(bgSpeed/2);
                            wallSpeed = Math.round(wallSpeed/2);
                            break;
                   }

                   upgradeList.shift();
                   coin.play();
                 
               }
        }

    
        deep.update(mouse, bgSpeed);
        deep.render();

}

function overlayEntitiesUpdate(){

        ctx.drawImage(spikey, 0, 0, 83, 1120, 0, 0, 40, cheight);
        
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = "#00000f";
        ctx.fillRect(0, 0, cwidth, 50);
        ctx.restore();
        ctx.drawImage(health, 70, 5, 40, 40);
            var my_grad=ctx.createLinearGradient(cwidth*.1, 0, cwidth*.1+150, 0);
            my_grad.addColorStop(0,"firebrick");
            my_grad.addColorStop(0.5,"gold");
            my_grad.addColorStop(1,"limegreen");
            ctx.fillStyle = "black"
            ctx.fillRect(cwidth*.1, 10, 150, 30);
            ctx.fillStyle=my_grad;
            ctx.strokeStyle = "black";
            if(deep.hp>=0){
                ctx.fillRect(cwidth*.1, 10, deep.hp*3/2, 30);
            }
            ctx.strokeRect(cwidth*.1, 10, 150, 30);

        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Georgia';
        ctx.fillText('Shield: '+ Math.round(Math.ceil(deep.shield)/10000*100) + "%", 300, 30);
        ctx.fillText('Level: '+ level, cwidth-200, 30);
        ctx.fillText('Score: '+ deep.score, cwidth-100, 30);
        
}

function manageTrash(){

        if(walls.length!=0 && walls[0].xpos <= -76){//76 is wall width and this makes sure only walls on screen exist
            walls.shift();
            walls.shift();
            deep.score++;
        }

        if(enemies.length!=0 && enemies[0].x <= -50){//25 is ghost width and this makes sure only ghosts on screen exist
            enemies.shift();
            
        }


        if(upgradeList.length!=0 && upgradeList[0].x <= -50){//25 is ghost width and this makes sure only ghosts on screen exist
            upgradeList.shift();
            
        }
        
}

function intro(){
    introaud.play();
    ctx.save();
    ctx.drawImage(introimg, 0, 0, cwidth, cheight);
    
    ctx.fillStyle = "white";
    ctx.font = "60px Georgia";
    ctx.fillText("IRunner",cwidth/2-110,60);
    ctx.font = "30px Georgia";
    ctx.fillText("Press 'p' to pause!",cwidth/2-120,115);
    ctx.fillText("Press Enter!",cwidth/2-80,150);
    ctx.fillStyle = "red";
    ctx.font = "25px Trebuchet MS";
    ctx.fillText("The dungeon is haunted by ghosts.",cwidth/2-150,190);
    ctx.fillText("Touching them will result in loss of health.",cwidth/2-200,225);
    ctx.fillText("They throw vicious spells that can damage your health very badly.",cwidth/2-320,260);
    ctx.fillText("WARNING: Their magic spells can pass through walls!",cwidth/2-250,295);
    
    ctx.fillStyle = "white";
    ctx.fillText("Collect the upgrades.",80,380);
    ctx.fillText("Left click to activate shield.",80,415);
    ctx.fillText("Shield protects you from ghosts and their spells.",80,445);
    ctx.fillText("Use shield carefully, as it is limited!",80,480);
    ctx.fillText("Crushing against spike will kill you!",80,515);
    ctx.fillText("Your score is calculated based on no. of walls you cross!",80,550);
    ctx.fillText("Upgrades",900,400);
    ctx.fillStyle = "yellow";
    ctx.fillText("Increases Health",900,445);
    ctx.fillText("Increases shield",900,480);
    ctx.fillText("Slows down time",900,515);
    ctx.drawImage(health, 1100, 420, 30, 30);
    ctx.drawImage(shieldimg, 1100, 455, 30, 30);
    ctx.drawImage(timeimg, 1100, 490, 30, 30);

 
    ctx.restore();
}

function gameOver(){
    stopAudio(bgaud);
    gameoveraud.play();
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "black";
    ctx.fillRect(100,130,1000,320);
    ctx.globalAlpha = 1;
    ctx.fillStyle= "white";
    ctx.font="40px Georgia";
    ctx.fillText("Game Over!", cwidth/2-115, 200);
    ctx.fillText("Press 'r' to Restart!" , cwidth/2-175, 300);
    ctx.fillText("Score: " + deep.score, cwidth/2-90, 400);
    ctx.restore();
}

function pauseScreen(){
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "black";
    ctx.fillRect(100,150,1000,320);
    ctx.globalAlpha = 1;
    ctx.fillStyle= "white";
    ctx.font="40px Georgia";
    ctx.fillText("Game Paused!", cwidth/2-135, 240);
    ctx.fillText("Press 'p' to resume!!", cwidth/2-180, 400);
    ctx.restore();
}

function generateWall(){
	var lengthTop = Math.round(Math.random()*310+100);
	var lengthBottom = 410 - lengthTop;  
	var returnData = {};
	returnData.top = new wall(wallimg, cwidth, -5, lengthTop, wallSpeed, 0, ctx);
	returnData.bottom = new wall(wallimg, cwidth, cheight+5-lengthBottom, lengthBottom, wallSpeed, 1, ctx);
	return returnData;
}

function generateEnemy(){
	var randx = Math.round(Math.random()*(cwidth-100)+600); //+ (walls[walls.length-4].xpos + walls[walls.length-4].thickness + 30));
	var randy = Math.round(Math.random()*(cheight-50)+50);  

	var returnData = new enemy(randx, randy, spawn, wallSpeed, canvas, ctx);
    return returnData;
    
}

function generateBullet(){
    var randx = enemies[enemies.length-1].x;
    var randy = enemies[enemies.length-1].y;

    var tan = ((deep.y-enemies[enemies.length-1].y)/(deep.x-enemies[enemies.length-1].x));
    // tan += Math.PI;
    var angle = Math.atan(tan);
    var spdX = Math.cos(angle)*10;
    var spdY = Math.sin(angle)*10;
    var returnData = new bullet(randx, randy, spdX, spdY, ctx);
    return returnData;
}

function generateUpgrade(){
    var randx = Math.round(Math.random()*(cwidth-100)+600); 
    var randy = Math.round(Math.random()*(cheight-100)+100);  
    var prob = Math.random()*100;
    //probability of upgrade spawning.
    if(prob<=10)
        var returnData = new upgrade(randx, randy, bgSpeed, 2, canvas, ctx);
    else if(prob>10 && prob<=50) 
            var returnData = new upgrade(randx, randy, bgSpeed, 0, canvas, ctx);
         else var returnData = new upgrade(randx, randy, bgSpeed, 1, canvas, ctx);
    
    return returnData;
    
}

function getDistanceBetweenEntity(entity1,entity2){  //return distance (number)
        var vx = entity1.x - entity2.x;
        var vy = entity1.y - entity2.y;
        return Math.sqrt(vx*vx+vy*vy);
}

function testCollisionEntity(entity1,entity2){       //return if colliding (true/false)
        var distance = getDistanceBetweenEntity(entity1,entity2);
        return distance < 40;
}

function stopAudio(audio) {  
    audio.pause();
    audio.currentTime = 0;
}



