"use strict";
var L08_Doom;
(function (L08_Doom) {
    var fc = FudgeCore;
    var fcAid = FudgeAid;
    let ANGLE;
    (function (ANGLE) {
        // N = 0, NE = 1, E = 2, SE = 3, S = 4, SW = 5, W = 6, NW = 7,
        ANGLE[ANGLE["_000"] = 0] = "_000";
        ANGLE[ANGLE["_045"] = 1] = "_045";
        ANGLE[ANGLE["_090"] = 2] = "_090";
        ANGLE[ANGLE["_135"] = 3] = "_135";
        ANGLE[ANGLE["_180"] = 4] = "_180";
        ANGLE[ANGLE["_225"] = 5] = "_225";
        ANGLE[ANGLE["_270"] = 6] = "_270";
        ANGLE[ANGLE["_315"] = 7] = "_315";
    })(ANGLE = L08_Doom.ANGLE || (L08_Doom.ANGLE = {}));
    class Enemy extends fc.Node {
        // private static speedMax: number = 1; // units per second
        // public direction: number = 0; 
        constructor(_name = "Enemy", _position) {
            super(_name);
            this.speed = 1;
            this.oldAngle = ANGLE._000;
            this.addComponent(new fc.ComponentTransform());
            this.mtxLocal.translation = _position;
            this.show = new fcAid.Node("Show", fc.Matrix4x4.IDENTITY());
            this.appendChild(this.show);
            this.sprite = new fcAid.NodeSprite("Sprite");
            this.show.appendChild(this.sprite);
            this.oldAngle = this.changeAngle();
            this.sprite.setAnimation(Enemy.animations["Walk_000"]);
            // this.sprite.showFrame(0);
            this.sprite.setFrameDirection(1);
            this.sprite.framerate = 2;
            this.posTarget = _position;
            // this.appendChild(new fcAid.Node("Cube", fc.Matrix4x4.IDENTITY(), new fc.Material("Cube", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("red"))), new fc.MeshCube()));
        }
        static generateSprites(_spritesheet) {
            Enemy.animations = {};
            for (let angle = 0; angle < 5; angle++) {
                let name = "Walk" + ANGLE[angle];
                let sprite = new fcAid.SpriteSheetAnimation(name, _spritesheet);
                sprite.generateByGrid(fc.Rectangle.GET(40 + angle * 125, 30, 93, 70), 3, 25, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.Y(103));
                Enemy.animations[name] = sprite;
            }
        }
        changeAngle() {
            let enemyViewDirection = this.mtxWorld.getZ();
            let avatarToEnemy = fc.Vector3.TRANSFORMATION(L08_Doom.avatar.mtxWorld.translation, this.mtxWorldInverse, true);
            let angle = fc.Vector3.DOT(avatarToEnemy, enemyViewDirection) / (this.pythagoras(avatarToEnemy) * this.pythagoras(enemyViewDirection));
            angle = Math.acos(angle) * 180 / Math.PI;
            console.log("Angle: " + angle + " x-achse: " + avatarToEnemy.x);
            /* if (ANGLE._180 || ANGLE._225 || ANGLE._270 || ANGLE._315) {
              console.log("Test erfolgt");
              this.mtxLocal.rotateY(180);
            } */
            if (angle < 22.5)
                return ANGLE._000;
            if (angle < 67.5 && avatarToEnemy.x > 0)
                return ANGLE._045;
            if (angle < 112.5 && avatarToEnemy.x > 0)
                return ANGLE._090;
            if (angle < 157.5 && avatarToEnemy.x > 0)
                return ANGLE._135;
            if (angle > 157.5)
                return ANGLE._180;
            /* if (angle < 112.5 && avatarToEnemy.x < 0)
                 return ANGLE._225;
               if (angle < 67.5 && avatarToEnemy.x < 0)
                 return ANGLE._270;
               if (angle < 22.5 && avatarToEnemy.x < 0)
                 return ANGLE._315;  */
            return ANGLE._000;
        }
        pythagoras(_vector) {
            return Math.sqrt(Math.pow(_vector.x, 2) + Math.pow(_vector.z, 2));
        }
        update() {
            if (this.mtxLocal.translation.equals(this.posTarget, 0.1))
                this.chooseTargetPosition();
            let spriteAngle = this.changeAngle();
            //console.log(ANGLE[spriteAngle]);
            if (this.oldAngle !== spriteAngle) {
                this.sprite.setAnimation(Enemy.animations["Walk" + ANGLE[spriteAngle]]);
                this.oldAngle = spriteAngle;
            }
            this.move();
        }
        move() {
            this.mtxLocal.showTo(this.posTarget);
            //this.mtxLocal.translateZ(this.speed * fc.Loop.timeFrameGame / 1000);
            this.show.mtxLocal.showTo(fc.Vector3.TRANSFORMATION(L08_Doom.avatar.mtxLocal.translation, this.mtxWorldInverse, true));
        }
        chooseTargetPosition() {
            let range = 5; //sizeWall * numWalls / 2 - 2;
            this.posTarget = new fc.Vector3(fc.Random.default.getRange(-range, range), 0, fc.Random.default.getRange(-range, range));
        }
    }
    L08_Doom.Enemy = Enemy;
})(L08_Doom || (L08_Doom = {}));
/* export class Enemy extends GameObject {

  public constructor(_name: string, _size: fc.Vector2, _position: fc.Vector3, _rotation: fc.Vector3, _material: fc.Material) {
    super(_name, _size, _position, _rotation);

    let cmpMaterial: fc.ComponentMaterial = new fc.ComponentMaterial(_material);
    cmpMaterial.pivot.scale(fc.Vector2.ONE(1));
    this.addComponent(cmpMaterial);
    this.mtxLocal.translateY(_size.y / 2);
  }

  public rotateEnemy(_target: fc.Vector3): void {
    this.mtxLocal.showTo(_target);

  }

  public followPlayer(_target: fc.Vector3, _wall: GameObject): boolean {
    let normalEnemy: fc.Vector3 = this.mtxWorld.getZ();
    let normalWall: fc.Vector3 = _wall.mtxWorld.getZ();
    let posEnemy: fc.Vector3 = this.mtxWorld.translation;
    let posWall: fc.Vector3 = _wall.mtxWorld.translation;
    let sizeWall: fc.Vector3 = _wall.getComponent(fc.ComponentMesh).pivot.scaling;

    if (this.pythagoras(fc.Vector3.DIFFERENCE(posWall, posEnemy)) > this.pythagoras(fc.Vector3.DIFFERENCE(_target, posEnemy))) {
      return false;
    }

    let localWall: fc.Vector3 = fc.Vector3.TRANSFORMATION(posWall, this.mtxWorldInverse, true);

    if (localWall.z < 0) {
      return false;
    }

    let ray: fc.Ray = new fc.Ray(normalEnemy, posEnemy);

    let intersect: fc.Vector3 = ray.intersectPlane(posWall, normalWall);
    let localIntersect: fc.Vector3 = fc.Vector3.TRANSFORMATION(intersect, _wall.mtxWorldInverse, true);
    
    if (Math.abs(localIntersect.x) > 0.5 * sizeWall.x) {
      return false;
    }
    
    return true;

  }

  public pythagoras(_vector: fc.Vector3): number {
    return Math.sqrt(Math.pow(_vector.x, 2) + Math.pow(_vector.z , 2));
  }

} */ 
//# sourceMappingURL=enemy.js.map