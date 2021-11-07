<template>
  <div class="grid grid-cols-2 gap-3 w-full md:grid-cols-3 md:gap-5">
    <div class="w-full rounded-lg overflow-hidden shadow-lg mx-auto cursor-pointer hover:shadow-2xl transition-all duration-200 ease-in-out transform hover:-translate-y-2 bg-white"
      v-for="(pokemon, index) in likeData"
      :key="'poke' + index"
    >
      <div  @click="setPokemonUrl(pokemon.url)" class="py-4 md:py-10 mx-auto w-full flex items-center justify-center relative">
        <v-lazy-image :src="`${imageUrl}${pokemon.id}.png`" />
      </div>
      <div class="bg-gray-100 w-full pt-5 pb-8 text-center">
        <h1 class="capitalize font-semibold text-md md:text-3xl mb-2">
          {{ pokemon.name }}
        </h1>
        <div class="flex justify-around items-center">
          <div class="font-bold uppercase text-xl">
            # {{ pokemon.id }}
          </div>
          <async-like-button 
            :liked="pokemon.isLike"
            @click="likeMe(pokemon)"
          />
        </div>

      </div>
    </div>
  </div>
  <div v-if="!likeData.length" id="scroll-trigger" ref="infinitescrolltrigger">
    <img src="../assets/no-result.png" width="200"/>
  </div>
</template>

<script>
import VLazyImage from 'v-lazy-image'
import Loading from '@/components/Loading.vue'
import { defineAsyncComponent, ref, onMounted } from "vue"

const AsyncLikeButton = defineAsyncComponent({
    loader: () => import("@/components/LikeButton.vue"),
    loadingComponent : Loading,
    delay:200,
    suspensible: false,
})

export default {
  components: {
    AsyncLikeButton,
    VLazyImage
  },
  props: {
    imageUrl: String,
    apiUrl: String
  },
  setup(_props, { emit, refs }){
    let pokemons = ref([])
    let nextUrl = ref('')
    let currentUrl = ref('')
    let likeData = ref([])
    const infinitescrolltrigger = ref(null)

    const likeMe = (itemPokemon) => {
      let tempData = []
      tempData = JSON.parse(localStorage.getItem('likeStorage'))

      if (!tempData.length) {
        tempData.push(itemPokemon)
      } else {
        if (!tempData.find(poke => poke.id === itemPokemon.id)) {
          tempData.push(itemPokemon)
        } else {
          tempData = tempData.filter((poke) => poke.id !== itemPokemon.id)
        }
      }
      likeData.value = tempData
      localStorage.setItem('likeStorage', JSON.stringify(tempData))
      convertIsLike()
    }

    const convertIsLike = () => {
      const likeStorage = JSON.parse(localStorage.getItem('likeStorage'))
      pokemons.value = pokemons.value.map((pokeResult) => {
        const isLike = likeStorage.find((pokeStorage) => pokeResult.id === pokeStorage.id)
        return {
          ...pokeResult,
          isLike: !!Object.keys(isLike || {}).length
        }
      })
    } 


    onMounted(() => {
      likeData.value = JSON.parse(localStorage.getItem('likeStorage'))
      // if (!likeData) localStorage.setItem('likeStorage', JSON.stringify(likeData))
    })

    return {
      convertIsLike,
      likeMe,
      likeData,
      currentUrl,
      nextUrl,
      pokemons,
      infinitescrolltrigger

    }
  } 
}
</script>

<style lang="scss" scoped>

#scroll-trigger {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 150px;
  font-size: 2rem;
  color: #efefef;
}
</style>

