/**
 * SCREEN
 */

var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');

var gamescreen = document.createElement('canvas');
var gamectx = gamescreen.getContext("2d");
gamescreen.width = 240;
gamescreen.height = 240;

var smoothing = 0;

gamectx.mozImageSmoothingEnabled = smoothing;
gamectx.msImageSmoothingEnabled = smoothing;
gamectx.webkitImageSmoothingEnabled = smoothing;
gamectx.imageSmoothingEnabled = smoothing;

window.addEventListener('resize', resizeCanvas, false);

resizeCanvas();

function resizeCanvas() {
   
    var hScale = Math.floor(window.innerWidth / gamescreen.width);
    var vScale = Math.floor(window.innerHeight / gamescreen.height);
    var scale = hScale < vScale ? hScale : vScale;
    scale = scale < 1 ? 1 : scale;

    var realWidth = scale * gamescreen.width;
    var realHeight = scale * gamescreen.height;
    var left = Math.floor((window.innerWidth - realWidth) / 2);
    var top = Math.floor((window.innerHeight - realHeight) / 2);

    canvas.style.width = realWidth + "px";
    canvas.style.height = realHeight + "px";
    canvas.style.left = left + "px";
    canvas.style.top = top + "px";

    canvas.width = realWidth;
    canvas.height = realHeight;
}


/**
 * TILESET
 */
var tileset = new Image(128, 128);
    tileset.src = "tileset.png";
    tileset.tileWidth = 16;
    tileset.tileHeight = 16;
    tileset.tilesInRow = 8;

function getTilePos(tile) {
    return [
        (tile % tileset.tilesInRow) * tileset.tileWidth,
        Math.floor(tile / tileset.tilesInRow) * tileset.tileHeight
    ];
}

/**
 * GAME LOOP
 */
var now,
    dt       = 0,
    last     = timestamp(),
    slow     = 1,
    step     = 1/60,
    slowStep = slow * step;

function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

function frame() {
    now = timestamp();
    dt = dt + Math.min(1, (now - last) / 1000);

    while(dt > slowStep) {
        dt = dt - slowStep;
        update(step);
    }

    render(dt/slow);

    last = now;

    requestAnimationFrame(frame);
}

tileset.onload = function () {
    requestAnimationFrame(frame);
}

/**
 * CONTROLS
 */
var controls = {};

function resetControls() {
    controls.A = false;
    controls.B = false;
    controls.UP = false;
    controls.DOWN = false;
    controls.LEFT = false;
    controls.RIGHT = false;
}

resetControls();


/**
 * KEYBOARD
 */
function keyControl(event, value) {
    switch (event.key) {
        case "Enter": controls.A = value; break;
        case "Shift": controls.B = value; break;
        case "Z": controls.A = value; break;
        case "X": controls.B = value; break;
        case "ArrowLeft": controls.LEFT = value; break;
        case "ArrowUp": controls.UP = value; break;
        case "ArrowRight": controls.RIGHT = value; break;
        case "ArrowDown": controls.DOWN = value; break;
    }
}

window.addEventListener("keydown", function (event) { keyControl(event, true); }, false);
window.addEventListener("keyup", function (event) { keyControl(event, null); }, false);


/**
 * MISC
 */
function isMobile() { 
    if( navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
    ){
       return true;
     }
    else {
       return false;
     }
   }




/**
 * GAME LOGIC
 */

var player = {
    x: gamescreen.width / 2,
    y: gamescreen.height / 2,
    tile: 2,
    width: 1,
    height: 1,
    speed: 75,
    vx: 0,
    vy: 0
}

var enemies = [];
var spawnTimer = 0;
var spawnEvery = 2;

function spawnEnemy() {
    enemies[enemies.length] = {
        type: "enemy",
        x: Math.random() * gamescreen.width,
        y: Math.random() * gamescreen.height,
        tile: 41 + Math.random() * 7,
        width: 1,
        height: 1,
        speed: 20 + Math.random() * 20,
        vx: 0,
        vy: 0
    }
}

spawnEnemy();
spawnEnemy();
spawnEnemy();
spawnEnemy();

function update(dt) {
    if(controls.UP) {
        player.vy = -player.speed;
    }
    else if(controls.DOWN) {
        player.vy = player.speed;
    }
    else {
        player.vy = 0;
    }

    if(controls.LEFT) {
        player.vx = -player.speed;
    }
    else if(controls.RIGHT) {
        player.vx = player.speed;
    }
    else {
        player.vx = 0;
    }

    player.x += player.vx * dt;
    player.y += player.vy * dt;

    for(var i in enemies) {
        var dx = player.x - enemies[i].x;
        var dy = player.y - enemies[i].y;
        var theta = Math.atan2(dy, dx);

        enemies[i].vx = enemies[i].speed * Math.cos(theta);
        enemies[i].vy = enemies[i].speed * Math.sin(theta);

        enemies[i].x += enemies[i].vx * dt;
        enemies[i].y += enemies[i].vy * dt;
    }
}


function render(dt) {
    gamectx.clearRect(0, 0, gamescreen.width, gamescreen.height);

    var tilePos = getTilePos(player.tile);
    gamectx.drawImage(tileset,
        tilePos[0], tilePos[1], player.width * tileset.tileWidth, player.height * tileset.tileHeight,
        Math.round(player.x), Math.round(player.y), player.width * tileset.tileWidth, player.height * tileset.tileHeight)
    
    for(var i in enemies) {
        var tilePos = getTilePos(enemies[i].tile);
        gamectx.drawImage(tileset,
            tilePos[0], tilePos[1], enemies[i].width * tileset.tileWidth, enemies[i].height * tileset.tileHeight,
            Math.round(enemies[i].x), Math.round(enemies[i].y), enemies[i].width * tileset.tileWidth, enemies[i].height * tileset.tileHeight)

    }


    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(gamescreen, 0, 0, gamescreen.width, gamescreen.height, 0,0, canvas.width, canvas.height);
}

/* var angle = 0;
var scale = 1;
var speed = 45;



function update(dt) {

    if(controls.UP) {
        speed += 5;
        resetControls();
        
    }
    else if(controls.DOWN) {
        speed -= 5;
        resetControls();
    }

    if(controls.A && speed != 0) {
        speed = 0;
    }
    else if(controls.A && speed == 0) {
        speed = 45;
    }


    angle += speed*dt;

    if(angle >= 360) {
        angle -= 360;
    }

    scale = 2 + 1*Math.sin(Math.PI / 180 *2*angle);
    
}

function render(dt) {
    gamectx.save();
    gamectx.clearRect(0, 0, gamescreen.width, gamescreen.height);
    gamectx.translate(tileset.width, tileset.height);
    gamectx.rotate(Math.PI / 180 * angle); 
    gamectx.drawImage(tileset, 0, 0, tileset.width, tileset.height,  -tileset.width * scale / 2, -tileset.height * scale / 2, tileset.width * scale, tileset.height * scale);
    gamectx.restore();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(gamescreen, 0, 0, gamescreen.width, gamescreen.height, 0,0, canvas.width, canvas.height);
    
}*/
