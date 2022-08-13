async function main(mod) {
  const mainGame = await mod.findModule("Game");
  console.log(mainGame);
  console.log(window)

  new mainGame.default()

  var Demo = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function Demo() {
      Phaser.Scene.call(this);
    },

    preload: function () {
      this.load.image("eye", "assets/pics/lance-overdose-loader-eye.png");
    },

    create: function () {
      this.eye = this.add.image(
        Phaser.Math.Between(0, 800),
        Phaser.Math.Between(0, 600),
        "eye"
      );
    },

    update: function () {
      this.eye.rotation += 0.02;
    },
  });
}

module.exports = {
  main,
};
