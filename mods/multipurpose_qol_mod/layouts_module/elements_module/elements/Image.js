
const UIElement = require('./modules/UIElement')

class Image extends UIElement {
    constructor(config) {
        super(config);

        this._textureName = config.textureName
        this._frameName = config.frameName;

        (this.image = this.layout.scene.add
            .image(this._xPos, this._yPos, this._textureName, this._frameName)
            .setScale(this._scale)
            .setOrigin(this._xOrigin, this._yOrigin))
    }

    setInteractive() {
        this.image.setInteractive()
    }

    on(action, callback) {
        this.image.on(action, callback)
    }

    setFrame(frame) {
        this.image.setFrame(frame)
    }

    setVisible(value) {
        this.image.setVisible(value)
    }
}

module.exports = Image
