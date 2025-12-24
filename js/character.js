import { vec2, loadImage, drawPixelText, createAudio, ctx, width, height, canvas, halfWidth, halfHeight, playerSprite, opponentSprite, playerShadow, playerShadowHit } from "./globals.js";
import { Ball, dt, TICK, DEBUG, netH, netY} from "./script.js"
import animationData from "../assets/player animation.json" with { type: "json" };

class character {
    constructor() {
        this.imageWidth = 60;
        this.pos = vec2(width -width*0.5, height - height*0.2);
        this.pos.z = 0;
        this.velocity = vec2(0,0);
        this.velocity.z = 0;
        this.friction = 1;
        this.speed = 60;
        this.length = 15;
        this.width = 40;
        this.uphit = 20;
        this.gravity = 40;
        this.points = 0;
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
        this.drawArrow = true;
        this.HIT = false;
    }
    update() {
        this.pos.z += this.velocity.z *dt;
        this.velocity.z -= this.gravity * dt; // gravity pulls down
        if (this.pos.z <= 0) {
            this.pos.z = 0;
            this.velocity.z = 0;
        }
        if (this.HIT) {
            this.previousAnimation = this.animation;
            if (this.animation.startsWith("Walk ")) {
                this.animation = this.animation.replace("Walk ", "");
            }
            if (!this.animation.includes("Hit")) {
                this.animation = `Hit ${this.animation}`;
                this.frameNumber = 0;
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
        if ((this.pos.x < Ball.pos.x + 5 && this.pos.x > Ball.pos.x -5) && (this.pos.y < Ball.pos.y + 5 && this.pos.y > Ball.pos.y - 5)) {
            ctx.globalAlpha = 0.5
            ctx.drawImage(playerShadowHit, this.pos.x-this.imageWidth/3.5, this.pos.y+2)
        } else {
            ctx.drawImage(playerShadow, this.pos.x-this.imageWidth/3.5, this.pos.y+2)
        }

        // HITBOX
        this.hitbox.x = this.pos.x - this.width /2.2;
        this.hitbox.y = this.pos.y-this.pos.z - (this.length+this.uphit)
        //console.log(this.pos.z);
        if (this.pos.z > 0) {
            this.hitbox.y = this.pos.y-this.pos.z - (this.length+5) - 30
        }
        // TODO: 10/17/25 The hitbox is not centered well.
        ctx.globalAlpha = 1.0;
        if (DEBUG) {
            ctx.fillStyle = "red";
            ctx.globalAlpha = 0.5;
            ctx.fillRect(this.hitbox.x, this.hitbox.y, this.width, this.length);
            ctx.globalAlpha = 1.0;
        }

        // Hit Right/Left
        if (this.angle < this.neutral) {
            this.angle += 1*dt;
        } else if (this.angle > this.neutral) {
            this.angle -= 1*dt;
        }
        //console.log(this.force);
        if (this.force > 20) {
            this.force -= 10*dt;
            if (this.colorG < 255 && this.colorB < 255) {
                this.colorG += 60*dt;
                this.colorB += 60*dt;
            }
            console.log(`COLORS: ${this.colorG} ${this.colorB}`);
        }
        this.actualCenterX = this.pos.x + this.center.x;
        this.actualCenterY = this.pos.y + this.center.y;
        this.newPointX = this.actualCenterX + (this.force * Math.cos(this.angle));
        this.newPointY = this.actualCenterY + (this.force * Math.sin(this.angle));
        if (this.drawArrow) {
            ctx.beginPath()
            ctx.lineWidth = 1
            ctx.moveTo(this.actualCenterX, this.actualCenterY);
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
}

export { character }