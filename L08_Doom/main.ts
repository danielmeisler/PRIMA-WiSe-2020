namespace L08_Doom {
  import fc = FudgeCore;
  //import fcAid = FudgeAid;

  window.addEventListener("load", hndLoad);
  const clrWhite: fc.Color = fc.Color.CSS("WHITE");
  export let viewport: fc.Viewport;
  let root: fc.Node = new fc.Node("Root");
  export let avatarNode: fc.Node = new fc.Node("AN");
  export let avatar: AvatarControls;
  //let enemy: Enemy;
  let enemies: fc.Node;
  let walls: fc.Node = new fc.Node("Walls");

  async function hndLoad(_event: Event): Promise<void> {
    const canvas: HTMLCanvasElement = document.querySelector("canvas");
    avatar = new AvatarControls(fc.Vector2.ONE(1), new fc.Vector3(10, 0, 10), new fc.Vector3(0, 225, 0));
    avatarNode.appendChild(avatar);
    root.appendChild(avatarNode);

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

    canvas.addEventListener("mousemove", hndMouse);
    canvas.addEventListener("click", canvas.requestPointerLock);
  }

  function hndLoop(_event: Event): void {
    hndAvatar();
    avatar.hndAvatarControls();

    for (let enemy of enemies.getChildren() as Enemy[])
    enemy.update();

    viewport.draw();
  }
  
  async function hndEnemy(): Promise<fc.Node> {
/*     let posAvatar: fc.Vector3 = avatar.mtxLocal.translation;
    enemy.rotateEnemy(posAvatar);
    let nearTarget: Boolean = true;
    
    for (let wall of walls.getChildren() as GameObject[]) {
      if (enemy.followPlayer(posAvatar, wall)) {
        nearTarget = false;
        break;
      }
    }
    if (enemy.calculateBounce(avatar.mtxLocal.translation, 1.3)) {
      nearTarget = false;
    }
    if (nearTarget) {
      enemy.mtxLocal.translateZ(0.1);
    } */
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
    let bouncedOff: Wall[] = bounceOffWalls(<Wall[]>walls.getChildren());
    if (bouncedOff.length < 2)
      return;

    bouncedOff = bounceOffWalls(bouncedOff);
    if (bouncedOff.length == 0)
      return;
  }

  function bounceOffWalls(_walls: Wall[]): Wall[] {
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
  }

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