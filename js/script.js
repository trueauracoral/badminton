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
let scalingFactor = 4;
canvas.width =128 * scalingFactor;
canvas.height = 128 * scalingFactor;
ctx.scale(scalingFactor, scalingFactor);

let width = canvas.width / scalingFactor
let height = canvas.height / scalingFactor
const halfWidth = width / 2;
const halfHeight = height / 2;

ctx.imageSmoothingEnabled= false

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
        ctx.fillRect(this.pos.x, this.pos.y, 2, 2);
        // Change this later to subtract by size of the ball. 9/17/25
        ctx.fillRect(this.pos.x - 1, this.pos.y-2-this.pos.z, 4, 4);
    }
}

class character {
    constructor() {
        this.pos = vec2(width -20, height -20);
        this.pos.z = 0;
        this.velocity = vec2(0,0);
        this.velocity.z = 3;
        this.friction = 1;
        this.speed = 25;
        this.length = 8;
        this.width = 4;
        this.gravity = 20;
    }
    update() {
        this.pos.z += this.velocity.z *dt;
        this.velocity.z -= this.gravity * dt; // gravity pulls down
        if (this.pos.z <= 0) {
            this.pos.z = 0;
            this.velocity.z = 0;
        }
        console.log(this.pos.z)
    }
    draw() {
        ctx.fillRect(this.pos.x, this.pos.y-this.pos.z, this.width, this.length);
        // Fix this width stuff.
        ctx.fillRect(this.pos.x + (this.width -(this.width+1) ), this.pos.y-(this.length /2)+this.length, this.width +2, 4);
    }
}
let Ball = new ball(vec2(50, 90));
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
    }
    if (keys.ArrowDown || keys.s) {
        Character.pos.y += speed;
    }

    if (keys.ArrowLeft || keys.a) {
        Character.pos.x -= speed;
    }
    if (keys.ArrowRight || keys.d) {
        Character.pos.x += speed;
    }

    if (keys[" "]) {
        console.log("HI");
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