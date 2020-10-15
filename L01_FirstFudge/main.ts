namespace L01_FirstFudge {
    import f = FudgeCore;

    window.addEventListener("load", hndLoad);
    export let viewport: f.Viewport;

    function hndLoad(_event: Event): void {
        const canvas: HTMLCanvasElement = document.querySelector("canvas");
        f.Debug.log(canvas);

        //Nodes werden deklariert.
        let node: f.Node = new f.Node("Quad");
        let node2: f.Node = new f.Node("Cube");
        let node3: f.Node = new f.Node("Pyramid");
        let node4: f.Node = new f.Node("Torus");

        //Mesh für das Quad wird deklariert und transformiert.
        let mesh: f.MeshQuad = new f.MeshQuad();
        let cmpMesh: f.ComponentMesh = new f.ComponentMesh(mesh);
        cmpMesh.pivot.translateY(-0.5);
        node.addComponent(cmpMesh);

        //Mesh für den Cube wird deklariert und transformiert.
        let mesh2: f.MeshCube = new f.MeshCube();
        let cmpMesh2: f.ComponentMesh = new f.ComponentMesh(mesh2);
        cmpMesh2.pivot.translateX(-1.1);
        cmpMesh2.pivot.translateY(-0.2);
        cmpMesh2.pivot.rotateX(45);
        node2.addComponent(cmpMesh2);
        node.addChild(node2);

        //Mesh für die Pyramide wird deklariert und transformiert.
        let mesh3: f.MeshPyramid = new f.MeshPyramid();
        let cmpMesh3: f.ComponentMesh = new f.ComponentMesh(mesh3);
        cmpMesh3.pivot.rotateY(45);
        cmpMesh3.pivot.rotateX(30);
        node3.addComponent(cmpMesh3);
        node.addChild(node3);

        //Mesh für den Torus wird deklariert und transformiert.
        let mesh4: f.MeshTorus = new f.MeshTorus("TorusMesh", 0.25, 32, 12);
        let cmpMesh4: f.ComponentMesh = new f.ComponentMesh(mesh4);
        cmpMesh4.pivot.rotateX(30);
        cmpMesh4.pivot.translateY(0.6);
        cmpMesh4.pivot.translateX(-1);
        
        node4.addComponent(cmpMesh4);
        node.addChild(node4);

        //Material, Shader und Farbe wird für das Quad initalisiert.
        let mtrMiddleColor: f.Material = new f.Material("MiddleColor", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("RED")));
        let cmpMaterial: f.ComponentMaterial = new f.ComponentMaterial(mtrMiddleColor);
        node.addComponent(cmpMaterial);

        //Material, Shader und Farbe wird für den Cube initalisiert.
        let mtrMiddleColor2: f.Material = new f.Material("MiddleColor2", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("PURPLE")));
        let cmpMaterial2: f.ComponentMaterial = new f.ComponentMaterial(mtrMiddleColor2);
        node2.addComponent(cmpMaterial2);

        //Material, Shader und Farbe wird für die Pyramide initalisiert.
        let mtrMiddleColor3: f.Material = new f.Material("MiddleColor3", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("ORANGE")));
        let cmpMaterial3: f.ComponentMaterial = new f.ComponentMaterial(mtrMiddleColor3);
        node3.addComponent(cmpMaterial3);

        //Material, Shader und Farbe wird für den Torus initalisiert.
        let mtrMiddleColor4: f.Material = new f.Material("MiddleColor4", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("CYAN")));
        let cmpMaterial4: f.ComponentMaterial = new f.ComponentMaterial(mtrMiddleColor4);
        node4.addComponent(cmpMaterial4);

        //Camera wird platziert.
        let cmpCamera: f.ComponentCamera = new f.ComponentCamera();
        cmpCamera.pivot.translateZ(3);
        cmpCamera.pivot.rotateY(190);

        //Viewport wird initialisiert.
        viewport = new f.Viewport();
        viewport.initialize("Viewport", node, cmpCamera, canvas);
        f.Debug.log(viewport);

        viewport.draw();

    }

}