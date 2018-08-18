
/**
 * SCREEN
 */



var gamescreen = document.createElement('canvas');
var gamectx = gamescreen.getContext("2d");
gamescreen.width = 420;
gamescreen.height = 140;

var scale = 1;

var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');
    canvas.width = gamescreen.width * scale;
    canvas.height = gamescreen.height * scale;

var smoothing = 0;

gamectx.mozImageSmoothingEnabled = smoothing;
gamectx.msImageSmoothingEnabled = smoothing;
gamectx.webkitImageSmoothingEnabled = smoothing;
gamectx.imageSmoothingEnabled = smoothing;

window.addEventListener('resize', resizeCanvas, false);

resizeCanvas();

function resizeCanvas() {
    scale = Math.floor(window.innerWidth / gamescreen.width);
    scale = scale < 1 ? 1 : (scale > 2 ? 2 : scale);

    canvas.width = gamescreen.width * scale;
    canvas.height = gamescreen.height * scale;
}


/**
 * Color tables
 */
var colorScheme = {};

colorScheme.standard = {
    colors: [
        [  0,  0,  0], // black - outline
        [255,156, 18], // orange - tone
        [255,255,255], // white - highlight,
        [250,188, 32], // yellow - ground,
        [196, 98,  0], // brown - ground marks
        [ 66,154,215], // blue - sky,
        [127,213,205], // light-blue - sky anti-aliasing
        [247,247,247], // gray - clouds
        [ 53,128,  0], // green - plants / animals
        [255, 41, 80]  // red - enemies
    ],
    groundColor: 3,
    skyColor: 5,
    cloudColor: 7,
    colorMap:{
        0: 0,
        127: 1,
        255: 2
    },
    palettes: [
        [0,1,2], // sprites
        [5,6,7], // sky / clouds
        [0,3,4], // ground
        [0,4,1], // rocks
        [0,8,3], // plants
        [0,8,2], // animals
        [0,9,3]  // read enemies
    ],
    // Palette index for each 32x32 px block on tileset
    palleteMap: [
        0,0,0,0,
        0,0,0,0,
        3,3,4,0,
        5,6,0,0,
        1,1,1,2
    ]
}


colorScheme.grayscale = {
    colors: [
        [  0,  0,  0], // black
        [160,160,160], // gray
        [247,247,247], // white
    ],
    groundColor: 1,
    skyColor: 2,
    cloudColor: 2,
    colorMap:{
        0: 0,
        127: 1,
        255: 2
    },
    palettes: [
        [0,1,2], // sprites
        [2,2,2], // sky / clouds
        [0,1,0], // ground
    ],
    // Palette index for each 32x32 px block on tileset
    palleteMap: [
        0,0,0,0,
        0,0,0,0,
        0,0,0,0,
        0,0,0,0,
        1,1,1,2
    ]
}

var currentColorScheme = 'standard';

/**
 * TILESET
 */
var chrtable = new Image();
    chrtable.src = "data:image/png;base64,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";

var tileset = document.getElementById('tileset'); //document.createElement('canvas');
var tilesetCtx = tileset.getContext("2d");
    tileset.width = 128;
    tileset.height = 256;


function colorizeTileset() {
    tilesetCtx.drawImage(chrtable, 0,0);
    var imageData = tilesetCtx.getImageData(0,0, 128,256);
    var data = imageData.data;

    var scheme = colorScheme[currentColorScheme];

    for(var y = 0; y < 256; y++)
    for(var x = 0; x < 128; x++) {
        var index = (y * 128 + x) * 4;
        var colorIndex = scheme.colorMap[data[index]];
        var palMap = Math.floor(y / 32) * 4 + Math.floor(x / 32);
        var pal = scheme.palleteMap[palMap] ? scheme.palleteMap[palMap] : 0;
        var color = scheme.colors[scheme.palettes[pal][colorIndex]];
  
        data[index] = color[0];
        data[index + 1] = color[1];
        data[index + 2] = color[2];
    }

    tilesetCtx.putImageData(imageData, 0,0);
}


function getTilePos(tile) {
    return [
        (tile % 8) * 16,
        Math.floor(tile / 8) * 16
    ];
}


/**
 * Layers
 */

var ground = document.getElementById('ground');
    groundCtx = ground.getContext('2d');

function initGround() {
    ground.width = Math.ceil(gamescreen.width / 80) * 80;
    ground.height = Math.floor(gamescreen.height / 4);

    var scheme = colorScheme[currentColorScheme];
    var color = scheme.colors[scheme.groundColor];

    groundCtx.fillStyle="rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
    groundCtx.fillRect(0,0, ground.width, ground.height);

    var stamps = Math.floor(5 + Math.random() * 3);
    var pos = getTilePos(70);

    var step = Math.floor(ground.width / stamps);
    var devStep = Math.floor(step / 3);
    var devVert = Math.floor(ground.height / 8);

    for(var i = 0; i < stamps; i++) {
        var dx = 16 + i*step + devStep - Math.floor(Math.random()*devStep*2);
        var dy = Math.floor(ground.height / 3) + devVert - Math.floor(Math.random()*devVert*2);
        groundCtx.drawImage(tileset, pos[0],pos[1], 32,32, dx, dy, 32,32);
    }
}

