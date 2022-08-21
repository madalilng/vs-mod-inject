
const BaseLayout = require('../../../../base_module/BaseLayout')

class BaseSingleTextLayout extends BaseLayout {
    constructor(config) {
        super(config);

    }

    setVisible(value) {
        this.sprite.setVisible(value)
    }
}

module.exports = BaseSingleTextLayout
