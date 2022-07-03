'use strict';
var ansi = require('ansi');
var cursor = ansi(process.stdout);

var keypress = require('keypress');
keypress(process.stdin);
process.stdin.setRawMode(true);
process.stdin.resume();

var dragonX = 20;
var dragonY = 15;

var demonX = 20;
var demonY = 17;

var dmShoot = false;
var drShoot = false;

var width = 40;
var height = 20;

var posX = 0;
var posY = 0;

var coinPosX = Math.ceil(Math.random() * (width - 2)) + 1;
var coinPosY = Math.ceil(Math.random() * (height - 2)) + 1;

var points = 30;
var mode = 0;

var centerX = width / 2;
var centerY = height / 2;

var swdatt = false;
var swordon = false;
var swordinv = false;

var bedon = false;
var bedinv = false;
var bedplace = false;

var eat = false;
var broton = false;
var brotinv = false;

var inv = false;

var facingR = false;
var facingL = false;
var facingU = false;
var facingD = false;

var health = 100;
var hunger = 100;

var demonhp = 100;
var dragonhp = 200;

var drblX = dragonX;
var drblY = dragonY - 1;

var dmblX = demonX;
var dmblY = demonY - 1;

try {
    process.stdout.write('\x1Bc');
    process.stderr.write('\x1B[?25l');

    drawWrld();

    process.stdin.on('keypress', handleInput);

    drawCoin();

    posX = Math.floor(width / 2);
    posY = Math.floor(height / 2);

    hungerf();

    gameLoop();
} 

catch (ex) {
    console.log(ex.toString());
    quitGame();
} 

function gameLoop(){
    process.stdout.write('\x1Bc');

    removePlayer(posX, posY);

    drawWrld();

    demon();
    dragon();

    wrld();

    if(mode == 1){
        drawCoin();

        if (posX == coinPosX && posY == coinPosY) {
            points++;
            
            coinPosX = Math.ceil(Math.random() * (width - 2)) + 1;
            coinPosY = Math.ceil(Math.random() * (height - 2)) + 1;

            drawCoin();
        }
    }

    if (posX == 1 || posX == width || posY == 1 || posY == height) {
        cursor.red();
        cursor.bg.white();
        setText(width / 2 - 6, height / 2, "  GAME OVER  ");
        quitGame();
    }

    if(dmShoot){
        if(posX == dmblX && posY <= dmblY){
            dmblY--;
        }

        else if(posX == dmblX && posY >= dmblY){
            dmblY++;
        }

        else if(posY == dmblY && posX <= dmblX){
            dmblX--;
        }

        else if(posY == dmblY && posX >= dmblX){
            dmblX++;
        }
        
        if(dmblY >= height){
            dmblY = demonY - 1;
        }

        else if(dmblY <= 0){
            dmblY = demonY - 1;
        }
    
        else if(dmblX >= width){
            dmblX = demonX;
        }
    
        else if(dmblX <= 0){
            dmblX = demonX;
        }
    
        if(dmblX == posX && dmblY == posY){
            health = health - 50;
            respawndmBullet();
        }
    }

    if(drShoot){
        if(posX == drblX && posY <= drblY){
            drblY--;
        }
    
        else if(posX == drblX && posY >= drblY){
            drblY++;
        }
    
        else if(posY == drblY && posX <= drblX){
            drblX--;
        }
    
        else if(posY == drblY && posX <= drblX){
            drblX++;
        }

        if(drblY >= height){
            drblY = dragonY - 1;
        }

        else if(drblY <= 0){
            drblY = dragonY - 1;
        }
    
        else if(drblX >= width){
            drblX = dragonX;
        }
    
        else if(drblX <= 0){
            drblX = dragonX;
        }
    
        if(drblX == posX && drblY == posY){
            dead();
            respawndrBullet();
        }    
    }

    drawPlayer();

    sword();
    brot();
    bed();

    won();

    setTimeout(gameLoop, 1000 / 10);
}

function quitGame() {
    cursor.reset();
    cursor.bg.reset();
    process.stderr.write('\x1B[?25h');
    cursor.goto(1, height + 4);
    process.exit();
}

function drawHorizontalLine(col, row, length) {
    for (var i = 0; i < length; i++) {
        cursor.goto(col + i, row).write(' ');
    }
}

function drawVerticalLine(col, row, length) {
    for (var i = 0; i < length; i++) {
        cursor.goto(col, row + i).write(' ');
    }
}

