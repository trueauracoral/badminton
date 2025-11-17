import animationData from "../assets/player animation.json" with { type: "json" };

//console.log(animationData);

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

function drawPixelText(text, x, y, outline=false, color="black") {
    ctx.imageSmoothingEnabled = false; 
    ctx.textBaseline = 'top';
    ctx.fillStyle = color; 
    ctx.font = "16px Arial";
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

const sideView = document.getElementById('sideView');

const sideview = sideView.getContext('2d');
let sideScaleFactor = 2;
sideView.width = 100 * sideScaleFactor;
sideView.height = 25 * sideScaleFactor;
let sideViewWidth = sideView.width / scalingFactor
let sideViewHeight = sideView.height / scalingFactor
const halfSideWidth = sideViewWidth / 2;
const halfHeightHeight = sideViewHeight / 2;
sideview.scale(sideScaleFactor, sideScaleFactor);

ctx.imageSmoothingEnabled= false;
// Net
let net = loadImage("./assets/net.png");
let netX = halfWidth - 233/2;
let netY = height*0.4;
let netH = 65;
let ballImage = loadImage('./assets/ball.png');
// Ball
let ballShadow = loadImage('./assets/ball-shadow.png')
let playerSprite = loadImage("./assets/player animation.png");
let opponentSprite = loadImage("./assets/opponent animation.png");
let playerShadow = loadImage("./assets/player shadow.png")

let TICK = 0;

function vec2(x, y) {
    return {x: x, y: y};
}

class ball {
    constructor(pos) {
        this.pos = pos;
        this.pos.z = 50;
        this.velocity = vec2(0, 0);
        this.velocity.z = 8;
        this.gravity = 15;
        this.hitbox = vec2();
        this.radius = 11;
        this.groundCenter = vec2();
    }
    update() {
        this.pos.x += this.velocity.x * dt;
        this.hitbox.x = this.pos.x+6;
        this.pos.y += this.velocity.y * dt;
        this.pos.z += this.velocity.z * dt;
    
        this.velocity.z -= this.gravity * dt;
    
        if (this.pos.z <= 0) {
            this.pos.z = 0;
            this.velocity.z = -this.velocity.z * 0.7; // bounce
        }
        this.hitbox.y = this.pos.y +6 - this.pos.z;
        //console.log(this.pos.z);
        //console.log(this.hitbox.x);
        //console.log(this.hitbox.y);
    }

    draw() {
        //SHADOW
        ctx.globalAlpha = 0.5;
        this.groundCenter.x = this.pos.x-4
        this.groundCenter.y = this.pos.y-4;
        ctx.drawImage(ballShadow,this.groundCenter.x,this.groundCenter.y)
        ctx.globalAlpha = 1.0;

        // IMAGE
        // Change this later to subtract by size of the ball. 9/17/25
        //ctx.fillRect(this.pos.x - 1, this.pos.y-2-this.pos.z, 4, 4);
        ctx.drawImage(ballImage, this.pos.x - 4, this.pos.y -4 - this.pos.z)

        // HITBOX
        //ctx.globalAlpha = 0.5;
        //ctx.beginPath();
        //ctx.fillStyle="red";
        //ctx.arc(this.hitbox.x, this.hitbox.y, 11, 0, 2*Math.PI);
        //ctx.fill();
        //ctx.globalAlpha = 1;

        // Vertical Height line
        ctx.beginPath();
        ctx.setLineDash([2, 2]);
        ctx.moveTo(this.pos.x+6, this.pos.y-this.pos.z+16);
        ctx.lineTo(this.pos.x+6, this.pos.y+6);
        ctx.stroke();
        ctx.setLineDash([0,0])
    }
}

class character {
    constructor() {
        this.imageWidth = 60;
        this.pos = vec2(width -width*0.5, height - height*0.2);
        this.pos.z = 0;
        this.velocity = vec2(0,0);
        this.velocity.z = 0;
        this.friction = 1;
        this.speed = 40;
        this.length = 20;
        this.width = 50;
        this.gravity = 40;
        // Animation
        this.animation = "Walk Forward";
        this.previousAnimation = this.animation;
        this.sprite = playerSprite;
        this.moving = false;
        this.frameNumber = 0;
        // collision
        this.hitbox = vec2();
        this.center = vec2(3,-10);
        // hiting left/right
        this.force = 20;
        this.forceAngle = 10;
        this.angle = -(Math.PI)/2;
        this.neutral = this.angle;
        this.newPointX;
        this.newPointY;
        this.actualCenterX;
        this.actualCenterY;
        this.colorG = 255;
        this.colorB = 255;
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
            if (this.moving) {
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
                ctx.drawImage(this.sprite,
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
        //ctx.fillStyle = "red";
        //ctx.globalAlpha = 0.2;
        this.hitbox.x = this.pos.x - this.width /2.2;
        this.hitbox.y = this.pos.y-this.pos.z - (this.length+5)
        //console.log(this.pos.z);
        if (this.pos.z > 0) {
            this.hitbox.y = this.pos.y-this.pos.z - (this.length+5) - 30
        }
        //ctx.fillRect(this.hitbox.x, this.hitbox.y, this.width, this.length);
        //ctx.globalAlpha = 1.0;

        // Hit Right/Left
        if (this.angle < this.neutral) {
            this.angle += 1*dt;
        } else if (this.angle > this.neutral) {
            this.angle -= 1*dt;
        }
        console.log(this.force);
        if (this.force > 20) {
            this.force -= 10*dt;
            if (this.colorG < 255 && this.colorB < 255) {
                this.colorG += 60*dt;
                this.colorB += 60*dt;
            }
            console.log(`COLORS: ${this.colorG} ${this.colorB}`);
        }
        ctx.beginPath()
        ctx.lineWidth = 1
        this.actualCenterX = this.pos.x + this.center.x;
        this.actualCenterY = this.pos.y + this.center.y;
        ctx.moveTo(this.actualCenterX, this.actualCenterY);
        this.newPointX = this.actualCenterX + (this.force * Math.cos(this.angle));
        this.newPointY = this.actualCenterY + (this.force * Math.sin(this.angle));
        let angleArrow = 8.95;
        ctx.lineTo(this.newPointX, this.newPointY);
        ctx.moveTo(this.newPointX, this.newPointY);
        ctx.lineTo(this.newPointX + (this.forceAngle * Math.cos(this.angle+angleArrow)), this.newPointY+ (this.forceAngle * Math.sin(this.angle+angleArrow)));
        ctx.moveTo(this.newPointX, this.newPointY);
        ctx.lineTo(this.newPointX + (this.forceAngle * Math.cos(this.angle-angleArrow)), this.newPointY+ (this.forceAngle * Math.sin(this.angle-angleArrow)));
        //console.log(this.neutral);
        //console.log(this.angle);
        //console.log(this.newPointX - this.center.x)
        //// draw
        ctx.lineWidth = 4;
        //https://stackoverflow.com/a/20874475/24903843
        ctx.strokeStyle="black";
        ctx.stroke();
        ctx.strokeStyle=`rgb(255 ${this.colorG} ${this.colorB})`;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}
let Ball = new ball(vec2(100, 223));
let Character = new character();
let opponent = new character();
opponent.pos.y -= 140;
opponent.sprite = opponentSprite;
opponent.angle = Math.PI/2;
opponent.neutral = opponent.angle;
opponent.center.y -= 20;

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
        return "t";
    }
    return false;
}
// https://www.jeffreythompson.org/collision-detection/poly-point.php
function polyPoint(vertices, px, py) {
    let collision = false;

    // go through each of the vertices, plus
    // the next vertex in the list
    let next = 0;
    for (let current=0; current<vertices.length; current++) {

        // get next vertex in list
        // if we've hit the end, wrap around to 0
        next = current+1;
        if (next == vertices.length) next = 0;

        // get the PVectors at our current position
        // this makes our if statement a little cleaner
        let vc = vertices[current];    // c for "current"
        let vn = vertices[next];       // n for "next"

        // compare position, flip 'collision' variable
        // back and forth
        if (((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) &&
            (px < (vn.x-vc.x)*(py-vc.y) / (vn.y-vc.y)+vc.x)) {
                collision = !collision;
        }
    }
    return collision;
}

function AImovement(dt) {
    let speed = (opponent.speed) * dt;

    let targetX = Ball.pos.x+6;
    let targetY = Ball.pos.y+6;

    let dx = targetX - opponent.pos.x-8;
    let dy = targetY - opponent.pos.y-10;
    //ctx.beginPath();
    //ctx.moveTo(opponent.pos.x, opponent.pos.y);
    //ctx.lineTo(targetX, targetY)
    //ctx.stroke()

    let distance = Math.hypot(dx, dy);
    //console.log(`DX: ${dx}\nDY: ${dy}`);
    
    if (distance > 10) {
        if ((Math.abs(Math.floor(Math.abs(dx)) - Math.floor(Math.abs(dy)))) < 1) {
            // 11/14/25 It's like he can't catch up with the ball for some reason
            opponent.pos.x += (dx / distance) * (speed/dt+20)*dt;
            opponent.pos.y += (dy / distance) * (speed/dt+20)*dt;
        } else if (Math.abs(dx) > Math.abs(dy)) {
            //console.log("HORIZONTAL")
            opponent.pos.x += (dx / distance) * speed;
            if (opponent.pos.x > targetX) {
                opponent.animation = "Left";
            } else {
                opponent.animation = "Right";
            }
            opponent.moving = true;
        } else if (Math.abs(dy) > Math.abs(dx)) {
            let newValue = (dy / distance) * speed;
            //console.log(`${opponent.pos.y + newValue} < ${netY+netH-20}`)
            // NO clue why this prevents clipping through the net.
            if (Math.floor(opponent.pos.y + newValue) < netY+netH-20) {
                //console.log("VERTICAL 2")
                opponent.pos.y += (dy / distance) * speed;
                if (opponent.pos.y > targetY) {
                    opponent.animation = "Backward";
                } else {
                    opponent.animation = "Forward";
                }
                opponent.moving = true;
            } else {
                //console.log("HI");
                opponent.pos.y -= 0.5;
            }
        } else {
            opponent.animation = "Forward";
            opponent.moving = false;
        }
    }
    if (opponent.pos.y > netY + netH-20) {
        opponent.pos.y - netY+netH-20;
    }
}

let lastTime = performance.now();
let dt = 0;
let ballC1Collision = false;
let ballC2Collision = false;
let outOfBounds = false
function gameUpdate() {
    let now = performance.now();
    dt = (now - lastTime) / 1000; // convert ms to seconds
    lastTime = now;
    // Collisions - hit ball
    if (ballC1Collision == "t" && (Character.pos.y < Ball.pos.y + 5 && Character.pos.y > Ball.pos.y - 5)) {
        Ball.velocity.z = 45;
        Ball.velocity.y = -20;
        Ball.velocity.x = Character.newPointX - Character.actualCenterX;
    }
    if (ballC2Collision == "t" && (opponent.pos.y < Ball.pos.y + 10 && opponent.pos.y > Ball.pos.y - 10)) {
        Ball.velocity.z = 45;
        Ball.velocity.y = 20;
        Ball.velocity.x = Character.newPointX - Character.actualCenterX;
    }
    ballC1Collision = circleRect(Ball.hitbox.x, Ball.hitbox.y, Ball.radius, Character.hitbox.x, Character.hitbox.y, Character.width, Character.length);
    ballC2Collision = circleRect(Ball.hitbox.x, Ball.hitbox.y, Ball.radius, opponent.hitbox.x, opponent.hitbox.y, opponent.width, opponent.length)
    //console.log("collision: " + circleRect(Ball.hitbox.x, Ball.hitbox.y, Ball.radius, Character.hitbox.x, Character.hitbox.y, Character.width, Character.length));
    // Bounce off backwall
    if (Ball.pos.y < 10) {
        Ball.velocity.y = 30;
        Ball.velocity.x *= -1;
    }
    let netCussion = 5
    //console.log(`${netH - 20} > ${Ball.pos.z} | ${netY+(netH-netCussion) -5} < ${Ball.pos.y - 10} < ${netY+(netH+netCussion) -5}`)
    //ctx.beginPath();
    //ctx.rect(0,netY+(netH+netCussion) -5,3,3);
    //ctx.rect(0,netY+(netH-netCussion) -5,3,3);
    //ctx.rect(0,netY,3,3);
    //ctx.rect(0,Ball.pos.y-10,100,3);
    //ctx.rect(0,Ball.pos.y-Ball.pos.z-8,100,3);
    //ctx.stroke();
    if (netH - 10 > Ball.pos.z && (Ball.pos.y-8 <netY+(netH+netCussion) -5 && Ball.pos.y > netY+(netH-netCussion) -5)) {
        //console.log("Collided!!!")
        drawPixelText("Collided with net", 0,0)
    }
    //drawPixelText("Out of Bounds: " + outOfBounds, 0,30);
    Ball.update();

    // Is in field?
    if (polyPoint(vertices, Ball.pos.x-4, Ball.pos.y-4)) {
        outOfBounds = false;
    } else {
        outOfBounds = true;
    }
    AImovement(dt);
    updateInput(dt);
    Character.update();
    opponent.update();
    // TICK COUNTER
    TICK++;

}
// Trapezoid points
let sideLines = 0.1;
let diagonal = 20;
let topLeft = { x: width * sideLines + diagonal, y: height * 0.1 };
let topRight = { x: width - (width * sideLines) - diagonal, y: height * 0.1 };
let bottomLeft = { x: width * sideLines, y: height - height * 0.1 };
let bottomRight = { x: width - (width * sideLines), y: height - height * 0.1 };
let vertices = [topLeft, topRight, bottomRight, bottomLeft];
function gameDraw() {
    ctx.strokeStyle="white";
    ctx.beginPath();
    // TOP
    ctx.moveTo(width * sideLines + diagonal, height * 0.1);
    ctx.lineTo(width - (width * sideLines) - diagonal, height * 0.1);

    // BOTTOM
    ctx.moveTo(width * sideLines, height - height * 0.1);
    ctx.lineTo(width - (width * sideLines), height - height * 0.1);

    // SIDE LEFT
    ctx.moveTo(width * sideLines + diagonal, height * 0.1);
    ctx.lineTo(width * sideLines, height - height * 0.1);

    // SIDE RIGHT
    ctx.moveTo(width - width * sideLines - diagonal, height * 0.1);
    ctx.lineTo(width - width * sideLines, height - height * 0.1);

    // FRONT LINES
    const topY = height * 0.1;
    const bottomY = height - height * 0.1;
    const H = bottomY - topY;
    const Wb = width - 2 * (width * sideLines);
    const Wt = Wb - 2 * diagonal;
    function getFrontWidth(yCanvas) {
        const y = (bottomY - yCanvas) / H; 
        return Wb - (Wb - Wt) * y;
    }

    function drawFrontLine(yCanvas) {
        const lineWidth = getFrontWidth(yCanvas);
        const x1 = (width - lineWidth) / 2;
        const x2 = (width + lineWidth) / 2;
        ctx.moveTo(x1, yCanvas);
        ctx.lineTo(x2, yCanvas);
    }

    let bottomFrontLine = 0.4;
    let topFrontLine = 0.65;

    const bottomFrontY = height - height * bottomFrontLine;
    const topFrontY = height - height * topFrontLine;

    drawFrontLine(bottomFrontY);
    drawFrontLine(topFrontY);

    ctx.rect(topLeft.x, topLeft.y, 3,3)
    ctx.rect(topRight.x, topRight.y, 3,3)
    ctx.rect(bottomLeft.x, bottomLeft.y, 3,3)
    ctx.rect(bottomRight.x,bottomRight.y,3,3)
    // Draw all lines
    ctx.stroke();

    opponent.draw();
    //NET
    //console.log("BallY: " + Ball.pos.y - Ball.pos.z)
    //console.log("Net Y: " + netY);
    if (Ball.pos.y > netY+60) {
        ctx.drawImage(net, netX, netY);
        Ball.draw();
    } else {
        //console.log("BALLS");
        Ball.draw();
        ctx.drawImage(net, netX, netY);
    }

    Character.draw();
    sideview.beginPath();
    sideview.rect(
        (Ball.pos.y/height) * sideViewWidth,
        ((height - (Ball.pos.z)) / height) * sideViewHeight - 8, 
        3,3);
    
    sideview.rect(
        ((netY / height) * sideViewWidth)+ 20,
        ((netH / height)* sideViewHeight +10)
        ,3,5);
    sideview.stroke();
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sideview.clearRect(0, 0, sideView.width, sideView.height);
    gameUpdate();
    gameDraw()
    window.requestAnimationFrame(gameLoop);    
}

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    " ":false,
    ShiftLeft: false,
    ShiftRight: false,
    KeyA: false,
    KeyC: false,
    KeyD: false,
    KeyE: false,
    KeyF: false,
    KeyW: false,
    KeyS: false,
    KeyQ: false,
    KeyX: false,
    KeyZ: false,
};

window.addEventListener("keydown", (e) => {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = true;
    }
});
window.addEventListener("keyup", (e) => {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = false;
    }
});

