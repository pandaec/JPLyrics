<template>
  <div class="center">
    <div>
      <form class="pform">
        <fieldset>
          <legend>Lyrics Form</legend>
          <div class="form-row">
            <label for="title">Title</label>
            <input v-model="title" id="title" type="text" placeholder="Title">
            <button class="pbutton pbutton-success" @click.stop.prevent="searchImportLyrics()">
              <i class="fas fa-plus-circle white-icon"></i>
            </button>
          </div>

          <ImportLyricsPanel v-if="importTitle" :title="importTitle" @importLyrics="importLyrics"/>

          <div class="form-row">
            <label for="artist">Artist</label>
            <input v-model="artist" id="artist" type="text" placeholder="Artist">
          </div>
          <div class="form-row">
            <label for="lyrics">Lyrics</label>
            <textarea v-model="lyrics" id="lyrics" rows="30"></textarea>
          </div>
          <div class="form-row">
            <button
              @click.stop.prevent="submit()"
              type="submit"
              class="pbutton pbutton-primary"
            >Submit</button>
          </div>
        </fieldset>
      </form>
    </div>
  </div>
</template>


<script>
import ImportLyricsPanel from "@/components/ImportLyricsPanel.vue";
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
      importTitle: ""
    };
  },
  methods: {
    submit: function() {
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
    searchImportLyrics: function() {
      this.importTitle = this.title;
    },
    importLyrics: function(sr) {
      this.title = sr.title;
      this.artist = sr.artist;
      this.lyrics = sr.content.join("\n");

      // close the import panel
      this.importTitle = "";
    }
  }
};
</script>