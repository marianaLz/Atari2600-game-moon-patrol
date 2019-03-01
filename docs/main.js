var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var startedGame = false;
var interval;
var frames = 0;
var score = 0;
var impacts = 0;
var shots = 0;

class Background {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = canvas.width;
        this.height = canvas.height;
        this.image = new Image()
        this.image.src = './images/background.png'
    }
    gameOver() {
        clearInterval(interval);
        ctx.font = "50px VT323";
        ctx.fillText ("GAME OVER", 250, 190);
    }
    gameComplete() {
        clearInterval(interval);
        ctx.font = "50px VT323";
        ctx.fillText ("GANASTE", 250, 190);
    }
    draw(){
        this.x--;
        if(this.x < -canvas.width) this.x = 0;
        ctx.drawImage(this.image, this.x, this.y ,this.width, this.height); 
        ctx.drawImage(this.image, this.x + this.width ,this.y, this.width, this.height); 
    }
}

class HealthBar {
    constructor(){
        this.x = 20;
        this.y = 0;
        this.width = 110;
        this.height = 75;
        this.image = new Image();
        this.image.src = './images/h1.png';
    }
    draw(){
        if (impacts > 2) this.image.src = './images/h2.png';
        if (impacts > 5) this.image.src = './images/h3.png';
        if (impacts > 8) this.image.src = './images/h4.png';
        if (impacts > 11) this.image.src = './images/h5.png';
        if (impacts > 14) this.image.src = './images/h6.png';
        if (impacts > 17) this.image.src = './images/h7.png';
        if (impacts > 20) this.image.src = './images/h8.png';
        if (impacts > 23) this.image.src = './images/h9.png';
        if (impacts > 26) this.image.src = './images/h10.png';
        if (impacts > 29) this.image.src = './images/h11.png';
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

class Ship {
    constructor () {
        this.image1 = new Image();
        this.image1.src = './images/nave1.png';
        this.image2 = new Image();
        this.image2.src = './images/nave2.png';
        this.image = this.image1;
        this.speed = 2;
        this.friction = 0.99;
        this.velxl = 0;
        this.velxr = 0;
        this.x = 440;
        this.y = 300;
        this.width = 120;
        this.height = 70;
    }
    collision(item){
        return (this.x < item.x + item.width) &&
            (this.x + this.width > item.x) &&
            (this.y < item.y + item.height) &&
            (this.y + this.height > item.y);
    }
    draw(){
        if(this.y < 360) this.y += 2;
        if(frames % 15 === 0){
             this.image = this.image == this.image1 ? this.image2 : this.image1;
        }
        ctx.drawImage(this.image, this.x, this.y, this.width,this.height);
    }
}

class Crater {
    constructor() {
        this.x = canvas.width;
        this.y = 417;
        this.width = 70;
        this.height = 20;
        this.image = new Image();
        this.image.src = "./images/crater.png";
    }
    draw(){
        if(frames % 10) this.x -= 5;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

class Enemy {
    constructor(x = canvas.width) {
        this.x = x;
        this.y = 375;
        this.width = 50;
        this.height = 30;
        this.image1 = new Image();
        this.image1.src = './images/enemy1.png';
        this.image2 = new Image();
        this.image2.src = './images/enemy2.png';
        this.image = this.image1;
    }
    draw(){
        if(frames % 10) this.x -= 5;
        if(frames % 10 === 0){
            this.image = this.image == this.image1 ? this.image2 : this.image1;
       }
       ctx.drawImage(this.image, this.x, this.y, this.width,this.height);
    }
}

class SkyEnemy1 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 35;
        this.height = 20;
        this.image1 = new Image();
        this.image1.src = './images/skyEnemy1.png';
        this.image2 = new Image();
        this.image2.src = './images/skyEnemy11.png';
        this.image = this.image1;
    }
    draw(){
        if(frames % 10 === 0){
            this.image = this.image == this.image1 ? this.image2 : this.image1;
       }
       ctx.drawImage(this.image, this.x, this.y, this.width,this.height);
    }
}

class SkyEnemy2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 35;
        this.height = 20;
        this.image1 = new Image();
        this.image1.src = './images/skyEnemy2.png';
        this.image2 = new Image();
        this.image2.src = './images/skyEnemy22.png';
        this.image = this.image1;
    }
    draw(){
        if(frames % 10 === 0){
            this.image = this.image == this.image1 ? this.image2 : this.image1;
       }
       ctx.drawImage(this.image, this.x, this.y, this.width,this.height);
    }
}