function updateInput(dt) {
    let speed = Character.speed * dt;
    let shootSpeed = 100*dt;
    let shotRange = Math.PI / 4;
    // Up/Down/Left/Right
    Character.moving = keys.ArrowUp || keys.KeyW || keys.ArrowDown || keys.KeyS || keys.ArrowLeft || keys.KeyA || keys.ArrowRight || keys.KeyD;
    let addY = 0;
    let addX = 0;
    if (keys.ArrowUp || keys.KeyW) {
        addY -= 1;
        Character.animation ="Backward"
    }
    if (keys.ArrowDown || keys.KeyS) {
        addY += 1;
        Character.animation ="Forward"
    }
    
    if (keys.ArrowLeft || keys.KeyA) {
        addX -= 1;
        Character.animation ="Left"
    }
    if (keys.ArrowRight || keys.KeyD) {
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
    // JUMP
    if (keys[" "]) {
        Character.pos.z += speed;
    }
    // Dash
    if (keys.f) {
        Character.pos.x += addX * speed * 2;
    }
    // Shoot Left/Right
    //console.log("MAX: " + -1*shotRange);
    //console.log("NEW: " + Character.angle + shootSpeed * dt)
    if (keys.KeyX) {
        if (Character.angle - shootSpeed * dt > -1*(Math.PI*3)/4) {
            Character.angle -= shootSpeed * dt;
        }
    }
    if (keys.KeyC) {
        if (Character.angle + shootSpeed * dt < -1 *(Math.PI)/4) {
            Character.angle += shootSpeed * dt;
        }
    }
    if (keys.ShiftLeft) {
        console.log("hello");
        if (Character.force < 40) {
            Character.force += ((speed/dt)-10)*dt;
            if (Character.colorG > 0 && Character.colorB > 0) {
                Character.colorG -= 200*dt;
                Character.colorB -= 200*dt;
            }
        }
        console.log(Character.force);
    }
}
let lengthIndex = 0;
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