"use strict";
var L08_Doom;
(function (L08_Doom) {
    var fc = FudgeCore;
    class GameObject extends fc.Node {
        constructor(_name, _size, _position, _rotation) {
            super(_name);
            this.addComponent(new fc.ComponentTransform(fc.Matrix4x4.TRANSLATION(_position)));
            this.mtxLocal.rotation = _rotation;
            let cmpQuad = new fc.ComponentMesh(GameObject.meshQuad);
            this.addComponent(cmpQuad);
            cmpQuad.pivot.scale(_size.toVector3(1));
            this.mtxPivot = this.getComponent(fc.ComponentMesh).pivot;
        }
        /*     public calculateBounce(_posWith: fc.Vector3, _radius: number = 1): fc.Vector3 {
              // make sure inversions exist
              this.calculatePivotInverse();
              this.calculateCompleteAndInverse();
        
              // transform position and radius to mesh coordinates
              let posLocal: fc.Vector3 = fc.Vector3.TRANSFORMATION(_posWith, this.mtxCompleteInverse, true);
              let vctRadiusLocal: fc.Vector3 = fc.Vector3.TRANSFORMATION(fc.Vector3.X(_radius), this.mtxPivotInverse);
        
              // return if behind mesh or further away than radius. Prerequisite: pivot.z of this object hasn't been scaled!!
              if (posLocal.z < 0 || posLocal.z > _radius)
                return null;
        
              // return if further to the side than 0.5 (the half of the width of the mesh) plus the transformed radius
              if (Math.abs(posLocal.x) > 0.5 + vctRadiusLocal.x)
                return null;
        
              // bounce in system local to mesh
              posLocal.z = _radius * 1.001;
        
              // transform back to world system
              posLocal.transform(this.mtxComplete, true);
        
              return posLocal;
            }
        
            private calculatePivotInverse(): void {
              if (this.mtxPivotInverse) return;
              this.mtxPivotInverse = fc.Matrix4x4.INVERSION(this.mtxPivot);
            }
        
            private calculateCompleteAndInverse(): void {
              if (this.mtxComplete) return;
              this.mtxComplete = fc.Matrix4x4.MULTIPLICATION(this.mtxWorld, this.mtxPivot);
              this.mtxCompleteInverse = fc.Matrix4x4.MULTIPLICATION(this.mtxPivotInverse, this.mtxWorldInverse);
            } */
        hndCollision(_targetradius) {
            for (let walls of L08_Doom.root.getChildrenByName("Walls"))
                for (let wall of walls.getChildren()) {
                    if (wall.detectHit(this.mtxWorld.translation, _targetradius)) {
                        return wall;
                    }
                }
            return null;
        }
        detectHit(_posWith, _radius) {
            let normal = this.mtxWorld.getZ();
            let posThis = this.mtxWorld.translation;
            let difference = fc.Vector3.DIFFERENCE(_posWith, posThis);
            let distance = fc.Vector3.DOT(difference, normal);
            if (distance < 0 || distance > _radius)
                return false;
            let size = this.getComponent(fc.ComponentMesh).pivot.scaling;
            let ray = new fc.Ray(normal, _posWith);
            let intersect = ray.intersectPlane(posThis, normal);
            let localIntersect = fc.Vector3.TRANSFORMATION(intersect, this.mtxWorldInverse, true);
            if (Math.abs(localIntersect.x) - _radius > 0.5 * size.x)
                return false;
            return true;
        }
    }
    GameObject.meshQuad = new fc.MeshSprite();
    L08_Doom.GameObject = GameObject;
})(L08_Doom || (L08_Doom = {}));
//# sourceMappingURL=gameobject.js.map