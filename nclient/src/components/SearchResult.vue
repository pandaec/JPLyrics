<template>
  <div class="search-result-panel">
    <SearchPanel :prevQ="q"/>

    <div class="flex-fill" :class="{'center-flex': loading || lyricsData.length===0}">
      <LoadingBox v-if="loading"/>
      <div v-else>
        <div
          v-for="item in lyricsData"
          :key="item.sid"
          class="result-item"
          @click="getLyrics(item.sid)"
        >
          <h3>{{item.title}}</h3>
          <h5>{{item.artist}} ({{item.sid}})</h5>
          <template v-for="line in item.slyrics">
            <span>{{line}}</span>
            <br>
          </template>

          <hr>
        </div>

        <div v-if="lyricsData.length===0">
          <h3>No result</h3>
          <button class="pbutton pbutton-primary" @click="addLyrics">
            <span>Add lyrics for this song</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import SearchPanel from "./SearchPanel.vue";
import LoadingBox from "./LoadingBox.vue";

export default {
  name: "SearchResult",
  components: {
    SearchPanel,
    LoadingBox
  },
  props: ["q"],
  data: function() {
    return {
      lyricsData: [],
      loading: true
    };
  },
  computed: {},
  mounted: function() {
    this.updateLyrics();
  },
  watch: {
    q: function() {
      this.updateLyrics();
    }
  },

  methods: {
    getLyrics: function(sid) {
      this.$router.push(`/lyrics/${sid}`);
    },

    updateLyrics: function() {
      const basePath = `${process.env.VUE_APP_DB_IP}/api/lyrics/search`;
      const fetchPath =
        basePath + (this.q ? `?q=${encodeURIComponent(this.q)}` : ``);

      this.loading = true;
      fetch(fetchPath)
        .then(res => res.json())
        .then(result => {
          this.lyricsData = result;
          this.loading = false;
        });
    },
    addLyrics: function() {
      this.$router.push(`/lyrics/new?t=${this.q}`);
    }
  }
};
</script>