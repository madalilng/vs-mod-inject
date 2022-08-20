module.exports = {
  main,
};


const weaponData = [
  {
    level: 0x1,
    bulletType: "KI",
    name: "Ki Blast",
    description: "Saiyan Energy Blast. Fired at closest enemy.",
    tips: "Ignores: duration.",
    texture: "KI",
    frameName: "smallki.png",
    isUnlocked: true,
    poolLimit: 0x3c,
    rarity: 0, //100
    interval: 0x4b0,
    repeatInterval: 0x64,
    power: 0x1,
    area: 0x1,
    speed: 1.2,
    amount: 0x1,
    penetrating: 0x1,
  },
  {
    amount: 0x1,
  },
  {
    interval: -0xc8,
    power: 0x1,
  },
  {
    amount: 0x2,
  },
  {
    power: 0x1,
  },
  {
    amount: 0x2,
    speed: 0x2,
  },
  {
    penetrating: 0x2,
    power: 0x1,
  },
  {
    interval: -0x1f4,
  },
];

function main(mod) {
  const { modules } = mod;
  const { default: preload } = mod.findModule(modules.PreloadAssets);
  const { default: weaponClass } = mod.findModule(modules.WeaponClass);
  const { default: weaponAtkClass } = mod.findModule(modules.WeaponClassMake);

  weaponClass["KI"] = weaponData;

  const preloadFunction = preload.prototype.preload;

  preload.prototype.preload = function () {
    preloadFunction.apply(this);
    this["load"]["atlas"]("ARSENAL", "mod-loader/mods/ki/arsenal.png", "mod-loader/mods/ki/arsenal.json" );
    this["load"]["atlas"]("KI", "mod-loader/mods/ki/blasts.png", "mod-loader/mods/ki/blasts.json");
    this["load"]["audio"]("SFX_KI", "mod-loader/mods/ki/ki.ogg");
  };

 
  weaponClassMod = classGenerator(mod);

  const weaponMake = weaponAtkClass.prototype.Make;
  weaponAtkClass.prototype.Make = function (...args) {
    
    if (this["weaponType"] === "KI") {
      return new weaponClassMod(this, 0, 0, args[0], args[1]);
    }
    return weaponMake.apply(this, args);
  }

}

const classGenerator = (mod) => {
  const { modules } = mod

  const { default: weaponClassBase } = mod.findModule(modules.WeaponClassBase);
  const { default: game } = mod.findModule(modules.Game);
  const { default: gameManager } = mod.findModule(modules.GameManager);
  const { default: SfxType } = mod.findModule(modules.SfxType);

  SfxType["SFX_KI"] = "SFX_KI";

  return class extends weaponClassBase {
    constructor(scene, x, y, frame, _0xb8461d) {
      super(
        scene,
        x,
        y,
        "ARSENAL", // texture key
        "smallki.png", // texture atlas
        frame,
        _0xb8461d
      );

      this.PfxEmitter = this.scene.add.particles("ARSENAL");
      this.PfxEmitter.createEmitter({
        frame: ["Pfxki1.png", "Pfxki2.png"],
        speed: {
          min: 15,
          max: 30,
        },
        quantity: 1,
        lifespan: 300,
        alpha: {
          start: 1,
          end: 0,
        },
        on: false,
      });
    }

    OnRecycle() {
      super.OnRecycle(),
        this.body.setCircle(8),
        this.setScale(
          gameManager.PixelScale* this.weapon.PArea
        );
      this.x += (Math.random() - 0.5) * this.indexInWeapon * 10;
      this.y += (Math.random() - 0.5) * this.indexInWeapon * 10;
      this.AimForNearestEnemy();
      let volume = this.weapon.volume ? this.weapon.volume : 0.15;

      game.Sound.PlaySound(
        SfxType["SFX_KI"],
        { detune: -0x64 * this["indexInWeapon"], volume: volume },
        0xc8,
        0xc
      );
    }

    OnHasHitAnObject(object) {
      if (!object.isDead) {
        if (this.bounces > 0)
          return (
            this.bounces--,
            this.AimForRandomEnemy(),
            void (this.objectsHit = [])
          );
        this.penetrating--;
        this.penetrating <= 0 && this.DeSpawn();
      }
    }

    Update() {
      this.PfxEmitter.emitParticleAt(this.x, this.x);
    }
  };
};
