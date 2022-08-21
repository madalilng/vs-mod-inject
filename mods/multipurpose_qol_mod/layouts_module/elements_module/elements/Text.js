
const UIElement = require('./modules/UIElement')

class Text extends UIElement {
    constructor(config) {
        super(config);

        this._text = config.text
        this._maxWidth = config.maxWidth || 180;

        (this.textElement = this.layout.scene.add
            .text(this._xPos, this._yPos, this._text, { align: "left" })
            .setScale(this._scale)
            .setOrigin(this._xOrigin, this._yOrigin));

        this.game.default.Lang.scaleToMaxFast(this.textElement, false, this._maxWidth)
    }

    get text() {
        return this.textElement.text
    }

    set text(text) {
        this.textElement.text = text
    }

    setVisible(value) {
        this.textElement.setVisible(value)
    }
}

module.exports = Text
