<template>
  <div class="pure-g center">
    <div class="pure-u-7-8">
      <form class="pure-form pure-form-aligned">
        <fieldset>
          <legend>Lyrics Form</legend>
          <div class="pure-control-group">
            <label for="title">Title</label>
            <input
              v-model="title"
              id="title"
              class="pure-input-1-2"
              type="text"
              placeholder="Title"
            >
            <button class="pure-button button-success" @click.stop.prevent="searchImportLyrics()" >
              <i class="fas fa-plus-circle white-icon"></i>
            </button>
          </div>

          <ImportLyricsPanel v-if="importTitle" :title="importTitle" @importLyrics="importLyrics" />

          <div class="pure-control-group">
            <label for="artist">Artist</label>
            <input
              v-model="artist"
              id="artist"
              class="pure-input-1-2"
              type="text"
              placeholder="Artist"
            >
          </div>
          <div class="pure-control-group">
            <label for="lyrics">Lyrics</label>
            <textarea v-model="lyrics" id="lyrics" class="pure-input-2-3" rows="30"></textarea>
          </div>
          <div class="pure-controls">
            <button
              @click.stop.prevent="submit()"
              type="submit"
              class="pure-button pure-button-primary"
            >Submit</button>
          </div>
        </fieldset>
      </form>
    </div>
  </div>
</template>


<script>
import ImportLyricsPanel from '@/components/ImportLyricsPanel.vue';
export default {
  name: "SearchPanel",
  components: {
    ImportLyricsPanel
  },
  data: function() {
    return {
      title: "",
      artist: "",
      lyrics: "",
      importTitle: "",
    };
  },
  methods: {
    submit: function() {
      console.log(this.title);
      console.log(this.artist);
      console.log(this.lyrics.split("\n"));
      if (this.title === "" || this.artist === "" || this.lyrics === "") {
        return;
      }

      const lyricsData = {
        title: this.title,
        artist: this.artist,
        slyrics: this.lyrics.split("\n")
      };

      fetch("http://localhost:8080/api/lyrics", {
        method: "POST",
        body: JSON.stringify(lyricsData),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(res => {
          const sid = res["sid"];
          this.$router.push(`/lyrics/${sid}`);
        })
        .catch(console.log);
    },
    searchImportLyrics: function(){
      this.importTitle = this.title;
    },
    importLyrics: function(sr){
      this.title = sr.title;
      this.artist = sr.artist;
      this.lyrics = sr.content.join('\n');
    },
  }
};
</script>