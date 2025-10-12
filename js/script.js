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
function vec2(x, y) {
    return {x: x, y: y};
}

class ball {
    constructor(pos) {
        this.pos = pos;
        this.pos.z = 30;
        this.velocity = vec2(0, 0);
        this.velocity.z = 2;
        this.gravity = 9.8;
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
        ctx.globalAlpha = 0.5;
        ctx.drawImage(ballShadow,this.pos.x-4,this.pos.y-4)
        ctx.globalAlpha = 1.0;
        // Change this later to subtract by size of the ball. 9/17/25
        //ctx.fillRect(this.pos.x - 1, this.pos.y-2-this.pos.z, 4, 4);
        ctx.drawImage(ballImage, this.pos.x - 4, this.pos.y -4 - this.pos.z)
    }
}

class character {
    constructor() {
        this.pos = vec2(width -width*0.5, height - height*0.2);
        this.pos.z = 0;
        this.velocity = vec2(0,0);
        this.velocity.z = 3;
        this.friction = 1;
        this.speed = 40;
        this.length = 10;
        this.width = 6;
        this.gravity = 50;
        this.animation = "Forward";
        this.previousAnimation = this.animation;
    }
    update() {
        this.pos.z += this.velocity.z *dt;
        this.velocity.z -= this.gravity * dt; // gravity pulls down
        if (this.pos.z <= 0) {
            this.pos.z = 0;
            this.velocity.z = 0;
        }
        console.log(this.pos.z)
        console.log(this.animation);
        if (this.pos.z >0) {
            this.previousAnimation = this.animation;
            if (!this.animation.includes("Hit")) {
                this.animation = `Hit ${this.animation}`;
            }
        } else {
            this.animation = this.animation.replace("Hit ", "");
        }
    }
    draw() {
        let filename = "player animation";
        let animations = animationData["meta"].frameTags;
        for (var i = 0; i < animations.length; i++) {
            if (animations[i].name == this.animation) {
                console.log(animations[i].name);
                if (animations[i].from == animations[i].to) {
                    let animationKey = `${filename} ${animations[i].from}.aseprite`;
                    let frame = animationData.frames[animationKey].frame;
                    ctx.drawImage(playerSprite,
                        frame.x, frame.y,
                        frame.w, frame.h,
                        Math.round(this.pos.x -frame.w*0.43), Math.round(this.pos.y-frame.h*0.8- this.pos.z),
                        frame.w, frame.h);
                }
            }
        }
        console.log(this.pos.y);
        console.log(this.pos.z);

        ctx.fillStyle="black";
        ctx.globalAlpha = 0.2;
        ctx.fillRect(this.pos.x -this.width/4 , this.pos.y+(this.length-this.length*0.2), this.width*1.5, this.width/2);
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = "red";
        ctx.fillRect(this.pos.x, this.pos.y-this.pos.z, this.width, this.length);
    }
}
let Ball = new ball(vec2(50, 130));
let Character = new character();

let lastTime = performance.now();
let dt = 0;
function gameUpdate() {
    let now = performance.now();
    dt = (now - lastTime) / 1000; // convert ms to seconds
    lastTime = now;
    Ball.update();
    updateInput(dt);
    Character.update();

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

function updateInput(dt) {
    let speed = Character.speed * dt;

    if (keys.ArrowUp || keys.w) {
        Character.pos.y -= speed;
        Character.animation ="Backward"
    }
    if (keys.ArrowDown || keys.s) {
        Character.pos.y += speed;
        Character.animation ="Forward"
    }

    if (keys.ArrowLeft || keys.a) {
        Character.pos.x -= speed;
        Character.animation ="Left"
    }
    if (keys.ArrowRight || keys.d) {
        Character.pos.x += speed;
        Character.animation ="Right"

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