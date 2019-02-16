<template>
  <!-- <form class="form-center frontpage-form"> -->
  <form class="form-center frontpage-form">
    <fieldset>
      <input type="text" name="q" v-model="q">
      <button class="pbutton pbutton-primary" type="submit" @click.stop.prevent="submit()">
        <i class="fas fa-search"></i> Search
      </button>
    </fieldset>
  </form>
</template>


<script>
export default {
  name: "SearchPanel",
  props: ['prevQ'],
  data: function() {
    return {
      q: this.prevQ || '',
    };
  },
  methods: {
    submit: function() {
      const basePath = "/search";
      const routePath =
        basePath + (this.q !== "" ? `?q=${encodeURIComponent(this.q)}` : "");
      this.$router.push(routePath);
    }
  }
};
</script>