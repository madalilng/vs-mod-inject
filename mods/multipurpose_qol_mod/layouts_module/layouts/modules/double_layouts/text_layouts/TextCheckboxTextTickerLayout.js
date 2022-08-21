
const BaseLayout = require('../../../base_module/BaseLayout')
const elements = require("../../../../elements_module/Elements");

class TextCheckboxTextTickerLayout extends BaseLayout {
    constructor(config) {
        super(config);

        this.checkboxText = new elements.Text(this.mergeConfigs(config, {
            text: config.checkboxText,
            xPos: this.data.leftBorder,
            maxWidth: 100,
        }))

        this.checkbox = new elements.Checkbox(this.mergeConfigs(config, {
            varName: config.checkboxVarName,
            defaultPlayerOptionsUsed: config.checkboxDefaultPlayerOptionsUsed,

            scale: 2,
            xPos: this.data.leftBorder + 165
        }))

        this.tickerText = new elements.Text(this.mergeConfigs(config, {
            text: config.tickerText,
            xPos: this.data.leftBorder + 30 + 165 + 37,
            maxWidth: 100,
        }))

        this.ticker = new elements.Ticker(this.mergeConfigs(config, {
            varName: config.tickerVarName,
            defaultPlayerOptionsUsed: config.tickerDefaultPlayerOptionsUsed,

            scale: 2,
            xPos: this.data.rightBorder + 24,
            xOrigin: 0.5,

            min: config.tickerMin,
            max: config.tickerMax,
            step: config.tickerStep,
        }))
    }

    EnableInput() {
        this.checkbox.EnableInput()
        this.ticker.EnableInput()
    }

    ReadPlayerOptions() {
        this.checkbox.ReadPlayerOptions()
        this.ticker.ReadPlayerOptions()
    }

    setVisible(value) {
        this.checkboxText.setVisible(value)
        this.checkbox.setVisible(value)

        this.ticker.setVisible(value)
        this.tickerText.setVisible(value)
    }
}

module.exports = TextCheckboxTextTickerLayout