var sky = document.getElementById('sky');
    skyCtx = sky.getContext('2d');

function initSky() {
    sky.width = ground.width;
    sky.height = gamescreen.height - ground.height;
    var thirdHeight = Math.floor(sky.height / 3);
    
    var scheme = colorScheme[currentColorScheme];
    var color = scheme.colors[scheme.skyColor];

    skyCtx.fillStyle="rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
    skyCtx.fillRect(0,0, sky.width, sky.height - thirdHeight);

    var color = scheme.colors[scheme.cloudColor];

    skyCtx.fillStyle="rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
    skyCtx.fillRect(0,sky.height - thirdHeight, sky.width, thirdHeight);

    var pos = getTilePos(64);

    for(var i = 0; i < sky.width / 80; i++) {
        var dx = i * 80;
        var dy = sky.height - thirdHeight - 32;

        skyCtx.drawImage(tileset, pos[0],pos[1],80,32, dx,dy, 80,32);
    }
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


var spritesheet = {
    player: {
        width: 32,
        height: 32,
        /*tiles: [
            0, // stand
            2, // walk 1
            4, // walk 2
            6, // dodge,
            8, // jump
            10, // look up
            12, // look back
            14 // hurt
        ],*/
        animations: {
            stand: [0],
            walk: [0,2,0,4],
            jump: [16],
            hurt: [20]
        },
        animationSpeed: 8,
        currentAnimation: 'stand'
    }
}

/**
 * SPRITE
 */
function Sprite(sprite) {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.jumping = false;
    this.width = spritesheet[sprite].width;
    this.height = spritesheet[sprite].height;
    this.animations = {};
    this.animationSpeed = spritesheet[sprite].animationSpeed;
    this.currentAnimation = spritesheet[sprite].currentAnimation;
    this.currentAnimationTile = 0;

    for(var a in spritesheet[sprite].animations) {
        this.animations[a] = [];

        for(var i in spritesheet[sprite].animations[a]) {
            this.animations[a][i] = getTilePos(spritesheet[sprite].animations[a][i]);
        }
    }
}

Sprite.prototype.update = function(dt) {
    this.currentAnimationTile = (this.currentAnimationTile + this.animationSpeed * dt) % this.animations[this.currentAnimation].length;

    var ay = this.ay + (gravity * 100);

    this.vx += this.ax * dt;
    this.vy += ay * dt;

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if(this.y + this.height > spriteGroundY) {
        this.y = spriteGroundY - this.height;
    }

    this.jumping = this.y + this.height < spriteGroundY;

    if(this.jumping) {
        this.setCurrentAnimation('jump');
    }
    else {
        this.setCurrentAnimation('walk');
    }
}

Sprite.prototype.setCurrentAnimation = function(animation) {
    if(animation !== this.currentAnimation) {
        this.currentAnimation = animation;
        this.currentAnimationTile = 0;
    }
}

Sprite.prototype.getCurrentTile = function() {
    return this.animations[this.currentAnimation][Math.floor(this.currentAnimationTile)];
}


/**
 * GAME LOGIC
 */
var gravity = 9.8;
var groundPos = 0;
var groundSpeed = -100;
var spriteGroundY;

var skyPos = 0;
var skySpeed = -10;

var player = new Sprite('player');

function initPlayer() {
    spriteGroundY = gamescreen.height - ground.height + 4;
    player.x = 16;
    player.y = spriteGroundY - player.height;
    player.currentAnimation = 'walk';
}

document.addEventListener('keypress', function(event) {

    if(!player.jumping && event.key == 'z') {
        player.vy = -300;
    }

    if(event.key == 'c' && currentColorScheme == 'standard') {
        currentColorScheme = 'grayscale';
        colorizeTileset();
        initGround();
        initSky();
    }
    else if(event.key == 'c' && currentColorScheme == 'grayscale') {
        currentColorScheme = 'standard';
        colorizeTileset();
        initGround();
        initSky();
    }
});

chrtable.onload = function() {
    colorizeTileset();
    initGround();
    initSky();
    initPlayer();
    requestAnimationFrame(frame);
}


function update(dt) {
    groundPos += groundSpeed * dt;
    if(groundPos < 0) {
        groundPos += ground.width;
    }

   skyPos += skySpeed * dt;
   if(skyPos < 0) {
        skyPos += sky.width;
    }

    player.update(dt);
}

function render(dt) {
    gamectx.clearRect(0, 0, gamescreen.width, gamescreen.height);

    gamectx.drawImage(ground, Math.floor(groundPos),gamescreen.height - ground.height);
    gamectx.drawImage(ground, 0,0, ground.width,ground.height, Math.floor(groundPos - ground.width),gamescreen.height - ground.height, ground.width,ground.height);

    gamectx.drawImage(sky, Math.floor(skyPos),0);
    gamectx.drawImage(sky, 0,0, sky.width,sky.height, Math.floor(skyPos - sky.width),0, sky.width,sky.height);

    var tile = player.getCurrentTile();
    gamectx.drawImage(tileset, tile[0],tile[1], player.width,player.height, Math.floor(player.x),Math.floor(player.y), player.width,player.height);


    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(gamescreen, 0, 0, gamescreen.width, gamescreen.height, 0,0, canvas.width, canvas.height);
}
