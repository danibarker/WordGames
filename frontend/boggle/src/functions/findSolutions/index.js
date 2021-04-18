const dict = require("../checkValidity/wordlist.json");
// dictionary object, with a key for each word, value holding the score for the word
const prefixes = require("./prefixlist.json");
// lookup object for a given string to get which letters can be the following letter to make a valid word

let gridSize;
let foundWords = {};
let letterIndexes = {};
// stores the indexes in the grid where specific letters can be found
const getAdjacentIndexes = (curr) => {
  if (curr % gridSize != 0 && curr % gridSize != gridSize - 1) {
    return [
      curr - gridSize,
      curr - gridSize + 1,
      curr - gridSize - 1,
      curr - 1,
      curr + 1,
      curr + gridSize + 1,
      curr + gridSize,
      curr + gridSize - 1,
    ];
  } else if (curr % gridSize === 0) {
    return [
      curr + gridSize,
      curr - gridSize,
      curr + 1,
      curr + gridSize + 1,
      curr - gridSize + 1,
    ];
  } else {
    return [
      curr + gridSize,
      curr - gridSize,
      curr - 1,
      curr + gridSize - 1,
      curr - gridSize - 1,
    ];
  }
};

const findWordsRecursion = (
  letterGrid,
  visitedSpaces,
  gridIndex,
  wordString
) => {
  visitedSpaces[gridIndex] = true;
  let letter = letterGrid[gridIndex];
  // if (letter == "Q") {
  //   letter = "QU";
  // }
  wordString = wordString + letter;

  if (wordString in dict && !(wordString in foundWords)) {
    foundWords[wordString] = dict[wordString];
  }

  const indexesToCheck = getAdjacentIndexes(gridIndex);

  for (let index of indexesToCheck) {
    if (
      prefixes[wordString] &&
      prefixes[wordString].includes(letterGrid[index])
    ) {
      if (index >= 0 && index < gridSize ** 2 && !visitedSpaces[index]) {
        findWordsRecursion(letterGrid, visitedSpaces, index, wordString);
      }
    }
  }

  visitedSpaces[gridIndex] = false;
};

const findSolutions = (grid) => {
  foundWords = {};
  letterIndexes = {};
  gridSize = grid.length ** 0.5;

  const visitedSpaces = new Array(grid.length).fill(false);

  for (let letter in grid) {
    if (letterIndexes[grid[+letter]]) {
      letterIndexes[grid[+letter]].push(+letter);
    } else {
      letterIndexes[grid[+letter]] = [+letter];
    }
  }

  let str = "";

  for (let gridIndex = 0; gridIndex < gridSize ** 2; gridIndex++) {
    findWordsRecursion(grid, visitedSpaces, gridIndex, str);
  }
  return foundWords;
};

// const test = (testGrid = []) => {
//   if (testGrid.length === 0) {
//     const alpha =
//       "AAAAAAAAABCDDDEEEEEEEEEEEFGGHIIIIIIIILLLMNNNNNOOOOOOOPRRRRRSSSTTTTTUUUVWYBCDEFGHIJKLMNOPQRSTUVWXYZ";
//     const testGridSize = 10;

//     for (let n = 0; n < testGridSize * testGridSize; n++) {
//       testGrid.push(alpha[Math.floor(Math.random() * alpha.length)]);
//     }
//   }
//   let solutions = findSolutions(testGrid);
//   return [testGrid, solutions];
// };
export default findSolutions;
