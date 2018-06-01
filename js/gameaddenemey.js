/*
.Started
.init setup
.controlled wall freq using set timeout
.added enemies
.hackermode
.prevented moving back wrt bg to prevent suiciding
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
var gameStarted = false;
var pause = false;


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
const enemies = [];
var curWalls = [];
//var enemybullets = [];
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

var genwall = function(){
	var wallSet = generateWall();
	walls.push(wallSet.top, wallSet.bottom);
	++count;
	console.log(count);
	if(wallSpeed<2){
        wallSpeed = 2;
        bgSpeed = 2;
    }
    if(count%2 == 0 && wallSpeed<20){
	
		wallSpeed++;;
		bgSpeed++;
	
	}
    if(walls.length>=4){
        var enemyPlayer = generateEnemy();
        enemies.push(enemyPlayer);
    
    }
		console.log(wallSpeed);

    if(count%2==0){
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
            var isColliding = testCollisionEntity(deep,enemytemp);
                if(isColliding){
                    deep.hp-=0.5;
                 
                }

        });
//Not getting deleted for some reason
        // upgradeList.forEach(function(upgradetemp){
        //     upgradetemp.update();
        //     upgradetemp.render();

        //     var isColliding = testCollisionEntity(deep,upgradetemp);
        //        if(isColliding){
        //            switch(upgradetemp.category){
        //             case 0: deep.hp += 30;break;
        //             case 1: deep.shield += 2000;break;
        //             case 2: bgSpeed = Math.round(bgSpeed/2);
        //                     wallSpeed = Math.round(wallSpeed/2);
        //                     break;
        //            }

        //            delete upgradetemp;
                 
        //        }

        // });

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
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Georgia';
        ctx.fillText('Score:'+ deep.score, cwidth-100, 25);
        ctx.fillText('HP:'+ Math.ceil(deep.hp), 50, 25);
        ctx.fillText('Shield:'+ Math.ceil(deep.shield), 250, 25);
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

        console.log("upgaea ",upgradeList.length);
        if(upgradeList.length!=0 && upgradeList[0].x <= -50){//25 is ghost width and this makes sure only ghosts on screen exist
            upgradeList.shift();
            
        }
        
}

function intro(){
    ctx.save();
    ctx.fillStyle= "white";
    ctx.font="80px Georgia";
    ctx.fillText("Press Enter to start!", cwidth/2-300, 200);
    ctx.font="40px Georgia"
    ctx.fillText("Press p for pause or rules.", cwidth/2-230, 400);
    ctx.restore();
}

function gameOver(){
    ctx.save();
    ctx.fillText('Game Over', 100, 100);
    ctx.restore();
}

function pauseScreen(){
    ctx.save();
    ctx.fillText('pauseScreen', 100, 100);
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



