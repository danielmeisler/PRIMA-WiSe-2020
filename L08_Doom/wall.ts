namespace L08_Doom {
  import fc = FudgeCore;

  export class Wall extends GameObject {
    // private static readonly meshQuad: fc.MeshQuad = new fc.MeshQuad();

    public constructor(_size: fc.Vector2, _position: fc.Vector3, _rotation: fc.Vector3, _material: fc.Material) {
      super("Wall", _size, _position, _rotation);

      // let floor: fcaid.Node = new fcaid.Node("Floor", fc.Matrix4x4.ROTATION_X(-90), mtrFloor, meshQuad);
      let cmpMaterial: fc.ComponentMaterial = new fc.ComponentMaterial(_material);
      cmpMaterial.pivot.scale(fc.Vector2.ONE(1));
      this.addComponent(cmpMaterial);
      this.mtxLocal.translateY(_size.y / 2);
    }
  }
}