"use strict";
var L08_Doom;
(function (L08_Doom) {
    var fc = FudgeCore;
    //import fcAid = FudgeAid;
    window.addEventListener("load", hndLoad);
    const clrWhite = fc.Color.CSS("WHITE");
    L08_Doom.root = new fc.Node("Root");
    L08_Doom.walls = new fc.Node("Walls");
    L08_Doom.sizeWall = 3;
    L08_Doom.numWalls = 10;
    let cameraRadius = 1.3;
    async function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        L08_Doom.avatar = new L08_Doom.AvatarControls(fc.Vector2.ONE(1), new fc.Vector3(10, 0, 10), new fc.Vector3(0, 225, 0));
        L08_Doom.root.appendChild(L08_Doom.avatar);
        L08_Doom.enemies = await hndEnemy();
        L08_Doom.root.appendChild(L08_Doom.enemies);
        let txtFloor = new fc.TextureImage("../DoomAssets/DEM1_5.png");
        let mtrFloor = new fc.Material("Floor", fc.ShaderTexture, new fc.CoatTextured(clrWhite, txtFloor));
        let floor = new L08_Doom.Floor(fc.Vector2.ONE(30), fc.Vector3.ZERO(), fc.Vector3.ZERO(), mtrFloor);
        L08_Doom.root.appendChild(floor);
        buildWalls();
        L08_Doom.root.appendChild(L08_Doom.walls);
        let cmpCamera = new fc.ComponentCamera();
        cmpCamera.projectCentral(1, 45, fc.FIELD_OF_VIEW.DIAGONAL, 0.2, 10000);
        cmpCamera.pivot.translate(fc.Vector3.Y(1.7));
        cmpCamera.backgroundColor = fc.Color.CSS("darkblue");
        L08_Doom.avatar.addComponent(cmpCamera);
        L08_Doom.viewport = new fc.Viewport();
        L08_Doom.viewport.initialize("Viewport", L08_Doom.root, cmpCamera, canvas);
        fc.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, hndLoop);
        fc.Loop.start(fc.LOOP_MODE.TIME_GAME, 60);
        L08_Doom.Hud.start();
        canvas.addEventListener("mousemove", hndMouse);
        canvas.addEventListener("click", canvas.requestPointerLock);
        canvas.addEventListener("click", shoot);
    }
    function hndLoop(_event) {
        hndAvatar();
        //gameState.time = fc.LOOP_MODE.TIME_GAME;
        for (let enemy of L08_Doom.enemies.getChildren())
            enemy.update();
        L08_Doom.viewport.draw();
    }
    function shoot() {
        if (L08_Doom.gameState.ammo === 0) {
            L08_Doom.gameState.ammo = 50;
        }
        else {
            L08_Doom.gameState.ammo--;
            L08_Doom.gameState.score = L08_Doom.gameState.score + 5;
            L08_Doom.avatar.shoot();
        }
    }
    async function hndEnemy() {
        let enemies = new fc.Node("Enemies");
        let txtMancubus = new fc.TextureImage();
        await txtMancubus.load("../DoomAssets/enemy_mancubus.png");
        let coatSprite = new fc.CoatTextured(clrWhite, txtMancubus);
        L08_Doom.Enemy.generateSprites(coatSprite);
        enemies.appendChild(new L08_Doom.Enemy("Mancubus0", new fc.Vector3(10, 0, -10)));
        enemies.appendChild(new L08_Doom.Enemy("Mancubus1", new fc.Vector3(-10, 0, -10)));
        enemies.appendChild(new L08_Doom.Enemy("Mancubus2", new fc.Vector3(-10, 0, 10)));
        return enemies;
    }
    function hndMouse(_event) {
        L08_Doom.avatar.hndMouseControl(_event.movementX);
    }
    function hndAvatar() {
        /*     let bouncedOff: Wall[] = bounceOffWalls(<Wall[]>walls.getChildren());
            if (bouncedOff.length < 2)
              return;
        
            bouncedOff = bounceOffWalls(bouncedOff);
            if (bouncedOff.length == 0)
              return; */
        let tempPos = L08_Doom.avatar.mtxLocal.translation;
        L08_Doom.avatar.hndAvatarControls();
        let collisionsWall = L08_Doom.avatar.hndCollision(cameraRadius);
        if (collisionsWall) {
            tempPos.x += collisionsWall.mtxLocal.getZ().x * 0.01;
            tempPos.z += collisionsWall.mtxLocal.getZ().z * 0.01;
            L08_Doom.avatar.mtxLocal.translation = tempPos;
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
    function buildWalls() {
        let txtWall = new fc.TextureImage("../DoomAssets/CEMPOIS.png");
        let mtrWall = new fc.Material("Wall", fc.ShaderTexture, new fc.CoatTextured(clrWhite, txtWall));
        let wallPos;
        //Wand vorne
        wallPos = -13.5;
        for (let x = 0; x < 10; x++) {
            L08_Doom.walls.addChild(new L08_Doom.Wall(fc.Vector2.ONE(3), new fc.Vector3(wallPos, 0, -15), fc.Vector3.ZERO(), mtrWall));
            wallPos = wallPos + 3;
        }
        //Wand rechts
        wallPos = -13.5;
        for (let x = 0; x < 10; x++) {
            L08_Doom.walls.addChild(new L08_Doom.Wall(fc.Vector2.ONE(3), new fc.Vector3(15, 0, wallPos), fc.Vector3.Y(-90), mtrWall));
            wallPos = wallPos + 3;
        }
        //Wand hinten
        wallPos = -13.5;
        for (let x = 0; x < 10; x++) {
            L08_Doom.walls.addChild(new L08_Doom.Wall(fc.Vector2.ONE(3), new fc.Vector3(wallPos, 0, 15), fc.Vector3.Y(180), mtrWall));
            wallPos = wallPos + 3;
        }
        //Wand links
        wallPos = -13.5;
        for (let x = 0; x < 10; x++) {
            L08_Doom.walls.addChild(new L08_Doom.Wall(fc.Vector2.ONE(3), new fc.Vector3(-15, 0, wallPos), fc.Vector3.Y(90), mtrWall));
            wallPos = wallPos + 3;
        }
        //Wand mitte
        wallPos = -1.5;
        for (let x = 0; x < 2; x++) {
            L08_Doom.walls.addChild(new L08_Doom.Wall(fc.Vector2.ONE(3), new fc.Vector3(-3, 0, wallPos), fc.Vector3.Y(-90), mtrWall));
            wallPos = wallPos + 3;
        }
        wallPos = -1.5;
        for (let x = 0; x < 2; x++) {
            L08_Doom.walls.addChild(new L08_Doom.Wall(fc.Vector2.ONE(3), new fc.Vector3(3, 0, wallPos), fc.Vector3.Y(90), mtrWall));
            wallPos = wallPos + 3;
        }
        wallPos = -1.5;
        for (let x = 0; x < 2; x++) {
            L08_Doom.walls.addChild(new L08_Doom.Wall(fc.Vector2.ONE(3), new fc.Vector3(wallPos, 0, 3), fc.Vector3.ZERO(), mtrWall));
            wallPos = wallPos + 3;
        }
        wallPos = -1.5;
        for (let x = 0; x < 2; x++) {
            L08_Doom.walls.addChild(new L08_Doom.Wall(fc.Vector2.ONE(3), new fc.Vector3(wallPos, 0, -3), fc.Vector3.Y(180), mtrWall));
            wallPos = wallPos + 3;
        }
    }
})(L08_Doom || (L08_Doom = {}));
//# sourceMappingURL=main.js.map