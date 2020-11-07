"use strict";
var L02_Breakout;
(function (L02_Breakout) {
    var fc = FudgeCore;
    let control = new fc.Control("PaddleControl", 20, 0 /* PROPORTIONAL */);
    control.setDelay(100);
    class Paddle extends L02_Breakout.MoveObject {
        constructor(_name, _position, _size) {
            super(_name, _position, _size);
            this.velocity = fc.Vector3.ZERO();
            this.speed = 300;
        }
        movePaddle() {
            let frameTime = fc.Loop.timeFrameGame / 1000;
            control.setInput(fc.Keyboard.mapToValue(-1, 0, [fc.KEYBOARD_CODE.A, fc.KEYBOARD_CODE.ARROW_LEFT])
                + fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.D, fc.KEYBOARD_CODE.ARROW_RIGHT]));
            this.velocity = fc.Vector3.X(control.getOutput());
            let distance = fc.Vector3.SCALE(this.velocity, frameTime);
            this.translate(distance);
        }
        translate(_distance) {
            this.mtxLocal.translate(_distance);
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
        }
    }
    L02_Breakout.Paddle = Paddle;
})(L02_Breakout || (L02_Breakout = {}));
//# sourceMappingURL=Paddle.js.map