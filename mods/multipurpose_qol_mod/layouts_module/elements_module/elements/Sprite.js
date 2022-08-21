
const UIElement = require('./modules/UIElement')

class Sprite extends UIElement {
    constructor(config) {
        super(config);

        this._textureName = config.textureName
        this._frameName = config.frameName
        this._start = config.start
        this._end = config.end
        this._zeroPad = config.zeroPad
        this._frameRate = config.frameRate
        this._scale = config.scale
        this._flipX = config.flipX
        this._playAnimation = config.playAnimation;

        (this.sprite = this.layout.scene.add
            .sprite(this._xPos, this._yPos, this._textureName, this._frameName)
            .setAlpha(1)
            .setDepth(Number.MAX_SAFE_INTEGER)
            .setOrigin(this._xOrigin, this._yOrigin)
            .setScale(this._scale)
            .setFlipX(this._flipX));

        if (this._playAnimation) {
            const frames = this.layout.scene.anims.generateFrameNames(this._textureName, {
                start: this._start,
                end: this._end,
                zeroPad: this._zeroPad,
                prefix: this._frameName.match('(.+)01\.png')[1],
                suffix: ".png",
            })

            this.sprite.anims.create({
                key: "idle",
                frames: frames,
                frameRate: this._frameRate,
                repeat: -1,
            })

            this.sprite.play('idle')
        }
    }

    setInteractive() {
        this.sprite.setInteractive()
    }

    on(action, callback) {
        this.sprite.on(action, callback)
    }

    setVisible(value) {
        this.sprite.setVisible(value)
    }
}

module.exports = Sprite
