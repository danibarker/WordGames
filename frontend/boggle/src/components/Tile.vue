<template>
  <div v-if="highlight" class="typed letter">{{ letter }}</div>
  <div v-else class="letter">
    <p>{{ letter }}</p>
  </div>
</template>

<script>
export default {
  props: { letter: String, highlight: Boolean },
  data: function () {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss">
$tile-color: var(--tile-color);
$tile-shade: var(--tile-shade);
$tile-font-color: var(--tile-font-color);

.letter {
  font-size: 2em;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  margin: 10px;
  /* float: right; */
  background-color: $tile-color;
  background-image: -webkit-linear-gradient(
      257deg,
      rgba(255, 255, 255, 0.2) 44%,
      transparent 66%
    ),
    -webkit-linear-gradient(top, rgba(255, 255, 255, 0.15), transparent);
  border-radius: 9px;
  box-shadow: 0 0 0 1px $tile-shade inset,
    0px 0px 3px 5px rgb(255 255 255 / 15%) inset, 4px 8px 3px 0px $tile-shade,
    5px 9px 0px 0px rgb(0 0 0 / 40%), 5px 8px 3px 1px rgb(0 0 0 / 50%),
    2px 4px 2px 1px $tile-shade;
  color: $tile-font-color;
  /* display: block; */
  letter-spacing: -1px;
  position: relative;
  line-height: 61px;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
  text-decoration: none !important;
  &.typed {
    filter: hue-rotate(50deg);
    box-shadow: 0 0 0 1px $tile-shade inset, 0 0 0 6px $tile-font-color inset,
      0 0 0 1px $tile-shade inset, 0px 0px 3px 5px rgb(255 255 255 / 15%) inset,
      4px 8px 3px 0px $tile-shade, 5px 9px 0px 0px rgb(0 0 0 / 40%),
      5px 8px 3px 1px rgb(0 0 0 / 50%), 2px 4px 2px 1px $tile-shade;
  }
  p {
    margin: 0;
    text-shadow: 0 0 8px $tile-shade;
  }
}
</style>
