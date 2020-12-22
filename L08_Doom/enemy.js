"use strict";
var L08_Doom;
(function (L08_Doom) {
    var fc = FudgeCore;
    var fcAid = FudgeAid;
    let ANGLE;
    (function (ANGLE) {
        // N = 0, NE = 1, E = 2, SE = 3, S = 4, SW = 5, W = 6, NW = 7,
        ANGLE[ANGLE["_000"] = 0] = "_000";
        ANGLE[ANGLE["_045"] = 1] = "_045";
        ANGLE[ANGLE["_090"] = 2] = "_090";
        ANGLE[ANGLE["_135"] = 3] = "_135";
        ANGLE[ANGLE["_180"] = 4] = "_180";
        ANGLE[ANGLE["_225"] = 5] = "_225";
        ANGLE[ANGLE["_270"] = 6] = "_270";
        ANGLE[ANGLE["_315"] = 7] = "_315";
    })(ANGLE = L08_Doom.ANGLE || (L08_Doom.ANGLE = {}));
    let JOB;
    (function (JOB) {
        JOB[JOB["IDLE"] = 0] = "IDLE";
        JOB[JOB["PATROL"] = 1] = "PATROL";
        JOB[JOB["HUNT"] = 2] = "HUNT";
    })(JOB = L08_Doom.JOB || (L08_Doom.JOB = {}));
    class Enemy extends fc.Node {
        // private static speedMax: number = 1; // units per second
        // public direction: number = 0; 
        constructor(_name = "Enemy", _position) {
            super(_name);
            this.speed = 3;
            this.angleView = 0;
            this.job = JOB.IDLE;
            this.addComponent(new fc.ComponentTransform());
            this.mtxLocal.translation = _position;
            this.show = new fcAid.Node("Show", fc.Matrix4x4.IDENTITY());
            this.appendChild(this.show);
            this.sprite = new fcAid.NodeSprite("Sprite");
            this.sprite.addComponent(new fc.ComponentTransform());
            this.show.appendChild(this.sprite);
            this.sprite.setAnimation(Enemy.animations["Idle_000"]);
            // this.sprite.showFrame(0);
            this.sprite.setFrameDirection(1);
            this.sprite.framerate = 2;
            // this.posTarget = _position;
            this.chooseTargetPosition();
            // this.appendChild(new fcAid.Node("Cube", fc.Matrix4x4.IDENTITY(), new fc.Material("Cube", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("red"))), new fc.MeshCube()));
        }
        static generateSprites(_spritesheet) {
            Enemy.animations = {};
            for (let angle = 0; angle < 5; angle++) {
                let name = "Idle" + ANGLE[angle];
                let sprite = new fcAid.SpriteSheetAnimation(name, _spritesheet);
                sprite.generateByGrid(fc.Rectangle.GET(40 + angle * 125, 28, 93, 70), 3, 25, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.Y(103));
                Enemy.animations[name] = sprite;
            }
        }
        update() {
            switch (this.job) {
                case JOB.PATROL:
                    if (this.mtxLocal.translation.equals(this.posTarget, 0.1)) {
                        this.chooseTargetPosition();
                        this.job = JOB.IDLE;
                    }
                    this.move();
                    break;
                case JOB.IDLE:
                    if (this.mtxLocal.translation.equals(L08_Doom.avatar.mtxLocal.translation, 10)) {
                        this.job = JOB.HUNT;
                    }
                    break;
                case JOB.HUNT:
                    this.mtxLocal.showTo(L08_Doom.avatar.mtxLocal.translation);
                    this.mtxLocal.translateZ(this.speed * fc.Loop.timeFrameGame / 1000);
                    if (this.mtxLocal.translation.equals(L08_Doom.avatar.mtxLocal.translation, 1)) {
                        L08_Doom.gameState.health = L08_Doom.gameState.health - 10;
                        L08_Doom.gameState.shield = L08_Doom.gameState.shield - 5;
                        this.job = JOB.PATROL;
                    }
            }
            this.displayAnimation();
        }
        hndIsTargetbetween() {
            for (let walls of L08_Doom.root.getChildrenByName("Walls"))
                for (let wall of walls.getChildren()) {
                    if (this.isTargetbetween(L08_Doom.avatar, wall)) {
                        return true;
                    }
                }
            return false;
        }
        move() {
            this.mtxLocal.showTo(this.posTarget);
            this.mtxLocal.translateZ(this.speed * fc.Loop.timeFrameGame / 1000);
        }
        displayAnimation() {
            this.show.mtxLocal.showTo(fc.Vector3.TRANSFORMATION(L08_Doom.avatar.mtxLocal.translation, this.mtxWorldInverse, true));
            let rotation = this.show.mtxLocal.rotation.y;
            rotation = (rotation + 360 + 22.5) % 360;
            rotation = Math.floor(rotation / 45);
            if (this.angleView == rotation)
                return;
            this.angleView = rotation;
            if (rotation > 4) {
                rotation = 8 - rotation;
                this.flip(true);
            }
            else
                this.flip(false);
            let section = ANGLE[rotation]; // .padStart(3, "0");
            //console.log(section);
            this.sprite.setAnimation(Enemy.animations["Idle" + section]);
        }
        chooseTargetPosition() {
            let range = L08_Doom.sizeWall * L08_Doom.numWalls / 2 - 2;
            this.posTarget = new fc.Vector3(fc.Random.default.getRange(-range, range), 0, fc.Random.default.getRange(-range, range));
            console.log("New target", this.posTarget.toString());
        }
        flip(_reverse) {
            this.sprite.mtxLocal.rotation = fc.Vector3.Y(_reverse ? 180 : 0);
        }
        vectorAmount(_vector) {
            return Math.sqrt(Math.pow(_vector.x, 2) + Math.pow(_vector.y, 2) + Math.pow(_vector.z, 2));
        }
        isTargetbetween(_target, _betweenTarget) {
            let posThis = this.mtxWorld.translation;
            let posTarget = _target.mtxWorld.translation;
            let posWith = _betweenTarget.mtxWorld.translation;
            if (this.vectorAmount(fc.Vector3.DIFFERENCE(posWith, posThis)) > this.vectorAmount(fc.Vector3.DIFFERENCE(posTarget, posThis)))
                return false;
            let localWich = fc.Vector3.TRANSFORMATION(posWith, this.mtxWorldInverse, true);
            if (localWich.z < 0)
                return false;
            //let normal: fc.Vector3 = this.mtxWorld.getZ();
            let normalBe = _betweenTarget.mtxWorld.getZ();
            let sizeBe = _betweenTarget.getComponent(fc.ComponentMesh).pivot.scaling;
            let ray = new fc.Ray(this.mtxWorld.getZ(), posTarget);
            let intersect = ray.intersectPlane(posWith, normalBe);
            let localIntersect = fc.Vector3.TRANSFORMATION(intersect, _betweenTarget.mtxWorldInverse, true);
            if (Math.abs(localIntersect.x) > 0.5 * sizeBe.x) {
                return false;
            }
            return true;
        }
    }
    L08_Doom.Enemy = Enemy;
})(L08_Doom || (L08_Doom = {}));
//# sourceMappingURL=enemy.js.map