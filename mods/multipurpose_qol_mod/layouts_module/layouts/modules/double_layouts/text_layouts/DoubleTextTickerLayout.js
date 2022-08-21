
const BaseLayout = require('../../../base_module/BaseLayout')
const elements = require("../../../../elements_module/Elements");

class DoubleTextTickerLayout extends BaseLayout {
    constructor(config) {
        super(config);

        this.firstTickerText = new elements.Text(this.mergeConfigs(config, {
            text: config.firstTickerText,
            xPos: this.data.leftBorder,
            maxWidth: 100
        }))

        this.firstTicker = new elements.Ticker(this.mergeConfigs(config, {
            scale: 2,
            xPos: this.data.leftBorder + 24 + 165,
            xOrigin: 0.5,

            varName: config.firstTickerVarName,
            defaultPlayerOptionsUsed: config.firstTickerDefaultPlayerOptionsUsed,

            min: config.firstTickerMin,
            max: config.firstTickerMax,
            step: config.firstTickerStep
        }))

        this.secondTickerText = new elements.Text(this.mergeConfigs(config, {
            text: config.secondTickerText,
            xPos: this.data.leftBorder + 30 + 165 + 37,
            maxWidth: 100
        }))

        this.secondTicker = new elements.Ticker(this.mergeConfigs(config, {
            scale: 2,
            xPos: this.data.rightBorder + 24,
            xOrigin: 0.5,

            varName: config.secondTickerVarName,
            defaultPlayerOptionsUsed: config.secondTickerDefaultPlayerOptionsUsed,

            min: config.secondTickerMin,
            max: config.secondTickerMax,
            step: config.secondTickerStep
        }))
    }

    EnableInput() {
        this.firstTicker.EnableInput()
        this.secondTicker.EnableInput()
    }

    ReadPlayerOptions() {
        this.firstTicker.ReadPlayerOptions()
        this.secondTicker.ReadPlayerOptions()
    }

    setVisible(value) {
        this.firstTicker.setVisible(value)
        this.firstTickerText.setVisible(value)

        this.secondTicker.setVisible(value)
        this.secondTickerText.setVisible(value)
    }
}

module.exports = DoubleTextTickerLayout
