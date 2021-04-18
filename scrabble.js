const  { lexicon:dic } = require('./game-logic/dictionary')
let firstWord = true;
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
    let crossWords = []
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
            return { valid:false,word:word, message: `${extendedWord} is not valid` };
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
                    console.log(crossWord)
                    crossWords.push(crossWord)
                    if (!checkValidity(crossWord)) {
                        invalidWords.push(crossWord);
                    }
                }
            }
            if (crossWords.length < 1 && !firstWord) {
                return {valid:false,word:word,message:"Play isn't connected to any other plays"}
            }
            if (invalidWords.length === 0) {
                for (let n = hStart; n < hStart + extendedWord.length; n++) {
                    boardState[row][n] = extendedWord[n - hStart];
                }
                firstWord = false
                return { valid: true, message:"Good play" }
            } else {
                return {valid:false,word:word, message:`${invalidWords.join(',')} are invalid words`}
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
            return { valid:false,word:word, message: `${extendedWord} is not valid` };
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

                    crossWords.push(crossWord)
                    if (!checkValidity(crossWord)) {
                        invalidWords.push(crossWord);
                    }
                }
                
            }
            if (crossWords.length < 1 && !firstWord) {
                return {valid:false,word:word,message:"Play isn't connected to any other plays"}
            }
            if (invalidWords.length === 0) {
                for (let n = vStart; n < vStart + extendedWord.length; n++) {
                    boardState[n][column] = extendedWord[n - vStart];
                }
                return { valid: true, message:"Good play" }
            } else {
                return {valid:false,word:word, message:`${invalidWords.join(',')} are invalid words`}
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
let moveStr = `#player1 JJB John J. Bulten
#player2 TB Tim Bottorff
>JJB: AEIMNOS 8F ANOMIES +70 70
#note 0:37 [24:23] JJB has retaken the tourney lead with three games to go, and every point will count in this game. He does not want to get a reputation for it but with this rack he is about to open with a bingo for the fourth consecutive time (even if one was phony). He has a funny feeling this rack is familiar: in fact he had it naturally last game, only nine turns ago (romanise), a very good sign. He chooses placement slowly; Quackle favors 8b by 1.5.
>TB: GPU 7H PUG +19 19
#note 1:59 [23:01] Good balance. Both players get a nice steady stream of middling tiles and there are lots of strong synergized plays.
>JJB: ABENNNR L2 BANNER. +18 88
#note 1:33 [22:50] JJB wonders what Brennan can do but finally selects turnover (banns 14 is just 2.4 higher on synergy).
>TB: BOTU M3 BOUT +26 45
#note 2:24 [20:37] TB scores well with parallelism.
>JJB: DENRRST F5 STR.NDER +65 153
#note 0:52 [21:58] Thankfully the one bingo on this imbalanced rack did not get blocked this time around. TB is unperturbed, holding a Z.
>TB: AANZ 5B AZAN. +28 73
#note 1:36 [19:01] Both players' preference, although Quackle adds .2 for za/aba 27.
>JJB: DEIJLWY 11E W.EDILY +56 209
#note 1:20 [20:38] JJB pulls away with a bingo equivalent. Dewily/wieldy/widely don't get much, and weird(l)y are passable, but just for comparison he writes weedily? on his scoresheet. To his amazement it looks like a real quadruple.
>TB: ATTW 6A TWAT +41 114
#note 1:43 [17:18] In absence of bingos and equivalents, TB's replies are no slouches; he begins a recovery rally from a 136-point deficit.
>JJB: DEFJOTU A6 .UFTED +30 239
#note 1:50 [18:48] With an eye on column K, JJB has drawn the O for jog and has a play that will give him another chance at the G. If he were to see fjord 40 (8.4 diff) or tweedily (jute 37 or tofu 29) that might make a difference. But he's also keeping his average word length at 7.0.
>TB: EX B9 EX +52 166
#note 1:13 [16:05] TB takes the easy hunk of bread.
>JJB: AEGIJOO K3 JOG +45 284
#note 0:44 [18:04] JJB has drawn the standout play despite AEIO, and as usual he tells himself he can handle the leave. He sees jigaboo 25 (jiao 30 also works) but the right play is the prepared one and his six-turn average holds at 47+.
>TB: IQ 4D QI +48 214
#note 0:58 [15:07] TB also has had his eye on a parallel and he wins the battle of the four power tiles. He is psyched to continue the rally.
>JJB: AEEILOV 12B AIVE. +21 305
#note 4:06 [13:58] JJB would rather play the city of Davie, but he is thankful he is relatively solid on the 5s now and can play with impunity a word that would have been sketchy mere months ago. He declines devil 30 (.2 higher) and its lower-ranked confederates, but does not try turning over both Es, which would yield the effective deave 30 (6.2 higher).
>TB: CEIV 3E VICE +18 232
#note 1:42 [13:25] TB takes the respite for important balancing, and is now recalibrating to play a blank bingo. Civie c11 20 was available and might be of assistance.
>JJB: AEELOOR 9F .OO +12 317
#note 3:38 [10:20] JJB is also in bingo territory and hoping for an unseasonably late blank. He plays for slower consumption and better leave, but at a cost of 5.2 for not finding the 4-overlap site for oleo, 10h 20.
>TB: NOP H1 OP.N +21 253
#note 0:49 [12:36] Great self-descriptive play! TB has made up all but 64 of his 136-point gap.
>JJB: ACEIKLR H11 .RECK +39 356
#note 0:59 [9:21] JJB's play is not really self-descriptive of his rack, but is still psychologically strong. It equals diker 33 on leave and is .3 behind back/about 31 (that hook gets constantly reviewed by both players and never used). He would find a bingo through BHNY if any such letter were available, and he is pretty positive that O fails to anagram (the only -like here is crablike).
>TB: EF 13B EF +22 275
#note 0:54 [11:42] TB is now signaling the blank and angling for the definitive reply; both players like the multiple lines, and bingoing from the K is still enough to lead and hold.
>JJB: AGIILOR 14D LOGI. +12 368
#note 3:24 [5:57] No NU to play through, and many plays are near the top, so a stylistic decision is called for. The highest is agio 12k 15 (5.4 diff, tied with the big bail risk at 2l 19). The most effective at shutdown is gloria j10 13 (1.2 diff). This is a strange logic to shut down only partially and tempt both the triple and the extensions (maybe opponent holds logicalities with 0-2 blanks).
>TB: AHMO 15A HOMA +33 308
#note 5:32 [6:10] Still absent a bingo, the triple is sufficient to hold onto winning chances from 60 back.
>JJB: ADIRRTU I1 RID +25 393
#note 1:38 [4:19] JJB continues bingo hunting but nothing exists besides the Latin ("traditur dies die", day turns on day). The highest-scoring and top-rated play combines a good hook with blocking and overlapping. Either player might still bingo. JJB is not calculating it exactly, but hopes that enough points (or his own blank) will overtake even the best bingo risk, with no blank out yet.
>TB: ?EEILLS 12K EL +9 317
#note 3:48 [2:22] TB has several decisions to make, some of which are external to game mechanics, and he models a trained approach to them all. First, sometimes winning the game and winning the tournament are in conflict, a point that is about to be illustrated on the next turn; TB says later that he pretty well gives up on the tournament win here in hopes of preserving the game win. Second, every game-solving process requires attention to a time control, so there is the decision of how much time for this decision versus how much time for the next unspecified decisions; taking a little more than half here is a very proper tempo for the rack and bag. Third, he is actively controlling his environmental factors, putting his concentration fully on the universe before him and focusing attentively, using the technique of muttering under his breath to consider options and compare routes. Fourth, he is inferring from the play of opponent, who is still not broadcasting the second blank, so there are good odds to draw it. Then, coming to the play itself and barring irregularities, he is heuristically assessing his own and his opponent's playing styles and word knowledge, and also the possibility that either may play a constructive phony intentionally. In the partial-knowledge game we play, every one of these factors turns the mathematical problem, of best play given the odds, into a psychological problem of assigning rule-of-thumb values to external and internal events. 1) While keeping these all in mind, TB concentrates the bigger search task on the present K bingo, which happens to be the only available one: it's a word that Joel Wapnick uses del+like to remember, namely killdees 83. It gets within 2 of the lead, but JJB's actual rack can defeat it with the H on n6 if not setting TB back up: shura/shiur 35, rya 23+4, winning by 10 (in postmortem, the players find hirsute m9 28, bays/about 23+2, winning by 5); and killdees does not win the most games in simulation either (about 10%). So even though TB does not find killdees his judgment is correct that his actual play and others have greater win chances. 2) He chooses el 12k 9 with the rationale that another line is needed that scores higher than column N (it's the fourth play statically, 22.3 behind), which simulation agrees with. However, because the needed bingo is so directed, ordinary balance considerations (favoring EILS?) do not apply rigidly; further, postmortem discovers opponent can block all lines by playing column M himself, so el takes only about 13%. In the actual situation, the column M blocks were not as strong as otherwise so the setup is relatively reasonable. 3) This logic implies led 10d 10, which takes 18% with the same idea because the present lines are mostly sufficient. 4) JJB is staring at 10a and never getting to use it, so he would prima facie favor exiled 10a 20 for TB; emptying bag is acceptable because there's a blank in it and the bingo is unstoppable (even claymores 1c opens up). But hiatus, shirt, shiur, and shura all win by 7 for JJB in this case; and exiled takes 12% of sims. 5) There is one over-the-board method to discover the (likeliest) winning play, namely, to imagine that an H or Y plays on 15l and/or 13g and to fish for a specific bingo. Y does not play at 15l with any rack/bag combo, but the best fit for H can be determined by list review: keelhaul 104/101 (keelhale and heelless are available in some of these draws; other seeks have lower chances, with keyholes and kernelly being important). Further, IS dumps easily: is n2 17 is highest, but sir/qats 7d 16 gets the highest win rate (about 20%) due to not having triple risk. 20% is also the exact chance of drawing keelhaul (albeit sometimes with blank for H), but with JJB's play it can be inferred to be, and is, even higher: 1/3 chance. In the actual game (where JJB has benefit of the H), hiatus and equivalents will still defeat both keelhaul and kernelly by 6; but in some scenarios it's hard or impossible to block both keelhaul/keelhale and heelless. Bravo to the player who can divine that keelhaul is a possible bam-dinger, fish correctly with sir/qats, draw it at 20% odds, and go on to win. Also, if the goal is, instead of to win outright, to keep spread low in all cases for the tourney's sake even if it means a mathematical loss, then bravo to the player who finds and plays killdees, because it does win some cases.
>JJB: AHIRSTU M9 HURST +27 420
#note 1:10 [3:09] JJB infers the bag is more than 1/4 likely to contain the blank (it does). He opts to run ahead with points, a method making it easier to win the game narrowly but more certainly. It's hard to find the best block and prove it; blocks are more likely to be surprised than points. He does not take time like TB to calculate the K line, but he does have time to do more than be satisfied with rough guesses. If a one-blank K bingo exists, without Y fifth, it will always be playable with one or two blanks and score from 80 to 95 (actual: 92). The words that do have Y fifth are so odd as to be inferably unavailable: only kailyard/kaleyard, kopiykas, koumyses. So with 76 lead, hurst 27, after unknown bingo up to 95+4, still wins by 4 or more. That confirms JJB's intuition, but he should take more time now to 1) run the numbers and verify, 2) consider Y fifth longer because it could defeat him if it exists, and 3) search for both higher-scoring plays and blocks, particularly even just see n6 or m12-15. JJB knows not to get confident in a lead, but he never does the full calculation here and is dismayed to hear later that the potential score is that close. His play is way behind in static values (Quackle puts hi n6 ahead by 19.1, not realizing an out bingo is virtually guaranteed). Of the 8 possible tile-distinct scenarios, all threaten in row 15: four rate 92, three 89, one 83, average 89.75 unless JJB helps it. We noted hiatus 33 and shirt/shiur/shura 35 tie for highest net, but hiatus adds .875 to TB's response and shirt 1.25, so the highest-scoring plays without blocking are shiur/shura 35, with average reply 89.75+6.25, net of -61, winning by 15 average (13 twice with kyanizes/kissably, 15 twice, 16 four times). Hurst 27 has the same replies and is exactly 8 behind this, squeaking a win spread as low as 5. As for blocks, other than reaching column M they don't block bingos: all racks bingo at m9, and all double-blank racks bingo at 10i. (Khat 11 has response of 76.75+10.25, net -76, and the opponent's best reply might even be logicalities/ah/la/it 91! Yeah 10, kauri etc. 10, ultra 12, lah 6 allow plurals; kith 11 blocks logicalities with response rate 74.875+10.25, net -74.125, still far behind shiur/shura.) Many blocks lose on the spot to one rack or another, whereas shiur/shura don't, another reason to favor points over blocks as a rule of thumb; you don't want to play lush or liar and lose with sketchily or skylarker! For maximum effect, the correct block must fall in m12-15 and use the H without allowing parallel bingos. Of the words that do this, shri m12 17 gives the best followup. With blank in bag (2 scenarios), opponent has no bingo and replies layins 36, followed by latu 16+4, net of 1, winning by 77; the other 6 scenarios have bingos and net -62, -64 thrice, -68, and -70 (where JJB wins over galleys 79+8 by 6). Average net is -48.75, or about 20.3 better than hurst. Hurst wins barely, shiur/shura win comfortably, but shri sometimes wins excessively. Shri is also the kind of word one would look for to block with, based on position (best two lines blocked), points and leave, and prickliness.
>TB: ?AEILSY -  +0 317
#note 2:13.9 [0:08.1] Now for the suspense, as TB hunts for the word. After the game, he challenges JJB to find it, which takes several minutes and hints because of its extraordinariness. TB sees that, even if found, the play will lose by 4 or 7 unless Y is the 5th letter, and concludes that no saving bingo exists, although he would not mind finding the best play, which happens to be kielbasy 92+4. He also has a tie game earlier this tournament, which means he will not be likely competing for tourney places on spread, only on games. Keep in mind, there is always the possibility of phonies by either player, which cannot be predicted by computer and have no algorithmic regularity. TB knows that an out bingo is too late to construct a reasonable phony, but what if JJB had constructed a phony to block columns M and N at the same time? Given the facts that 1) TB is not 100% sure of hurst and 2) he has decided he wants the game won more than he wants his spread saved, it is eminently reasonable to conclude that challenging hurst is the only way to win, since the dictionary is not yielding enough points otherwise. This is a key counterintuitive insight. TB coolly decides that he will stop the clock when it reaches the last few seconds and continues searching the full two minutes, then quietly challenges at 8.1 remaining. (Another option is to accept the 10-point loss and search another minute.) The risk of challenging is to allow a knowable 19+18 more to his opponent, total 133 points, and the reward is very slight: only the opportunity to keep playing, after JJB returns his courtesy tile! After challenging and playing kielbasy 92, TB must draw the last tile in the bag, and still has a mathematical loss, so he must hope to take advantage of some additional swindle or error. (JJB wins by 3 with hiatus 33, qats 12+2, but TB can hope he misses the best play by 4; in all other scenarios that TB can see, JJB bingos.) So TB's calling a challenge is heroic and inspiring, and is useful for winning future endgames, despite the fact that the distant possibility of winning the challenge is not even the whole of the 100-yard run he needs to win the game. All the same, when players conspire to create an endgame with significant ongoing teaching potential, they can be commended for contributing unique new methods to the strategy of gameplay.
>JJB: ?AI C5 ..mIA +18 438
#note 2:28.6 [0:40.4] The pressure over, JJB trawls the board for best play, thinking he's clever to eschew logician (a showoff play) and log zamia/tea 18. He misses zaida/tea 19.
>JJB:  (AEILSY?) +18 456
#note While JJB runs ahead by 136 in four turns, TB lowers that spread to 64 in five more turns without needing a bingo, both demonstrating a wide variety of parallels and premiums. TB carries the blank into the endgame and JJB tries to stay far enough ahead to win, leading to an explosive and instructive position. TB finds a play with higher winning chances than a bingo (the setup el/ye, another good one being the fish sir/qats), and then calculates a potential swindle game accurately but does not get the dictionary to agree. Though some plays may have embarrassing omissions, the sheer amount of didactical situations is impressive. Known points available: JJB 21.25, TB 135. Overall points available: JJB 50.7, TB 157.5+.`
let moves = moveStr.split('\n').filter((line) => line[0] === '>')
for (move of moves) {
    splitMoves = move.split(/\s+/)
    console.log(move)
    if (splitMoves.length !==6) {
        console.log(splitMoves.length, splitMoves)
    } else {
        console.log(splitMoves.length, splitMoves)
        playMove([move.split(' ')[2], move.split(' ')[3]])
    }
}



for (row of boardState) {
    console.log(row.join(""));
}
