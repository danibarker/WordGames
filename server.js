




const express = require("express");
const path = require("path");
const cors = require("cors");
const PORT = process.env.PORT || 5001;
const app = express();
app.use(express.json());
app.use(cors());
app.get("/start", async (req, res) => {
    // gameState = {
    //     numPlayers: gameState.numPlayers,
    //     playerOnTurn: gameState.numPlayers,
    //     currentWord: gameState.currentWord,
    //     guessed: gameState.guessed,
    //     players: gameState.players,
    //     fails:gameState.fails
    // };
    try {
        if (!gameState.currentWord) {
            gameState.currentWord = deadends.start();
        }
        res.json(gameState);
    } catch (e) {
        res.status(400).send(e);
    }
});
app.get("/login/:name", async (req, res) => {
    try {
        gameState.players.push({ name: req.params.name, score: 0 });
        gameState.numPlayers = gameState.players.length;
        fs.writeFileSync("gameState.json", JSON.stringify(gameState));

        res.status(200).send(req.params.name);
    } catch (e) {
        res.status(400).send(e);
    }
});
app.get("/logout/:name", async (req, res) => {
    try {
        gameState.players = gameState.players.filter(
            (user) => user.name != req.params.name
        );
        gameState.numPlayers = gameState.players.length;
        fs.writeFileSync("gameState.json", JSON.stringify(gameState));
        res.sendStatus(201);
    } catch (e) {
        res.status(400).send(e);
    }
});
app.get("/gameState", async (req, res) => {
    try {
        res.json(gameState);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get("/myTurn/:name/:leng", async (req, res) => {
    try {
        if (
            req.params.leng !=
            gameState.guessed.length + gameState.fails.length
        ) {
            res.send("t");
        } else {
            res.send("f");
        }
    } catch (e) {
        res.status(400).send(e);
    }
});

app.post("/guess", async (req, res) => {
    try {
        if (req.body.guess == "&reset") {
            gameState = {
                numPlayers: gameState.players.length,
                playerOnTurn: 0,
                currentWord: deadends.start(),
                guessed: [],
                players: gameState.players,
                fails: [],
            };
            res.json({ loseTurn: false, valid: false, message: "" });
        }
        let guess = req.body.guess.toUpperCase().trim();
        if (req.body.name === gameState.players[gameState.playerOnTurn].name) {
            response = deadends.guess(
                gameState.currentWord,
                guess,
                gameState.guessed,
                gameState.fails
            );
            if (response.loseTurn || response.valid) {
                gameState.playerOnTurn =
                    (gameState.playerOnTurn + 1) % gameState.numPlayers;

                gameState.currentWord = response.valid
                    ? guess
                    : gameState.currentWord;
            }
            fs.writeFileSync("gameState.json", JSON.stringify(gameState));
            res.send(response);
        } else {
            res.sendStatus(203);
        }
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});

app.use("/", express.static(path.join(__dirname, "public")));
