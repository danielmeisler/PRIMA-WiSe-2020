"use strict";
var L02_Breakout;
(function (L02_Breakout) {
    var fc = FudgeCore;
    class MoveObject extends L02_Breakout.GameObject {
        constructor(_name, _position, _size) {
            super(_name, _position, _size);
            this.speed = 15;
            this.velocity = fc.Vector3.ZERO();
            this.velocity = new fc.Vector3(fc.Random.default.getRange(-1, 1), fc.Random.default.getRange(-1, 1), 0);
            this.velocity.normalize(this.speed);
        }
        move() {
            let frameTime = fc.Time.game.getElapsedSincePreviousCall() / 1000;
            let distance = fc.Vector3.SCALE(this.velocity, frameTime);
            this.mtxLocal.translate(distance);
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
        }
        checkCollision(_target) {
            let intersection = this.rect.getIntersection(_target.rect);
            if (intersection == null) {
                return false;
            }
            if (intersection.size.x > intersection.size.y)
                this.velocity.reflect(MoveObject.REFLECT_VECTOR_Y);
            else
                this.velocity.reflect(MoveObject.REFLECT_VECTOR_X);
            return true;
        }
    }
    MoveObject.REFLECT_VECTOR_X = fc.Vector3.X();
    MoveObject.REFLECT_VECTOR_Y = fc.Vector3.Y();
    L02_Breakout.MoveObject = MoveObject;
})(L02_Breakout || (L02_Breakout = {}));
//# sourceMappingURL=MoveObject.js.map