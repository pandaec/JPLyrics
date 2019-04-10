<template>
  <ruby
    class="word"
    v-if="this.hasKanji()"
    :class="[{highlight: this.focus}]"
    @click="this.selectWord"
  >
    <rb>{{this.wordObj.sf}}</rb>
    <rt :class="[{'hidden': this.readingMode === 'none'}]">{{reading}}</rt>
  </ruby>
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
    readingMode: String,
  },
  computed: {
    reading: function(){
      if(this.readingMode === 'hiragana'){
        return this.toHiragana(this.wordObj.rd);
      }else{
        return this.wordObj.rd;
        
      }
    }
  },
  methods: {
    hasKanji: function() {
      return jpUtils.hasKanji(this.wordObj.sf);
    },

    toHiragana: function(w) {
      return jpUtils.toHiragana(w);
    },

    hasSpecialChar: function() {
      return jpUtils.hasSpecialCharOrEng(this.wordObj.sf);
    },

    selectWord: function() {
      this.$emit("selectWord", this.wordObj, this.lineNum);
    }
  }
};
</script>