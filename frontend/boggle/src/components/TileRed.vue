<template>
  <div class="red_letter">{{ letter }}</div>
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
.red_letter {
  font-size: 30px;
  padding: 0.5rem;
  box-shadow: 0 0 0 1px black;
  background: pink;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
}
</style>
