<template>
  <div class="board">
    <div v-for="(letter, index) in letters" v-bind:key="index">
      <Tile :highlight="found(index)" :letter="letter" />
    </div>

    <input
      v-model="inputLetters"
      ref="inputter"
      v-on:keyup="presskey"
      v-on:blur="losefocus"
    />
    <input v-on:change="setTileColor" type="color" />
  </div>
</template>

<script>
import Tile from "./Tile";
import { checkFunction } from "../functions/checkFunction";
export default {
  components: {
    Tile,
  },
  props: {
    msg: Number,
    guessedWords: Array,
    setTileColor: Function,
    letters: Array,
  },
  data: function () {
    return {
      app: null,
      inputLetters: [],
      tilesToColor: [],
      solutions: ["A"],
    };
  },

  methods: {
    presskey: function ($event) {
      if ($event.keyCode === 13) {
        if (
          this.tilesToColor.length > 0 &&
          !this.guessedWords.includes(this.inputLetters.toUpperCase())
        ) {
          this.guessedWords.push(this.inputLetters.toUpperCase());
        }
        this.inputLetters = [];
        this.tilesToColor = [];
        return;
      }
      const paths = checkFunction(this.inputLetters);
      const tilesToColor = [];
      if (paths) {
        for (let index of paths) {
          tilesToColor.push(index);
        }
      }

      this.tilesToColor = [...new Set(tilesToColor)];
    },
    losefocus: function () {
      this.$refs.inputter.focus();
    },
    found: function (index) {
      return this.tilesToColor.includes(index);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.board {
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  grid-template-columns: repeat(6, 1fr);
  width: 19em;
  margin: 0;
  aspect-ratio: 1;
  place-self: center;
}
.solutions {
  grid-column: 1 / -1;
  display: flex;
}
input {
  grid-column: 1/-1;
  font-size: 1.5em;
  margin: 0.5em;
  border-radius: 22px;
  box-shadow: 0 0 0 7px black inset;
  padding: 10px;
  &:active,
  &:hover,
  &:focus {
    outline: none;
    box-shadow: 0 0 0 7px var(--tile-color) inset;
  }
  &[type="color"] {
    position: absolute;
    right: 50px;
    top: 0;
    width: 50px;
    height: 50px;
    box-shadow: unset;
  }
}
</style>
