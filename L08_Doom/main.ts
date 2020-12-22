namespace L08_Doom {
  import fc = FudgeCore;
  //import fcAid = FudgeAid;

  window.addEventListener("load", hndLoad);
  const clrWhite: fc.Color = fc.Color.CSS("WHITE");
  export let viewport: fc.Viewport;
  export let root: fc.Node = new fc.Node("Root");
  export let avatar: AvatarControls;
  //let enemy: Enemy;
  export let enemies: fc.Node;
  export let walls: fc.Node = new fc.Node("Walls");
  export const sizeWall: number = 3;
  export const numWalls: number = 10;
  let cameraRadius: number = 1.3;

  async function hndLoad(_event: Event): Promise<void> {
    const canvas: HTMLCanvasElement = document.querySelector("canvas");
    avatar = new AvatarControls(fc.Vector2.ONE(1), new fc.Vector3(10, 0, 10), new fc.Vector3(0, 225, 0));
    root.appendChild(avatar);

    enemies = await hndEnemy();
    root.appendChild(enemies);

    let txtFloor: fc.TextureImage = new fc.TextureImage("../DoomAssets/DEM1_5.png");
    let mtrFloor: fc.Material = new fc.Material("Floor", fc.ShaderTexture, new fc.CoatTextured(clrWhite, txtFloor));
    let floor: Floor = new Floor(fc.Vector2.ONE(30), fc.Vector3.ZERO(), fc.Vector3.ZERO(), mtrFloor);
    root.appendChild(floor);

    buildWalls();
    root.appendChild(walls);

    let cmpCamera: fc.ComponentCamera = new fc.ComponentCamera();
    cmpCamera.projectCentral(1, 45, fc.FIELD_OF_VIEW.DIAGONAL, 0.2, 10000);
    cmpCamera.pivot.translate(fc.Vector3.Y(1.7));
    cmpCamera.backgroundColor = fc.Color.CSS("darkblue");

    avatar.addComponent(cmpCamera);

    viewport = new fc.Viewport();
    viewport.initialize("Viewport", root, cmpCamera, canvas);

    fc.Loop.addEventListener(fc.EVENT.LOOP_FRAME, hndLoop);
    fc.Loop.start(fc.LOOP_MODE.TIME_GAME, 60);

    Hud.start();

    canvas.addEventListener("mousemove", hndMouse);
    canvas.addEventListener("click", canvas.requestPointerLock);
    canvas.addEventListener("click", shoot);
  }

  function hndLoop(_event: Event): void {
    hndAvatar();

    //gameState.time = fc.LOOP_MODE.TIME_GAME;

    for (let enemy of enemies.getChildren() as Enemy[])
    enemy.update();

    viewport.draw();
  }

  function shoot(): void {
    
    if (gameState.ammo === 0) {
      gameState.ammo = 50;
    } else {
      gameState.ammo--;
      gameState.score = gameState.score + 5;
      avatar.shoot();
    }

  }
  
  async function hndEnemy(): Promise<fc.Node> {
    let enemies: fc.Node = new fc.Node("Enemies");

    let txtMancubus: fc.TextureImage = new fc.TextureImage();
    await txtMancubus.load("../DoomAssets/enemy_mancubus.png");
    let coatSprite: fc.CoatTextured = new fc.CoatTextured(clrWhite, txtMancubus);
    Enemy.generateSprites(coatSprite);
    enemies.appendChild(new Enemy("Mancubus0", new fc.Vector3(10, 0, -10)));
    enemies.appendChild(new Enemy("Mancubus1", new fc.Vector3(-10, 0, -10)));
    enemies.appendChild(new Enemy("Mancubus2", new fc.Vector3(-10, 0, 10)));
    
    return enemies;
  }

  function hndMouse(_event: MouseEvent): void {
    avatar.hndMouseControl(_event.movementX);
  }

  function hndAvatar(): void {
/*     let bouncedOff: Wall[] = bounceOffWalls(<Wall[]>walls.getChildren());
    if (bouncedOff.length < 2)
      return;

    bouncedOff = bounceOffWalls(bouncedOff);
    if (bouncedOff.length == 0)
      return; */
      let tempPos: fc.Vector3 = avatar.mtxLocal.translation;
      avatar.hndAvatarControls();
      let collisionsWall: Wall = avatar.hndCollision(cameraRadius);
      if (collisionsWall) {
        tempPos.x += collisionsWall.mtxLocal.getZ().x * 0.01;
        tempPos.z += collisionsWall.mtxLocal.getZ().z * 0.01;
        avatar.mtxLocal.translation = tempPos;
  }
}

/*   function bounceOffWalls(_walls: Wall[]): Wall[] {
    let bouncedOff: Wall[] = [];
    let posAvatar: fc.Vector3 = avatar.mtxLocal.translation;
    for (let wall of _walls) {
      let posBounce: fc.Vector3 = wall.calculateBounce(posAvatar, 1);
      if (posBounce) {
        posAvatar = posBounce;
        bouncedOff.push(wall);
      }
    }
    return bouncedOff;
  } */

  function buildWalls(): void {
    let txtWall: fc.TextureImage = new fc.TextureImage("../DoomAssets/CEMPOIS.png");
    let mtrWall: fc.Material = new fc.Material("Wall", fc.ShaderTexture, new fc.CoatTextured(clrWhite, txtWall));
    let wallPos: number;

    //Wand vorne
    wallPos = -13.5;
    for (let x: number = 0; x < 10; x++) {
      walls.addChild(new Wall(fc.Vector2.ONE(3), new fc.Vector3(wallPos, 0, -15), fc.Vector3.ZERO(), mtrWall));
      wallPos = wallPos + 3;
    }

    //Wand rechts
    wallPos = -13.5;
    for (let x: number = 0; x < 10; x++) {
      walls.addChild(new Wall(fc.Vector2.ONE(3), new fc.Vector3(15, 0, wallPos), fc.Vector3.Y(-90), mtrWall));
      wallPos = wallPos + 3;
    }

    //Wand hinten
    wallPos = -13.5;
    for (let x: number = 0; x < 10; x++) {
      walls.addChild(new Wall(fc.Vector2.ONE(3), new fc.Vector3(wallPos, 0, 15), fc.Vector3.Y(180), mtrWall));
      wallPos = wallPos + 3;
    }

    //Wand links
    wallPos = -13.5;
    for (let x: number = 0; x < 10; x++) {
      walls.addChild(new Wall(fc.Vector2.ONE(3), new fc.Vector3(-15, 0, wallPos), fc.Vector3.Y(90), mtrWall));
      wallPos = wallPos + 3;
    }

    //Wand mitte
    wallPos = -1.5;
    for (let x: number = 0; x < 2; x++) {
      walls.addChild(new Wall(fc.Vector2.ONE(3), new fc.Vector3(-3, 0, wallPos), fc.Vector3.Y(-90), mtrWall));
      wallPos = wallPos + 3;
    }
    wallPos = -1.5;
    for (let x: number = 0; x < 2; x++) {
      walls.addChild(new Wall(fc.Vector2.ONE(3), new fc.Vector3(3, 0, wallPos), fc.Vector3.Y(90), mtrWall));
      wallPos = wallPos + 3;
    }
    wallPos = -1.5;
    for (let x: number = 0; x < 2; x++) {
      walls.addChild(new Wall(fc.Vector2.ONE(3), new fc.Vector3(wallPos, 0, 3), fc.Vector3.ZERO(), mtrWall));
      wallPos = wallPos + 3;
    }
    wallPos = -1.5;
    for (let x: number = 0; x < 2; x++) {
      walls.addChild(new Wall(fc.Vector2.ONE(3), new fc.Vector3(wallPos, 0, -3), fc.Vector3.Y(180), mtrWall));
      wallPos = wallPos + 3;
    }

  }
}