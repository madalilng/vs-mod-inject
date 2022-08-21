
const PageScrollerLayout = require('../../layouts_module/layouts/page/PageScrollerLayout')

class PageManager {
    constructor(config) {
        this.pageScroller = new PageScrollerLayout(config)
        this.pages = config.pages

        this.pages[0].show()
        this.pages[0].wasActivated = true

        this.min = 1
        this.max = this.pages.length

        this.currentPage = 1

        this.pageScroller.leftArrow.on('pointerdown', () => this.onLeftArrowClicked())
        this.pageScroller.rightArrow.on('pointerdown', () => this.onRightArrowClicked())
    }

    onLeftArrowClicked() {
        this.pages[this.currentPage - 1].hide()

        this.currentPage -= 1

        if (this.currentPage < this.min) {
            this.currentPage = this.max
        }

        this.updateContent()
    }

    onRightArrowClicked() {
        this.pages[this.currentPage - 1].hide()

        this.currentPage += 1

        if (this.currentPage > this.max) {
            this.currentPage = this.min
        }

        this.updateContent()
    }

    updateContent() {
        this.pages[this.currentPage - 1].show()
        this.updateText()

        if (!this.pages[this.currentPage - 1].wasActivated) {
            this.EnableInput()
            this.ReadPlayerOptions()

            this.pages[this.currentPage - 1].wasActivated = true
        }
    }

    updateText() {
        this.pageScroller.text.text = `${this.currentPage} / ${this.max}`
    }

    EnableInput() {
        this.pages[this.currentPage - 1].EnableInput()
    }

    ReadPlayerOptions() {
        this.pages[this.currentPage - 1].ReadPlayerOptions()
    }
}

module.exports = PageManager
