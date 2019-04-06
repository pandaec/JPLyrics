<template>
  <div class="container">
    <div class="lyrics-info">
      <h3>{{lyricsData.title}}</h3>
      <h4>{{lyricsData.artist}}</h4>
      <LyricsViewerReadingToggleBtn @updateReadingMode="updateReadingMode"/>
    </div>

    <div class="line" v-for="(line, index) in lyricsData.slyrics" v-bind:key="index">
      <template v-for="(word, windex) in line">
        <Word
          :key="windex"
          @selectWord="focusWord"
          :wordObj="word"
          :focus="word.focus"
          :readingMode="readingMode"
          :lineNum="index"
        />
      </template>

      <br v-if="line.length === 0">

      <DictPanel v-if="index === focusLine" :word="highlightWord" @removePanel="removePanel"/>
    </div>
  </div>
</template>

<script>
import DictPanel from "./DictPanel.vue";
import Word from "./Word.vue";
import LyricsViewerReadingToggleBtn from "./LyricsViewerReadingToggleBtn.vue";

export default {
  name: "LyricsViewer",
  components: {
    DictPanel,
    Word,
    LyricsViewerReadingToggleBtn
  },
  props: {
    sid: String
  },
  data: function() {
    return {
      lyricsData: {
        title: "",
        artist: "",
        slyrics: []
      },
      focusLine: undefined,
      highlightWord: "",
      readingMode: "hiragana",
    };
  },
  created() {
    fetch(`${process.env.VUE_APP_DB_IP}/api/lyrics/${this.sid}`)
      .then(res => res.json())
      .then(result => {
        this.lyricsData = result;
      });
  },
  methods: {
    focusWord(word, lineNum) {
      this.lyricsData.slyrics.forEach(line => {
        line.forEach(word => {
          delete word.focus;
        });
      });

      this.$set(word, "focus", true);
      this.highlightWord = word.sf;
      this.focusLine = lineNum;
    },
    removePanel() {
      this.lyricsData.slyrics.forEach(line => {
        line.forEach(word => {
          delete word.focus;
        });
      });

      this.focusLine = undefined;
      this.highlightWord = "";
    },
    updateReadingMode(targetMode) {
      this.readingMode = targetMode;
    }
  }
};
</script>