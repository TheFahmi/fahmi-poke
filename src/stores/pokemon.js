import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePokemonStore = defineStore('pokemon', () => {
  const pokemons = ref([])
  const favorites = ref([])
  const pokemonTypes = ref([])
  const selectedType = ref('')
  const isLoading = ref(false)
  const error = ref(null)
  const nextUrl = ref('')

  // Use a CORS proxy if needed
  const API_URL = 'https://pokeapi.co/api/v2/'
  const IMAGE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'

  // Computed properties
  const filteredPokemons = computed(() => {
    // Debug filtering process
    console.log('Filtering pokemons, current selectedType:', selectedType.value);
    console.log('Current pokemons count:', pokemons.value ? pokemons.value.length : 0);
    
    if (!selectedType.value) {
      console.log('No type filter, returning all', pokemons.value ? pokemons.value.length : 0, 'pokemons');
      return pokemons.value || [];
    }

    const filtered = pokemons.value ? pokemons.value.filter(pokemon => {
      if (!pokemon || !pokemon.types) return false;
      return pokemon.types.some(type => type.type?.name === selectedType.value);
    }) : [];
    
    console.log('Filtered pokemons by type', selectedType.value, ':', filtered.length, 'pokemons');
    return filtered;
  })

  const isFavorite = (id) => {
    return favorites.value.some(fav => fav.id === id)
  }
  
  // Initialization - load favorites from localStorage on startup
  const init = () => {
    try {
      console.log('🚀 Initializing Pokemon store...')
      console.log('Store state:', { 
        pokemonsLength: pokemons.value?.length || 0,
        typesLength: pokemonTypes.value?.length || 0,
        isLoading: isLoading.value,
        hasError: !!error.value
      })
      
      // Load favorites first
      loadFavorites()
      
      // Reset state to ensure clean start
      isLoading.value = true
      selectedType.value = ''
      error.value = null
      
      // Selalu muat data pokemon saat init - force reactive update
      pokemons.value = []
      nextUrl.value = ''
      
      // Immediately load data
      console.log('🔄 Loading initial Pokemon data')
      
      // Dispatch fetches - don't await to avoid blocking
      setTimeout(() => {
        console.log('📦 Dispatching fetchPokemons...')
        fetchPokemons()
          .then(() => console.log('✅ Initial Pokemon loaded:', pokemons.value.length))
          .catch(e => {
            console.error('❌ Failed initial Pokemon load:', e)
            // Force fallback on error
            if (!pokemons.value.length) {
              console.log('💢 Auto-loading fallback data after fetch error')
              loadFallbackData()
            }
          })
      }, 0)
      
      setTimeout(() => {
        console.log('📦 Dispatching fetchPokemonTypes...')
        fetchPokemonTypes()
          .then(() => console.log('✅ Initial types loaded:', pokemonTypes.value.length))
          .catch(e => console.error('❌ Failed initial types load:', e))
      }, 0)
      
      // Signal that initialization has completed
      console.log('🏁 Store initialization dispatched')
      
      // Also setup a safety timer to verify data was loaded
      setTimeout(() => {
        console.log('⏱️ Safety timer checking data...')
        if (!pokemons.value || pokemons.value.length === 0) {
          console.warn('⚠️ Safety timer: No Pokemon data loaded after 5s, loading fallback data')
          loadFallbackData()
        } else {
          console.log('✅ Safety timer: Data already loaded:', pokemons.value.length, 'Pokemon')
        }
      }, 5000)
      
      return true
    } catch (error) {
      console.error('💥 Error during store initialization:', error)
      // Load fallback data jika gagal
      loadFallbackData()
      return false
    }
  }

  // Actions
  // Fallback data in case API fails
  function loadFallbackData() {
    console.log('🔶 Loading fallback data...')
    // Pastikan kita berhenti loading
    isLoading.value = false
    
    // Definisi data darurat yang pasti bekerja
    const fallbackPokemons = [
      {
        id: '1',
        name: 'bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon/1/',
        types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
        sprites: {
          front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
          other: {
            'official-artwork': {
              front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
            }
          }
        },
        isLike: false
      },
      {
        id: '4',
        name: 'charmander',
        url: 'https://pokeapi.co/api/v2/pokemon/4/',
        types: [{ type: { name: 'fire' } }],
        sprites: {
          front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
          other: {
            'official-artwork': {
              front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png'
            }
          }
        },
        isLike: false
      },
      {
        id: '7',
        name: 'squirtle',
        url: 'https://pokeapi.co/api/v2/pokemon/7/',
        types: [{ type: { name: 'water' } }],
        sprites: {
          front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
          other: {
            'official-artwork': {
              front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png'
            }
          }
        },
        isLike: false
      },
      {
        id: '25',
        name: 'pikachu',
        url: 'https://pokeapi.co/api/v2/pokemon/25/',
        types: [{ type: { name: 'electric' } }],
        sprites: {
          front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
          other: {
            'official-artwork': {
              front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
            }
          }
        },
        isLike: false
      },
      {
        id: '133',
        name: 'eevee',
        url: 'https://pokeapi.co/api/v2/pokemon/133/',
        types: [{ type: { name: 'normal' } }],
        sprites: {
          front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png',
          other: {
            'official-artwork': {
              front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png'
            }
          }
        },
        isLike: false
      }
    ]

    try {
      // 0. Log state awal untuk debugging
      console.log('💾 State awal pokemons:', {
        isArray: Array.isArray(pokemons.value),
        length: pokemons.value?.length || 0,
        isNull: pokemons.value === null,
        isUndefined: pokemons.value === undefined,
      })
      
      // 1. Pastikan pokemons.value adalah array - ini paling penting
      if (!Array.isArray(pokemons.value)) {
        console.log('⚠️ pokemons.value bukan array, membuat array baru')
        pokemons.value = []
      }
      
      // 2. Reset array (paling aman)
      pokemons.value.length = 0
      
      // 3. Coba beberapa pendekatan untuk memperbarui data
      
      // Approach 1: Push individual items
      try {
        console.log('Mencoba pendekatan 1: Push item satu per satu')
        for (const pokemon of fallbackPokemons) {
          pokemons.value.push({...pokemon})
        }
        console.log('✓ Pendekatan 1 berhasil, pokemons.length:', pokemons.value.length)
      } catch (err1) {
        console.error('✗ Pendekatan 1 gagal:', err1)
        
        // Approach 2: Direct assignment with spread 
        try {
          console.log('Mencoba pendekatan 2: Penugasan langsung dengan spread')
          pokemons.value = [...fallbackPokemons]
          console.log('✓ Pendekatan 2 berhasil, pokemons.length:', pokemons.value.length)
        } catch (err2) {
          console.error('✗ Pendekatan 2 gagal:', err2)
          
          // Approach 3: Direct assignment without spread
          try {
            console.log('Mencoba pendekatan 3: Penugasan langsung tanpa spread')
            pokemons.value = fallbackPokemons
            console.log('✓ Pendekatan 3 berhasil, pokemons.length:', pokemons.value.length)
          } catch (err3) {
            console.error('✗ Pendekatan 3 gagal:', err3)
            
            // Approach 4: $patch (Pinia method)
            try {
              console.log('Mencoba pendekatan 4: $patch Pinia')
              this.$patch({ pokemons: fallbackPokemons })
              console.log('✓ Pendekatan 4 berhasil, pokemons.length:', pokemons.value.length)
            } catch (err4) {
              console.error('✗ Pendekatan 4 gagal:', err4)
              
              // Final approach: Global direct assignment
              try {
                console.log('Mencoba pendekatan darurat: Global assignment')
                // Buat store baru dan set pokemons
                const tempStore = usePokemonStore()
                tempStore.pokemons = fallbackPokemons
                console.log('✓ Pendekatan global berhasil, length:', tempStore.pokemons.length)
              } catch (finalErr) {
                console.error('💥 Semua pendekatan gagal:', finalErr)
                throw new Error('Tidak dapat memuat data fallback dengan cara apapun')
              }
            }
          }
        }
      }
      
      // Jika sampai disini, setidaknya salah satu pendekatan berhasil
      console.log('🟢 Fallback data berhasil dimuat')
      
      // Juga muat tipe darurat
      if (!pokemonTypes.value || !Array.isArray(pokemonTypes.value) || pokemonTypes.value.length === 0) {
        console.log('Loading fallback types...')
        const fallbackTypes = [
          { "name": "normal", "url": "https://pokeapi.co/api/v2/type/1/" },
          { "name": "fire", "url": "https://pokeapi.co/api/v2/type/10/" },
          { "name": "water", "url": "https://pokeapi.co/api/v2/type/11/" },
          { "name": "grass", "url": "https://pokeapi.co/api/v2/type/12/" },
          { "name": "electric", "url": "https://pokeapi.co/api/v2/type/13/" }
        ]
        
        try {
          pokemonTypes.value = fallbackTypes
        } catch (typeErr) {
          console.error('Error setting fallback types:', typeErr)
          // Force dengan approach alternatif
          this.$patch({ pokemonTypes: fallbackTypes })
        }
      }
      
      // Pastikan pokemons dan types sudah diatur
      const success = pokemons.value && Array.isArray(pokemons.value) && pokemons.value.length > 0
      
      // Make sure isLoading is set to false
      isLoading.value = false
      
      // Umumkan ke DOM bahwa data telah dimuat (untuk debugging)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('pokemon-fallback-loaded', { 
          detail: { success, count: pokemons.value?.length || 0 } 
        }))
      }
      
      return success ? pokemons.value : []
    } catch (err) {
      console.error('💥 Error kritis saat memuat data fallback:', err)
      
      // Ultimate fallback - definisi dan assignment sederhana
      try {
        console.log('⚡ Mencoba penugasan Pikachu darurat...')
        const emergencyPikachu = {
          id: '25',
          name: 'pikachu (super emergency)',
          types: [{ type: { name: 'electric' } }],
          sprites: {
            front_default: `${IMAGE_URL}25.png`,
            other: {
              'official-artwork': {
                front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png`
              }
            }
          },
          isLike: false
        }
        
        // Buat array baru dan setel dengan tegas
        pokemons.value = [emergencyPikachu]
        
        // Pastikan masih meload
        isLoading.value = false
        
        // Notifikasi global untuk debugging
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('pokemon-emergency-loaded'))
        }
        
        return pokemons.value
      } catch (ultimateError) {
        console.error('💥💥 KRITIS: Bahkan Pikachu darurat gagal:', ultimateError)
        
        // Notifikasi kegagalan global untuk debugging
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('pokemon-loading-failed'))
        }
        
        // Kembalikan array kosong daripada gagal 
        return []
      }
    }
  }

  async function fetchPokemons() {
    console.log('Fetching Pokémon...')
    isLoading.value = true
    error.value = null

    try {
      // Determine the URL to fetch from
      const url = nextUrl.value || `${API_URL}pokemon?limit=20&offset=0`
      console.log('Fetching from URL:', url)

      // Fetch the data from the API
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch Pokémon: ${response.status}`)
      }

      const pokemonData = await response.json()
      
      // Validate the data structure
      if (!pokemonData || !pokemonData.results || !Array.isArray(pokemonData.results)) {
        throw new Error('Invalid Pokemon data structure received from API')
      }
      
      console.log('Fetched data:', pokemonData)

      // Update the next URL for pagination
      nextUrl.value = pokemonData.next

      // Process each Pokemon
      const newPokemons = []
      const fetchPromises = []

      // First, create all the Pokemon with basic data
      for (const pokemon of pokemonData.results) {
        if (!pokemon || !pokemon.url) continue; // Skip invalid entries
        
        const id = pokemon.url
          .split('/')
          .filter(part => !!part)
          .pop()
        
        if (!id) continue; // Skip if we couldn't extract an ID

        // Create a basic Pokemon object with fallback data
        let types = []

        // Assign estimated types based on ID ranges (simplified fallback)
        if (id <= 3) {
          types = [{ type: { name: 'grass' } }, { type: { name: 'poison' } }]
        } else if (id <= 6) {
          types = [{ type: { name: 'fire' } }]
          if (id == 6) types.push({ type: { name: 'flying' } })
        } else if (id <= 9) {
          types = [{ type: { name: 'water' } }]
        } else if (id <= 12) {
          types = [{ type: { name: 'bug' } }]
          if (id == 12) types.push({ type: { name: 'flying' } })
        } else if (id <= 15) {
          types = [{ type: { name: 'bug' } }, { type: { name: 'poison' } }]
        } else if (id <= 18) {
          types = [{ type: { name: 'normal' } }, { type: { name: 'flying' } }]
        } else if (id <= 20) {
          types = [{ type: { name: 'normal' } }]
        } else {
          types = [{ type: { name: 'normal' } }] // Default type
        }

        // Create the Pokemon with basic data
        const basicPokemon = {
          ...pokemon,
          id,
          types,
          sprites: {
            front_default: `${IMAGE_URL}${id}.png`,
            other: {
              'official-artwork': {
                front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
              }
            }
          },
          // Tambahkan fallback untuk height dan weight
          height: 10, // default 1.0m
          weight: 100, // default 10.0kg
          isLike: isFavorite(id)
        }

        // Add to the list immediately
        newPokemons.push(basicPokemon)

        // Create a promise to fetch detailed data
        const fetchDetailPromise = fetch(pokemon.url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors',
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to fetch details for ${pokemon.name}`)
            }
            return response.json()
          })
          .then(detailData => {
            // Update the Pokemon with detailed data
            if (detailData && detailData.types) {
              basicPokemon.types = detailData.types
            }
            if (detailData && detailData.sprites) {
              basicPokemon.sprites = detailData.sprites
            }
            // Tambahkan data height dan weight dari API
            if (detailData && detailData.height !== undefined) {
              basicPokemon.height = detailData.height
            }
            if (detailData && detailData.weight !== undefined) {
              basicPokemon.weight = detailData.weight
            }
            // Tambahkan data abilities dan stats jika ada
            if (detailData && detailData.abilities) {
              basicPokemon.abilities = detailData.abilities
            }
            if (detailData && detailData.stats) {
              basicPokemon.stats = detailData.stats
            }
            if (detailData && detailData.base_experience !== undefined) {
              basicPokemon.base_experience = detailData.base_experience
            }
            // Tambahkan data moves, game_indices dan data lainnya
            if (detailData && detailData.moves) {
              basicPokemon.moves = detailData.moves
            }
            if (detailData && detailData.game_indices) {
              basicPokemon.game_indices = detailData.game_indices
            }
            if (detailData && detailData.order !== undefined) {
              basicPokemon.order = detailData.order
            }
            if (detailData && detailData.is_default !== undefined) {
              basicPokemon.is_default = detailData.is_default
            }
            if (detailData && detailData.species) {
              basicPokemon.species = detailData.species
            }
            console.log(`Updated details for ${pokemon.name}`)
          })
          .catch(error => {
            console.error(`Error fetching details for ${pokemon.name}:`, error)
            // Keep the fallback data
          })

        fetchPromises.push(fetchDetailPromise)
      }

      // Add all the Pokemon to the list immediately  
      if (newPokemons.length > 0) {
        console.log('New Pokémon with basic data:', newPokemons.length)
        // Force reactive update with new array assignment
        if (nextUrl.value && nextUrl.value.includes('offset=')) {
          // Append if this is pagination (not first page)
          pokemons.value = [...pokemons.value, ...newPokemons]
        } else {
          // Replace if this is the first page
          pokemons.value = [...newPokemons]
        }
        
        // Explicitly log the state to check reactivity
        console.log('Updated pokemons array:', pokemons.value.length, 'items')
        console.log('First few pokemon:', pokemons.value.slice(0, 3))
      } else {
        console.warn('No valid Pokemon data found in API response')
        if (pokemons.value.length === 0) {
          loadFallbackData()
        }
      }

      // Then fetch the details in the background
      // This ensures the UI shows something immediately
      Promise.allSettled(fetchPromises).then(() => {
        console.log('All Pokemon details fetched or fallback used')
        // Force a reactive update by creating a shallow copy
        pokemons.value = [...pokemons.value]
      })
    } catch (err) {
      error.value = err.message
      console.error('Error processing Pokemon data:', err)

      // Load fallback data if processing fails
      if (pokemons.value.length === 0) {
        loadFallbackData()
      }
    } finally {
      isLoading.value = false
    }
  }

  async function fetchPokemonTypes() {
    try {
      console.log('Fetching Pokémon types from API...')
      
      if (pokemonTypes.value && pokemonTypes.value.length > 0) {
        console.log('Types already loaded:', pokemonTypes.value.length)
        return pokemonTypes.value
      }

      // Coba ambil dari API
      const response = await fetch('https://pokeapi.co/api/v2/type')
      
      if (!response.ok) {
        throw new Error('Failed to fetch Pokémon types')
      }
      
      const data = await response.json()
      console.log('Fetched', data.results.length, 'Pokémon types:', data)
      
      // Filter tipe utama, tidak termasuk 'shadow' dan 'unknown'
      const mainTypes = data.results.filter(type => 
        !['shadow', 'unknown'].includes(type.name)
      )
      
      console.log('Filtered main types:', mainTypes)
      
      pokemonTypes.value = mainTypes
      console.log('Updated pokemonTypes.value:', pokemonTypes.value)
      
      return mainTypes
    } catch (error) {
      console.error('Error fetching Pokémon types:', error)
      
      // Jika gagal, gunakan fallback tipe
      console.log('Using fallback Pokémon types')
      const fallbackTypes = [
        { "name": "normal", "url": "https://pokeapi.co/api/v2/type/1/" },
        { "name": "fighting", "url": "https://pokeapi.co/api/v2/type/2/" },
        { "name": "flying", "url": "https://pokeapi.co/api/v2/type/3/" },
        { "name": "poison", "url": "https://pokeapi.co/api/v2/type/4/" },
        { "name": "ground", "url": "https://pokeapi.co/api/v2/type/5/" },
        { "name": "rock", "url": "https://pokeapi.co/api/v2/type/6/" },
        { "name": "bug", "url": "https://pokeapi.co/api/v2/type/7/" },
        { "name": "ghost", "url": "https://pokeapi.co/api/v2/type/8/" },
        { "name": "steel", "url": "https://pokeapi.co/api/v2/type/9/" },
        { "name": "fire", "url": "https://pokeapi.co/api/v2/type/10/" },
        { "name": "water", "url": "https://pokeapi.co/api/v2/type/11/" },
        { "name": "grass", "url": "https://pokeapi.co/api/v2/type/12/" },
        { "name": "electric", "url": "https://pokeapi.co/api/v2/type/13/" },
        { "name": "psychic", "url": "https://pokeapi.co/api/v2/type/14/" },
        { "name": "ice", "url": "https://pokeapi.co/api/v2/type/15/" },
        { "name": "dragon", "url": "https://pokeapi.co/api/v2/type/16/" },
        { "name": "dark", "url": "https://pokeapi.co/api/v2/type/17/" },
        { "name": "fairy", "url": "https://pokeapi.co/api/v2/type/18/" }
      ]
      
      pokemonTypes.value = fallbackTypes
      return fallbackTypes
    }
  }

  async function fetchPokemonByType(type) {
    console.log(`Filtering Pokémon by type: ${type}`);
    isLoading.value = true;
    error.value = null;
    selectedType.value = type;

    try {
      if (type) {
        // Fetch Pokémon by type from the API
        const response = await fetch(`${API_URL}type/${type}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch Pokémon of type ${type}`);
        }

        const data = await response.json();
        console.log(`Found ${data.pokemon?.length || 0} Pokémon of type ${type}`);

        // Process each Pokémon (limit to first 20 for performance)
        const typePokemons = [];
        const fetchPromises = [];
        
        // Ensure we have valid data
        if (!data.pokemon || !Array.isArray(data.pokemon)) {
          throw new Error(`Invalid data structure for type ${type}`);
        }
        
        const limit = Math.min(data.pokemon.length, 20);

        for (let i = 0; i < limit; i++) {
          const item = data.pokemon[i];
          if (!item || !item.pokemon || !item.pokemon.url) continue;
          
          const pokemon = item.pokemon;
          const id = pokemon.url
            .split('/')
            .filter(part => !!part)
            .pop();
            
          if (!id) continue;

          // Create a basic Pokemon object with fallback data
          const basicPokemon = {
            ...pokemon,
            id,
            types: [{ type: { name: type } }], // We know at least this type
            sprites: {
              front_default: `${IMAGE_URL}${id}.png`,
              other: {
                'official-artwork': {
                  front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
                }
              }
            },
            // Tambahkan fallback untuk height dan weight
            height: 10, // default 1.0m
            weight: 100, // default 10.0kg
            isLike: isFavorite(id)
          };

          // Add to the list immediately
          typePokemons.push(basicPokemon);

          // Create a promise to fetch detailed data
          const fetchDetailPromise = fetch(pokemon.url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
            mode: 'cors',
          })
            .then(response => {
              if (!response.ok) {
                throw new Error(`Failed to fetch details for ${pokemon.name}`);
              }
              return response.json();
            })
            .then(detailData => {
              // Update the Pokemon with detailed data
              if (detailData && detailData.types) {
                basicPokemon.types = detailData.types;
              }
              if (detailData && detailData.sprites) {
                basicPokemon.sprites = detailData.sprites;
              }
              // Tambahkan data height dan weight dari API
              if (detailData && detailData.height !== undefined) {
                basicPokemon.height = detailData.height
              }
              if (detailData && detailData.weight !== undefined) {
                basicPokemon.weight = detailData.weight
              }
              // Tambahkan data abilities dan stats jika ada
              if (detailData && detailData.abilities) {
                basicPokemon.abilities = detailData.abilities
              }
              if (detailData && detailData.stats) {
                basicPokemon.stats = detailData.stats
              }
              if (detailData && detailData.base_experience !== undefined) {
                basicPokemon.base_experience = detailData.base_experience
              }
              // Tambahkan data moves, game_indices dan data lainnya
              if (detailData && detailData.moves) {
                basicPokemon.moves = detailData.moves
              }
              if (detailData && detailData.game_indices) {
                basicPokemon.game_indices = detailData.game_indices
              }
              if (detailData && detailData.order !== undefined) {
                basicPokemon.order = detailData.order
              }
              if (detailData && detailData.is_default !== undefined) {
                basicPokemon.is_default = detailData.is_default
              }
              if (detailData && detailData.species) {
                basicPokemon.species = detailData.species
              }
              console.log(`Updated details for ${pokemon.name}`);
            })
            .catch(error => {
              console.error(`Error fetching details for ${pokemon.name}:`, error);
              // Keep the fallback data
            });

          fetchPromises.push(fetchDetailPromise);
        }

        // Only update if we have data
        if (typePokemons.length > 0) {
          // Replace the current Pokémon list with the filtered ones
          pokemons.value = typePokemons;
          console.log(`Updated pokemons array with ${typePokemons.length} type-filtered Pokémon`);
        } else {
          console.warn(`No Pokémon found for type ${type}, using fallback data`);
          // Use fallback data if no pokemons found
          if (pokemons.value.length === 0) {
            loadFallbackData();
          }
        }

        // Then fetch the details in the background
        Promise.allSettled(fetchPromises).then(() => {
          console.log('All type-filtered Pokemon details fetched or fallback used');
          // Force reactive update
          pokemons.value = [...pokemons.value];
        });
      } else {
        // If no type is selected, reset and fetch all Pokémon
        pokemons.value = [];
        await fetchPokemons();
      }

      console.log(`Set selected type to: ${selectedType.value}`);
      console.log(`Filtered Pokémon count: ${filteredPokemons.value.length}`);
    } catch (err) {
      error.value = err.message;
      console.error(`Error filtering Pokémon of type ${type}:`, err);

      // Fallback to computed filtering if API fails
      if (pokemons.value.length === 0) {
        await fetchPokemons();
      }
    } finally {
      isLoading.value = false;
    }
  }

  async function searchPokemon(query) {
    console.log(`Searching for Pokémon: ${query}`);
    isLoading.value = true;
    error.value = null;

    try {
      if (!query || typeof query !== 'string') {
        throw new Error('Invalid search query');
      }
      
      // First check if we already have this Pokémon in our list
      const searchLower = query.toLowerCase();
      let foundPokemon = pokemons.value.find(p =>
        p.name.toLowerCase() === searchLower || p.id === searchLower
      );

      if (!foundPokemon) {
        // Try to fetch directly from the API by name or ID
        try {
          const response = await fetch(`${API_URL}pokemon/${searchLower}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
            mode: 'cors',
          });

          if (!response.ok) {
            throw new Error(`Pokémon "${query}" not found`);
          }

          const data = await response.json();
          
          if (!data || !data.id) {
            throw new Error('Invalid pokemon data returned from API');
          }

          foundPokemon = {
            name: data.name,
            url: `${API_URL}pokemon/${data.id}`,
            id: data.id.toString(),
            types: data.types || [{ type: { name: 'normal' } }],
            sprites: data.sprites || {
              front_default: `${IMAGE_URL}${data.id}.png`,
              other: {
                'official-artwork': {
                  front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`
                }
              }
            },
            isLike: isFavorite(data.id.toString())
          };

          // Add to the beginning of the list if not already present
          if (!pokemons.value.some(p => p.id === foundPokemon.id)) {
            pokemons.value = [foundPokemon, ...pokemons.value];
          }
        } catch (apiError) {
          console.error('API search failed:', apiError);

          // If API fails, try to find by ID if it's a number
          const id = parseInt(query);
          if (!isNaN(id) && id >= 1 && id <= 898) {
            // Create a new Pokémon entry with this ID as fallback
            foundPokemon = {
              name: `pokemon-${id}`, // We don't know the actual name
              url: `${API_URL}pokemon/${id}`,
              id: id.toString(),
              types: [{ type: { name: 'normal' } }], // Default type
              sprites: {
                front_default: `${IMAGE_URL}${id}.png`,
                other: {
                  'official-artwork': {
                    front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
                  }
                }
              },
              isLike: isFavorite(id.toString())
            };

            // Add to the beginning of the list
            pokemons.value = [foundPokemon, ...pokemons.value];
          } else {
            throw new Error(`Pokémon "${query}" not found`);
          }
        }
      }

      console.log('Found Pokémon:', foundPokemon);
      return foundPokemon;
    } catch (err) {
      error.value = err.message;
      console.error('Error searching Pokémon:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  function toggleFavorite(pokemon) {
    console.log('Toggle favorite for:', pokemon.name, 'ID:', pokemon.id)
    
    // Cari di favorites berdasarkan ID
    const index = favorites.value.findIndex(fav => fav.id === pokemon.id)
    
    // Update status isLike di objek pokemon yang dikirim
    pokemon.isLike = index === -1

    if (index === -1) {
      // Add to favorites - pastikan isLike sudah true
      console.log('Adding to favorites:', pokemon.name)
      favorites.value.push({
        ...pokemon,
        isLike: true
      })
    } else {
      // Remove from favorites
      console.log('Removing from favorites:', pokemon.name)
      favorites.value.splice(index, 1)
    }

    // Update isLike property in pokemons array
    const pokemonIndex = pokemons.value.findIndex(p => p.id === pokemon.id)
    if (pokemonIndex !== -1) {
      console.log('Updating isLike in pokemons array for:', pokemon.name, 'to:', index === -1)
      pokemons.value[pokemonIndex].isLike = index === -1
    } else {
      console.log('Pokemon not found in pokemons array:', pokemon.name)
    }

    // Save to localStorage
    localStorage.setItem('pokemonFavorites', JSON.stringify(favorites.value))
    
    console.log('Favorites after toggle:', favorites.value.length)
    
    // Return the new status untuk convenience
    return index === -1
  }

  function loadFavorites() {
    try {
      console.log('Loading favorites from localStorage')
      const storedFavorites = localStorage.getItem('pokemonFavorites')
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites)
        if (Array.isArray(parsedFavorites)) {
          favorites.value = parsedFavorites
          console.log(`Loaded ${parsedFavorites.length} favorites from localStorage`)
        } else {
          console.warn('Invalid favorites data in localStorage, using empty array')
          favorites.value = []
        }
      } else {
        console.log('No favorites found in localStorage')
        favorites.value = []
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
      favorites.value = []
    }
  }

  function resetFilters() {
    try {
      console.log('Resetting filters...')
      // Reset filter
      selectedType.value = ''
      // Reset data pokemon
      pokemons.value = []
      nextUrl.value = ''
      // Muat ulang data
      fetchPokemons()
      console.log('Filters reset completed')
    } catch (error) {
      console.error('Error resetting filters:', error)
      // Coba gunakan data fallback jika reset gagal
      loadFallbackData()
    }
  }

  return {
    pokemons,
    favorites,
    pokemonTypes,
    selectedType,
    isLoading,
    error,
    nextUrl,
    filteredPokemons,
    API_URL,
    IMAGE_URL,
    fetchPokemons,
    fetchPokemonTypes,
    fetchPokemonByType,
    searchPokemon,
    toggleFavorite,
    loadFavorites,
    resetFilters,
    isFavorite,
    loadFallbackData,
    init
  }
})
