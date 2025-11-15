# Volleyball

# TODO List
- Art
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
    - [ ] Player 2
- [X] Code Animation player
- [X] Make it so that way the hitbox adjusts when the player jumps up.
- [X] (10/13/25) Fix diagonals
- [X] Make a backwall to bounce off of.
- [X] Ball Collision
    - [X] (10/19/25) Player
    - [ ] I need to fix it so that way it checks if they are on the same y position
        - ASSIGNED: (10/31/25)
    - [X] (10/26/25) Net 
- [X] Make ball bounce
- [X] Check if ball is outside of the play area 
    - ASSIGNED: (10/31/25)
    - COMPLETED: (11/01/25)
- [X] Draw dashed line from ball to ground
    - ASSIGNED: (10/31/25)
    - COMPLETED: (10/31/25)
- [ ] Make it so that way based on the direction l/r the player goes that's where the ball goes.
    - [X] Make it so it doesn't go past a left most bounds and a right most bounds
    - Make it so you can make it grow in size perhaps change collors as a power indicator
    - Only make it appear when the ball is near the player
- [ ] Make an indicator when the ball has gone offscreen
    - ASSIGNED: (10/31/25)
- [ ] SFX
    - [ ] Ball Hit
    - ASSIGNED: (10/31/25)
- [ ] Make the side view prettier
    - ASSIGNED: (11/01/25)
- [ ] Dash
    - [ ] Yokai watch style dash (10/26/25)
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