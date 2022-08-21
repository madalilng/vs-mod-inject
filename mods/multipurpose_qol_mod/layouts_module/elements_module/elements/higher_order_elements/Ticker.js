
const BaseHigherOrderUIElement = require('./modules/BaseHigherOrderUIElement')

const Image = require('../Image')
const Text = require('../Text')

class Ticker extends BaseHigherOrderUIElement {
    constructor(config) {
        super(config);
        this.varName = config.varName

        this.targetObj = config.defaultPlayerOptionsUsed
            ? this.game.default.Core.PlayerOptions
            : this.game.default.Core.PlayerOptions.qolModOptions

        this.min = config.min === undefined ? 1 : config.min
        this.max = config.max === undefined ? 10 : config.max

        this.step = config.step || 1

        this.checkbox = new Image(this.mergeConfigs(config, {
            textureName: 'UI',
            frameName: 'menu_checkbox_24_bg.png'
        }))

        this.toggle = new Text(this.mergeConfigs(config, {
            textureName: 'UI',
            frameName: 'menu_checkbox_24_bg.png'
        }))
    }

    EnableInput() {
        this.checkbox.setInteractive()

        this.checkbox.on("pointerdown", (event) => {
            if (event.button === 0) {
                this.targetObj[this.varName] += this.step

                if (this.targetObj[this.varName] > this.max) {
                    this.targetObj[this.varName] = this.min
                }
            } else {
                this.targetObj[this.varName] -= this.step

                if (this.targetObj[this.varName] < this.min) {
                    this.targetObj[this.varName] = this.max
                }
            }

            this.game.default.Sound.PlaySound('ClickIn')
            this.ReadPlayerOptions()
        })
    }

    ReadPlayerOptions() {
        try {
            this.toggle.text = this.targetObj[this.varName].toString()
        } catch {
            debugger
        }
    }

    setInteractive() {
        this.checkbox.setInteractive()
    }

    on(action, callback) {
        this.checkbox.on(action, callback)
    }

    set text(text) {
        this.toggle.text = text
    }

    setVisible(value) {
        this.checkbox.setVisible(value)
        this.toggle.setVisible(value)
    }
}

module.exports = Ticker
