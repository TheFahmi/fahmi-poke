<template>
  <div class="relative w-full pb-5 max-w-xl">
    <form @submit.prevent="setPokemonUrl()">
      <input class="rounded text-base w-11/12" type="text" placeholder="Search your Pokemon" v-model="searchValue">
    </form>
    <i class="fas fa-search -translate-x-6 absolute text-xl text-gray-800 cursor-pointer top-3 right-3" @click="setPokemonUrl()"></i>
  </div>
</template>

<script>
  import { ref } from 'vue'
  export default {
    props: {
      apiUrl: String
    },
    setup(_props, { emit }){
      let searchValue = ref('')
      const setPokemonUrl = () => {
        if(searchValue.value) {
          emit('setPokemonUrl', _props.apiUrl + 'pokemon/'+ searchValue.value);
        }
      }
      return {
        searchValue,
        setPokemonUrl
      }
    }
  }
</script>