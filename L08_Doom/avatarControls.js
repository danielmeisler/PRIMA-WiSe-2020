"use strict";
var L08_Doom;
(function (L08_Doom) {
    var fc = FudgeCore;
    let controlVertical = new fc.Control("CameraControlVertical", 20, 0 /* PROPORTIONAL */);
    let controlHorizontal = new fc.Control("CameraControlHorizontal", 20, 0 /* PROPORTIONAL */);
    let controlRotation = new fc.Control("CameraControlRotation", -0.1, 0 /* PROPORTIONAL */);
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
    }
    L08_Doom.AvatarControls = AvatarControls;
})(L08_Doom || (L08_Doom = {}));
//# sourceMappingURL=avatarControls.js.map