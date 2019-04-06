<template>
  <div class="dictBlock">
    <div class="arrow-up" :style="{left: arrowLeft+'px'}"></div>
    <div class="lineBlock">
      <!-- <div class="dictBar" @click="removePanel">
        <i class="fas fa-window-close"></i>
      </div> -->
      <div class="dictContainer">
        <button class="dictPagingBtn" @click="updateWordIndex(-1)">
          <i class="fas fa-angle-left"></i>
        </button>
        <div class="dictContent">
          <span style="float: right;">{{this.wordIndex+1}}/{{this.meanings.length}}</span>
          <div
            v-if="meanings[this.wordIndex].japanese[0].word"
          >{{meanings[this.wordIndex].japanese[0].word}} ({{getReadingStr(meanings[this.wordIndex].japanese)}})</div>
          <div v-else>{{meanings[this.wordIndex].japanese[0].reading}}</div>

          <!-- <div class="dictPaging">
            <button class="pbutton pbutton-primary" @click="updateWordIndex(-1)"><i class="fas fa-angle-left"></i></button>
            <span>{{this.wordIndex+1}}/{{this.meanings.length}}</span>
            <button class="pbutton pbutton-primary" @click="updateWordIndex(1)"><i class="fas fa-angle-right"></i></button>
          </div>-->

          <ul>
            <li
              v-for="(sense, si) in meanings[this.wordIndex].senses"
              :key="si"
            >{{getDefinitionStr(sense.definition)}}</li>
          </ul>
        </div>
        <button class="dictPagingBtn" @click="updateWordIndex(1)">
          <i class="fas fa-angle-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "DictPanel",
  props: {
    word: String
  },
  data: function() {
    return {
      arrowLeft: this.calcArrowOffset(),
      meanings: [
        {
          japanese: [
            {
              word: "",
              reading: ""
            }
          ],
          senses: [
            {
              definition: [],
              pos: []
            }
          ]
        }
      ],
      wordIndex: 0
    };
  },
  computed: {},
  mounted: function() {
    this.searchWord();
  },
  watch: {
    word: function(newVal, oldVal) {
      this.searchWord();
    }
  },

  methods: {
    calcArrowOffset: function() {
      const highlight = document.querySelector(".highlight");
      const dictBlock = this.$el;

      if (highlight == undefined || dictBlock == undefined) return 9999999;

      const highlightRect = highlight.getBoundingClientRect();
      const dictBlkRect = dictBlock.getBoundingClientRect();
      const arrowWidth = 10 / 2;

      return (
        highlightRect.left -
        dictBlkRect.left -
        arrowWidth +
        highlightRect.width / 2
      );
    },
    removePanel: function() {
      this.$emit("removePanel");
    },
    searchWord() {
      fetch(`${process.env.VUE_APP_DB_IP}/api/jisho?keyword=${this.word}`)
        .then(res => res.json())
        .then(this.searchWordHandle)
        .catch(console.err);
    },
    searchWordHandle(res) {
      this.meanings = res;
      this.arrowLeft = this.calcArrowOffset();
      this.wordIndex = 0;
    },

    getDefinitionStr(definition) {
      if (definition !== undefined) {
        return definition.join(", ");
      }
    },
    updateWordIndex(amount) {
      this.wordIndex = Math.max(
        Math.min(this.wordIndex + amount, this.meanings.length - 1),
        0
      );
    },
    getReadingStr(japanese) {
      if (japanese === undefined) return;

      const targetWord = japanese[0]["word"];
      let result = [];

      for (let w of japanese) {
        if (w.word === targetWord) {
          result.push(w.reading);
        }
      }

      return result.join("/");
    }
  }
};
</script>