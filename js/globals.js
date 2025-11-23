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
// Ball
let ballImage = loadImage('./assets/ball.png');
let ballShadow = loadImage('./assets/ball-shadow.png')
// Player
let playerSprite = loadImage("./assets/player animation.png");
let opponentSprite = loadImage("./assets/opponent animation.png");
let playerShadow = loadImage("./assets/player shadow.png")

export { canvas, ctx, scalingFactor, width, height, halfWidth, halfHeight, sideView, sideview, sideViewWidth, sideViewHeight, halfSideWidth, halfHeightHeight, ballImage, ballShadow, playerSprite, opponentSprite, playerShadow}

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
