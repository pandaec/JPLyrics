<template>
  <div class="dictBlock">
    <div class="arrow-up" :style="{left: arrowLeft+'px'}"></div>
    <div class="lineBlock">
      <div
        style="width:100%;float:right;text-align:right;border-bottom:1px solid;"
        @click="removePanel"
      >X</div>
      <div>
        <div v-if="meaning.japanese[0].word">
          {{meaning.japanese[0].word}} ({{meaning.japanese[0].reading}})
        </div>
        <div v-else>
          {{meaning.japanese[0].reading}}
        </div>
        <ul>
          <li v-for="(sense, si) in meaning.senses" :key="si">{{sense.definition}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "DictPanel",
  props: ["word"],
  data: function() {
    return {
      arrowLeft: this.calcArrowOffset(),
      meaning: {
        japanese: [
          {
            word: "",
            reading: ""
          }
        ],
        senses: [
          {
            definition: "",
            pos: ""
          }
        ]
      }
    };
  },
  computed: {},
  mounted: function() {
    this.arrowLeft = this.calcArrowOffset();
    this.searchWord();
  },
  watch: {
    word: function(newVal, oldVal) {
      this.arrowLeft = this.calcArrowOffset();
      this.searchWord();
    }
  },

  methods: {
    calcArrowOffset: function() {
      const highlight = document.querySelector(".highlight");
      const dictBlock = this.$el;

      if (highlight == undefined || dictBlock == undefined) return 500;

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
      fetch(`http://localhost:8080/api/jisho?keyword=${this.word}`)
        .then(res => res.json())
        .then(res => {
          this.meaning.japanese = res[0].japanese;
          this.meaning.senses = res[0].senses.map(entry => {
            return {
              definition: entry['english_definitions'],
              pos: entry['parts_of_speech']
            }
          });
        })
        .catch();
    }
  }
};
</script>