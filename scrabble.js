const  { lexicon:dic } = require('./game-logic/dictionary')

let boardState = [
    [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
];
const checkValidity = (word) => {
    
    return word?dic[word]:1;
};
const findHorizontalStart = (column, row) => {
    let currentColumn = column;
    while (currentColumn >= 0 && boardState[row][currentColumn] != ".") {
        currentColumn--;
    }
    return currentColumn+1;
};
const findHorizontalEnd = (column, row) => {
    let currentColumn = column;
    while (currentColumn <= 14 && boardState[row][currentColumn] != ".") {
        currentColumn++;
    }
    return currentColumn-1;
};
const findVerticalStart = (column, row) => {
    let currentRow = row;
    while (currentRow >= 0 && boardState[currentRow][column] != ".") {
        currentRow--;
    }
    return currentRow+1;
};
const findVerticalEnd = (column, row) => {
    let currentRow = row;
    while (currentRow <= 14 && boardState[currentRow][column] != ".") {
        currentRow++;
    }
    return currentRow-1;
};

const makeMove = (row, column, direction, word) => {
    //horizontal move
    
    if (direction === 1) {
        let hStart = findHorizontalStart(column-1, row);
        let hEnd = findHorizontalEnd(column + word.length, row);
        let extendedWord = "";
        for (let m = hStart; m <= hEnd; m++) {
            if (
                m >= column &&
                m < column + word.length &&
                word[m - column] != "."
            ) {
                extendedWord += word[m - column];
            } else {
                extendedWord += boardState[row][m];
            }
        }

        if (!checkValidity(extendedWord)) {
            return { valid: false, message: `${extendedWord} is not valid` };
        } else {
            //check cross words
            let invalidWords = [];
            for (let n = column; n < column + word.length; n++) {
                let start = findVerticalStart(n, row-1);
                let end = findVerticalEnd(n, row+1);
                if (end!==start) {
                    //cross word made
                    let crossWord = "";
                    for (m = start; m <= end; m++) {
                        if (m == row && word[n - column] != ".") {
                            crossWord += word[n - column];
                        } else {
                            crossWord += boardState[m][n];
                        }
                    }
                    if (!checkValidity(crossWord)) {
                        invalidWords.push(crossWord);
                    }
                }
            }
            if (invalidWords.length === 0) {
                for (let n = hStart; n < hStart + extendedWord.length; n++) {
                    boardState[row][n] = extendedWord[n - hStart];
                }
                return { valid: true, message:"Good play" }
            } else {
                return {valid:false, message:`${invalidWords.join(',')} are invalid words`}
            }
        }
    } else {
        //vertical move

        let vStart = findVerticalStart(column, row-1);
        let vEnd = findVerticalEnd(column, row + word.length);
        let extendedWord = "";
        for (m = vStart; m <= vEnd; m++) {
            if (m >= row && m < row + word.length && word[m - row] != ".") {
                extendedWord += word[m - row];
            } else {
                extendedWord += boardState[m][column];
            }
        }
        if (!checkValidity(extendedWord)) {
            return { valid: false, message: `${extendedWord} is not valid` };
        } else {
            //check cross words
            let invalidWords = [];
            for (let n = row; n < row + word.length; n++) {
                let start = findHorizontalStart(column-1, n);
                let end = findHorizontalEnd(column+1, n);
                if (end!==start) {
                    //cross word made
                    let crossWord = "";
                    for (m = start; m <= end; m++) {
                        if (m == column && word[n - row] != ".") {
                            crossWord += word[n - row];
                        } else {
                            crossWord += boardState[n][m];
                        }
                    }
                    console.log(crossWord)
                    if (!checkValidity(crossWord)) {
                        invalidWords.push(crossWord);
                    }
                }
            }
            if (invalidWords.length === 0) {
                for (let n = vStart; n < vStart + extendedWord.length; n++) {
                    boardState[n][column] = extendedWord[n - vStart];
                }
                return { valid: true, message:"Good play" }
            } else {
                return {valid:false, message:`${invalidWords.join(',')} are invalid words`}
            }
        }
    }
   
};
const columnConvert = "ABCDEFGHIJKLMNO";

const playMove = (move) => {
    let moveLocation = move[0]
    let moveWord = move[1]
    let [column , direction] =
        columnConvert.search(moveLocation[0]) > -1
            ? [columnConvert.indexOf(moveLocation[0]),0]
            : moveLocation.length == 3
            ? [columnConvert.indexOf(moveLocation[2]),1]
            : [columnConvert.indexOf(moveLocation[1]),1];
    let row =
        columnConvert.search(moveLocation[0]) > -1
            ? +moveLocation.substring(1) - 1
            : moveLocation.length == 3
            ? +moveLocation.substring(0, 2) - 1
            : +moveLocation[0] -1;
    return makeMove(row,column,direction,moveWord)
};

console.log(playMove(['7H', 'APPLE']))
console.log(playMove(['8H', 'BAA']))
console.log(playMove(['9H', 'OPTED']))
console.log(playMove(['K5', 'CALLED']))
console.log(playMove(['6J', 'SAFEST']))
console.log(playMove(['5M', 'ME']))
console.log(playMove(['L4', 'SAFE']))
console.log(playMove(['O3', 'BELT']))


for (row of boardState) {
    console.log(row.join(""));
}
