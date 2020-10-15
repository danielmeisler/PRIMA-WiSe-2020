"use strict";
var L02_Breakout;
(function (L02_Breakout) {
    var fc = FudgeCore;
    window.addEventListener("load", hndLoad);
    let root = new fc.Node("Root");
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        fc.Debug.log(canvas);
        root.addComponent(new fc.ComponentTransform());
        let ndQuad = new fc.Node("Quad");
        let meshQuad = new fc.MeshQuad();
        let cmpQuad = new fc.ComponentMesh(meshQuad);
        ndQuad.addComponent(cmpQuad);
        let mtrQuadColor = new fc.Material("QuadColor", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("PURPLE")));
        let cmpQuadMaterial = new fc.ComponentMaterial(mtrQuadColor);
        ndQuad.addComponent(cmpQuadMaterial);
        root.appendChild(ndQuad);
        let cmpCamera = new fc.ComponentCamera();
        cmpCamera.pivot.translateZ(4);
        cmpCamera.pivot.rotateY(180);
        L02_Breakout.viewport = new fc.Viewport();
        L02_Breakout.viewport.initialize("Viewport", root, cmpCamera, canvas);
        fc.Debug.log(L02_Breakout.viewport);
        fc.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, hndLoop);
        fc.Loop.start(fc.LOOP_MODE.TIME_GAME, 30);
        //viewport.draw();
    }
    function hndLoop(_event) {
        console.log("Tick Test");
        root.mtxLocal.rotateZ(10);
        L02_Breakout.viewport.draw();
    }
})(L02_Breakout || (L02_Breakout = {}));
//# sourceMappingURL=main.js.map