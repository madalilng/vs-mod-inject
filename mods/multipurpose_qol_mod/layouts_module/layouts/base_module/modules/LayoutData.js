
class LayoutData {
    constructor(game) {
        this.leftBorder = 30 + game.SAFEAREA.left

        this.leftCenter = null
        this.rightCetner = null

        this.rightBorder = 430 + game.SAFEAREA.left

        this.baseYOffset = 39
        this.lineOffset = 75
    }
}

module.exports = LayoutData
