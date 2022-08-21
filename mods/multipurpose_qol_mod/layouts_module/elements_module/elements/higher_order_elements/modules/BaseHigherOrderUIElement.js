
class BaseHigherOrderUIElement {
    constructor(config) {
        this.layout = config.layout
        this.game = config.game
    }

    mergeConfigs(first, second) {
        const config = {}

        Object.getOwnPropertyNames(first).forEach(prop => config[prop] = first[prop])
        Object.getOwnPropertyNames(second).forEach(prop => config[prop] = second[prop])

        return config
    }
}

module.exports = BaseHigherOrderUIElement
