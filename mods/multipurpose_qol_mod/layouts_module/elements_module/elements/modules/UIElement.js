
class UIElement {
    constructor(config) {
        this.layout = config.layout

        this._xPos = config.xPos
        this._yPos = config.yPos || this.layout.yPos

        this._scale = config.scale || 1.5
        this._xOrigin = config.xOrigin === undefined ? 0 : config.xOrigin
        this._yOrigin = config.yOrigin === undefined ? 0.5 : config.yOrigin

        this.game = config.game
    }
}

module.exports = UIElement
