# Volleyball

# TODO List
## Art
    - [X] Ball at different sizes
    - [X] Net
    - [X] Character
        - [X] Run
            - [X] Side
            - [X] Forward
            - [X] Backward
        - [X] Stand
            - [X] Side
            - [X] Forward
            - [X] Backward
        - [X] Hit
            - [X] Side
            - [X] Forward
            - [X] Backward
    - [X] Player 2
## Code
- [X] Tell the player what caused a point
- [ ] Make an indicator when the ball has gone offscreen
    - ASSIGNED: (10/31/25)
- [X] Need to make it so that way the player can decide when and how to shoot the ball. in 2 player it must randomly select who shoots.
    - A: 11/23/25
    - C: 1/24/26
- [X] Need to make AI so that way he shoots the ball where the player isn't located but also not outside the trapezoid
    - A: 11/15/25
- [X] Make it so that way based on the direction l/r the player goes that's where the ball goes.
    - [X] Make it so it doesn't go past a left most bounds and a right most bounds
    - [X] Make it so you can make it grow in size 
        - [X] perhaps change collors as a power indicator
    - [X] Only make it appear when the ball is near the player
    - D: 11/22/25
- [X] Make it so that way you can't run and continue hitting the ball. 
    - ASSIGNED: (11/18/25)
    - COMPLETED: (11/20/25)
- [X] Organize the code into seperate files.
    - D: 11/22/25
- [X] Make it use the player jump sprite when hitting the ball.
    - D: 11/20/25
### Polish
- [ ] Menu 
    - Be able to choose 1P/2P
    - A: (11/16/25)
- [ ] Make the side view prettier
    - ASSIGNED: (11/01/25)
- [X] Make the ball grow darker as it's away from the ground lighter as it gets closer.
    - Assigned: (11/18/25)
    - Completed: (12/18/25)
- [ ] Dash
    - [ ] Yokai watch style dash (10/26/25)
### GENERAL
- Find name for the project
- change the name on github
### Done/OLD Stuff
- [X] Code Animation player
- [X] Make it so that way the hitbox adjusts when the player jumps up.
- [X] (10/13/25) Fix diagonals
- [X] Make a backwall to bounce off of.
- [X] Ball Collision
    - [X] (10/19/25) Player
    - [X] (11/15/25) I need to fix it so that way it checks if they are on the same y position
        - ASSIGNED: (10/31/25)
    - [X] (10/26/25) Net 
- [X] Make ball bounce
- [X] Check if ball is outside of the play area 
    - ASSIGNED: (10/31/25)
    - COMPLETED: (11/01/25)
- [X] Draw dashed line from ball to ground
    - ASSIGNED: (10/31/25)
    - COMPLETED: (10/31/25)
## SFX
- [ ] Hand slapping ball various sounds
    - ASSIGNED: (10/31/25)
- ball hitting net
- button pressing sounds
- sound for cranking the arrow
- sound for lengthening the arrow
- walking sound?
# Devlog
## 9/12/25
Setup project working on ball bounce have idea. 2d badminton like mario tennis top down. Implemented ball bouncing physics
## 9/13/25
Decided that I am going to make volleyball game I think. However if it fails or I get done with it I might take the code and make a top down minigolf game with a ball that can go up vertically. I think volleyball could be cool because it takes the direction of Mario Tennis and changes it up a bit. 
## 9/14/25 
You can move around now.
## 9/27/25
Implemented Jump.
## 10/4/25
- Procedurally generated lines for backgorund which is kind of inneficient
- working on bacground size
- 3d modeled a net and put it in the game. 
- The game's size is going to have to get working
- THinking about making a hunch back character. Fixed the shadows sort of.
## 10/7/25
- Made a sprite
- Made the forward animation (WIP)
## 10/8/25
- Begane work on the side animation. 
## 10/11/25 
- Began work on on the animation player
- You can now change the sprite when the left, right, up, down keys are pressed.
- Tried to make it work on hit but it breaks for some reason.
- It also works to give the hit animation when needed
## 10/12/25
- Implemented animation player it animates when player moves.
## 10/13/25 
- Normalized the diagonal movement.
## 10/17/25
- Made ball bigger
- Made player shadow sprite
- Positioned Hitbox better.
- Researched how to do circle to square collisions. Probably better than doing square to square.
## 10/19/25
- Implemented Circle Hitbox
- Implemented Circle to square collisions using code from:
    - https://www.jeffreythompson.org/collision-detection/circle-rect.php
## 10/21/25
- Fixed bug with how hitbox was defined so that way it could work to move the ball when the hitbox's of the player and ball collide
## 10/25/25
- not sure if I have been forgetting to write here
- implemeneted it so that way when you jump the hitbox becomes higher
- made the field a trapezoid which helps with visibility
- fixed it so that way the ball is behind the net when coming back if it's below it.
    - This better conveys depth