function handleInput(chunk, key) {
    if (key.name == 'q') {
        quitGame();
    } 

    if(key.name == 'x'){
        inv = !inv;
    }

    if(key.name == 'l'){
        mode = 1;
    }

    if(key.name == 'e'){
        swdatt = true;
    }

    if(key.name == 'f'){
        if(swordinv){
            swordon = true;
            bedon = false;
            broton = false;
        }
        else if(swordinv == false){
            if(points >= 20){
                points = points - 20;
                swordinv = true;
                swordon = true;
            }
        }
    }

    if(key.name == 'r'){
        bedplace = true;
    }

    if(key.name == 'c'){
        eat = true;
    }
    else{
        eat = false;
    }

    if(key.name == 'g'){
        if(bedinv){
            bedon = true;
            swordon = false;
            broton = false;
        }
        else if(bedinv == false){
            if(points >= 10){
                points = points - 10;
                bedinv = true;
                bedon = true;
            }
        }
    }

    if(key.name == 'h'){
        if(brotinv){
            broton = true;
            bedon = false;
            swordon = false;
        }
        else if(brotinv == false){
            if(points >= 20){
                points = points - 20;
                brotinv = true;
                broton = true;
            }
        }
    }

    else if (key.name == 'd') {
        posX += 1;

        facingR = true;
        facingD = false;
        facingU = false;
        facingL = false;
    } 

    else if (key.name == 'a') {
        posX -= 1;

        facingR = false;
        facingD = false;
        facingU = false;
        facingL = true;
    }

    else if (key.name == 'w') {
        posY -= 1;

        facingR = false;
        facingD = false;
        facingU = true;
        facingL = false;
    } 

    else if (key.name == 's') {
        posY += 1;

        facingR = false;
        facingD = true;
        facingU = false;
        facingL = false;
    }
}

function removePlayer() {
    if(mode >= 1 && mode <= 3){
        cursor.bg.black();
        drawPoint(posX, posY);
        cursor.bg.reset();
    }
}

function drawPlayer() {
    if(mode >= 1 && mode <= 3){
        cursor.bg.blue();
        drawPoint(posX, posY);
        cursor.bg.reset();
    }
}

function drawPoint(col, row, char) {
    cursor.goto(col, row).write(' ');
}

function drawCoin() {
    cursor.bg.green();
    drawPoint(coinPosX, coinPosY);
    cursor.bg.reset();

    setText(1, height + 2, "Points: " + points.toString());
}

function setText(col, row, text) {
    cursor.goto(col, row).write(text);
}

function wrld(){
    
}

function drawWrld(){
    if(mode == 0){
        cursor.bg.red();
        drawHorizontalLine(1, 1, width);
        drawHorizontalLine(1, height, width);
        drawVerticalLine(1, 1, height);
        drawVerticalLine(width, 1, height);
        setText(centerX, centerY, "NodeCraft");
        cursor.bg.reset();
    }

    if(mode == 1){
        cursor.bg.green();
        drawHorizontalLine(1, 1, width);
        drawHorizontalLine(1, height, width);
        drawVerticalLine(1, 1, height);
        drawVerticalLine(width, 1, height);
        cursor.bg.reset();
    }

    else if(mode == 2){
        cursor.bg.red();
        drawHorizontalLine(1, 1, width);
        drawHorizontalLine(1, height, width);
        drawVerticalLine(1, 1, height);
        drawVerticalLine(width, 1, height);
        cursor.bg.reset();
    }

    else{
        cursor.bg.yellow();
        drawHorizontalLine(1, 1, width);
        drawHorizontalLine(1, height, width);
        drawVerticalLine(1, 1, height);
        drawVerticalLine(width, 1, height);
        cursor.bg.reset();
    }
}

function sword(){
    if(mode > 0 && swordon && swordinv){
        cursor.bg.grey();

        if(facingD){
            drawPoint(posX, posY + 1);
        }

        else if(facingU){
            drawPoint(posX, posY - 1);
        }

        else if(facingR){
            drawPoint(posX + 1, posY);
        }

        else if(facingL){
            drawPoint(posX - 1, posY);
        }

        if(mode == 2){
            if(facingR){
                if(posX + 2 == demonX && posY == demonY || posX + 2 == demonX && posY == demonY){
                    if(swdatt){
                        demonhp = demonhp - 25;
                    }
                }
            }

            if(facingL){
                if(posX - 2 == demonX && posY == demonY || posX - 2 == demonX && posY == demonY){
                    if(swdatt){
                        demonhp = demonhp - 25;
                    }
                }
            }

            if(facingD){
                if(posY + 2 == demonY && posX == demonX || posY + 2 == demonY && posX == demonX){
                    if(swdatt){
                        demonhp = demonhp - 25;
                    }
                }
            }

            if(facingU){
                if(posY - 2 == demonY && posX == demonX || posY - 2 == demonY && posX == demonX){
                    if(swdatt){
                        demonhp = demonhp - 25;
                    }
                }
            }
        }



        if(mode == 3){
            if(facingR){
                if(posX + 2 == dragonX && posY == dragonY || posX + 2 == dragonX && posY == dragonY){
                    if(swdatt){
                        dragonhp = dragonhp - 25;
                    }
                }
            }

            if(facingL){
                if(posX - 2 == dragonX && posY == dragonY || posX - 2 == dragonX && posY == dragonY){
                    if(swdatt){
                        dragonhp = dragonhp - 25;
                    }
                }
            }

            if(facingD){
                if(posY + 2 == dragonY && posX == dragonX || posY + 2 == dragonY && posX == dragonX){
                    if(swdatt){
                        dragonhp = dragonhp - 25;
                    }
                }
            }

            if(facingU){
                if(posY - 2 == dragonY && posX == dragonX || posY - 2 == dragonY && posX == dragonX){
                    if(swdatt){
                        dragonhp = dragonhp - 25;
                    }
                }
            }
        }

        cursor.bg.reset();
    }

    if(mode == 1 && swordinv){
        mode = 2;
    }

    if(swdatt && swordon && swordinv){
        cursor.bg.black();

        swdatt = false;

        cursor.bg.reset();
    }
}

