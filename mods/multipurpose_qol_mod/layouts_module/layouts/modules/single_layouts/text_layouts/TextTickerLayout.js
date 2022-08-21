
const BaseLayout = require('../../../base_module/BaseLayout')
const elements = require('../../../../elements_module/Elements')

class TextTickerLayout extends BaseLayout {
    constructor(config) {
        super(config);

        this.text = new elements.Text(this.mergeConfigs(config, {
            xPos: this.data.leftBorder
        }))

        this.ticker = new elements.Ticker(this.mergeConfigs(config, {
            scale: 2,
            xPos: this.data.rightBorder + 24,
            xOrigin: 0.5
        }))
    }

    EnableInput() {
        this.ticker.EnableInput()
    }

    ReadPlayerOptions() {
        this.ticker.ReadPlayerOptions()
    }

    setVisible(value) {
        this.text.setVisible(value)
        this.ticker.setVisible(value)
    }
}

module.exports = TextTickerLayout
