// import { lexicon } from './dictionary'
const { lexicon } = require("./dictionary");

const fs = require("fs");
const { findDrops, findInserts, findSwaps } = require("./dictionary");
let alphaDic = JSON.parse(fs.readFileSync("twl_alpha.json", "utf8"));
let tree = {};
let path = {};

const guess = (prev, word, guessed, fails) => {
    if (lexicon[word]) {
        if (searchTree(prev, prev, 0, 1)[word]) {
            if (
                !guessed.includes(word) &&
                word != prev + "S" &&
                prev != word + "S"
            ) {
                guessed.unshift(word);
                currentWord = word;
                for (var member in tree) delete tree[member];
                searchTree(currentWord, currentWord, 0, 1);
                
                if (
                    Object.keys(tree).every((w) =>
                        [
                            ...guessed,
                            currentWord + "S",
                            currentWord.substring(currentWord.length - 2) == "S"
                                ? currentWord.substring(
                                      0,
                                      currentWord.length - 1
                                  )
                                : currentWord + "S",
                        ].includes(w)
                    )
                ) {
                    return {
                        loseTurn: false,
                        valid: true,
                        message: "Game Over, no more valid answers",
                    };
                }
                return { valid: true, message: `${word} is a valid guess` };
            } else {
                fails.push(word)
                return {
                    loseTurn: false,
                    valid: false,
                    message: `${word} was previously guessed, 
                    or you tried adding or removing an S from the end, try again`,
                };
            }
        } else {
            fails.push(word)
            return {
                loseTurn: false,
                valid: false,
                message: `${word} is not a valid move from ${prev}, try again`,
            };
        }
    } else {
        fails.push(word)
        return {
            loseTurn: true,
            valid: false,
            message: `${word} is not in TWL`,
        };
    }
};

const start = () => {
    let twos = Object.keys(lexicon).filter((word) => word.length == 2);
    let currentWord = twos[Math.floor(Math.random() * twos.length)];

    return currentWord;
};

let searchTree = (main, rootWord, depth, maxDepth) => {
    depth++;
    let result = [];
    let dropResults = findDrops(rootWord);
    let insertResults = findInserts(rootWord);
    let anagramResults = findAnagrams(rootWord);
    let swapResults = findSwaps(rootWord);
    for (answer of dropResults) {
        result.push(answer);
    }
    for (answer of insertResults) {
        result.push(answer);
    }
    for (answer of anagramResults) {
        result.push(answer);
    }
    for (answer of swapResults) {
        result.push(answer);
    }

    if (depth <= maxDepth) {
        for (answer of result.filter((r) => r != main)) {
            if (tree[answer] > depth || !tree[answer]) {
                tree[answer] = depth;
                if (path[rootWord]) {
                    path[answer] = rootWord + "->" + path[rootWord];
                } else {
                    path[answer] = rootWord;
                }
                searchTree(main, answer, depth, maxDepth);
            }
        }
    }
    return tree;
};

const ladder = (word1, word2, maxDepth = 6) => {
    word1 = word1.upper();
    word2 = word2.upper();
    tree = {};
    path = {};
    searchTree(word1, word2, 0, maxDepth);
    return word2 + "->" + path[word2];
};

const findAnagrams = (s) => {
    s = s.toUpperCase().split("");
    s = s.sort((letter1, letter2) => {
        if (letter1 < letter2) {
            return -1;
        }
        return 1;
    });

    s = s.join("");

    return alphaDic[s];
};
module.exports = { start, guess };
