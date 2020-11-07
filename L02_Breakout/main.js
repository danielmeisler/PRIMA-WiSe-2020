"use strict";
var L02_Breakout;
(function (L02_Breakout) {
    var fc = FudgeCore;
    window.addEventListener("load", hndLoad);
    let ball;
    let walls;
    let bricks;
    let paddle;
    let cmpAudio;
    let audioPong;
    let audioPaddle;
    let audioWall;
    let root;
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        audioPong = new fc.Audio("pongSound.mp3");
        audioPaddle = new fc.Audio("paddleSound.mp3");
        audioWall = new fc.Audio("wallSound.mp3");
        cmpAudio = new fc.ComponentAudio(audioPong, false, false);
        cmpAudio.connect(true);
        cmpAudio.volume = 1;
        root = new fc.Node("Root");
        ball = new L02_Breakout.MoveObject("Ball", new fc.Vector2(0, 0), new fc.Vector2(1, 1));
        root.addChild(ball);
        walls = new fc.Node("Walls");
        root.addChild(walls);
        walls.addChild(new L02_Breakout.GameObject("WallLeft", new fc.Vector2(-18, 0.2), new fc.Vector2(0.05, 28)));
        walls.addChild(new L02_Breakout.GameObject("WallRight", new fc.Vector2(18, 0.2), new fc.Vector2(0.05, 28)));
        walls.addChild(new L02_Breakout.GameObject("WallTop", new fc.Vector2(0, 14.2), new fc.Vector2(36, 0.06)));
        //walls.addChild(new GameObject("WallBottom", new fc.Vector2(0, -18), new fc.Vector2(36, 0.08)));
        bricks = new fc.Node("Bricks");
        addBricks(28);
        root.addChild(bricks);
        paddle = new L02_Breakout.Paddle("Paddle", new fc.Vector2(0, -14), new fc.Vector2(5, 0.5));
        root.appendChild(paddle);
        let cmpCamera = new fc.ComponentCamera();
        cmpCamera.pivot.translateZ(40);
        cmpCamera.pivot.rotateY(180);
        L02_Breakout.viewport = new fc.Viewport();
        L02_Breakout.viewport.initialize("Viewport", root, cmpCamera, canvas);
        fc.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, hndLoop);
        fc.Loop.start(fc.LOOP_MODE.TIME_GAME, 60);
    }
    function hndLoop(_event) {
        ball.move();
        L02_Breakout.viewport.draw();
        paddle.movePaddle();
        hndCollision();
    }
    function hndCollision() {
        for (let wall of walls.getChildren()) {
            if (ball.checkCollision(wall)) {
                cmpAudio.setAudio(audioWall);
                cmpAudio.play(true);
            }
        }
        for (let brick of bricks.getChildren()) {
            if (ball.checkCollision(brick)) {
                brick.hit();
                cmpAudio.setAudio(audioPong);
                cmpAudio.play(true);
            }
        }
        if (ball.checkCollision(paddle)) {
            cmpAudio.setAudio(audioPaddle);
            cmpAudio.play(true);
        }
    }
    function addBricks(_amount) {
        let x = -15;
        let y = 12.5;
        for (let i = 0; i < _amount; i++) {
            if (x > 15) {
                x = -15;
                y -= 2;
            }
            bricks.addChild(new L02_Breakout.Brick(`Brick-${i}`, new fc.Vector2(x, y), new fc.Vector2(3, 1)));
            x += 5;
        }
    }
})(L02_Breakout || (L02_Breakout = {}));
//# sourceMappingURL=main.js.map