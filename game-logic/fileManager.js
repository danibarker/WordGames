const fs = require('fs')
const saveGameState = (gameState) => {
    fs.writeFileSync("./game-logic/gameState.json", JSON.stringify(gameState));
}
const loadGameState = () => {
    return JSON.parse(fs.readFileSync('./game-logic/gameState.json'))
}

module.exports = { loadGameState, saveGameState }