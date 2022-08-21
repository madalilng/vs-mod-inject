
const Image = require('../Image')
const BaseHigherOrderUIElement = require('./modules/BaseHigherOrderUIElement')

class Checkbox extends BaseHigherOrderUIElement{
    constructor(config) {
        super(config);
        this.varName = config.varName

        this.targetObj = config.defaultPlayerOptionsUsed
            ? this.game.default.Core.PlayerOptions
            : this.game.default.Core.PlayerOptions.qolModOptions

        this.checkbox = new Image(this.mergeConfigs(config, {
            textureName: 'UI',
            frameName: 'menu_checkbox_24_bg.png'
        }))

        this.toggle = new Image(this.mergeConfigs(config, {
            textureName: 'UI',
            frameName: 'yes16.png'
        }))
    }

    EnableInput() {
        this.checkbox.setInteractive()

        this.checkbox.on("pointerdown", () => {
            this.targetObj[this.varName] =
                !this.targetObj[this.varName]

            this.game.default.Sound.PlaySound('ClickIn')

            this.ReadPlayerOptions()
        })
    }

    ReadPlayerOptions() {
        this.toggle.setFrame(this.targetObj[this.varName] ? "yes16.png" : "no16.png");
    }

    setInteractive() {
        this.checkbox.setInteractive()
    }

    on(action, callback) {
        this.checkbox.on(action, callback)
    }

    setFrame(frame) {
        this.toggle.setFrame(frame)
    }

    setVisible(value) {
        this.checkbox.setVisible(value)
        this.toggle.setVisible(value)
    }
}

module.exports = Checkbox
