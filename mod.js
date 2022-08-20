const ki = require("./mods/ki/ki.js")
const goku = require("./mods/goku/goku.js")
const foundModules = require("./classKey.json");

class Mod {
  constructor() {
    this.index = 0;
    this._modules = undefined;
    this.modules = {}

    Object.keys(foundModules).forEach( keys => {
      this.modules[keys] = foundModules[keys].dec
    });
  }

  main() {
    goku.main(this);
    ki.main(this);
  }

  findModule(className) {
    return this._modules(className)
  }

  inject(modules) {
    this._modules = modules;
    this.main();
  }
}

module.exports = {
  Mod,
};
