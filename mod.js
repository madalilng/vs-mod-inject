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
    const importer =
      (this._modules["arg1"] && this._modules["arg1"]["__importDefault"]) ||
      function (_class) {
        return _class && _class["__esModule"] ? _class : { default: _class };
      };

    return importer(this._modules["arg4"](className));
  }

  inject(_class, args) {
    if (this.index === 1) {
      this.index++;
      this._modules = args;
      this.main();
      return _class;
    } else {
      this.index++;
      return _class;
    }
  }
}

module.exports = {
  Mod,
};
