
class Page {
    constructor(elements) {
        this.elements = elements
        this.wasActivated = false

        this.hide()
    }

    EnableInput() {
        this.elements.forEach(el => el.EnableInput())
    }

    ReadPlayerOptions() {
        this.elements.forEach(el => el.ReadPlayerOptions())
    }

    hide() {
        this.elements.forEach(el => el.setVisible(false))
    }

    show() {
        this.elements.forEach(el => el.setVisible(true))
    }
}

module.exports = Page
