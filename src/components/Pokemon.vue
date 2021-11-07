<template>
  <div class="container h-full mx-auto text-center">
    <img
      alt="Vue logo"
      src="https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg"
    >
    <h1>Pokedex VueJS</h1>
    <ul class="flex w-full md:w-2/4 mb-8 mt-4">
      <li class="flex-1 mr-2">
        <a
          @click="changeMenu('listPokemon')" 
          :class="{'border-blue bg-blue-500 hover:bg-blue-700 text-white' : activeMenu === 'listPokemon'}"
          class="text-center block border rounded py-2 px-4 border-white over:border-gray-200 cursor-pointer" >List Pokemon</a>
      </li>
       <li class="flex-1 mr-2">
        <a
          @click="changeMenu('listFavorite')" 
          :class="{'border-blue bg-blue-500 hover:bg-blue-700 text-white' : activeMenu === 'listFavorite'}"
          class="text-center block border rounded py-2 px-4 border-white over:border-gray-200 cursor-pointer" >List Favorite</a>
      </li>
    </ul>
    
    <div v-if="activeMenu === 'listPokemon'" class="flex w-full md:w-2/4 justify-center items-center flex-col md:flex-row">
      <AsyncPokemonSearch
        :apiUrl="apiUrl" 
        @setPokemonUrl="setPokemonUrl"
      />
      <div class="pb-5 w-full max-w-xl z-10 group inline-block relative">
        <button
          class="bg-gray-300 text-gray-700 w-11/12 text-center font-semibold py-2 px-4 rounded inline-flex items-center"
        >
          <span class="mr-1">Filter Pokemon Type</span>
          <svg
            class="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
            />
          </svg>
        </button>
        <ul class="absolute hidden text-gray-700 pt-1 group-hover:block w-full">
          <li v-for="(item, idx) in listPokeType" :key="idx" class="">
            <a
              class="rounded bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap capitalize cursor-pointer"
              @click="filterType(item.name)"
            >
              {{item.name}}
            </a>
          </li>
        </ul>
      </div>
    </div>
    <async-pokemon-list 
      v-if="activeMenu === 'listPokemon'"
      :imageUrl="imageUrl" 
      :apiUrl="apiUrl" 
      :pokeType="pokeType"
      @setPokemonUrl="setPokemonUrl"
    />
    <pokemon-favorite
      v-if="activeMenu === 'listFavorite'"
      :imageUrl="imageUrl" 
      :apiUrl="apiUrl" 
      @setPokemonUrl="setPokemonUrl"
    />
    <pokemon-detail
      v-if="showDetail"
      :pokemonUrl="pokemonUrl"
      :imageUrl="imageUrl"
      @closeDetail="closeDetail"
    />
  </div>
</template>
<script>
import { defineAsyncComponent, ref, readonly, onMounted } from "vue"
// import { Sheet } from 'bottom-sheet-vue3'
import Loading from '@/components/Loading.vue'
import PokemonDetail from '@/components/PokemonDetail.vue'
import PokemonFavorite from '@/components/PokemonFavorite.vue'


const AsyncPokemonSearch = defineAsyncComponent({
    loader: () => import("@/components/PokemonSearch.vue"),
    loadingComponent : Loading,
    delay:200,
    suspensible: true,
})

const AsyncPokemonList = defineAsyncComponent({
    loader: () => import("@/components/PokemonList.vue"),
    loadingComponent : Loading,
    delay:200,
    suspensible: true,
})

const LIST_MENU = [
  {
    seq: 1,
    name: "List Pokemon",
    components: "listPokemon"
  },
  {
    seq: 2,
    name: "List Favorite",
    components: "listFavorite"
  }
]

export default {
  components: {
    AsyncPokemonSearch,
    AsyncPokemonList,
    PokemonFavorite,
    PokemonDetail,
  },
  setup(){
    const imageUrl = ref('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/')
    let apiUrl = ref('https://pokeapi.co/api/v2/')
    let pokemonUrl = ref('')
    let activeMenu = ref('listPokemon')
    let showDetail = ref(false)
    let listMenu = readonly(LIST_MENU)
    let listPokeType = ref([])
    let isOpenModal =  ref(false)
    let pokeType = ref('')

    const filterType = (dataType) => {
      pokeType.value = dataType
    }

    const fetchDataPokeType = () => {
      let req = new Request(`${apiUrl.value}type`);
      fetch(req)
        .then((resp) => {
          if (resp.status === 200) return resp.json();
        })
        .then((data) => {
          listPokeType.value = data.results
        })
        .catch((error) => {
          console.log(error);
        });
    }

    const changeMenu = (menuType) => {
      activeMenu.value = menuType
    }

    const setPokemonUrl = (url) => {
      pokemonUrl.value = url
      showDetail.value = true    
    }

    const closeDetail = () => {
      pokemonUrl.value = '';
      showDetail.value = false;
    }

    onMounted(() => {
      fetchDataPokeType()
    })


    return {
      imageUrl,
      apiUrl,
      pokemonUrl,
      activeMenu,
      showDetail,
      listMenu,
      listPokeType,
      pokeType,
      isOpenModal,
      closeDetail,
      setPokemonUrl,
      changeMenu,
      fetchDataPokeType,
      // openModal,
      filterType,
    }
    
  }
}
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 10px;
  width: calc(100% - 20px);
  min-height: calc(100vh - 20px);
  //background: radial-gradient(#ffbf0b, #e20000);

  font-family: "Acme", arial;
  font-size: 1rem;
  font-weight: normal;
}

h1 {
  color: #efefef;
}
</style>