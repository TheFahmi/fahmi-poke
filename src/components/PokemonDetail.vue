<template>
  <div class="flex justify-center items-start fixed h-screen w-full pt-20 top-0 left-0 bg-black bg-opacity-70 z-50">
    <div class="flex justify-center items-center flex-col relative bg-white rounded w-full max-w-xs md:max-w-xl" v-if="show">
      <div v-if="pokemon" class="flex justify-center items-center absolute w-32 h-32 bg-yellow-500 overflow-hidden rounded-full -translate-y-16 top-0 drop-shadow-md">
        <img :src="`${imageUrl}${pokemon.id}.png`" alt="">
      </div>
      <div v-if="pokemon" class="flex justify-start items-center flex-col w-full mb-10 mt-20">
        <h2 class="text-3xl font-bold mb-4">{{ pokemon.name }}</h2>
        <div class="flex w-11/12 justify-between items-start">
          <div class="flex flex-col divide-y divide-blue-400 w-4/5 mr-2">
            <div class="mb-2 font-bold text-xl">Pokemon Info</div>
            <div class="flex divide-y divide-light-blue-400 justify-between">
              <div>Base Experience</div>
              <div>{{ pokemon.base_experience }} XP</div>
            </div>    
            <div class="flex divide-y divide-light-blue-400 justify-between">
              <div>Height</div>
              <div>{{ pokemon.height / 10 }} m</div>
            </div>
            <div class="flex divide-y divide-light-blue-400 justify-between">
              <div>Weight</div>
              <div>{{ pokemon.weight / 10 }} kg</div>
            </div>

          </div>
          <div class="flex flex-col divide-y divide-blue-400 w-4/5 ml-2">
            <div class="mb-2 font-bold text-xl">Pokemon Stats</div>
            <div v-for="(value, index) in pokemon.stats" :key="index" 
              class="flex divide-y divide-light-blue-400 justify-between">
              <div>
                {{ value.stat.name }}
              </div>
              <div>
                {{ value.base_stat }}
              </div>
            </div>
          
          </div>

        </div>
        <div class="mt-2 font-bold text-xl">Pokemon Types</div>
        <div class="flex justify-start flex-wrap w-11/12 max-w-sm">
          <div class="mt-2 font-bold text-base capitalize mb-3 py-1 px-2" 
            v-for="(value, index) in pokemon.types"
            :key="index">
            <span :class="value.type.name" class="text-white p-3 rounded-3xl">
              {{ value.type.name }}
            </span>
          </div>
        </div>
        <div class="mt-2 font-bold text-xl">Abilities</div>
        <div class="flex justify-start flex-wrap w-11/12 max-w-sm">
          <div class="mt-2 font-bold text-base capitalize mb-3 py-1 px-2" 
            v-for="(value, index) in pokemon.abilities"
            :key="'value'+index">
            <span class="p-3 rounded-3xl border-black border-solid border">
              {{ value.ability.name }}
            </span>
          </div>
        </div>        
      </div>
      <h2 v-else>The pokemon was not found</h2>
      <button class="rounded bg-red-700 text-gray-200 mb-5 text-xl cursor-pointer px-5 py-3 over:-translate-y-2" @click="closeDetail">Close</button>
    </div>
    <i v-else class="fas fa-spinner fa-spin text-center text-3xl text-gray-200"></i>
  </div>
</template>

<script>
  import { ref, onMounted } from 'vue'
  export default {
    props: {
      pokemonUrl: String,
      imageUrl: String
    },
    setup(_props, {emit}){
      let show = ref(false)
      const pokemon = ref({})

      const fetchData = () => {
        let req = new Request(_props.pokemonUrl);
        fetch(req)
          .then((resp) => {
            if(resp.status === 200)
              return resp.json();
          })
          .then((data) => {
            pokemon.value = data
            show.value = true;
          })
          .catch((error) => {
            console.log(error);
          })
      }
      
      const closeDetail = () => {
        emit('closeDetail');
      }

      onMounted(() => {
        fetchData()
      })

      return {
        show,
        pokemon,
        fetchData,
        closeDetail
      }
    }
  }
</script>

<style lang="scss" scoped>
  .grass {background:rgb(3, 139, 44) !important;}
  .poison {background:rgb(74, 7, 105) !important;}
  .water {background:rgb(8, 135, 219) !important;}
  .dragon {background:rgb(27, 2, 68) !important;}
  .ice {background:rgb(78, 199, 255) !important;}
  .flying {background:rgb(145, 215, 255) !important;}
  .fire {background:rgb(238, 135, 17) !important;}
  .ghost {background:rgb(74, 52, 87) !important;}
  .fighting {background:rgb(122, 0, 0) !important;}
  .normal {background:rgb(104, 104, 104) !important;}
  .psychic {background:rgb(195, 0, 255) !important;}
  .bug {background:rgb(52, 87, 6) !important;}
  .dark {background:rgb(43, 43, 43) !important;}
  .steel {background:rgb(116, 116, 116) !important;}
  .fairy {background:rgb(248, 165, 237) !important;}
  .eletric {background:rgb(255, 217, 1) !important;}
  .rock {background:rgb(88, 95, 100) !important;}
  .ground {background:rgb(92, 70, 70) !important;}

</style>
