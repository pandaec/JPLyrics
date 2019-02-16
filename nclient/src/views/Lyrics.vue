<template>
  <LyricsViewer :sid="$route.params.sid"/>
</template>

<script>
// @ is an alias to /src
import LyricsViewer from "@/components/LyricsViewer.vue";

export default {
  name: "lyrics",
  components: {
    LyricsViewer
  }
};
</script>
