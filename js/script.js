import animationData from "../assets/player animation.json" with { type: "json" };

console.log(animationData);

// ./assets/player animation.json
function loadImage(src) {
    var img = new Image();
    img.src = src;
    return img;
}
function createAudio(src) {
    var audio = document.createElement('audio');
    audio.volume = 1;
    //audio.loop   = options.loop;
    audio.src = src;
    audio.playbackRate = 4;
    return audio;
}

function drawPixelText(text, x, y, outline, color="black") {
    ctx.imageSmoothingEnabled = false; 
    ctx.textBaseline = 'top';
    ctx.fillStyle = color; 
    
    charLength = text.toString().length;
    if (charLength == 2) {
        x -= 4
    }

    if (outline) {
        ctx.fillStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.strokeText(text, x, y);
    }

    ctx.fillText(text, x, y);
}

const canvas = document.getElementById('canvas');

const ctx = canvas.getContext('2d');
let scalingFactor = 2;
canvas.width =250 * scalingFactor;
canvas.height = 300 * scalingFactor;
ctx.scale(scalingFactor, scalingFactor);

let width = canvas.width / scalingFactor
let height = canvas.height / scalingFactor
const halfWidth = width / 2;
const halfHeight = height / 2;

ctx.imageSmoothingEnabled= false;
let net = loadImage("./assets/net.png");
let ballImage = loadImage('./assets/ball.png');
let ballShadow = loadImage('./assets/ball-shadow.png')
let playerSprite = loadImage("./assets/player animation.png");
let playerShadow = loadImage("./assets/player shadow.png")

let TICK = 0;

function vec2(x, y) {
    return {x: x, y: y};
}

class ball {
    constructor(pos) {
        this.pos = pos;
        this.pos.z = 40;
        this.velocity = vec2(0, 0);
        this.velocity.z = 8;
        this.gravity = 10;
        this.hitbox = vec2(this.pos.x+6, this.pos.y +6 - this.pos.z)
        this.radius = 11;
    }
    update() {
        this.pos.x += this.velocity.x * dt;
        this.pos.y += this.velocity.y * dt;
        this.pos.z += this.velocity.z * dt;
    
        this.velocity.z -= this.gravity * dt;
    
        if (this.pos.z <= 0) {
            this.pos.z = 0;
            this.velocity.z = -this.velocity.z * 0.7; // bounce
        }
    }

