const fs = require('fs')
const { findDrops, findInserts, findSwaps } = require ('./dictionary')
let alphaDic = JSON.parse(fs.readFileSync('twl_alpha.json','utf8'))
let tree = {};
let path = {};

let count = 0;

let searchTree = (main, rootWord, depth, maxDepth) => {
    count++;
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
            if (tree[answer] > depth) {
                tree[answer] = depth
                if (path[root]){
                    path[answer] = root + '->' + path[root]
                } else {
                    path[answer] = root
                }
                searchTree(main,answer,depth,maxDepth)
            }
        }
    }
    return tree
};

const ladder = (word1,word2,maxDepth=6) => {
    word1 = word1.upper()
    word2 = word2.upper()
    tree = {}
    path = {}
    searchTree(word1, word2, 0, maxDepth)
    return word2 + '->' + path[word2]
}

const findAnagrams = (s) => {
    s = s.toUpperCase().split('')
    s = s.sort((letter1, letter2) => {
        if (letter1 < letter2) {
            return -1
        }
        return 1
    })
    
    s=s.join('')
    
    return alphaDic[s]
}

module.exports = {tree:tree,searchTree:searchTree}
