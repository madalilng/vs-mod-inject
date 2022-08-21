const layouts = require("./layouts_module/Layouts");
const managers = require("./managers_module/Managers");
const qolOptions = require("./options.json");

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

//   console.log(mod.cleanFunction(0xe49a));
  //   console.log(GameManager)
  makeWeaponClass(mod);
  makeWeaponUIClass(mod);

  const GameManagerInitGame = GameManager.prototype.InitGame;
  GameManager.prototype.InitGame = function (...args) {
    GameManagerInitGame.apply(this, args);
    this.MainUI.ShowPassiveBlocks(6 - qolOptions.maxPowerUpWeapons);
  };
}

const makeWeaponClass = (mod) => {
  const { modules } = mod;
  const WeaponClass = mod.findModule(modules.WeaponClass);
  WeaponClass.default = class extends WeaponClass.default { 
    constructor( bulletType , _bool = true) {
        super(bulletType, _bool)
        console.log("weapon class");
    }
  }

  console.log(WeaponClass)
};

const makeWeaponUIClass = (mod) => {
  const { modules } = mod;

  const WeaponIconUI = mod.findModule(modules.WeaponIconUI);
  const { GM } = mod.findModule(modules.Game);

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