## 10/26/25
- Deleted some console.logs
- Made the dash run on f key
- Need to add timeout to dash.
- Worked on net collision checking
## 10/27/25
In Gamedev one must ductape around their poor game design experience/judgement
I did this by
- Adding some debugging squares around the ball
- Finnessing net to ball collision
- Made a sidebar canvas that shows from a side view perspective what's going on with the ball
    - It works decently well. Math is hard.
## 10/28/25
- Made an arrow in desmos
The idea is that the way the ball travels an arrow will stem from the player
- Q moves the arrow left
- E moves the arrow right
- X increases radius speed
## 11/1/25
Implemented if in bounds of the trapezoidal field
## 11/2/25
Begane work on the shooting by adding a line that can be controlled with q and e for angle
## 11/3/25
Worked on outline
## 11/5/25
Drew whole arrow and it has an outline.
I think that i need to delete jump
it's not a part of mvp perhaps make thins to easy. I think not having jump adds more flavor perhaps.
## 11/8/25
Made it so actually x and c so the thumb controlls wheter the ball goes left or right
## 11/12/25
Begane work on implementing second player. He is drawn to the screen
fixed animation error where it would animate the second player if I started moving.
Decided to make the second character gray as an alternative to orange. Blue looks weird.
## 11/13/25
Began work on the arrow for the second player. Fixed directionality.
## 11/14/25
Began work on the enemy AI and animating him.
## 11/15/25
Heavy progress on the AI made it fully functional and fixed bugs. Still not perfect
## 11/16/25
Made it so that way on shift the arrow would grow in intensity shows powerby changing color
## 11/18/25
Made it the hitbox smaller. 
Cleaned up todo list
Changed the name on the browser
fix shootspeed
## 11/20/25
Made a debug button. For now all it does is that it toggles the visual hitbox on the player.

I think my game is a buggy long coded inneficient mess. So the sooner I finish the better.
dividing intos seperate files I must do even if tedious because it's a good learning experience.

Also made it so that way you can't run into the ball and keep hitting it. You can only hit it once. Debug tool comes in handy
It uses the jump sprite when hitting the ball as well.
## 11/22/25
Split everything into several files
## 11/23/25
Made the screen wider in height.
## 11/25/25
Worked on making enemy AI turn his arrow advantagously against the player
He can play quite perfectly
in life you can code your own friends. Clanker dev 101 -- me
## 11/28/25
Figured out how to make it not do stuff when you switch the tab using document.hasfocus
## 11/30/25
Debug text of character positions
Made it so that way I can stop the arrow from showing
Made it so the AI just choses randomly which direction to go left or right every 100 frames or so
## 12/14/25
Make it so that way your shadow highlights when you can hit the ball. 
## 12/21/25
Removed the sideview
## 12/23/25
Fixed opponent  going through the net when diagnoal
## 1/5/26
Implemented points and now it feels like a real game.
## 1/18/26
- Fixed the sideways
- Made the shadow grow darker the closer it is to the ground
- made the dashed line from the ball transparent and yellow
## 1/25/26
Added wrapping.
## 1/26/26
Made it so that way it will pause a bit when you lose
## 2/1/26
Started work on the dash meter
## 2/9/26
FIxed velocity so that way it works on both sides
delete teleport.
## 2/13/26
Implemented the ability to see why a point was earned.
Fixed a mistake with the velocity increasing.
I think there needs to be like a logarithmic curve in how the ball speed increases.
Need to implement dash

# User Reports
## 11/26/25
- Users are confused that you can't just run up to the ball. You need to tap the ball and send it flying or something. Detection against this is still not working well
- [X] Users feel the character is too slow
- Ball looks weird in the top down 2d space. You can't see the ball when the player is on top of it.
    - perhaps can detect for this and make the ball transparent on top of the player?
- When the user gets out of the tab all of a sudden the game gets weird and speeds up
    - [X] Must detect when inactive and pause the game
- Softlock occurs when ball gets off the screen and when ball stops bouncing.
    - Need to start work on a points system and start awarding points to either player.
    - Need a reset condition on when a point is rewarded
- [X] Need award point when the character hits through the net.
- [ ] Does the game only work on chrome???
- [ ] Games name is badminton and not volleyball!
- [X] Need to have a top/bottom thing that shows player and opponent x,y 
- [X] Figure out how to make it easy to hit the ball
    - Perhaps can make it so that way the shadow highlights when ball is hitable
- IDEA to make the game more interesting: Have the ball wrap around if it's in air to the other side of the screen
## 2/6/25
- Hit net animation
- Out of bounds check delete the teleport
- mouse to control