namespace L08_Doom {
  import fc = FudgeCore;
  import fcAid = FudgeAid;

  export enum ANGLE {
    // N = 0, NE = 1, E = 2, SE = 3, S = 4, SW = 5, W = 6, NW = 7,
    _000 = 0, _045 = 1, _090 = 2, _135 = 3, _180 = 4, _225 = 5, _270 = 6, _315 = 7
  }

  export enum JOB {
    IDLE, PATROL, HUNT
  }


  export class Enemy extends fc.Node {
    private static animations: fcAid.SpriteSheetAnimations;
    public speed: number = 3;
    private show: fc.Node;
    private sprite: fcAid.NodeSprite;
    private posTarget: fc.Vector3;
    private angleView: number = 0;
    private job: JOB = JOB.IDLE;
    // private static speedMax: number = 1; // units per second
    // public direction: number = 0; 

    constructor(_name: string = "Enemy", _position: fc.Vector3) {
      super(_name);
      this.addComponent(new fc.ComponentTransform());
      this.mtxLocal.translation = _position;

      this.show = new fcAid.Node("Show", fc.Matrix4x4.IDENTITY());
      this.appendChild(this.show);

      this.sprite = new fcAid.NodeSprite("Sprite");
      this.sprite.addComponent(new fc.ComponentTransform());
      this.show.appendChild(this.sprite);


      this.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Enemy.animations["Idle_000"]);
      // this.sprite.showFrame(0);
      this.sprite.setFrameDirection(1);
      this.sprite.framerate = 2;

      // this.posTarget = _position;
      this.chooseTargetPosition();

      // this.appendChild(new fcAid.Node("Cube", fc.Matrix4x4.IDENTITY(), new fc.Material("Cube", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("red"))), new fc.MeshCube()));
    }


    public static generateSprites(_spritesheet: fc.CoatTextured): void {
      Enemy.animations = {};
      for (let angle: number = 0; angle < 5; angle++) {
        let name: string = "Idle" + ANGLE[angle];
        let sprite: fcAid.SpriteSheetAnimation = new fcAid.SpriteSheetAnimation(name, _spritesheet);
        sprite.generateByGrid(fc.Rectangle.GET(40 + angle * 125, 28, 93, 70), 3, 25, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.Y(103));
        Enemy.animations[name] = sprite;
      }
    }

    public update(): void {

      switch (this.job) {
        case JOB.PATROL:
          if (this.mtxLocal.translation.equals(this.posTarget, 0.1)) {
            this.chooseTargetPosition();
            this.job = JOB.IDLE; }
          this.move();
          break;
        case JOB.IDLE:
          if (this.mtxLocal.translation.equals(avatar.mtxLocal.translation, 10)) {
            this.job = JOB.HUNT;
          }
          break;
        case JOB.HUNT:
          this.mtxLocal.showTo(avatar.mtxLocal.translation);
          this.mtxLocal.translateZ(this.speed * fc.Loop.timeFrameGame / 1000);     
          if (this.mtxLocal.translation.equals(avatar.mtxLocal.translation, 1)) {
            gameState.health = gameState.health - 10;
            gameState.shield = gameState.shield - 5;
            this.job = JOB.PATROL;
          }
      }

      this.displayAnimation();
    }

    public hndIsTargetbetween(): boolean {
      for (let walls of root.getChildrenByName("Walls"))
          for (let wall of walls.getChildren() as GameObject[]) {
              if (this.isTargetbetween(avatar, wall)) {
                  return true;
              }
          }
      return false;
    }

    private move(): void {
      this.mtxLocal.showTo(this.posTarget);
      this.mtxLocal.translateZ(this.speed * fc.Loop.timeFrameGame / 1000);
    }

    private displayAnimation(): void {
      this.show.mtxLocal.showTo(fc.Vector3.TRANSFORMATION(avatar.mtxLocal.translation, this.mtxWorldInverse, true));

      let rotation: number = this.show.mtxLocal.rotation.y;
      rotation = (rotation + 360 + 22.5) % 360;
      rotation = Math.floor(rotation / 45);

      if (this.angleView == rotation)
        return;

      this.angleView = rotation;

      if (rotation > 4) {
        rotation = 8 - rotation;
        this.flip(true);
      }
      else
        this.flip(false);

      let section: string = ANGLE[rotation]; // .padStart(3, "0");
      //console.log(section);
      this.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Enemy.animations["Idle" + section]);
    }

    private chooseTargetPosition(): void {
      let range: number = sizeWall * numWalls / 2 - 2;
      this.posTarget = new fc.Vector3(fc.Random.default.getRange(-range, range), 0, fc.Random.default.getRange(-range, range));
      console.log("New target", this.posTarget.toString());
    }

    private flip(_reverse: boolean): void {
      this.sprite.mtxLocal.rotation = fc.Vector3.Y(_reverse ? 180 : 0);
    }

    private vectorAmount(_vector: fc.Vector3): number {
      return Math.sqrt(Math.pow(_vector.x, 2) + Math.pow(_vector.y, 2) + Math.pow(_vector.z, 2));
    }

    private isTargetbetween(_target: GameObject, _betweenTarget: GameObject): boolean {

      let posThis: fc.Vector3 = this.mtxWorld.translation;
      let posTarget: fc.Vector3 = _target.mtxWorld.translation;
      let posWith: fc.Vector3 = _betweenTarget.mtxWorld.translation;

      if (this.vectorAmount(fc.Vector3.DIFFERENCE(posWith, posThis)) > this.vectorAmount(fc.Vector3.DIFFERENCE(posTarget, posThis)))
          return false;

      let localWich: fc.Vector3 = fc.Vector3.TRANSFORMATION(posWith, this.mtxWorldInverse, true);
      if (localWich.z < 0)
          return false;

      //let normal: fc.Vector3 = this.mtxWorld.getZ();
      let normalBe: fc.Vector3 = _betweenTarget.mtxWorld.getZ();
      let sizeBe: fc.Vector3 = _betweenTarget.getComponent(fc.ComponentMesh).pivot.scaling;

      let ray: fc.Ray = new fc.Ray(this.mtxWorld.getZ(), posTarget);

      let intersect: fc.Vector3 = ray.intersectPlane(posWith, normalBe);
      let localIntersect: fc.Vector3 = fc.Vector3.TRANSFORMATION(intersect, _betweenTarget.mtxWorldInverse, true);

      if (Math.abs(localIntersect.x) > 0.5 * sizeBe.x) {
          return false;
      }
      return true;
    }
  }
}