function demon(){
    if(mode == 2){
        cursor.bg.magenta();

        drawPoint(demonX, demonY);

        cursor.bg.reset();

        demonShoot();
    }

    if(demonhp == 0){
        mode = 3;
    }
}

function dragon(){
    if(mode == 3){
        cursor.bg.brightBlack();

        drawPoint(dragonX, dragonY);

        cursor.bg.reset();

        dragonShoot();
    }
}

function brot(){
    if(mode > 0 && broton && brotinv){
        cursor.bg.brightYellow();
    
        if(facingD){
            drawPoint(posX, posY + 1);
        }
    
        else if(facingU){
            drawPoint(posX, posY - 1);
        }
    
        else if(facingR){
            drawPoint(posX + 1, posY);
        }
    
        else if(facingL){
            drawPoint(posX - 1, posY);
        }
    
        cursor.bg.reset();
    }

    if(eat && broton){
        hunger++;
    }

    if(hunger >= 100){
        hunger = 100;

        if(eat){
            health++;
        }
    }

    if(health >= 100){
        hunger = 100;
    }

    if(health <= 0){
        dead();
    }
}

function bed(){
    if(mode > 0 && bedon && bedinv){
        cursor.bg.brightRed();
    
        if(facingD){
            drawPoint(posX, posY + 1);
        }
    
        else if(facingU){
            drawPoint(posX, posY - 1);
        }
    
        else if(facingR){
            drawPoint(posX + 1, posY);
        }
    
        else if(facingL){
            drawPoint(posX - 1, posY);
        }
    
        cursor.bg.reset();
    }

    if(mode > 1 && bedplace){
        explode();
    }
}

function explode(){
    if(mode == 3){
        if(facingR){
            if(dragonX == posX + 1 || dragonX == posX + 2){
                dragonhp = dragonhp - 20;
            }
        }

        else if(facingL){
            if(dragonX == posX - 1 || dragonX == posX - 2){
                dragonhp = dragonhp - 20;
            }
        }

        else if(facingU){
            if(dragonY == posY - 1 || dragonY == posY - 2){
                dragonhp = dragonhp - 20;
            }
        }

        else if(facingD){
            if(dragonY == posY + 1 || dragonY == posY + 2){
                dragonhp = dragonhp - 20;
            }
        }
    }



    if(mode == 2){
        if(facingR){
            if(demonX == posX + 1 || demonX == posX + 2){
                demonhp = demonhp - 20;
            }
        }

        else if(facingL){
            if(demonX == posX - 1 || demonX == posX - 2){
                demonhp = demonhp - 20;
            }
        }

        else if(facingU){
            if(demonY == posY - 1 || demonY == posY - 2){
                demonhp = demonhp - 20;
            }
        }

        else if(facingD){
            if(demonY == posY + 1 || demonY == posY + 2){
                demonhp = demonhp - 20;
            }
        }
    }
}

function dragonShoot(){
    cursor.bg.red();

    drblX = dragonX;
    drblY = dragonY - 1;

    drShoot = true;

    drawPoint(drblX, drblY);

    cursor.bg.reset();
}

function respawndrBullet(){
    dmblX = demonX;
    dmblY = demonY - 1;

    if(drblY >= height){
        drblY = dragonY - 1;
    }
    
    else if(drblY <= 0){
        drblY = dragonY - 1;
    }

    else if(drblX >= width){
        drblX = dragonX;
    }

    else if(drblX <= 0){
        drblX = dragonX;
    }
}

function demonShoot(){
    cursor.bg.red();

    dmblX = demonX;
    dmblY = demonY - 1;

    dmShoot = true;

    drawPoint(dmblX, dmblY);

    cursor.bg.reset();
}

function respawndmBullet(){
    dmblX = demonX;
    dmblY = demonY - 1;

    if(dmblY >= height){
        dmblY = demonY - 1;
    }
    
    else if(dmblY <= 0){
        dmblY = demonY - 1;
    }

    else if(dmblX >= width){
        dmblX = demonX;
    }

    else if(dmblX <= 0){
        dmblX = demonX;
    }
}

function dead(){
    cursor.red();
    cursor.bg.white();
    setText(width / 2 - 6, height / 2, "  GAME OVER  ");
    quitGame();
}

function won(){
    if(dragonhp <= 0){
        cursor.green();
        cursor.bg.white();
        setText(width / 2 - 6, height / 2, "  YOU WIN  ");
        quitGame();
    }
}

function hungerf(){
    setTimeout(hungers, 10000);
}

function hungers(){
    hunger--;
}