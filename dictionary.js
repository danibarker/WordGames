// import fs from "fs";
const fs = require('fs')
let lexicon = JSON.parse(fs.readFileSync("twl.json", "utf8"));
let alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const findDrops = (s) => {
    let result = []
    for (x = 0; x < s.length; x++) {
        let front = s.substring(0, x)
        let back = s.substring(x + 1)
        if (lexicon[front + back]) {
            result.push(front+back)
        }
    }
    return result
}

const findInserts = (s) => {
    let result = []
    s = s.toUpperCase()
    for (x = 0; x < s.length+1; x++){
        for (letter of alpha) {
            word1 = s.substring(0, x) + letter + s.substring(x)
           
            if (lexicon[word1]) {
                result.push(word1)
            }
        }
    }
    return result

}

const findSwaps = (s) => {
    let result = []
    for (x = 0; x < s.length+1; x++){
        let front = s.substring(0, x)
        let back = s.substring(x + 1)
        for (letter of alpha) {
            if (lexicon[front + letter + back] && front + letter + back != s) {
                result.push(front + letter + back)
            }
        }
    }
    return result
}


module.exports = {lexicon, findDrops,findSwaps,findInserts}