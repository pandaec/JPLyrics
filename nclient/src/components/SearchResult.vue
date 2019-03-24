<template>
  <div class="content">
    <SearchPanel :prevQ="q"/>

    <div v-for="item in lyricsData" :key="item.sid" class="result-item" @click="getLyrics(item.sid)">

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
    </div>
  </div>
</template>


<script>
import SearchPanel from "./SearchPanel.vue";

export default {
  name: "SearchResult",
  components: {
    SearchPanel
  },
  props: ["q"],
  data: function() {
    return {
      lyricsData: []
    };
  },
  computed: {},
  mounted: function() {
    this.updateLyrics();
  },
  watch: {
    q: function(){
      this.updateLyrics();
    },
  },

  methods: {
    getLyrics: function(sid) {
      this.$router.push(`/lyrics/${sid}`);
    },
    
    updateLyrics: function(){
      const basePath = `${process.env.VUE_APP_DB_IP}/api/lyrics/search`;
      const fetchPath =
        basePath + (this.q ? `?q=${encodeURIComponent(this.q)}` : ``);
      fetch(fetchPath)
        .then(res => res.json())
        .then(result => {
          this.lyricsData = result;
        });
    }
  }
};
</script>