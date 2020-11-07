"use strict";
var L02_Breakout;
(function (L02_Breakout) {
    class Brick extends L02_Breakout.GameObject {
        constructor(_name, _position, _size) {
            super(_name, _position, _size);
        }
        hit() {
            this.getParent().removeChild(this);
        }
    }
    L02_Breakout.Brick = Brick;
})(L02_Breakout || (L02_Breakout = {}));
//# sourceMappingURL=Brick.js.map