class FinalEnemy {
    constructor() {
        this.x = 700;
        this.y = 350;
        this.width = 100;
        this.height = 80;
        this.image = new Image();
        this.image.src = "./images/finalEnemy.png";
        this.visible = false;
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

class Bullet {
    constructor(direction, x, y) {
        this.x = x + 60;
        this.y = y + 30;
        this.width = 20;
        this.height = 3;
        this.image = new Image();
        this.image.src = "./images/rightBullet.png";
        this.direction = direction;
    }
    collision(item){
        return (this.x < item.x + item.width) &&
            (this.x + this.width > item.x) &&
            (this.y < item.y + item.height) &&
            (this.y + this.height > item.y);
    }
    draw () {
        if (this.direction === 'up'){
            this.image.src = './images/upBullet.png'; 
            this.width = 3; 
            this.height = 20;
        } 
        if (this.direction === 'enemy'){
            this.image.src = './images/enemyBullet.png';
            this.width = 20; 
            this.height = 3;
        }
        if (this.direction === 'sky1'){
            this.image.src = './images/sky1Bullet.png';
            this.width = 20; 
            this.height = 8;
        }
        if (this.direction === 'sky2'){
            this.image.src = './images/sky2Bullet.png';
            this.width = 20; 
            this.height = 8;
        }
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

var background = new Background();
var healthBar = new HealthBar();
var ship = new Ship();
var finalEnemy = new FinalEnemy();
var bullet = new Bullet('right');
var craters = [];
var enemies = [];
var skyEnemies1 = [];
var skyEnemies2 = [];
var shipRightBullets = [];
var shipUpBullets = [];
var skyEnemy1Bullets = [];
var skyEnemy2Bullets = [];
var finalEnemyBullets = [];

function generateCraters() {
    if (frames <= 5400 && (frames % 220 == 0 || frames % 550 == 0)) {
        let crater = new Crater();
        craters.push(crater);
    }
}

function drawCraters() {
    craters.forEach((crater, index) => {
        if(crater.x < -canvas.width){
          score += 20;
        return craters.splice(index, 1);  
        } 
        crater.draw();
        if(ship.collision(crater)){
            craters.splice(index, 1); 
            impacts++;
        }
    })
}

function generateEnemies() {
    if (frames >= 1200 && frames <= 5400 && (frames % 280 == 0 || frames % 1000 == 0)){
        let enemy = new Enemy();
        enemies.push(enemy);
    }
}

function drawEnemies() {
    enemies.forEach((enemy, index) => {
        if(enemy.x < -canvas.width){
        return enemies.splice(index, 1);  
        } 
        enemy.draw();
        if(ship.collision(enemy)){
            enemies.splice(index, 1);
            impacts++;
        }
    })
}

function randomNum(max, min){
    return Math.floor(Math.random() * (max - min) + min);
}

function generateSkyEnemies() {
    if (frames >= 3000 && frames <= 5400 && (frames % 300 == 0 || frames && 1000 == 0)){
        let posy1 = randomNum(40, 200)
        let posy2 = randomNum(40, 200)
        let skyEnemy1 = new SkyEnemy1(0, posy1);
        let skyEnemy2 = new SkyEnemy2(canvas.width, posy2);
        let skyEnemy1Bullet = new Bullet('sky1', skyEnemy1.x, skyEnemy1.y);
        let skyEnemy2Bullet = new Bullet('sky2', skyEnemy2.x, skyEnemy2.y);
        skyEnemies1.push(skyEnemy1);
        skyEnemies2.push(skyEnemy2);
        skyEnemy1Bullets.push(skyEnemy1Bullet);
        skyEnemy2Bullets.push(skyEnemy2Bullet);
    }
}

function drawSkyEnemies() {
    skyEnemies1.forEach((skyEnemy1, index) => {
        skyEnemy1.x += 1;
        if(skyEnemy1.x > canvas.width){
        return skyEnemies1.splice(index, 1);
        } 
        skyEnemy1.draw();
        if(ship.collision(skyEnemy1)){
            skyEnemies1.splice(index, 1);
            impacts++;
        }
        skyEnemy1Bullets.forEach((skyEnemy1Bullet, i) => {
            skyEnemy1Bullet.y += 1;
            skyEnemy1Bullet.x += 3;
            if(skyEnemy1Bullet.y > canvas.height || skyEnemy1Bullet.x > canvas.width){
            return skyEnemy1Bullets.splice(i, 1);
            }
            skyEnemy1Bullet.draw();
            if (skyEnemy1Bullet.collision(ship)) {
                skyEnemy1Bullets.splice(i, 1)
                impacts++;
            } 
        }); 
    })
    skyEnemies2.forEach((skyEnemy2, index) => {
        skyEnemy2.x -= 3;
        if(skyEnemy2.x < -canvas.width){
        return skyEnemies2.splice(index, 1);
        } 
        skyEnemy2.draw();
        if(ship.collision(skyEnemy2)){
            skyEnemies2.splice(index, 1);
            impacts++;
        }
        skyEnemy2Bullets.forEach((skyEnemy2Bullet, i) => {
            skyEnemy2Bullet.y += 1;
            skyEnemy2Bullet.x -= 3;
            if(skyEnemy2Bullet.y > canvas.height || skyEnemy2Bullet.y > canvas.height){
            return skyEnemy2Bullets.splice(i, 1);
            }
            skyEnemy2Bullet.draw();
            if (skyEnemy2Bullet.collision(ship)) {
                skyEnemy2Bullets.splice(i, 1)
                impacts++;
            } 
        }); 
    })
}

function generateFinalEnemy() {
    if (frames >= 6000){
        ship.x = 200;
        finalEnemy.draw();
        finalEnemy.visible = true;
    }
}

function drawBullets() {
    if (bullet.direction === 'right'){
        shipRightBullets.forEach((bullet, i) => {
            bullet.x += 10;
            if(bullet.x > canvas.width){
            return shipRightBullets.splice(i, 1);
            } 
            bullet.draw();
            enemies.forEach((enemy, index) => {
                if(bullet.collision(enemy)) {
                    shipRightBullets.splice(i, 1)
                    enemies.splice(index, 1)
                    score += 50;
                } 
            })
            if (finalEnemy.visible == true && bullet.collision(finalEnemy)) {
                shipRightBullets.splice(i, 1)
                score += 100;
                shots ++;
            }
        });
    } else if (bullet.direction === 'up'){
        shipUpBullets.forEach((bullet, i) => {
            bullet.y -= 10;
            if(bullet.y < -canvas.height){
            return shipUpBullets.splice(i, 1);
            }
            bullet.draw();
            skyEnemies1.forEach((skyEnemy1, index) => {
                if(bullet.collision(skyEnemy1)) {
                    shipUpBullets.splice(i, 1)
                    skyEnemies1.splice(index, 1)
                    score += 50;
                }
            })
            skyEnemies2.forEach((skyEnemy2, index) => {
                if(bullet.collision(skyEnemy2)) {
                    shipUpBullets.splice(i, 1)
                    skyEnemies2.splice(index, 1)
                    score += 50;
                }
            })
        });
    } 
}

function generateFinalEnemyBullet() {
    if (frames >= 6000 && frames % 120 == 0){
        let posY = randomNum(finalEnemy.y, finalEnemy.y + 30)
        let finalEnemyBullet = new Bullet('enemy', finalEnemy.x, posY - 30);
        finalEnemyBullets.push(finalEnemyBullet);
    }
}

function drawFinalEnemyBullet() {
    finalEnemyBullets.forEach((finalEnemyBullet, i) => {
        finalEnemyBullet.x -= 10;
        if(finalEnemyBullet.x < -canvas.height){
        return finalEnemyBullets.splice(i, 1);
        }
        finalEnemyBullet.draw();
        if (finalEnemyBullet.collision(ship)) {
            finalEnemyBullets.splice(i, 1)
            impacts++;
        } 
    }); 
}

function game_Over() {
    if (impacts >= 30) {
        background.gameOver();
    } else if (shots >= 50){
        background.gameComplete();
    }
}

/*var interval = setInterval(function(){
    frames++;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    background.draw();
    ship.draw();
    healthBar.draw();
    ctx.fillStyle = 'white'
    ctx.font = "25px VT323";
    ctx.fillText('SCORE ' + score, 860, 45);
    ctx.fillText('IMPACTS ' + impacts, 455, 45);
    generateCraters();
    drawCraters();
    generateEnemies();
    drawEnemies();
    generateSkyEnemies();
    drawSkyEnemies();
    generateFinalEnemy();
    drawBullets();
    generateFinalEnemyBullet();
    drawFinalEnemyBullet();
    ship.velxl *= ship.friction;
    ship.velxr *= ship.friction;
    if (ship.x + ship.velxl < 880) ship.x += ship.velxl;
    if (ship.x - ship.velxr > 15) ship.x += ship.velxr;
    game_Over();
},1000/75);*/

window.onload = function(){
    function startGame() {
        startedGame = true;
        interval = setInterval(function(){
        frames++;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        background.draw();
        ship.draw();
        healthBar.draw();
        ctx.fillStyle = 'white'
        ctx.font = "25px VT323";
        ctx.fillText('SCORE ' + score, 860, 45);
        ctx.fillText('IMPACTS ' + impacts, 455, 45);
        generateCraters();
        drawCraters();
        generateEnemies();
        drawEnemies();
        generateSkyEnemies();
        drawSkyEnemies();
        generateFinalEnemy();
        drawBullets();
        generateFinalEnemyBullet();
        drawFinalEnemyBullet();
        ship.velxl *= ship.friction;
        ship.velxr *= ship.friction;
        if (ship.x + ship.velxl < 880) ship.x += ship.velxl;
        if (ship.x - ship.velxr > 15) ship.x += ship.velxr;
        game_Over();
        },1000/75);
    }
    document.getElementById("start-button").onclick = function() {
        if(!interval){
            startGame();
        }
       
    };
}

addEventListener('keydown', function(event){
    if(event.keyCode === 37){
        if (ship.velxr < ship.speed) {
            ship.velxr--;
        }
    }
    if(event.keyCode === 39){
        if (ship.velxl < ship.speed) {
            ship.velxl++;
        }
    }
    if(event.keyCode === 32 && ship.y >= 120){
        ship.y -= 120;
    }
    if(event.keyCode === 40){
        bullet.direction = 'right';
        shipRightBullets.push(new Bullet('right', ship.x, ship.y));
    }
    if(event.keyCode === 38){
        bullet.direction = 'up';
        shipUpBullets.push(new Bullet('up', ship.x, ship.y));
    }
})