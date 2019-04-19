<template>
  <span
    class="word"
    v-if="this.hasKanji()"
    :class="[{highlight: this.focus}]"
    @click="this.selectWord"
  >
    <template v-for="(token, index) in tokenizeKanji()">
      <ruby v-if="Array.isArray(token)" :key="index">
        <rb>{{token[0]}}</rb>
        <rt :class="[{'hidden': readingMode === 'none'}]">{{translateReading(token[1])}}</rt>
      </ruby>
      <template v-else>{{token}}</template>
    </template>
  </span>
  <span
    v-else-if="!this.hasSpecialChar()"
    class="word"
    :class="[{highlight: this.focus}]"
    @click="this.selectWord"
  >{{this.wordObj.sf}}</span>
  <span v-else>{{this.wordObj.sf}}</span>
</template>


<script>
import jpUtils from "@/logic/jpUtils";
export default {
  name: "Word",
  props: {
    wordObj: {
      sf: String,
      rd: String
    },
    focus: Boolean,
    lineNum: Number,
    // hiragana, katakana, none
    readingMode: String
  },
  computed: {
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
      this.$emit("selectWord", this.wordObj, this.lineNum);
    },

    // assume kanji must be first letter
    // will force all sf to hiragana
    // maybe can move to backend?
    tokenizeKanji: function() {
      let hirakata = this.wordObj.sf
        .split(jpUtils.kanjiRegex)
        .filter(s => s !== "");
      let customRegex = `(.*)`;
      for (let token of hirakata) {
        customRegex += jpUtils.toHiragana(token) + `(.*)`;
      }
      const kanjiTokens = jpUtils
        .toHiragana(this.wordObj.sf)
        .match(customRegex)
        .filter(s => s !== "")
        .slice(1);
      const readingTokens = jpUtils
        .toHiragana(this.wordObj.rd)
        .match(customRegex)
        .filter(s => s !== "")
        .slice(1);

      let r = [];
      for (let i = 0; i < kanjiTokens.length; i++) {
        r.push([kanjiTokens[i], readingTokens[i]]);
        if (hirakata[i]) {
          r.push(hirakata[i]);
        }
      }
      return r;
    },

    translateReading: function(str){
      if (this.readingMode === "hiragana") {
        return this.toHiragana(str);
      } else {
        return this.toKatakana(str);
      }
    },
  }
};
</script>