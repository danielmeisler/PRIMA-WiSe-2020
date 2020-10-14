"use strict";
var L01_FirstFudge;
(function (L01_FirstFudge) {
    console.log("Hallo Welt");
    var f = FudgeCore;
    window.addEventListener("load", hndLoad);
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        f.Debug.log(canvas);
        let node = new f.Node("Quad");
        let mesh = new f.MeshQuad();
        let cmpMesh = new f.ComponentMesh(mesh);
        node.addComponent(cmpMesh);
        let mtrSolidWhite = new f.Material("SolidWhite", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("WHITE")));
        let cmpMaterial = new f.ComponentMaterial(mtrSolidWhite);
        node.addComponent(cmpMaterial);
        let cmpCamera = new f.ComponentCamera();
        cmpCamera.pivot.translateZ(2);
        cmpCamera.pivot.rotateY(180);
        L01_FirstFudge.viewport = new f.Viewport();
        L01_FirstFudge.viewport.initialize("Viewport", node, cmpCamera, canvas);
        f.Debug.log(L01_FirstFudge.viewport);
        L01_FirstFudge.viewport.draw();
        console.log("TEST 2");
    }
})(L01_FirstFudge || (L01_FirstFudge = {}));
//# sourceMappingURL=main.js.map