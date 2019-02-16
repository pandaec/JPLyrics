<template>
  <div class="form-expand">
    <div v-for="sr in searchResult" :key="sr.lid" @click="importLyrics(sr)" class="search-result">
      <h4>{{sr.name}}</h4>
      <h5>{{sr.artist}}</h5>
      <h5>{{sr.content}}</h5>
    </div>
  </div>
</template>


<script>
export default {
  name: "ImportLyricsPanel",
  props: ["title"],
  data: function() {
    return {
      searchResult: []
    };
  },
  mounted: function() {
    fetch(`http://localhost:8080/api/fetch/search/${this.title}`)
      .then(res => res.json())
      .then(res => {
        this.searchResult = res;
      })
      .catch(console.log);
  },
  watch: {
    title: function(){
      fetch(`http://localhost:8080/api/fetch/search/${this.title}`)
        .then(res => res.json())
        .then(res => {
          this.searchResult = res;
        })
        .catch(console.log);
    
    }
  },
  methods: {
    importLyrics: function(searchObj) {
      fetch(
        `http://localhost:8080/api/fetch/lyrics?aid=${encodeURIComponent(
          searchObj.aid
        )}&lid=${encodeURIComponent(searchObj.lid)}`
      )
        .then(res => res.json())
        .then(res => {
          let lyricsObj = {
            'title': searchObj.name,
            'artist': searchObj.artist,
            'content': res,
          }
          this.$emit("importLyrics", lyricsObj);
        })
        .catch(console.log);
    }
  }
};
</script>