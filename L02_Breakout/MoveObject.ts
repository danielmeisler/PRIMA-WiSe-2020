namespace L02_Breakout {
    import fc = FudgeCore;

    export class MoveObject extends GameObject {
        private static readonly REFLECT_VECTOR_X: fc.Vector3 = fc.Vector3.X();
        private static readonly REFLECT_VECTOR_Y: fc.Vector3 = fc.Vector3.Y();

        public speed: number = 15;
        public velocity: fc.Vector3 = fc.Vector3.ZERO();

        public constructor(_name: string, _position: fc.Vector2, _size: fc.Vector2) {
            super(_name, _position, _size);

            this.velocity = new fc.Vector3(fc.Random.default.getRange(-1, 1), fc.Random.default.getRange(-1, 1), 0);
            this.velocity.normalize(this.speed);
        }

        public move(): void {
            let frameTime: number = fc.Time.game.getElapsedSincePreviousCall() / 1000;
            let distance: fc.Vector3 = fc.Vector3.SCALE(this.velocity, frameTime);

            this.mtxLocal.translate(distance);
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
        }

        public checkCollision(_target: GameObject): boolean {
            let intersection: fc.Rectangle = this.rect.getIntersection(_target.rect);
            if (intersection == null) {
                return false;
            }

            if (intersection.size.x > intersection.size.y)
                this.velocity.reflect(MoveObject.REFLECT_VECTOR_Y);
            else
                this.velocity.reflect(MoveObject.REFLECT_VECTOR_X);

            return true;
        }
    }
}