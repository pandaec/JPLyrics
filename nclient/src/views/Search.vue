<template>
  <!-- v-if="$route.query.q !== undefined" -->
  <SearchResult :q="$route.query.q"/>
</template>

<script>
// @ is an alias to /src
import SearchResult from "@/components/SearchResult.vue";

export default {
  name: "search",
  components: {
    SearchResult
  },
  data: function() {
    return {
      q: ""
    };
  }
};
</script>
