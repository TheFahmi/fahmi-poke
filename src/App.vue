<template>
  <Suspense>
    <template #default>
      <Pokemon />
    </template>
    <template #fallback>
      <Loading />
    </template>
  </Suspense>
</template>

<script>
import Pokemon from "@/components/Pokemon.vue"
import Loading from "@/components/Loading.vue"

export default {
  name: "app",
  components: {
    Pokemon,
    Loading
  }
};
</script>

<style>
@import url("https://use.fontawesome.com/releases/v5.8.2/css/all.css");

body {
  margin: 0;
  padding: 0;
}
#app {
  background: radial-gradient(#ffbf0b, #e20000);
}
</style>
