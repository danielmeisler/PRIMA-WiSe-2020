namespace L08_Doom {
  import fc = FudgeCore;
  import fui = FudgeUserInterface;

  export class GameState extends ƒ.Mutable {
    public health: number = 100;
    public shield: number = 50;
    public time: String = "00:00";
    public score: number = 0;
    public ammo: number = 50;
    protected reduceMutator(_mutator: fc.Mutator): void {/* */ }
  }

  export let gameState: GameState = new GameState();

  export class Hud {
    private static controller: fui.Controller;

    public static start(): void {
      let domHud: HTMLDivElement = document.querySelector("div#hud");
      
      Hud.controller = new fui.Controller(gameState, domHud);
      Hud.controller.updateUserInterface();
    }
  }
}