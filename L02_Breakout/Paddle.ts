namespace L02_Breakout {
    import fc = FudgeCore;
    let control: fc.Control = new fc.Control("PaddleControl", 20, fc.CONTROL_TYPE.PROPORTIONAL);
    control.setDelay(100);

    export class Paddle extends MoveObject {

        public velocity: fc.Vector3 = fc.Vector3.ZERO();
        public speed: number = 300;

        public constructor(_name: string, _position: fc.Vector2, _size: fc.Vector2) {
            super(_name, _position, _size);
        }

        public movePaddle(): void {
            let frameTime: number = fc.Loop.timeFrameGame / 1000;

            control.setInput(
                fc.Keyboard.mapToValue(-1, 0, [fc.KEYBOARD_CODE.A, fc.KEYBOARD_CODE.ARROW_LEFT])
                + fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.D, fc.KEYBOARD_CODE.ARROW_RIGHT])
              );
            this.velocity = fc.Vector3.X(control.getOutput());

            let distance: fc.Vector3 = fc.Vector3.SCALE(this.velocity, frameTime);
            this.translate(distance);
        }

        public translate(_distance: fc.Vector3): void {
            this.mtxLocal.translate(_distance);
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
          }
    }
}