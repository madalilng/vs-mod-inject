var fs = require("fs");
const qol = require("./mods/multipurpose_qol_mod/qol")
const ki = require("./mods/ki/ki.js")
const goku = require("./mods/goku/goku.js")
const finderDictionary = require("./finderDictionary.json");
const foundModules = require("./classKey.json");

class ClassFinder {
  constructor() {
    this.index = 0;
    this._modules = undefined;
    this.modules = {}

    Object.keys(foundModules).forEach( keys => {
      this.modules[keys] = foundModules[keys].dec
    });

    this.output = foundModules;
  }

  main() {
    // UPDATE CLASS KEY
    // for (const key in this._modules["m"]) {
    //   this.identifier(key);
    // }
    // this.saveClassKey();

    // TEST MOD
    qol.main(this);
    // goku.main(this);


    // // TEST MODULE LOCATOR
    // let func = this.findModule(this.modules.CharacterClass);
    // console.log(func)

    // TEST CLEAN CLASS
    let testClass = this.cleanFunction(this.modules.SceneManager);
    console.log(testClass)

    // let func = this.findModule(0x17895);
    
    // console.log(func)

      // FIND STATIC MODULES AKA STRINGS NAME
      //   if (clean.includes(" = void 0x0")) {
      //     let name = /\["(.+)"\] = void 0x0/i;
      //     const result = clean.match(name);

      //     this.output[result[1]] = {
      //         dec: Number(key),
      //         hex: `0x${Number(key).toString(16)}`
      //     };
      //     console.log(result[1]);
      //   }
    

  }

  saveClassKey() {
    fs.writeFile(
      "D:/Steam/steamapps/common/Vampire Survivors/resources/app/.webpack/renderer/mod-loader/classKey.json",
      JSON.stringify(this.output, undefined, 2),
      "utf8",
      function (err) {
        if (err) {
          console.log("An error occured while writing JSON Object to File.");
          return console.log(err);
        }

        console.log("JSON file has been saved.");
      }
    );
  }

  identifier(key) {
    const func = this.cleanFunction(key);
    Object.keys(finderDictionary).forEach((className) => {
      if (!this.output[className]) {
        let found = [];
        finderDictionary[className].forEach((toFind, index) => {
          found[index] = func.includes(toFind);
        });

        if (!found.includes(false)) {
          console.log(key, className);
          this.output[className] = {
            dec: Number(key),
            hex: `0x${Number(key).toString(16)}`,
          };
        }
      }
    });
  }

  findModule(className) {
    return this._modules(className)
  }


  cleanFunction(fnc) {
    const strLibrary = window.a0_0x1e38;

    let pattern = /_0[xX][0-9a-fA-F]+\((0[xX][0-9a-fA-F]+)\)/g;
    
    let test = this._modules["m"][fnc].toString();
    // console.log(test)
    let result = test.match(pattern);

    let hexcode = /\((0[xX][0-9a-fA-F]+)\)/i;
    if (result) {
      result.forEach((str) => {
        const getHex = str.match(hexcode);
        let realStr = "";
        if ( (realStr = strLibrary(getHex[1])) ) {
          test = test.replace(str, `"${realStr}"`);
        } else {
          // console.log(getHex);
        }
      });

      let cleanStringArray = /_0[xX][0-9a-fA-F]+\["default"\]\["(.+)"\]/g;
      let findStringArray = ""
      while( findStringArray = cleanStringArray.exec(test)){
        test = test.replaceAll(findStringArray[0], `"${findStringArray[1]}"`)
      }

      test = test.replaceAll('!0x0', `true`)
      test = test.replaceAll('!0x1', `false`)

      return test;
    }

    return "";
  }

  // intercept phaser config (possible location: window.load inside main.bundle.js) useless for now!
  fckmod(config) {
    const scenes = {};
    // console.log(config)
    config.scene.forEach((scene, index) => {
      
      let pattern = /{ key: .+\]\[(.+)\]/i;
      let result = scene.toString().match(pattern);
      if (result) {
        let pattern2 = /.+\((.+)\)/i;
        let result2 = result[1].match(pattern2);
        if (result2) {
          scenes[window.a0_0x1e38(result2[1])] = {
            index: index,
            class: scene.name
          };
        } else {
          scenes[result[1].replaceAll('"', "")] = index;
        }
      } else {
        // console.log(scene);
      }
    });

    // console.log(scenes);
  }

  inject(modules) {
    this._modules = modules;
    this.main();
  }
}

module.exports = {
  ClassFinder,
};
