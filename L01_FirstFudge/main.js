"use strict";
var L01_FirstFudge;
(function (L01_FirstFudge) {
    var f = FudgeCore;
    window.addEventListener("load", hndLoad);
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        f.Debug.log(canvas);
        //Nodes werden deklariert.
        let node = new f.Node("Quad");
        let node2 = new f.Node("Cube");
        let node3 = new f.Node("Pyramid");
        let node4 = new f.Node("Torus");
        //Mesh für das Quad wird deklariert und transformiert.
        let mesh = new f.MeshQuad();
        let cmpMesh = new f.ComponentMesh(mesh);
        cmpMesh.pivot.translateY(-0.5);
        node.addComponent(cmpMesh);
        //Mesh für den Cube wird deklariert und transformiert.
        let mesh2 = new f.MeshCube();
        let cmpMesh2 = new f.ComponentMesh(mesh2);
        cmpMesh2.pivot.translateX(-1.1);
        cmpMesh2.pivot.translateY(-0.2);
        cmpMesh2.pivot.rotateX(45);
        node2.addComponent(cmpMesh2);
        node.addChild(node2);
        //Mesh für die Pyramide wird deklariert und transformiert.
        let mesh3 = new f.MeshPyramid();
        let cmpMesh3 = new f.ComponentMesh(mesh3);
        cmpMesh3.pivot.rotateY(45);
        cmpMesh3.pivot.rotateX(30);
        node3.addComponent(cmpMesh3);
        node.addChild(node3);
        //Mesh für den Torus wird deklariert und transformiert.
        let mesh4 = new f.MeshTorus("TorusMesh", 0.25, 32, 12);
        let cmpMesh4 = new f.ComponentMesh(mesh4);
        cmpMesh4.pivot.rotateX(30);
        cmpMesh4.pivot.translateY(0.6);
        cmpMesh4.pivot.translateX(-1);
        node4.addComponent(cmpMesh4);
        node.addChild(node4);
        //Material, Shader und Farbe wird für das Quad initalisiert.
        let mtrMiddleColor = new f.Material("MiddleColor", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("RED")));
        let cmpMaterial = new f.ComponentMaterial(mtrMiddleColor);
        node.addComponent(cmpMaterial);
        //Material, Shader und Farbe wird für den Cube initalisiert.
        let mtrMiddleColor2 = new f.Material("MiddleColor2", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("PURPLE")));
        let cmpMaterial2 = new f.ComponentMaterial(mtrMiddleColor2);
        node2.addComponent(cmpMaterial2);
        //Material, Shader und Farbe wird für die Pyramide initalisiert.
        let mtrMiddleColor3 = new f.Material("MiddleColor3", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("ORANGE")));
        let cmpMaterial3 = new f.ComponentMaterial(mtrMiddleColor3);
        node3.addComponent(cmpMaterial3);
        //Material, Shader und Farbe wird für den Torus initalisiert.
        let mtrMiddleColor4 = new f.Material("MiddleColor4", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("CYAN")));
        let cmpMaterial4 = new f.ComponentMaterial(mtrMiddleColor4);
        node4.addComponent(cmpMaterial4);
        //Camera wird platziert.
        let cmpCamera = new f.ComponentCamera();
        cmpCamera.pivot.translateZ(3);
        cmpCamera.pivot.rotateY(190);
        //Viewport wird initialisiert.
        L01_FirstFudge.viewport = new f.Viewport();
        L01_FirstFudge.viewport.initialize("Viewport", node, cmpCamera, canvas);
        f.Debug.log(L01_FirstFudge.viewport);
        L01_FirstFudge.viewport.draw();
    }
})(L01_FirstFudge || (L01_FirstFudge = {}));
//# sourceMappingURL=main.js.map