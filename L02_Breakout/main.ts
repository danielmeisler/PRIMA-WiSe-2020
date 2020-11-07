namespace L02_Breakout {
  import fc = FudgeCore;

  window.addEventListener("load", hndLoad);
  
  let ball: MoveObject;
  let walls: fc.Node;
  let bricks: fc.Node;
  let paddle: Paddle;

  let cmpAudio: fc.ComponentAudio;
  let audioPong: fc.Audio;
  let audioPaddle: fc.Audio;
  let audioWall: fc.Audio;

  export let viewport: fc.Viewport;
  let root: fc.Node;

  function hndLoad(_event: Event): void {
    const canvas: HTMLCanvasElement = document.querySelector("canvas");

    audioPong = new fc.Audio("pongSound.mp3");
    audioPaddle = new fc.Audio("paddleSound.mp3");
    audioWall = new fc.Audio("wallSound.mp3");
    cmpAudio = new fc.ComponentAudio(audioPong, false, false);
    cmpAudio.connect(true);
    cmpAudio.volume = 1;

    root = new fc.Node("Root");

    ball = new MoveObject("Ball", new fc.Vector2(0, 0), new fc.Vector2(1, 1));
    root.addChild(ball);

    walls = new fc.Node("Walls");
    root.addChild(walls);

    walls.addChild(new GameObject("WallLeft", new fc.Vector2(-18, 0.2), new fc.Vector2(0.05, 28)));
    walls.addChild(new GameObject("WallRight", new fc.Vector2(18, 0.2), new fc.Vector2(0.05, 28)));
    walls.addChild(new GameObject("WallTop", new fc.Vector2(0, 14.2), new fc.Vector2(36, 0.06)));
    //walls.addChild(new GameObject("WallBottom", new fc.Vector2(0, -18), new fc.Vector2(36, 0.08)));

    bricks = new fc.Node("Bricks");
    addBricks(28);
    root.addChild(bricks);

    paddle = new Paddle("Paddle", new fc.Vector2(0, -14), new fc.Vector2(5, 0.5));
    root.appendChild(paddle);

    let cmpCamera: fc.ComponentCamera = new fc.ComponentCamera();
    cmpCamera.pivot.translateZ(40);
    cmpCamera.pivot.rotateY(180);

    viewport = new fc.Viewport();
    viewport.initialize("Viewport", root, cmpCamera, canvas);

    fc.Loop.addEventListener(fc.EVENT.LOOP_FRAME, hndLoop);
    fc.Loop.start(fc.LOOP_MODE.TIME_GAME, 60);
  }

  function hndLoop(_event: Event): void {
    ball.move();
    viewport.draw();
    paddle.movePaddle();
    hndCollision();
  }

  function hndCollision(): void {
    for (let wall of walls.getChildren()) {
      if (ball.checkCollision(<GameObject>wall)) {
        cmpAudio.setAudio(audioWall);
        cmpAudio.play(true);
      }
    }

    for (let brick of bricks.getChildren() as Brick[]) {
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

  function addBricks(_amount: number): void {
    let x: number = -15;
    let y: number = 12.5;
    for (let i: number = 0; i < _amount; i++) {
      if (x > 15) {
        x = -15;
        y -= 2;
      }

      bricks.addChild(new Brick(`Brick-${i}`, new fc.Vector2(x, y), new fc.Vector2(3, 1)));
      x += 5;
    }
  }
}