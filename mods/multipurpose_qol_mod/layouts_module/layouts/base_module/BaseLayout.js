
const LayoutData = require('./modules/LayoutData')

class BaseLayout {
    constructor(config) {
        this.game = config.game
        this.scene = config.scene

        this.line = config.line

        this.data = new LayoutData(this.game)
    }

    get yPos() {
        return this.data.baseYOffset + this.data.lineOffset * this.line
    }

    mergeConfigs(first, second) {
        const config = { layout: this }

        Object.getOwnPropertyNames(first).forEach(prop => config[prop] = first[prop])
        Object.getOwnPropertyNames(second).forEach(prop => config[prop] = second[prop])

        return config
    }
}

module.exports = BaseLayout
