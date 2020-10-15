namespace L02_Breakout {

    import fc = FudgeCore;

    window.addEventListener("load", hndLoad);

    export let viewport: fc.Viewport;
    let root: fc.Node = new fc.Node("Root");

    function hndLoad(_event: Event): void {

        const canvas: HTMLCanvasElement = document.querySelector("canvas");
        fc.Debug.log(canvas);

        root.addComponent(new fc.ComponentTransform());

        let ndQuad: fc.Node = new fc.Node("Quad");
        let meshQuad: fc.MeshQuad = new fc.MeshQuad();
        let cmpQuad: fc.ComponentMesh = new fc.ComponentMesh(meshQuad);
        ndQuad.addComponent(cmpQuad);

        let mtrQuadColor: fc.Material = new fc.Material("QuadColor", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("PURPLE")));
        let cmpQuadMaterial: fc.ComponentMaterial = new fc.ComponentMaterial(mtrQuadColor);
        ndQuad.addComponent(cmpQuadMaterial);

        root.appendChild(ndQuad);

        let cmpCamera: fc.ComponentCamera = new fc.ComponentCamera();
        cmpCamera.pivot.translateZ(4);
        cmpCamera.pivot.rotateY(180);

        viewport = new fc.Viewport();
        viewport.initialize("Viewport", root, cmpCamera, canvas);
        fc.Debug.log(viewport);

        fc.Loop.addEventListener(fc.EVENT.LOOP_FRAME, hndLoop);
        fc.Loop.start(fc.LOOP_MODE.TIME_GAME, 30);
        //viewport.draw();
    }

    function hndLoop(_event: Event): void {
        console.log("Tick Test");
        root.mtxLocal.rotateZ(10);
        viewport.draw();
    }

}