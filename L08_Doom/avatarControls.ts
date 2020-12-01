namespace L08_Doom {
  import fc = FudgeCore;

  let controlVertical: fc.Control = new fc.Control("CameraControlVertical", 20, fc.CONTROL_TYPE.PROPORTIONAL);
  let controlHorizontal: fc.Control = new fc.Control("CameraControlHorizontal", 20, fc.CONTROL_TYPE.PROPORTIONAL);
  let controlRotation: fc.Control = new fc.Control("CameraControlRotation", -0.1, fc.CONTROL_TYPE.PROPORTIONAL);
  controlVertical.setDelay(100);
  controlHorizontal.setDelay(100);
  controlRotation.setDelay(100);

  let avatarVelocityHorizontal: fc.Vector3 = fc.Vector3.ZERO();
  let avatarVelocityVertical: fc.Vector3 = fc.Vector3.ZERO();

  export class AvatarControls extends GameObject {
    
    public constructor(_size: fc.Vector2, _position: fc.Vector3, _rotation: fc.Vector3) {
      super("DoomGuy", _size, _position, _rotation);
    }

    public hndAvatarControls(): void {
      let controlVelocity: number = 0.3; 

      if ( fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.SHIFT_LEFT]) ) 
        controlVelocity = 0.6;

      if ( fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.ALT_LEFT]) ) 
        controlVelocity = 0.1;

      controlHorizontal.setInput(
        fc.Keyboard.mapToValue(controlVelocity, 0, [fc.KEYBOARD_CODE.A])
        + fc.Keyboard.mapToValue(-controlVelocity, 0, [fc.KEYBOARD_CODE.D])
      );
      controlVertical.setInput(
        fc.Keyboard.mapToValue(controlVelocity, 0, [fc.KEYBOARD_CODE.W])
        + fc.Keyboard.mapToValue(-controlVelocity, 0, [fc.KEYBOARD_CODE.S])
      );
  
      avatarVelocityHorizontal = fc.Vector3.X(controlHorizontal.getOutput());
      avatarVelocityVertical = fc.Vector3.Z(controlVertical.getOutput());

      let frameTime: number = fc.Loop.timeFrameGame / 1000;

      let distanceHorizontal: fc.Vector3 = fc.Vector3.SCALE(avatarVelocityHorizontal, frameTime);
      let distanceVertical: fc.Vector3 = fc.Vector3.SCALE(avatarVelocityVertical, frameTime);
      this.mtxLocal.translate(distanceHorizontal);
      this.mtxLocal.translate(distanceVertical);
    }
  
    public hndMouseControl(_rotation: number): void {
      controlRotation.setInput(_rotation);
      this.mtxLocal.rotateY(controlRotation.getOutput());
    }
  
  }
}