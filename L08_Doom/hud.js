"use strict";
var L08_Doom;
(function (L08_Doom) {
    var fui = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        constructor() {
            super(...arguments);
            this.health = 100;
            this.shield = 50;
            this.time = "00:00";
            this.score = 0;
            this.ammo = 50;
        }
        reduceMutator(_mutator) { }
    }
    L08_Doom.GameState = GameState;
    L08_Doom.gameState = new GameState();
    class Hud {
        static start() {
            let domHud = document.querySelector("div#hud");
            Hud.controller = new fui.Controller(L08_Doom.gameState, domHud);
            Hud.controller.updateUserInterface();
        }
    }
    L08_Doom.Hud = Hud;
})(L08_Doom || (L08_Doom = {}));
//# sourceMappingURL=hud.js.map