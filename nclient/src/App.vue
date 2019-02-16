<style lang="scss">
@import "src/assets/css/main.scss";
</style>
<template>
  <div id="app">
    <div class="sidebar">
      <h3>P-Lyrics</h3>

      <ul>
        <a>
          <router-link tag="li" to="/" class="nav-link">Home</router-link>
        </a>
        <a>
          <router-link tag="li" to="/lyrics/new" class="nav-link">Add</router-link>
        </a>
      </ul>
    </div>

    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
// import LyricsViewer from "./components/LyricsViewer.vue";

export default {
  name: "app",
  components: {
    // LyricsViewer,
  }
};
</script>

<style>
</style>
