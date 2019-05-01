<template>
  <span
    class="word"
    v-if="!isSymbol && isValidPos"
    @click="selectWord"
    :class="[{highlight: this.focus}]"
  >
    <template v-for="(token, index) in word.tokens">
      <template v-if="token.rd">
        <ruby :key="index">
          <rb>{{token.sf}}</rb>
          <rt :class="[{'hidden': readingMode === 'none'}]">{{translateReading(token.rd)}}</rt>
        </ruby>
      </template>
      <template v-else>{{token.sf}}</template>
    </template>
  </span>
  <span v-else>{{word.tokens[0].sf}}</span>
</template>


<script>
import jpUtils from "@/logic/jpUtils";
export default {
  name: "Word",
  props: {
    word: {
      bf: String,
      pos: String,
      tokens: [{ sf: String, bf: String }]
    },
    focus: Boolean,
    lineNum: Number,
    linePos: Number,
    // hiragana, katakana, none
    readingMode: String
  },
  computed: {
    isSymbol: function() {
      return (
        this.word.tokens.length === 1 &&
        !jpUtils.hasJapanese(this.word.tokens[0].sf)
      );
    },
    isValidPos: function() {
      return (
        this.word.pos === "動詞" ||
        this.word.pos === "名詞" ||
        this.word.pos === "副詞" ||
        this.word.pos === "形容詞"
      );
    }
  },
  methods: {
    hasKanji: function() {
      return jpUtils.hasKanji(this.wordObj.sf);
    },

    toHiragana: function(w) {
      return jpUtils.toHiragana(w);
    },

    toKatakana: function(w) {
      return jpUtils.toKatakana(w);
    },

    hasSpecialChar: function() {
      return !jpUtils.hasJapanese(this.wordObj.sf);
    },

    selectWord: function() {
      this.$emit("selectWord", this.word, this.lineNum, this.linePos);
    },

    translateReading: function(str) {
      if (this.readingMode === "hiragana") {
        return this.toHiragana(str);
      } else {
        return this.toKatakana(str);
      }
    }
  }
};
</script>