    draw() {
        //SHADOW
        ctx.globalAlpha = 0.5;
        ctx.drawImage(ballShadow,this.pos.x-4,this.pos.y-4)
        ctx.globalAlpha = 1.0;

        // IMAGE
        // Change this later to subtract by size of the ball. 9/17/25
        //ctx.fillRect(this.pos.x - 1, this.pos.y-2-this.pos.z, 4, 4);
        ctx.drawImage(ballImage, this.pos.x - 4, this.pos.y -4 - this.pos.z)

        // HITBOX
        this.hitbox.x = this.pos.x+6;
        this.hitbox.y = this.pos.y +6 - this.pos.z;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.fillStyle="red";
        ctx.arc(this.hitbox.x, this.hitbox.y, 11, 0, 2*Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

class character {
    constructor() {
        this.imageWidth = 60;
        this.pos = vec2(width -width*0.5, height - height*0.2);
        this.pos.z = 0;
        this.velocity = vec2(0,0);
        this.velocity.z = 3;
        this.friction = 1;
        this.speed = 40;
        this.length = 20;
        this.width = 50;
        this.gravity = 50;
        this.animation = "Walk Forward";
        this.previousAnimation = this.animation;
        this.frameNumber = 0;
        this.hitbox = vec2();
    }
    update() {
        this.pos.z += this.velocity.z *dt;
        this.velocity.z -= this.gravity * dt; // gravity pulls down
        if (this.pos.z <= 0) {
            this.pos.z = 0;
            this.velocity.z = 0;
        }
        if (this.pos.z >0) {
            this.previousAnimation = this.animation;
            if (!this.animation.includes("Hit")) {
                this.animation = `Hit ${this.animation}`;
            }
        } else {
            this.animation = this.animation.replace("Hit ", "");
            if (moving) {
                this.previousAnimation = this.animation;
                if (!this.animation.includes("Walk")) {
                    this.animation = `Walk ${this.animation}`;
                }
            } else {
                this.animation = this.animation.replace("Walk ", "");
                this.frameNumber = 0;
            }
        }
        
    }
    draw() {
        let filename = "player animation";
        let animations = animationData["meta"].frameTags;
        for (var i = 0; i < animations.length; i++) {
            if (animations[i].name == this.animation) {
                let animationKey = `${filename} ${animations[i].from+this.frameNumber}.aseprite`;
                let frame = animationData.frames[animationKey].frame;
                ctx.drawImage(playerSprite,
                    frame.x, frame.y,
                    frame.w, frame.h,
                    Math.round(this.pos.x -frame.w*0.43), Math.round(this.pos.y-frame.h*0.8- this.pos.z),
                    frame.w, frame.h);
                if (TICK % 8 == 0) {
                    if (animations[i].from +this.frameNumber + 1 <= animations[i].to) {
                        this.frameNumber++
                    } else {
                        this.frameNumber = 0;
                    }
                }
            }
        }
        // SHADOW
        ctx.globalAlpha = 0.2;
        ctx.drawImage(playerShadow, this.pos.x-this.imageWidth/3.5, this.pos.y+2)
        ctx.globalAlpha = 1.0;
        // HITBOX
        // TODO: 10/17/25 The hitbox is not centered well.
        ctx.fillStyle = "red";
        ctx.globalAlpha = 0.2;
        this.hitbox.x = this.pos.x - this.width /2.2;
        this.hitbox.y = this.pos.y-this.pos.z - (this.length+5)
        ctx.fillRect(this.hitbox.x, this.hitbox.y, this.width, this.length);
        ctx.globalAlpha = 1.0;
    }
}
let Ball = new ball(vec2(100, 230));
let Character = new character();

// https://www.jeffreythompson.org/collision-detection/circle-rect.php
function circleRect(cx, cy, radius, rx, ry, rw, rh) {

    // temporary variables to set edges for testing
    let testX = cx;
    let testY = cy;
  
    // which edge is closest?
    if (cx < rx)         testX = rx;      // test left edge
    else if (cx > rx+rw) testX = rx+rw;   // right edge
    if (cy < ry)         testY = ry;      // top edge
    else if (cy > ry+rh) testY = ry+rh;   // bottom edge
  
    // get distance from closest edges
    let distX = cx-testX;
    let distY = cy-testY;
    let distance = Math.sqrt( (distX*distX) + (distY*distY) );
  
    // if the distance is less than the radius, collision!
    if (distance <= radius) {
      return true;
    }
    return false;
  }

let lastTime = performance.now();
let dt = 0;
function gameUpdate() {
    let now = performance.now();
    dt = (now - lastTime) / 1000; // convert ms to seconds
    lastTime = now;
    Ball.update();
    updateInput(dt);
    Character.update();

    // Collisions
    console.log(circleRect(Ball.hitbox.x, Ball.hitbox.y, Ball.radius, Character.hitbox.x, Character.hitbox.y, Character.width, Character.length))
    // TICK COUNTER
    TICK++;

}

function gameDraw() {
    ctx.strokeStyle="white";
    let sideLines = 0.1;
    ctx.beginPath();
    // TOP
    ctx.moveTo(width*sideLines,height*0.1);
    ctx.lineTo(width-(width*sideLines),height*0.1);
    //BOTTOM
    ctx.moveTo(width*sideLines,height - height*0.1);
    ctx.lineTo(width-(width*sideLines), height-height*0.1);
    //SIDE LEFT
    ctx.moveTo(width*sideLines,height*0.1);
    ctx.lineTo(width*sideLines, height-height*0.1);
    //SIDE Right
    ctx.moveTo(width-width*sideLines,height*0.1);
    ctx.lineTo(width -width*sideLines, height-height*0.1);
    //Front Lines
    let bottomFrontLine = 0.4;
    ctx.moveTo(width*sideLines,height - height*bottomFrontLine);
    ctx.lineTo(width-(width*sideLines), height-height*bottomFrontLine);
    let topFrontLine = 0.6;
    ctx.moveTo(width*sideLines,height - height*topFrontLine);
    ctx.lineTo(width-(width*sideLines), height-height*topFrontLine);
    ctx.stroke();

    //NET
    ctx.drawImage(net, halfWidth - 233/2, height*0.4);
    Ball.draw();
    Character.draw();
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    gameUpdate();
    gameDraw()
    window.requestAnimationFrame(gameLoop);    
}

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    s: false,
    a: false,
    d: false,
    " ":false,
};

window.addEventListener("keydown", (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
});
window.addEventListener("keyup", (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});
let moving;
function updateInput(dt) {
    let speed = Character.speed * dt;
    moving = keys.ArrowUp || keys.w || keys.ArrowDown || keys.s || keys.ArrowLeft || keys.a || keys.ArrowRight || keys.d;
    let addY = 0;
    let addX = 0;
    if (keys.ArrowUp || keys.w) {
        addY -= 1;
        Character.animation ="Backward"
    }
    if (keys.ArrowDown || keys.s) {
        addY += 1;
        Character.animation ="Forward"
    }
    
    if (keys.ArrowLeft || keys.a) {
        addX -= 1;
        Character.animation ="Left"
    }
    if (keys.ArrowRight || keys.d) {
        addX += 1;
        Character.animation ="Right"
    }
    let normalized = Math.hypot(addY,addX)
    // Normalize Diagonals.
    if (addX != 0 && addY != 0) {
        Character.pos.x += (addX/normalized) * speed
        Character.pos.y += (addY/normalized) * speed
    } else {
        Character.pos.x += addX * speed
        Character.pos.y += addY * speed
    }
    if (keys[" "]) {
        Character.pos.z += speed;
    }
}
//document.addEventListener("keydown", e => {
//    if (e.key === "ArrowUp") { // spacebar hit
//        Ball.velocity.z = 15;             // go upward
//        Ball.velocity.y = -15;     // move forward
//
//        Character.velocity.y += 2;
//    }
//
//    if (e.key === "ArrowDown") {
//        Ball.velocity.z = 15; 
//        Ball.velocity.y = 15;   
//    }
//});

gameLoop();