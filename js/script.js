import { character } from "./character.js";
import { ball } from "./ball.js";
import { vec2, loadImage, drawPixelText, ctx, width, height, canvas, halfWidth, opponentSprite, getRandom, turn, halfHeight} from "./globals.js";

ctx.imageSmoothingEnabled= false;
// Net
let net = loadImage("./assets/net.png");
let netX = halfWidth - 236/2;
let netH = 65;
let netY = height*0.5 - netH;

// Globals
let TICK = 0;
let DEBUG = false;
let pause = false;

let Ball = new ball(vec2(100, 223));
let Character = new character();
let opponent = new character();
opponent.pos.y -= 140;
opponent.sprite = opponentSprite;
opponent.angle = Math.PI/2;
opponent.neutral = opponent.angle;
opponent.center.y -= 20;
opponent.drawArrow = false;
let lasthit = "nobody";

reset()
Ball.pos.x = Character.pos.x - 5
Ball.pos.y = Character.pos.y
Ball.pos.z = 100;
lasthit = "character"

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
let choice = true
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
    
    if (opponent.pos.y > netY + netH-20) {
        opponent.pos.y - netY+netH-20;
    }
    if (distance > 5) {
        if ((Math.abs(Math.floor(Math.abs(dx)) - Math.floor(Math.abs(dy)))) < 1) {
            // 11/14/25 It's like he can't catch up with the ball for some reason
            if (opponent.pos.y + (dy / distance) * (speed/dt+20)*dt <  netY+netH-20) {
                opponent.pos.x += (dx / distance) * (speed/dt+20)*dt;
                opponent.pos.y += (dy / distance) * (speed/dt+20)*dt;
            }
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
    if (TICK % 100 == 0) {
        opponent.moving = false;
    }
    //console.log(opponent.moving)
    // AI shoots and maybe scores??!! 11/25/25
    let startPost = vec2(opponent.actualCenterX, opponent.actualCenterY);
    let goalPost = Character.pos;
    let distanceX = goalPost.x - startPost.x
    let distanceY = goalPost.y - startPost.y
    //let shotAngle = Math.atan2(distanceY, distanceX);
    let shotAngleLeft = (3*Math.PI)/4
    let shotAngleRight = Math.PI/4
    let shotAngle = shotAngleLeft;
    let shotLength = Math.hypot(distanceX, distanceY);
    let endX = startPost.x + shotLength* Math.cos(shotAngle)
    let endY = startPost.y + shotLength* Math.sin(shotAngle)
    //console.log(shotAngle);
    function shotDistance() {
        endX = startPost.x + shotLength* Math.cos(shotAngle)
        return Math.abs(endX - Character.pos.x);
    }
    let leftDistance = shotDistance();
    shotAngle = shotAngleRight;
    let rightDistance = shotDistance();
    shotAngle = opponent.angle;
    shotDistance();
    //console.log(`Left: ${leftDistance}; Right: ${rightDistance}`)
    let shootSpeed = 2*dt
    if (TICK % 100 == 0) {

        choice = Math.random() < 0.5;
        //console.log(`I MADE THE CHOICE: ${choice}`)
    }
    //if (leftDistance > rightDistance) {
    if (choice == true) {
        //console.log(`GOING LEFT ${choice}`)
        if (opponent.angle + shootSpeed < shotAngleLeft - getRandom(0,0.5) && endX > topLeft.x) {
            opponent.angle += shootSpeed;
        }
    } else if (choice == false) {
        // } else if (leftDistance < rightDistance) {
        if (opponent.angle - shootSpeed > shotAngleRight + getRandom(0,0.7) && endX < topRight.x) {
            opponent.angle -= shootSpeed;
            //console.log(`GOING RIGHT ${choice}`)
        }
    }

    if (DEBUG) {
        ctx.beginPath();
        ctx.moveTo(startPost.x, startPost.y);
        ctx.lineTo(endX, endY); 
        ctx.stroke()
        //console.log(opponent.angle);
    }
    
}

//let lastTime = performance.now();
let dt;
let ballC1Collision = false;
let ballC2Collision = false;
let outOfBounds = false
let ballSpeed = 20;
function reset() {
    let middle = 171
    let vertDistance = 0.4;
    Character.pos = vec2(middle, height * (1-vertDistance))
    Character.pos.z = 0
    opponent.pos = vec2(middle, height * vertDistance)
    opponent.pos.z = 0
    Ball.pos.z = 100
    Ball.pos.x = middle -5
    Ball.velocity.x = 0;
    Ball.velocity.y = 0;
    Ball.velocity.z = 0;
    Ball.ballSpeed = 20;
}

let ballIncrement = 5;
function gameUpdate() {
    // Collisions - hit ball hit
    if (ballC1Collision == "t" && (Character.pos.y < Ball.pos.y + 5 && Character.pos.y > Ball.pos.y - 5) && Character.HIT == false) {
        Ball.velocity.z = 45;
        Ball.velocity.y = - (Ball.ballSpeed);
        Ball.ballSpeed+= ballIncrement
        // Ball.velocity.y = - (Character.force);
        Ball.velocity.x = Character.newPointX - Character.actualCenterX;
        Character.HIT = true;
        Ball.pos.z += 14;
        //console.log("I HIT it");
        lasthit = "character"
    } 
    //console.log(Character.HIT);
    if (TICK % 50 == 0) {
        Character.HIT = false;
    }
    if (ballC2Collision == "t" && (opponent.pos.y < Ball.pos.y + 10 && opponent.pos.y > Ball.pos.y - 10) && opponent.HIT == false) {
        Ball.velocity.z = 45;
        Ball.velocity.y = (Ball.ballSpeed);
        Ball.ballSpeed+= ballIncrement
        Ball.velocity.y = Character.force;
        Ball.velocity.x = opponent.newPointX - opponent.actualCenterX;
        opponent.HIT = true;
        Ball.pos.z += 14;
        //console.log("I HIT it");
        lasthit = "opponent"
    } 
    if (TICK % 50 == 0) {
        opponent.HIT = false;
    }
    ballC1Collision = circleRect(Ball.hitbox.x, Ball.hitbox.y, Ball.radius, Character.hitbox.x, Character.hitbox.y, Character.width, Character.length);
    ballC2Collision = circleRect(Ball.hitbox.x, Ball.hitbox.y, Ball.radius, opponent.hitbox.x, opponent.hitbox.y, opponent.width, opponent.length)
    //console.log("collision: " + circleRect(Ball.hitbox.x, Ball.hitbox.y, Ball.radius, Character.hitbox.x, Character.hitbox.y, Character.width, Character.length));
    // Bounce off backwall
    if (Ball.pos.y < 10) {
        Ball.velocity.y += 20;
        //Ball.velocity.y = 30;
        //Ball.velocity.x *= -1;
    } 
    if (Ball.pos.y > height - 10) {
        Ball.velocity.y += 20
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
    drawPixelText("Out of Bounds: " + outOfBounds, 0,30);
    drawPixelText(lasthit, 0, 15)
    Ball.update();

    // Is in field?
    if (polyPoint(vertices, Ball.pos.x-4, Ball.pos.y-4)) {
        outOfBounds = false;
    } else {
        outOfBounds = true;
    }
    // Has the ball touched ground
    //console.log(Ball.pos.z)
    let nethit = netH - 10 > Ball.pos.z && (Ball.pos.y-8 <netY+(netH+netCussion) -5 && Ball.pos.y > netY+(netH-netCussion) -5)
    if (outOfBounds || Ball.pos.z == 0 || nethit) {
        if (lasthit == "nobody") {
            reset()
            Ball.pos.x = Character.pos.x - 5
            Ball.pos.y = Character.pos.y
            Ball.pos.z = 100;
            lasthit = "character"
        } else if (lasthit == "character") {
            reset()
            Ball.pos.x = Character.pos.x - 5
            Ball.pos.y = Character.pos.y
            console.log(Ball.pos.y);
            Character.points += 1;
            console.log("HELLO");
        } else if (lasthit == "opponent") {
            reset()
            Ball.pos.x = opponent.pos.x -5
            Ball.pos.y = opponent.pos.y
            console.log(Ball.pos.y);
            opponent.points += 1;
            console.log("HELLO");
        }
        pause = true
    }
    // if (Character.dash < dashSize.x)
    // Character.dash += 7*dt;
    // console.log(Character.dash)
    updateInput(dt);
    Character.update();
    AImovement(dt);
    opponent.update();
    // TICK COUNTER
    TICK++;

    // DEBUG 11/20/25
    DEBUG = document.querySelector('input[type=checkbox]').checked;
    //DEBUG = true;
    drawPixelText(`P1: ${Math.round(Character.pos.x)}, ${Math.round(Character.pos.y)}`,0,height*0.9)
    drawPixelText(`P2: ${Math.round(opponent.pos.x)}, ${Math.round(opponent.pos.y)}`,0,height*0.95)
    drawPixelText(`Ball Z: ${Math.round(Ball.pos.z)}`,width*0.5,height*0.95)

}
// Trapezoid points
let sideLines = 0.13;
let verticalLines = 0.13
let diagonal = 15;
let topLeft = { x: width * sideLines + diagonal, y: height * verticalLines };
let topRight = { x: width - (width * sideLines) - diagonal, y: height * verticalLines };
let bottomLeft = { x: width * sideLines, y: height - height * verticalLines };
let bottomRight = { x: width - (width * sideLines), y: height - height * verticalLines };
let vertices = [topLeft, topRight, bottomRight, bottomLeft];
// DASH
// let startDashCoords = vec2(width*0.7, height*0.9)
// let dashSize = vec2(91, 16)
function gameDraw() {
    ctx.strokeStyle="white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    // TOP
    ctx.moveTo(topLeft.x, topLeft.y);
    ctx.lineTo(topRight.x, topRight.y);

    // BOTTOM
    ctx.moveTo(topRight.x, topRight.y);
    ctx.lineTo(bottomRight.x, bottomRight.y);

    // SIDE LEFT
    ctx.moveTo(bottomRight.x, bottomRight.y);
    ctx.lineTo(bottomLeft.x, bottomLeft.y);

    // SIDE RIGHT
    ctx.moveTo(bottomLeft.x, bottomLeft.y);
    ctx.lineTo(topLeft.x, topLeft.y);

    // FRONT LINES
    const topY = height * sideLines;
    const bottomY = height - height * sideLines;
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

    const bottomFrontY = (bottomLeft.y-topLeft.y) * 0.75 + topLeft.y;
    const topFrontY = (bottomLeft.y-topLeft.y) * 0.25 + topLeft.y;

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
    //Ball.draw();
    if (Ball.pos.y > netY+60) {
        ctx.drawImage(net, netX , netY);
        Ball.draw();
    } else {
        //console.log("BALLS");
        Ball.draw();
        ctx.drawImage(net, netX, netY);
    }

    Character.draw();

    // POINTS
    drawPixelText(Character.points, width / 2 - 6, 360, false, "white");
    drawPixelText(opponent.points, width / 2 - 6, 30, false, "white");
    
    // Dash Bar Percentage
    // ctx.beginPath();
    // ctx.fillStyle = "#222034"
    // ctx.fillRect(startDashCoords.x, startDashCoords.y, dashSize.x+4, dashSize.y+4)
    // ctx.fillStyle = "#cbdbfc"
    // ctx.fillRect(startDashCoords.x+2, startDashCoords.y+2, dashSize.x, dashSize.y)
    // ctx.fillStyle = "#99e550"
    // ctx.fillRect(startDashCoords.x+2, startDashCoords.y+2, Character.dash, dashSize.y)
    // ctx.stroke()
}
let lastTime = performance.now();
let seconds = 1;
let timePassed = 0
function gameLoop() {
    let now = performance.now();
    dt = (now - lastTime) / 1000;
    //console.log(now-lastTime)
    lastTime = now;
    if (dt > 0.05) {
        dt = 0.05;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!pause) {
        gameUpdate();
    } else {
        timePassed += dt
        drawPixelText(seconds, halfWidth - 5, 60, false, "white");
        if (timePassed >= 1) {
            if (seconds > 0) {
                seconds--;
            } else {
                pause = false
                seconds = 1
                timePassed = 0;
            }
            timePassed -= 1;
        }

    }
    gameDraw()
    //if (document.hasFocus()) {
    //    let now = performance.now();
    //    dt = (now - lastTime) / 1000;
    //    lastTime = now;
    //    if (dt > 0.05) {
    //        dt = 0.05;
    //    } 
    //    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //    sideview.clearRect(0, 0, sideView.width, sideView.height);
    //    gameUpdate();
    //    gameDraw()
    //}
    window.requestAnimationFrame(gameLoop);    
}

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space:false,
    ShiftLeft: false,
    ShiftRight: false,
    KeyA: false,
    KeyC: false,
    KeyD: false,
    KeyE: false,
    KeyF: false,
    KeyI: false,
    KeyJ: false,
    KeyL: false,
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
    let shootSpeed = 2*dt;
    // Up/Down/Left/Right
    Character.moving = keys.ArrowUp || keys.KeyW || keys.ArrowDown || keys.KeyS || keys.ArrowLeft || keys.KeyA || keys.ArrowRight || keys.KeyD;
    let addY = 0;
    let addX = 0;
    if (keys.ArrowUp || keys.KeyW) {
        if (Character.pos.y > netY+netH) {
            addY -= 1;
        }
        Character.animation ="Backward"
    }
    if (keys.ArrowDown || keys.KeyS) {
        if (Character.pos.y < height) {
            addY += 1;
        }
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
    // if (keys.Space) {
    //     Character.pos.z += speed;
    // }
    // Dash
    if (keys.KeyF) {
        Character.pos.x += addX * speed * 2;
    }
    // Shoot Left/Right
    //console.log("MAX: " + -1*shotRange);
    //console.log("NEW: " + Character.angle + shootSpeed * dt)
    if (keys.KeyJ) {
        if (Character.angle - shootSpeed > -1*(Math.PI*3)/4) {
            Character.angle -= shootSpeed;
        }
    }
    if (keys.KeyL) {
        if (Character.angle + shootSpeed < -1 *(Math.PI)/4) {
            Character.angle += shootSpeed;
        }
    }
    if (keys.KeyI) {
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
export { Ball, dt, TICK, DEBUG, netH, netY, netX };
gameLoop();