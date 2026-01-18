import { vec2, loadImage, drawPixelText, createAudio, ctx, width, height, canvas, halfWidth, halfHeight, playerSprite, opponentSprite, playerShadow, ballShadow, ballImage } from "./globals.js";
import { dt, TICK, DEBUG} from "./script.js"

class ball {
    constructor(pos) {
        this.pos = pos;
        this.pos.z = 50;
        this.velocity = vec2(0, 0);
        this.velocity.z = 8;
        this.gravity = 25;
        this.hitbox = vec2();
        this.radius = 8;
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
        let darkness = 1 - (this.pos.z / 150)
        //console.log(darkness)
        ctx.globalAlpha = darkness;
        this.groundCenter.x = this.pos.x-4
        this.groundCenter.y = this.pos.y-4;
        ctx.drawImage(ballShadow,this.groundCenter.x,this.groundCenter.y)
        ctx.globalAlpha = 1.0;
        
        // Vertical Height line
        ctx.globalAlpha = 0.8
        ctx.beginPath();
        ctx.strokeStyle="#fbf236"
        ctx.lineWidth = 2;
        ctx.setLineDash([2, 2]);
        ctx.moveTo(this.pos.x+6, this.pos.y-this.pos.z+16);
        ctx.lineTo(this.pos.x+6, this.pos.y+6);
        ctx.stroke();
        ctx.setLineDash([0,0])
        ctx.globalAlpha = 1

        // IMAGE
        // Change this later to subtract by size of the ball. 9/17/25
        //ctx.fillRect(this.pos.x - 1, this.pos.y-2-this.pos.z, 4, 4);
        ctx.drawImage(ballImage, this.pos.x - 4, this.pos.y -4 - this.pos.z)

        // HITBOX
        if (DEBUG) {
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.fillStyle="red";
            ctx.arc(this.hitbox.x, this.hitbox.y, this.radius, 0, 2*Math.PI);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

    }
}

export { ball }