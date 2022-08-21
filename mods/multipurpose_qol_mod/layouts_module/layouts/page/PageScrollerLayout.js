
const BaseLayout = require('../base_module/BaseLayout')
const elements = require('../../elements_module/Elements')

class PageScrollerLayout extends BaseLayout {
    constructor(config) {
        super(config);

        this.min = 1
        this.max = config.pages.length

        this.text = new elements.Text(this.mergeConfigs(config, {
            xPos: this.data.leftBorder + 189,
            text: `1 / ${this.max}`
        }))

        this.leftArrow = new elements.Sprite(this.mergeConfigs(config, {
            xPos: this.data.leftBorder + 130,
            start: 1,
            end: 8,
            zeroPad: 2,
            textureName: 'UI',
            frameName: 'arrow_01.png',
            playAnimation: true,
            frameRate: 6,
            scale: 2.5,
            xOrigin: 0,
            flipX: true,
        }))

        this.rightArrow = new elements.Sprite(this.mergeConfigs(config, {
            xPos: this.data.rightBorder - 79,
            start: 1,
            end: 8,
            zeroPad: 2,
            textureName: 'UI',
            frameName: 'arrow_01.png',
            playAnimation: true,
            frameRate: 6,
            scale: 2.5,
            xOrigin: 1,
        }))

        this.leftArrow.setInteractive()
        this.rightArrow.setInteractive()
    }
}

module.exports = PageScrollerLayout
