<template>
  <div :style="cssVars" class="main">
    <div class="header">
      <h1>Word Squares</h1>
    </div>
    <GameBoard
      :setTileColor="setTileColor"
      :guessedWords="guessedWords"
      :letters="letters"
      :msg="3"
    />
    <div class="guessed">
      <div class="guessed__list">
        <table>
          <thead>
            <tr>
              <th>Word</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(word, index) in guessedWords.slice().reverse()"
              v-bind:key="index"
            >
              <td>{{ word.toUpperCase() }}</td>
              <td>{{ checkValidity(word) ? scoreDict[word.length] : -1 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="guessed__list guessed__goal">
        <div>Score</div>
        {{
          guessedWords.reduce((total, word) => {
            total += checkValidity(word) ? scoreDict[word.length] : -1;
            return total;
          }, 0)
        }}
        /
        {{
          Object.keys(solutions).reduce((max, solution) => {
            max += solutions[solution].length * scoreDict[solution];
            return max;
          }, 0)
        }}
      </div>
      <div class="guessed__list guessed__goal">
        <div>Words to find</div>
        <p v-for="(num, len) in solutions" v-bind:key="len">
          {{ len }} letter words: {{ num.length }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import GameBoard from "./components/GameBoard.vue";
import checkValidity from "./functions/checkValidity";
import findSolutions from "./functions/findSolutions";
import { letters } from "./functions/checkFunction";

export default {
  name: "App",
  components: {
    GameBoard,
  },
  data: function () {
    return {
      guessedWords: [],
      tileColor: "#9800c2",
      tileShade: "#440066",
      tileFontColor: "#eee",
      letters: letters,
      solutions: [],
      scoreDict: {
        3: 1,
        4: 1,
        5: 2,
        6: 3,
        7: 5,
        8: 11,
        9: 11,
        10: 11,
        11: 11,
        12: 11,
        13: 11,
        14: 11,
        15: 11,
        16: 11,
      },
    };
  },
  mounted: function () {
    let solutionsList = findSolutions(this.letters);

    this.solutions = Object.keys(solutionsList).reduce(
      (groupedSolutions, solution) => {
        if (solution.length in groupedSolutions) {
          groupedSolutions[solution.length].push(solution);
        } else {
          groupedSolutions[solution.length] = [solution];
        }
        return groupedSolutions;
      },
      {}
    );
    console.log(this.solutions);
  },
  computed: {
    cssVars() {
      return {
        "--tile-color": this.tileColor,
        "--tile-shade": this.tileShade,
        "--tile-font-color": this.tileFontColor,
      };
    },
  },
  methods: {
    checkValidity: checkValidity,
    setTileColor: function ($event) {
      let colorInput = $event.target.value;
      let [red, green, blue] = [
        parseInt("0x" + colorInput.substring(1, 3)),
        parseInt("0x" + colorInput.substring(3, 5)),
        parseInt("0x" + colorInput.substring(5, 7)),
      ];
      this.tileColor = `rgb(${red},${green},${blue})`;
      this.tileShade = `rgb(${red > 100 ? red - 100 : 0},${
        green > 100 ? green - 100 : 0
      },${blue > 100 ? blue - 100 : 0})`;
      if (red + blue + green > 512 || green > 200) {
        this.tileFontColor = "#333";
      } else {
        this.tileFontColor = "#EEE";
      }
    },
  },
};
</script>

<style lang="scss">
$tile-color: var(--tile-color);
$tile-shade: var(--tile-shade);
$tile-font-color: var(--tile-font-color);
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-size: 2rem;
  background: rgba(silver, 20%);
  color: #333;
}

.main {
  display: grid;
  grid-template-columns: 610px auto;

  .header {
    grid-row: 1;
    grid-column: 1 / -1;
    text-align: center;
    font-family: "Dela Gothic One";
  }
  .guessed {
    height: 73vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    h2 {
      margin: 0;
    }
    p {
      padding: 0.5em;
    }
    &__list {
      overflow: auto;
      width: -webkit-fill-available;
      max-width: 600px;
      height: 70%;
      margin: 10px 20px;

      display: flex;
      justify-content: center;
      box-shadow: 0 0 0 1px var(--tile-shade),
        0px 0px 3px 5px rgba(255, 255, 255, 0.15) inset,
        4px 8px 3px 0px var(--tile-shade), 5px 9px 0px 0px rgba(0, 0, 0, 0.4),
        5px 8px 3px 1px rgba(0, 0, 0, 0.5), 2px 4px 2px 1px var(--tile-shade);

      &::-webkit-scrollbar {
        width: 0;
      }

      border-radius: 9px;

      table {
        overflow: hidden;
        border-collapse: collapse;
        font-size: 0.9em;
        font-family: sans-serif;
        width: 100%;
        max-width: 600px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
        thead tr {
          background-color: $tile-color;
          color: $tile-font-color;
          text-align: left;
        }
        th:last-of-type {
          width: 40%;
        }

        th,
        td {
          padding: 12px 15px;
        }
        tbody {
          tr {
            border-bottom: 1px solid #dddddd;
          }

          tr:nth-of-type(even) {
            td {
              background-color: #e8e8e8;
            }
          }

          tr:last-of-type {
            border-bottom: 2px solid $tile-color;
          }
        }
      }
    }
    &__goal {
      height: 30%;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-evenly;
      align-items: center;
      p {
        padding: 0;
        margin: 0 10px;
        font-size: 20px;
        height: fit-content;
      }
      div {
        width: 100%;
        text-align: center;
      }
    }
  }
}
@media only screen and (max-width: 400px) {
  .main {
    grid-template-columns: auto;
  }
}
</style>
