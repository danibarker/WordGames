const fs = require('fs')
const saveGameState = (gameState) => {
    fs.writeFileSync("gameState.json", JSON.stringify(gameState));
}
const loadGameState = () => {
    return JSON.parse(fs.readFileSync('./gameState.json'))
}

module.exports = { loadGameState, saveGameState }