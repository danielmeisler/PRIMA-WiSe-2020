"use strict";
var L08_Doom;
(function (L08_Doom) {
    var fc = FudgeCore;
    let controlVertical = new fc.Control("CameraControlVertical", 20, 0 /* PROPORTIONAL */);
    let controlHorizontal = new fc.Control("CameraControlHorizontal", 20, 0 /* PROPORTIONAL */);
    let controlRotation = new fc.Control("CameraControlRotation", -0.1, 0 /* PROPORTIONAL */);
    //let controlJump: fc.Control = new fc.Control("ControlJump", 1, fc.CONTROL_TYPE.PROPORTIONAL);
    controlVertical.setDelay(100);
    controlHorizontal.setDelay(100);
    controlRotation.setDelay(100);
    let avatarVelocityHorizontal = fc.Vector3.ZERO();
    let avatarVelocityVertical = fc.Vector3.ZERO();
    class AvatarControls extends L08_Doom.GameObject {
        constructor(_size, _position, _rotation) {
            super("DoomGuy", _size, _position, _rotation);
        }
        hndAvatarControls() {
            let controlVelocity = 0.3;
            if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.SHIFT_LEFT]))
                controlVelocity = 0.6;
            if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.ALT_LEFT]))
                controlVelocity = 0.1;
            controlHorizontal.setInput(fc.Keyboard.mapToValue(controlVelocity, 0, [fc.KEYBOARD_CODE.A])
                + fc.Keyboard.mapToValue(-controlVelocity, 0, [fc.KEYBOARD_CODE.D]));
            controlVertical.setInput(fc.Keyboard.mapToValue(controlVelocity, 0, [fc.KEYBOARD_CODE.W])
                + fc.Keyboard.mapToValue(-controlVelocity, 0, [fc.KEYBOARD_CODE.S]));
            this.jump();
            avatarVelocityHorizontal = fc.Vector3.X(controlHorizontal.getOutput());
            avatarVelocityVertical = fc.Vector3.Z(controlVertical.getOutput());
            let frameTime = fc.Loop.timeFrameGame / 1000;
            let distanceHorizontal = fc.Vector3.SCALE(avatarVelocityHorizontal, frameTime);
            let distanceVertical = fc.Vector3.SCALE(avatarVelocityVertical, frameTime);
            this.mtxLocal.translate(distanceHorizontal);
            this.mtxLocal.translate(distanceVertical);
        }
        hndMouseControl(_rotation) {
            controlRotation.setInput(_rotation);
            this.mtxLocal.rotateY(controlRotation.getOutput());
        }
        /*     public calculateShoot(_posWall: fc.Vector3, _posEnemy: fc.Vector3): void {
              let normal: fc.Vector3 = this.mtxWorld.getZ();
              let posThis: fc.Vector3 = this.mtxWorld.translation;
        
              let ray: fc.Ray = new fc.Ray(normal, posThis);
              let intersectEnemy: fc.Vector3 = ray.intersectPlane(_posEnemy, normal);
              let intersectWall: fc.Vector3 = ray.intersectPlane(_posWall, normal);
        
              let localIntersectEnemy: fc.Vector3 = fc.Vector3.TRANSFORMATION(intersectEnemy, this.mtxWorldInverse, true);
              let localIntersectWall: fc.Vector3 = fc.Vector3.TRANSFORMATION(intersectWall, this.mtxWorldInverse, true);
        
              console.log("Enemy: " + localIntersectEnemy + " Walls: " + localIntersectWall);
        
            }*/
        shoot() {
            let hitEnemys = [];
            for (let enemy of L08_Doom.enemies.getChildren()) {
                if (this.hitEnemy(enemy)) {
                    hitEnemys.push(this.hitEnemy(enemy));
                }
            }
            let hitEnemy = this.firstEnemy(hitEnemys);
            if (!hitEnemy)
                return;
            console.log(hitEnemy);
            L08_Doom.enemies.removeChild(hitEnemy);
        }
        jump() {
            let speed;
            let grounded = true;
            if (grounded) {
                if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.SPACE])) {
                    speed = 0.2;
                    grounded = false;
                }
            }
            else {
                speed -= 0.2;
            }
            this.mtxLocal.translateY(speed);
            if (this.mtxLocal.translation.y <= 0) {
                speed = 0;
                grounded = true;
            }
        }
        hitEnemy(_enemy) {
            let richtung = this.mtxWorld.getZ();
            let position = this.mtxWorld.translation;
            let ray = new fc.Ray(richtung, position);
            let localEnemy = fc.Vector3.TRANSFORMATION(_enemy.mtxWorld.translation, this.mtxWorldInverse, true);
            if (localEnemy.z > 0)
                return null;
            let intersect = ray.intersectPlane(_enemy.mtxWorld.translation, _enemy.getChild(0).mtxWorld.getZ());
            let localIntersect = fc.Vector3.TRANSFORMATION(intersect, this.mtxWorldInverse, true);
            if (Math.abs(localIntersect.x) > 0.5 * 3) {
                return null;
            }
            return _enemy;
        }
        firstEnemy(_enemys) {
            if (_enemys.length <= 0) {
                return null;
            }
            if (_enemys.length <= 1) {
                return _enemys[0];
            }
            let firstEnemy;
            let localfirstEnemy = fc.Vector3.TRANSFORMATION(_enemys[0].mtxWorld.translation, this.mtxWorldInverse, true);
            let shortestDistance = localfirstEnemy.magnitude;
            for (let i = 1; i < _enemys.length; i++) {
                let localEnemy = fc.Vector3.TRANSFORMATION(_enemys[i].mtxWorld.translation, this.mtxWorldInverse, true);
                let newDistence = localEnemy.magnitude;
                if (shortestDistance > newDistence) {
                    shortestDistance = newDistence;
                    firstEnemy = _enemys[i];
                }
            }
            return firstEnemy;
        }
    }
    L08_Doom.AvatarControls = AvatarControls;
})(L08_Doom || (L08_Doom = {}));
//# sourceMappingURL=avatarControls.js.map