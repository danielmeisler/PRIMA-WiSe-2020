"use strict";
var L08_Doom;
(function (L08_Doom) {
    var fc = FudgeCore;
    //import fcAid = FudgeAid;
    window.addEventListener("load", hndLoad);
    const clrWhite = fc.Color.CSS("WHITE");
    let root = new fc.Node("Root");
    L08_Doom.avatarNode = new fc.Node("AN");
    //let enemy: Enemy;
    let enemies;
    let walls = new fc.Node("Walls");
    async function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        L08_Doom.avatar = new L08_Doom.AvatarControls(fc.Vector2.ONE(1), new fc.Vector3(10, 0, 10), new fc.Vector3(0, 225, 0));
        L08_Doom.avatarNode.appendChild(L08_Doom.avatar);
        root.appendChild(L08_Doom.avatarNode);
        enemies = await hndEnemy();
        root.appendChild(enemies);
        let txtFloor = new fc.TextureImage("../DoomAssets/DEM1_5.png");
        let mtrFloor = new fc.Material("Floor", fc.ShaderTexture, new fc.CoatTextured(clrWhite, txtFloor));
        let floor = new L08_Doom.Floor(fc.Vector2.ONE(30), fc.Vector3.ZERO(), fc.Vector3.ZERO(), mtrFloor);
        root.appendChild(floor);
        buildWalls();
        root.appendChild(walls);
        let cmpCamera = new fc.ComponentCamera();
        cmpCamera.projectCentral(1, 45, fc.FIELD_OF_VIEW.DIAGONAL, 0.2, 10000);
        cmpCamera.pivot.translate(fc.Vector3.Y(1.7));
        cmpCamera.backgroundColor = fc.Color.CSS("darkblue");
        L08_Doom.avatar.addComponent(cmpCamera);
        L08_Doom.viewport = new fc.Viewport();
        L08_Doom.viewport.initialize("Viewport", root, cmpCamera, canvas);
        fc.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, hndLoop);
        fc.Loop.start(fc.LOOP_MODE.TIME_GAME, 60);
        canvas.addEventListener("mousemove", hndMouse);
        canvas.addEventListener("click", canvas.requestPointerLock);
    }
    function hndLoop(_event) {
        hndAvatar();
        L08_Doom.avatar.hndAvatarControls();
        for (let enemy of enemies.getChildren())
            enemy.update();
        L08_Doom.viewport.draw();
    }
    async function hndEnemy() {
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
        let bouncedOff = bounceOffWalls(walls.getChildren());
        if (bouncedOff.length < 2)
            return;
        bouncedOff = bounceOffWalls(bouncedOff);
        if (bouncedOff.length == 0)
            return;
    }
    function bounceOffWalls(_walls) {
        let bouncedOff = [];
        let posAvatar = L08_Doom.avatar.mtxLocal.translation;
        for (let wall of _walls) {
            let posBounce = wall.calculateBounce(posAvatar, 1);
            if (posBounce) {
                posAvatar = posBounce;
                bouncedOff.push(wall);
            }
        }
        return bouncedOff;
    }
    function buildWalls() {
        let txtWall = new fc.TextureImage("../DoomAssets/CEMPOIS.png");
        let mtrWall = new fc.Material("Wall", fc.ShaderTexture, new fc.CoatTextured(clrWhite, txtWall));
        let wallPos;
        //Wand vorne
        wallPos = -13.5;
        for (let x = 0; x < 10; x++) {
            walls.addChild(new L08_Doom.Wall(fc.Vector2.ONE(3), new fc.Vector3(wallPos, 0, -15), fc.Vector3.ZERO(), mtrWall));
            wallPos = wallPos + 3;
        }
        //Wand rechts
        wallPos = -13.5;
        for (let x = 0; x < 10; x++) {
            walls.addChild(new L08_Doom.Wall(fc.Vector2.ONE(3), new fc.Vector3(15, 0, wallPos), fc.Vector3.Y(-90), mtrWall));
            wallPos = wallPos + 3;
        }
        //Wand hinten
        wallPos = -13.5;
        for (let x = 0; x < 10; x++) {
            walls.addChild(new L08_Doom.Wall(fc.Vector2.ONE(3), new fc.Vector3(wallPos, 0, 15), fc.Vector3.Y(180), mtrWall));
            wallPos = wallPos + 3;
        }
        //Wand links
        wallPos = -13.5;
        for (let x = 0; x < 10; x++) {
            walls.addChild(new L08_Doom.Wall(fc.Vector2.ONE(3), new fc.Vector3(-15, 0, wallPos), fc.Vector3.Y(90), mtrWall));
            wallPos = wallPos + 3;
        }
        //Wand mitte
        wallPos = -1.5;
        for (let x = 0; x < 2; x++) {
            walls.addChild(new L08_Doom.Wall(fc.Vector2.ONE(3), new fc.Vector3(-3, 0, wallPos), fc.Vector3.Y(-90), mtrWall));
            wallPos = wallPos + 3;
        }
        wallPos = -1.5;
        for (let x = 0; x < 2; x++) {
            walls.addChild(new L08_Doom.Wall(fc.Vector2.ONE(3), new fc.Vector3(3, 0, wallPos), fc.Vector3.Y(90), mtrWall));
            wallPos = wallPos + 3;
        }
        wallPos = -1.5;
        for (let x = 0; x < 2; x++) {
            walls.addChild(new L08_Doom.Wall(fc.Vector2.ONE(3), new fc.Vector3(wallPos, 0, 3), fc.Vector3.ZERO(), mtrWall));
            wallPos = wallPos + 3;
        }
        wallPos = -1.5;
        for (let x = 0; x < 2; x++) {
            walls.addChild(new L08_Doom.Wall(fc.Vector2.ONE(3), new fc.Vector3(wallPos, 0, -3), fc.Vector3.Y(180), mtrWall));
            wallPos = wallPos + 3;
        }
    }
})(L08_Doom || (L08_Doom = {}));
//# sourceMappingURL=main.js.map