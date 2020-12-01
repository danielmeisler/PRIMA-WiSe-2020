namespace L08_Doom {
  import fc = FudgeCore;

  export class Floor extends GameObject {
    
    public constructor(_size: fc.Vector2, _position: fc.Vector3, _rotation: fc.Vector3, _material: fc.Material) {
      super("Floor", _size, _position, _rotation);
  
      let cmpMaterial: fc.ComponentMaterial = new fc.ComponentMaterial(_material);
      this.mtxLocal.rotateX(-90);
      cmpMaterial.pivot.scale(fc.Vector2.ONE(_size.x / 3));
      this.addComponent(cmpMaterial);
    }
  }
}