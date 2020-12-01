"use strict";
var L08_Doom;
(function (L08_Doom) {
    var fc = FudgeCore;
    class Wall extends L08_Doom.GameObject {
        // private static readonly meshQuad: fc.MeshQuad = new fc.MeshQuad();
        constructor(_size, _position, _rotation, _material) {
            super("Wall", _size, _position, _rotation);
            // let floor: fcaid.Node = new fcaid.Node("Floor", fc.Matrix4x4.ROTATION_X(-90), mtrFloor, meshQuad);
            let cmpMaterial = new fc.ComponentMaterial(_material);
            cmpMaterial.pivot.scale(fc.Vector2.ONE(1));
            this.addComponent(cmpMaterial);
            this.mtxLocal.translateY(_size.y / 2);
        }
    }
    L08_Doom.Wall = Wall;
})(L08_Doom || (L08_Doom = {}));
//# sourceMappingURL=wall.js.map