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
- [ ] Ball Collision
    - [X] (10/19/25) Player
    - [ ] Net 
- [X] Make ball bounce
- [ ] Make ball change size as Y changes (???)
- [ ] Dash
- [X] (10/13/25)Fix diagonals
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