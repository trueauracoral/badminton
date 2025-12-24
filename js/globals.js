const canvas = document.getElementById('canvas');

const ctx = canvas.getContext('2d');
let scalingFactor = 2;
canvas.width =350 * scalingFactor;
canvas.height = 400 * scalingFactor;
ctx.scale(scalingFactor, scalingFactor);

let width = canvas.width / scalingFactor
let height = canvas.height / scalingFactor
const halfWidth = width / 2;
const halfHeight = height / 2;

// Ball
let ballImage = loadImage('./assets/ball.png');
let ballShadow = loadImage('./assets/ball-shadow.png')
let ballShadowHit = loadImage("./assets/ball-shadow-hit.png")
// Player
let playerSprite = loadImage("./assets/player animation.png");
let opponentSprite = loadImage("./assets/opponent animation.png");
let playerShadow = loadImage("./assets/player shadow.png")
let playerShadowHit = loadImage("./assets/player shadow-hit.png")


export { canvas, ctx, scalingFactor, width, height, halfWidth, halfHeight, ballImage, ballShadow, playerSprite, opponentSprite, playerShadow, ballShadowHit, playerShadowHit}

export function loadImage(src) {
    var img = new Image();
    img.src = src;
    return img;
}
export function createAudio(src) {
    var audio = document.createElement('audio');
    audio.volume = 1;
    //audio.loop   = options.loop;
    audio.src = src;
    audio.playbackRate = 4;
    return audio;
}

export function drawPixelText(text, x, y, outline=false, color="black") {
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
export function vec2(x, y) {
    return {x: x, y: y};
}

//https://stackoverflow.com/a/1527820/24903843
export function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}