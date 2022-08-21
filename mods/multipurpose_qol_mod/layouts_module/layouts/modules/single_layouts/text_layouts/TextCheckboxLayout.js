
const BaseLayout = require('../../../base_module/BaseLayout')
const elements = require('../../../../elements_module/Elements')

class TextCheckboxLayout extends BaseLayout {
    constructor(config) {
        super(config);

        this.text = new elements.Text(this.mergeConfigs(config, {
            xPos: this.data.leftBorder
        }))

        this.checkbox = new elements.Checkbox(this.mergeConfigs(config, {
            scale: 2,
            xPos: this.data.rightBorder
        }))
    }

    EnableInput() {
        this.checkbox.EnableInput()
    }

    ReadPlayerOptions() {
        this.checkbox.ReadPlayerOptions()
    }

    setVisible(value) {
        this.text.setVisible(value)
        this.checkbox.setVisible(value)
    }
}

module.exports = TextCheckboxLayout
