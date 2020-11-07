namespace L02_Breakout {
  import fc = FudgeCore;

  export class Brick extends GameObject {

    public constructor(_name: string, _position: fc.Vector2, _size: fc.Vector2) {
      super(_name, _position, _size);
    }

    public hit(): void {
      this.getParent().removeChild(this);
    }

  }
}