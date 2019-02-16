<template>
  <div class="container">
    <div class="lyrics-info">
      <h3>{{lyricsData.title}}</h3>
      <h4>{{lyricsData.artist}}</h4>
    </div>
    
    <div class="line" v-for="(line, index) in lyricsData.slyrics" v-bind:key="index">
      <span
        v-for="(word, windex) in line"
        :key="windex"
        @click="focusWord(word, index)"
        class="word"
        :class="[{highlight: word.focus}]"
      >{{ word.sf }}</span>

      <br v-if="line.length === 0" />

      <DictPanel v-if="index === focusLine" :word="highlightWord" @removePanel="removePanel"/>
    </div>
  </div>
</template>

<script>
import DictPanel from "./DictPanel.vue";

export default {
  name: "LyricsViewer",
  components: {
    DictPanel
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
      highlightWord: '',
    };
  },
  created() {
    fetch(`http://localhost:8080/api/lyrics/${this.sid}`)
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
      this.highlightWord =  word.sf;
      this.focusLine = lineNum;
    },
    removePanel(){
      this.lyricsData.slyrics.forEach(line => {
        line.forEach(word => {
          delete word.focus;
        });
      });

      this.focusLine = undefined;
      this.highlightWord = '';
    }
  }
};
</script>