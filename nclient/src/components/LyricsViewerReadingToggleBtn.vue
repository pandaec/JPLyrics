<template>
  <div>
    <span>Reading:</span>
    <input type="radio" id="hiragana" value="hiragana" v-model="picked" class="hidden">
    <label for="hiragana" class="pinput">あ</label>
    <input type="radio" id="katakana" value="katakana" v-model="picked" class="hidden">
    <label for="katakana" class="pinput">ア</label>

    <input type="radio" id="none" value="none" v-model="picked" class="hidden">
    <label for="none" class="pinput">Ｘ</label>
  </div>
</template>

<script>
export default {
  name: "LyricsViewerReadingToggleBtn",
  data: function() {
    return {
      picked: "katakana"
    };
  },
  watch: {
    picked: function(val) {
      this.$emit("updateReadingMode", val);
    }
  },
  methods: {}
};
</script>
