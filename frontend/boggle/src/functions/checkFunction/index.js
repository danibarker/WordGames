const print = console.log;

const findLetterInGrid = (grid, letter) => {
  print("letter", letter);
  return grid.reduce((arr, cur, index) => {
    if (cur === letter.toUpperCase()) {
      arr.push(index);
    }
    return arr;
  }, []);
};

const canReachLetter = (curr, target) => {
  if (curr % gridSize != 0 && curr % gridSize != gridSize - 1) {
    return [
      (gridSize + 1) * -1,
      gridSize * -1,
      (gridSize - 1) * -1,
      -1,
      1,
      gridSize + 1,
      gridSize,
      gridSize - 1,
    ].includes(target - curr);
  } else if (curr % gridSize === 0) {
    return [
      gridSize * -1,
      (gridSize - 1) * -1,
      1,
      gridSize + 1,
      gridSize,
    ].includes(target - curr);
  } else {
    return [
      gridSize * -1,
      (gridSize + 1) * -1,
      -1,
      gridSize - 1,
      gridSize,
    ].includes(target - curr);
  }
};
const findPaths = (word, unvisited = letters) => {
  paths = [];
  if (word) {
    const firstLetter = word[0];
    for (let index of findLetterInGrid(unvisited, firstLetter)) {
      recur(word, index, 1, [index]);
    }
    print(paths);
    return paths[0];
  }
};

const recur = (word, index, n, path) => {
  let nthLetter = word[n];
  if (nthLetter) {
    for (let sindex of findLetterInGrid(letters, nthLetter)) {
      if (canReachLetter(sindex, index) && !path.includes(sindex)) {
        let pathToSend = [...path, sindex];
        recur(word, sindex, n + 1, pathToSend);
      }
    }
  }
  if (path.length === word.length) {
    print(path);
    paths.push(path);
  }
};
export function checkFunction(word) {
  return findPaths(word);
}
let paths = [];
const gridSize = 6;
const alpha =
  "AAAAAAAAABCDDDEEEEEEEEEEEFGGHIIIIIIIILLLMNNNNNOOOOOOOPRRRRRSSSTTTTTUUUVWYBCDEFGHIJKLMNOPQRSTUVWXYZ";

export const letters = [];
for (let n = 0; n < gridSize * gridSize; n++) {
  letters.push(alpha[Math.floor(Math.random() * 98)]);
}
//  0 1 2 3 4
//  5 6 7 8 9
//  0 1 2 3 4
//  5 6 7 8 9
//  0 1 2 3 4

// 0: 1, 5, 6
// 1: 0, 2, 5, 6, 7
// 7: 1, 2, 3, 6, 8, 11, 12, 13

// n: -6 - 5 - 4 - 1 + 1 + 4 + 5 + 6;
