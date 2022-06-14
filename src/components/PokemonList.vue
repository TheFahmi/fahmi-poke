<template>
  <div class="grid grid-cols-2 gap-3 w-full md:grid-cols-3 md:gap-5 min-h-screen">
    <div class="w-full rounded-lg overflow-hidden shadow-lg mx-auto cursor-pointer hover:shadow-2xl transition-all duration-200 ease-in-out transform hover:-translate-y-2 bg-white"
      v-for="(pokemon, index) in pokemons"
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
    <div id="scroll-trigger" ref="infinitescrolltrigger">
      <i class="fas fa-spinner fa-spin"></i>
    </div>
  </div>
</template>

<script>
import VLazyImage from 'v-lazy-image'
import Loading from '@/components/Loading.vue'
import { defineAsyncComponent, ref, onMounted, watch } from 'vue'

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
    apiUrl: String,
    pokeType: String
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
        const saveData = {
          ...itemPokemon,
          isLike: true
        }
        tempData.push(saveData)
      } else {
        if (!tempData.find(poke => poke.id === itemPokemon.id)) {
          const saveData = {
            ...itemPokemon,
            isLike: true
          }
          tempData.push(saveData)
        } else {
          tempData = tempData.filter((poke) => poke.id !== itemPokemon.id)
        }
      }
      localStorage.setItem('likeStorage', JSON.stringify(tempData))
      likeData.value = tempData
      convertIsLike()
    }

    const fetchData = () => {
      if (!currentUrl.value) return
      let req = new Request(`${currentUrl.value}pokemon`)
      fetch(req)
        .then((resp) => {
          if (resp.status === 200) return resp.json()
        })
        .then((data) => {
          nextUrl.value = data.next
          data.results.forEach((pokemon) => {
            pokemon.id = pokemon.url
              .split("/")
              .filter(function (part) {
                return !!part
              })
              .pop()
            pokemons.value.push(pokemon)
          })
          convertIsLike()
        })
        .catch((error) => {
          console.log(error)
        })
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

    const scrollTrigger = () => {
      // const infinitescrolltrigger = document.querySelector('#scroll-trigger');
      // const observer = new IntersectionObserver((entries) => {
      //   entries.forEach((entry) => {
      //     if (entry.intersectionRatio > 0 && nextUrl) {
      //       next()
      //     }
      //   })
      // })
      // observer.observe(infinitescrolltrigger)
    }
  
    const next = () => {
      currentUrl.value = nextUrl.value
      fetchData()
    }

    const setPokemonUrl = (url) => {
      emit("setPokemonUrl", url)
    }

    onMounted(() => {
      currentUrl.value = _props.apiUrl
      scrollTrigger()
      fetchData()
      const likeData = JSON.parse(localStorage.getItem('likeStorage'))
      if (!likeData) localStorage.setItem('likeStorage', JSON.stringify([]))
    })

    watch(
      () => _props.pokeType,
      async () => {
      pokemons.value = []
      let req = new Request(`${_props.apiUrl}type/${_props.pokeType}`)
      fetch(req)
        .then((resp) => {
          if (resp.status === 200) return resp.json()
        })
        .then((data) => {
          nextUrl.value = data.next
          data.pokemon.forEach((poke) => {
            poke.pokemon.id = poke.pokemon.url
              .split("/")
              .filter(function (part) {
                return !!part
              })
              .pop()

            pokemons.value.push(poke.pokemon)            
          })
          convertIsLike()
        })
        .catch((error) => {
          console.log(error)
        })
      }
    )

    return {
      setPokemonUrl,
      next,
      scrollTrigger,
      convertIsLike,
      fetchData,
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

