"use strict";
var L08_Doom;
(function (L08_Doom) {
    var fc = FudgeCore;
    class Floor extends L08_Doom.GameObject {
        constructor(_size, _position, _rotation, _material) {
            super("Floor", _size, _position, _rotation);
            let cmpMaterial = new fc.ComponentMaterial(_material);
            this.mtxLocal.rotateX(-90);
            cmpMaterial.pivot.scale(fc.Vector2.ONE(_size.x / 3));
            this.addComponent(cmpMaterial);
        }
    }
    L08_Doom.Floor = Floor;
})(L08_Doom || (L08_Doom = {}));
//# sourceMappingURL=floor.js.map