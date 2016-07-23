// Enemies our player must avoid
var Enemy = function(level) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = 800;
    this.speed = 0;
    this.speedLvl = level + 1;
    this.y = 800;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // you should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x += this.speed * dt;

    if(this.x > 600){
        this.y = Math.ceil(Math.random() * 3) * 83 - 20;
        this.speed = Math.ceil(Math.random() * 50 * this.speedLvl) + 30 * this.speedLvl; 
        this.x = -10;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
*  A defination of play ground
*  Which contains #rows and #cols
*  and may be better to
*  replace some paras in engine.js
*/
var playGround = {
    grid: {
        NUM_ROWS: 6,
        NUM_COLS: 5
    },
    ROW_PX: 83,
    COL_PX: 101
};

var Player = function(){
    this.charSet = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
    ];
    this.charId = 0;
    this.sprite = this.charSet[this.charId];

    this.score = -1;    // P.S. score will be added to 0 when start a new game
}

/*
* Init player at bottom center of play ground
* Will be called at first and reset
*/
Player.prototype.init = function(){    
    this.gridY = playGround.grid.NUM_ROWS - 1;
    this.gridX = Math.floor(playGround.grid.NUM_COLS / 2);
};

/*
*   collision check in player.updated
*   if collision, reset game with succeed = false
*   otherwise, do nothing
*/
Player.prototype.update = function(){   
    this.x = playGround.COL_PX * this.gridX;
    this.y = playGround.ROW_PX * this.gridY - 20;

    for(var i = 0; i < allEnemies.length; i++){
        if(allEnemies[i].y == this.y){
            var diff = allEnemies[i].x - this.x;
            if (diff > -85 && diff < 85){
                this.newGame(false);
                break;
            }
        };
    };  
};

/*
* Draw character image and score
*/
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.clearRect(430,13,100,20);
    ctx.fillText("SCORE: " + this.score, 350, 30);
};

/* 
*  if previous game succeed, increase score
*  otherwise, decrease score
*  Meanwhile, add or remove enemies
*  based on score of current player
*  At last, reset player's status
*/
Player.prototype.newGame = function(succeed){
    if(succeed){
        this.score++;
    }else{
        this.score -= 1;
        this.score = Math.max(this.score, 0);
    }
    numEnemies = Math.floor(this.score / 2 + 3);

    // # of enemies is based on current player's score
    while(allEnemies.length < numEnemies){                  
        allEnemies.push(new Enemy(allEnemies.length));
    };
    while(allEnemies.length > numEnemies){
        allEnemies.pop();
    };
    this.init();
}


/* update position when has input
*  or switch character
*/
Player.prototype.handleInput = function(keyName){
    switch(keyName){
        case 'left':
            this.gridX = Math.max(this.gridX - 1, 0);
            break;
        case 'right':
            this.gridX = Math.min(this.gridX + 1, playGround.grid.NUM_COLS - 1);
            break;
        case 'down':
            this.gridY = Math.min(this.gridY + 1, playGround.grid.NUM_ROWS - 1);
            break;
        case 'up':
            this.gridY--;
            break;
        case 'swich-char':
            this.charId = (this.charId + 1) % 5;
            this.sprite = this.charSet[this.charId];
    };

    if(this.gridY == 0){
        this.newGame(true);
    }
};



/*
*  Build Entities
*/
var numEnemies,
    allEnemies = [];

var player = new Player();
player.newGame(true);   // start game

// This listens for key presses and sends the keys to your
// Player.handleInput() method. you don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'swich-char'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
