const layouts = require("./layouts_module/Layouts");
const managers = require("./managers_module/Managers");
const qolData = require("./options.json");

const qolOptions = new Proxy(qolData, {
  set: function (target, key, value) {
    console.log(`${key} set from ${target[key]} to ${value}`);
    target[key] = value;
    return true;
  },
});

Object.defineProperty(String.prototype, "capitalize", {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false,
});

class Queue {
  #size;
  #elements;
  #head;
  #tail;
  #sumOfRemovedElements;

  constructor(size = 5) {
    this.#size = size;

    this.#elements = {};

    this.#head = 0;
    this.#tail = 0;
    this.#sumOfRemovedElements = 0;
  }

  enqueue(element) {
    this.#elements[this.#tail] = element;
    this.#tail++;

    if (this.length > this.#size) {
      this.dequeue();
    }
  }

  dequeue() {
    const item = this.#elements[this.#head];
    delete this.#elements[this.#head];

    this.#head += 1;

    this.#sumOfRemovedElements += item;

    return item;
  }

  get length() {
    return this.#tail - this.#head;
  }

  get elements() {
    return Object.values(this.#elements);
  }

  get sum() {
    return this.elements.reduce((sum, el) => sum + el, 0);
  }

  get lifetimeSum() {
    return (this.sum || 0) + this.#sumOfRemovedElements;
  }

  get last() {
    return this.#elements[this.#tail - 1];
  }

  set last(newValue) {
    this.#elements[this.#tail - 1 >= 0 ? this.#tail - 1 : 0] = newValue;
  }

  get preLast() {
    return this.#elements[this.#tail - 2];
  }
}

function main(mod) {
  const { modules } = mod;
  const { default: GameManager } = mod.findModule(modules.GameManager);
  const { default: PreloadAssets } = mod.findModule(modules.PreloadAssets);

  const GameManagerInitGame = GameManager.prototype.InitGame;
  GameManager.prototype.InitGame = function (...args) {
    GameManagerInitGame.apply(this, args);
    this.MainUI.ShowPassiveBlocks(6 - qolOptions.maxPowerUpWeapons);
  };

  const preloadFunction = PreloadAssets.prototype.preload;

  PreloadAssets.prototype.preload = function () {
    preloadFunction.apply(this);

    this.load.atlas(
      "qolModAtlas",
      "./mod-loader/mods/multipurpose_qol_mod/assets/qolModAtlas.png",
      "./mod-loader/mods/multipurpose_qol_mod/assets/qolModAtlas.json"
    );
  };

  extendWeaponUIClass(mod);
  extendSceneManager(mod);

  const interval = setInterval(function () {
    const GM = mod.findModule(modules.Game);
    if (GM.default.Core) {
      clearInterval(interval);
      modScene = makeModScene(mod);
      addDebugMode(GM);
      // GM.default.Core.Game.scene.add("ModOptionsScene2222", new mainScene());
      GM.default.Core.Game.scene.add("ModOptionsScene", new modScene());
      GM.default.Core.SceneManager.SetModOptionScene();
    } else {
      console.log("gm empty");
    }
  }, 1000);
}

const addDebugMode = (GM) => {
  const createMainScene = GM.default.Core.SceneManager.MainScene.create;
  GM.default.Core.SceneManager.MainScene.create = function () {
    if (qolOptions.debugModeEnabled) {
      this.input.keyboard
        .addKey(Phaser.Input.Keyboard.KeyCodes.B)
        .on("down", () => {
          GM.default.Core.debug_destructibles();
        });

      this.input.keyboard
        .addKey(Phaser.Input.Keyboard.KeyCodes.X)
        .on("down", () => {
          GM.default.Core.Player.AddXP(
            GM.default.Core.LevelUpFactory.XpRequiredToLevelUp -
              GM.default.Core.LevelUpFactory.PreviousXpRequiredToLevelUp
          ),
            GM.default.Core.CheckForLevelUp();
        });

      this.input.keyboard
        .addKey(Phaser.Input.Keyboard.KeyCodes.Z)
        .on("down", () => {
          for (
            let weapon = GM.default.Core.LevelUpFactory.WeaponStore.length - 1;
            weapon >= 0;
            weapon--
          ) {
            const selectedWeapon =
              GM.default.Core.LevelUpFactory.WeaponStore[weapon];
            GM.default.Core.LevelWeaponUp(selectedWeapon),
              GM.default.Core.Player.LevelUp();
          }
          GM.default.Core.Player.xp =
            GM.default.Core.LevelUpFactory.PreviousXpRequiredToLevelUp;
        });

      this.input.keyboard
        .addKey(Phaser.Input.Keyboard.KeyCodes.P)
        .on("down", () => {
          GM.default.Core.TimeStop();
        });

      this.input.keyboard
        .addKey(Phaser.Input.Keyboard.KeyCodes.L)
        .on("down", () => {
          GM.default.Core.PlayerOptions.AddCoins(1000);
          GM.default.Core.MainUI.UpdateCoins();
        });

      this.input.keyboard
        .addKey(Phaser.Input.Keyboard.KeyCodes.M)
        .on("down", () => {
          GM.default.Core.Player.moveSpeed =
            10 == GM.default.Core.Player.moveSpeed ? 1.2 : 10;
        });

      this.input.keyboard
        .addKey(Phaser.Input.Keyboard.KeyCodes.G)
        .on("down", () => {
          GM.default.Core.debug_Treasure();
        }),
        this.input.keyboard
          .addKey(Phaser.Input.Keyboard.KeyCodes.N)
          .on("down", () => {
            GM.default.Core.debug_Arcana();
          }),
        this.input.keyboard
          .addKey(Phaser.Input.Keyboard.KeyCodes.J)
          .on("down", () => {
            GM.default.Core.debug_CharCoffin();
          }),
        this.input.keyboard
          .addKey(Phaser.Input.Keyboard.KeyCodes.I)
          .on("down", () => {
            GM.default.Core.Player.SetInvulForMilliSeconds(
              Number.MAX_SAFE_INTEGER
            ),
              GM.default.Core.Player.restoreTint(),
              this.time.addEvent({
                delay: 100,
                callback: () => {
                  GM.default.Core.Player.restoreTint();
                },
              });
          }),
        this.input.keyboard
          .addKey(Phaser.Input.Keyboard.KeyCodes.H)
          .on("down", () => {
            GM.default.Core.Player.RecoverHp(9999, false);
          }),
        this.input.keyboard
          .addKey(Phaser.Input.Keyboard.KeyCodes.K)
          .on("down", () => {
            GM.default.Core.RosaryDamage();
          }),
        this.input.keyboard
          .addKey(Phaser.Input.Keyboard.KeyCodes.V)
          .on("down", () => {
            GM.default.Core.TurnOnVacuum();
          }),
        this.input.keyboard
          .addKey(Phaser.Input.Keyboard.KeyCodes.O)
          .on("down", () => {
            GM.default.Core.Player.OnDeath();
          }),
        this.input.keyboard
          .addKey(Phaser.Input.Keyboard.KeyCodes.E)
          .on("down", () => {
            GM.default.Core.debug_SpawnEnemies();
          }),
        this.input.keyboard
          .addKey(Phaser.Input.Keyboard.KeyCodes.Q)
          .on("down", () => {
            GM.default.Core.SceneManager.EnterWeaponSelection();
          }),
        this.input.keyboard
          .addKey(Phaser.Input.Keyboard.KeyCodes.T)
          .on("down", () => {
            GM.default.Core.debug_NextMinute();
          }),
        this.input.keyboard
          .addKey(Phaser.Input.Keyboard.KeyCodes.F)
          .on("down", () => {
            //(GM.default._0x11db86.default[_0x1777f3.default.STATS_TREASURE_3].pickedupAmount += 1),
            GM.default.Core.debug_FireAll();
          }),
        this.input.on(
          "wheel",
          function (...args) {
            (this.cameras.main.zoom -= 0.005 * this.cameras.main.zoom),
              (this.cameras.main.zoom = Math.min(
                Math.max(this.cameras.main.zoom, 0.05),
                4
              ));
          }.bind(this)
        );
      var pauseBtn = this.add
        .image(0, 120, "UI", "pause.png")
        .setScrollFactor(0)
        .setScale(3)
        .setInteractive()
        .setAlpha(0.3)
        .setOrigin(0, 0);
      GM["DEBUG_INFO"] || pauseBtn.setAlpha(0.001),
        pauseBtn.on("pointerdown", () => {
          GM.default.Core.SceneManager.EnterDebug();
        });
    }
    createMainScene.apply(this);
  };
};

const extendSceneManager = (mod) => {
  const { modules } = mod;
  const SceneManager = mod.findModule(modules.SceneManager);
  const { default: gameManager } = mod.findModule(modules.GameManager);
  const { default: NineSliceConfig } = mod.findModule(modules.NineSliceConfig);

  // console.log(mod.cleanFunction(modules.SceneManager));

  SceneManager.default = class extends SceneManager.default {
    constructor(game, scene) {
      super(game, scene);
    }

    SetModOptionScene() {
      this.ModOptionsScene = this.scene.get("ModOptionsScene");
    }

    OptionsFromMainMenu() {
      super.OptionsFromMainMenu();
      const plugins = mod.findModule(0x16c14); // cant find plugin manager
      const { height, width } = this.OptionsScene.renderer;

      const ModOptionsButton = new plugins.NineSlice(
        this.OptionsScene,
        NineSliceConfig["OptionsButton"],
        {
          x: width - 8 - 100,
          y: height - 128 - 74,
          width: 100,
          height: 32,
        }
      )
        .setScale(2 * gameManager.PixelScale)
        .setOrigin(0.5);
      this.OptionsScene.add.existing(ModOptionsButton);

      const ModOptionsText = this.OptionsScene.add
        .text(ModOptionsButton.x, ModOptionsButton.y, "Mod Options", {
          align: "center",
        })
        .setScale(1 * gameManager.PixelScale)
        .setOrigin(0.5);

      ModOptionsText.setVisible(true);

      ModOptionsButton.setInteractive();

      ModOptionsButton.on("pointerdown", () => {
        this.ModOptionsFromOptions();
      });
    }

    ModOptionsFromOptions() {
      this.UI_overlayScene.DestroyGrid(),
        this.scene.launch(this.ModOptionsScene),
        this.scene.bringToTop(this.ModOptionsScene),
        this.scene.pause(this.OptionsScene),
        this.scene.setVisible(false, this.OptionsScene),
        this.UI_topBar.EnableBack(this.ExitModOptions.bind(this)),
        this.UI_topBar.DisableOptions(),
        this.scene.bringToTop(this.UI_overlayScene);
    }
    ExitModOptions() {
      this.UI_overlayScene.DestroyGrid(),
        this.scene.stop(this.ModOptionsScene),
        this.scene.resume(this.IntroScene),
        this.scene.setVisible(false, this.ModOptionsScene),
        this.IntroScene.MakeUIGrid(this.IntroScene.UI_topBar.OptionsButton),
        this.UI_topBar.EnableOptions(this.OptionsFromMainMenu.bind(this)),
        this.UI_topBar.DisableBack();
    }
  };
};

const makeModScene = (mod) => {
  const { modules } = mod;
  const { default: NineSliceConfig } = mod.findModule(modules.NineSliceConfig);
  const { default: WeaponList } = mod.findModule(modules.WeaponList);
  const { default: gameManager } = mod.findModule(modules.GameManager);
  const { default: SceneManager } = mod.findModule(modules.SceneManager);
  const { default: Utils } = mod.findModule(modules.Utils);
  const GM = mod.findModule(modules.Game);

  // console.log(mod.cleanFunction(0x1715a));

  return class extends window.Phaser.Scene {
    constructor() {
      super({ key: "ModOptionsScene" });

      let weapons = [];

      for (const weapon in WeaponList) {
        weapons.push(WeaponList[weapon][0]);
      }

      this._maxWeapons = weapons.filter(
        (el) => !el.isSpecialOnly && !el.isPowerUp && !el.isEvolution
      ).length;
      this._maxPassives = weapons.filter((el) => el.isPowerUp).length;
    }

    preload() {}
    create() {
      const plugins = mod.findModule(0x16c14);
      const screenWidth = GM.SAFEAREA.width * gameManager.RPixelScale;
      const screenHeight = (GM.SAFEAREA.height - 64) * gameManager.RPixelScale;
      const height = screenHeight * gameManager.PixelScale;

      this.background = new plugins.NineSlice(
        this,
        NineSliceConfig.MenuBackground,
        {
          x: 0,
          y: 0,
          width: screenWidth,
          height: screenHeight,
        }
      );

      this.background.setPosition(GM.SAFEAREA.centerX, height);
      this.background.setOrigin(0.5, 1);
      this.background.setScale(gameManager.PixelScale);
      this.add.existing(this.background);
      this.background.setInteractive();

      this.header = this.add
        .text(GM.SAFEAREA.centerX, 33, "Mod Options", {})
        .setScale(2 * gameManager.PixelScale)
        .setOrigin(0.5);

      this.pageManager = new managers.PageManager({
        game: GM,
        options: qolOptions,
        scene: this,
        line: 7,
        pages: [
          // First page
          new layouts.Page([
            // Debug mode toggle
            new layouts.TextCheckboxLayout({
              game: GM,
              options: qolOptions,
              scene: this,
              varName: "debugModeEnabled",
              text: "Debug mode",
              line: 1,
            }),

            // Limit break tooltip toggle
            new layouts.TextCheckboxLayout({
              game: GM,
              options: qolOptions,
              scene: this,
              varName: "limitBreakTooltipEnabled",
              text: "Limit break stats tooltip",
              line: 2,
            }),

            // Colored chests toggle
            new layouts.TextCheckboxLayout({
              game: GM,
              options: qolOptions,
              scene: this,
              varName: "coloredChestsEnabled",
              text: "Colored chests",
              line: 3,
            }),

            // Starting arcanas ticker
            new layouts.TextTickerLayout({
              game: GM,
              options: qolOptions,
              scene: this,
              varName: "startingArcanas",
              min: 1,
              max: 3,
              text: "Starting arcanas",
              line: 4,
            }),

            // Max weapons/passives tickers
            new layouts.TextTickerLayout({
              game: GM,
              options: qolOptions,
              scene: this,
              varName: "maxPowerUpWeapons",
              min: 1,
              max: this._maxPassives,
              text: "Max passives",
              line: 5,
            }),

            // Skip penta chest toggle
            new layouts.TextCheckboxLayout({
              game: GM,
              options: qolOptions,
              scene: this,
              varName: "skipPentaChestsEnabled",
              text: "Skip Penta Chests",
              line: 6,
            }),
          ]),

          // Second page
          new layouts.Page([
            // Spawn chests on player toggle
            new layouts.TextCheckboxLayout({
              game: GM,
              options: qolOptions,
              scene: this,
              varName: "spawnChestsOnPlayerEnabled",
              text: "Spawn Chests On Player",
              line: 1,
            }),

            // Dps tooltip settings
            new layouts.TextCheckboxTextTickerLayout({
              game: GM,
              options: qolOptions,
              scene: this,
              checkboxText: "Dps tooltip",
              checkboxVarName: "dpsTooltipEnabled",

              tickerText: "Track time(s)",
              tickerVarName: "dpsQueueSize",
              tickerMin: 3,
              tickerMax: 9,

              line: 2,
            }),

            // Kills ps settings
            new layouts.TextCheckboxTextTickerLayout({
              game: GM,
              options: qolOptions,
              scene: this,
              checkboxText: "Kills/s",
              checkboxVarName: "killsPSEnabled",

              tickerText: "Track time(s)",
              tickerVarName: "killsPSQueueSize",
              tickerMin: 3,
              tickerMax: 9,

              line: 3,
            }),

            // Gold ps settings
            new layouts.TextCheckboxTextTickerLayout({
              game: GM,
              options: qolOptions,
              scene: this,
              checkboxText: "Gold/s",
              checkboxVarName: "goldPSEnabled",

              tickerText: "Track time(s)",
              tickerVarName: "goldPSQueueSize",
              tickerMin: 3,
              tickerMax: 9,

              line: 4,
            }),
          ]),
        ],
      });

      this.UI_topBar = this.scene.get("UI_topBar");
      this.UI_mainMenu = this.scene.get("UI_mainMenu");

      const _children = this.children.getAll();
      this.children.removeAll();

      this.SceneContainer = this.add.container(0, 0, _children);
      this.SceneContainer.setScale((0, GM.GET_RATIO)());

      Utils.CalculateAndSetContainerSize(this.SceneContainer);
      this.SceneContainer.y =
        this.renderer.height - this.SceneContainer.displayHeight;
      this.EnableInput();
      this.ReadPlayerOptions();

      this.MakeUIGrid(this.UI_topBar.BackButton);
    }

    EnableInput() {
      this.pageManager.EnableInput();
    }

    ReadPlayerOptions() {
      this.pageManager.ReadPlayerOptions();
    }

    MakeUIGrid(UI) {
      let overlay = GM.default.Core.SceneManager.UI_overlayScene;
      overlay.MakeUIGrid(1, 9, false),
        overlay.UI_grid.SetContents(0, 0, this.UI_topBar.BackButton),
        overlay.ToggleCursorsVisibility(true),
        overlay.UI_grid.SelectGameObject(UI),
        (overlay.UI_selected = UI),
        GM.default.Core.SceneManager.scene.bringToTop(overlay),
        (overlay.OnCancelCallback = () => {
          var backBtn, btnEvnt, callback;
          null ===
            (callback =
              null ===
                (btnEvnt =
                  null === (backBtn = this.UI_topBar.BackButton) ||
                  void 0 === backBtn
                    ? void 0
                    : backBtn._events) || void 0 === btnEvnt
                ? void 0
                : btnEvnt.pointerdown) ||
            void 0 === callback ||
            callback.fn();
        });
    }

    DestroyUIGrid() {
      GM.Core.SceneManager.UI_overlayScene.DestroyGrid();
    }
  };
};

const extendWeaponUIClass = (mod) => {
  const { modules } = mod;

  const WeaponIconUI = mod.findModule(modules.WeaponIconUI);
  const { default: GM } = mod.findModule(modules.Game);

  WeaponIconUI.default = class extends WeaponIconUI.default {
    constructor(args) {
      super(args);
      this.BlockedPassiveSlots = new Array();
      this.BlockedPassiveSlots = [];

      for (let i = 1; i < 6; i++) {
        this.BlockedPassiveSlots[i] = this.scene.add
          .image(
            20 + this.xIncrease * i,
            7 + this.yOffset * 2,
            "UI",
            "no16.png"
          )
          .setAlpha(0.5)
          .setScrollFactor(0)
          .setOrigin(1, 0.5)
          .setVisible(false);
      }

      this.BlockedPassiveSlots.reverse();

      if (qolOptions.killsPSEnabled) {
        this.KillsIcon2 = this.scene.add
          .image(
            0.85 * this.scene.renderer.width - 4,
            45,
            "UI",
            "SkullToken.png"
          )
          .setScrollFactor(0)
          .setOrigin(1, 0.5);

        this.KillsPSText = this.scene.add
          .text(
            this.KillsIcon2.x - this.KillsIcon2.displayWidth - 4,
            this.KillsIcon2.y,
            "0/s",
            {
              color: "white",
              fontSize: "12px",
              fontStyle: "bold",
            }
          )
          .setScrollFactor(0)
          .setOrigin(1, 0.5);
      }

      if (qolOptions.goldPSEnabled) {
        this.CoinsIcon2 = this.scene.add
          .image(this.scene.renderer.width - 4, 45, "UI", "CoinGold.png")
          .setScrollFactor(0)
          .setOrigin(1, 0.5);

        this.PlayerGoldPSText = this.scene.add
          .text(
            this.CoinsIcon2.x - this.CoinsIcon2.displayWidth - 4,
            this.CoinsIcon2.y,
            "0/s",
            {
              color: "white",
              fontSize: "12px",
              fontStyle: "bold",
            }
          )
          .setScrollFactor(0)
          .setOrigin(1, 0.5);
      }
      if (qolOptions.killsPSEnabled) {
        this.killsPSQueue = new Queue(qolOptions.goldPSQueueSize);
        this.KillsIcon2.setDepth(Number.MAX_SAFE_INTEGER);
        this.KillsPSText.setDepth(Number.MAX_SAFE_INTEGE);
      }
      if (qolOptions.goldPSEnabled) {
        this.CoinsIcon2.setDepth(Number.MAX_SAFE_INTEGER);
        this.PlayerGoldPSText.setDepth(Number.MAX_SAFE_INTEGER);
        this.goldPSQueue = new Queue(qolOptions.killsPSQueueSize);
      }
    }

    SetSurvivedSeconds(sec) {
      super.SetSurvivedSeconds(sec);

      if (qolOptions.killsPSEnabled) {
        this.killsPSQueue.enqueue(
          GM.Core.PlayerOptions.RunEnemies - this.killsPSQueue.lifetimeSum
        );
        this.KillsPSText.text = `${(
          this.killsPSQueue.sum / this.killsPSQueue.length || 0
        )
          .toFixed(0)
          .toLocaleString()}/s`;
      }

      if (qolOptions.goldPSEnabled) {
        this.goldPSQueue.enqueue(
          GM.Core.PlayerOptions.RunCoins - this.goldPSQueue.lifetimeSum
        );
        this.PlayerGoldPSText.text = `${(
          this.goldPSQueue.sum / this.goldPSQueue.length || 0
        )
          .toFixed(0)
          .toLocaleString()}/s`;
      }

      if (qolOptions.dpsTooltipEnabled) {
        GM.Core.Weapons.forEach((weapon) => {
          //   weapon.damageQueue.enqueue(
          //     weapon.stats_inflictedDamage - weapon.damageQueue.lifetimeSum
          //   );
        });
      }
    }

    ShowPassiveBlocks = function (len) {
      for (let i = 0; i < len; i++) {
        this.BlockedPassiveSlots[i] &&
          (this.BlockedPassiveSlots[i].visible = true);
      }
    };
  };
};

module.exports = {
  main,
};
