goku = [
  {
    level: 1,
    startingWeapon: "KI",
    charName: "Goku",
    surname: "the Saiyan",
    spriteName: "goku_01.png",
    textureName: "GOKU",
    walkingFrames: 3,
    description: "+1 projectile/20 Levels(max+3). +1% Might/Level. Ki Blasts.",
    isBought: true,
    price: 0,
    maxHp: 125,
    armor: 1,
    regen: 1,
    moveSpeed: 1,
    power: 1,
    cooldown: 1,
    area: 1,
    speed: 1,
    duration: 1,
    amount: 0,
    luck: 1,
    growth: 5,
    greed: 1,
    curse: 1.5,
    magnet: 0,
    revivals: 2,
    rerolls: 0,
    skips: 0,
    banish: 0,
    showcase: [],
    onEveryLevelUp: {
      power: 0.01,
    },
    debugTime: 840,
  },
  {
    level: 20,
    growth: 1,
  },
  {
    level: 40,
    growth: 1,
  },
  {
    level: 60,
    amount: 1,
  },
  {
    level: 21,
    growth: -1,
  },
  {
    level: 41,
    growth: -1,
  },
];

function main(mod) {
  //   const weaponType = mod.findModule("WeaponType");
  const { modules } = mod;
  const { default: characterClass } = mod.findModule(modules.CharacterClass);
  const { default: characters } = mod.findModule(modules.CharacterType);
  const { default: preload } = mod.findModule(modules.PreloadAssets);

  characters["GOKU"] = "GOKU";

  characterClass["GOKU"] = goku;

  const preloadFunction = preload.prototype.preload;
  preload.prototype.preload = function () {
    preloadFunction.apply(this);
    preloadAssets.apply(this);
  }
}

function preloadAssets() {
  this["load"]["atlas"](
    "GOKU",
    "mod-loader/mods/goku/goku.png",
    "mod-loader/mods/goku/goku.json"
  );
}

module.exports = {
  main,
};
