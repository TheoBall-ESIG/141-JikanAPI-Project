<template>
  <v-container>
    <h1 class="text-h4 my-4">Liste anime</h1>

    <!-- Chargement (skeleton) -->
    <v-row v-if="isLoading">
      <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader type="image, heading, text" />
      </v-col>
    </v-row>

    <!-- Erreur -->
    <v-alert v-else-if="error" type="error" class="my-4">
      {{ error }}
    </v-alert>

    <!-- TODO : Liste des animes -->
    <v-row v-else>
      <v-col
          v-for="anime in animes"
          :key="anime.mal_id"
          cols="12" sm="6" md="4" lg="3"
      >
        <anime-card :anime="anime" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AnimeCard from "@/components/AnimeCard.vue";

// État réactif
//const animes = ref([])

// TODO : Charger les personnages depuis l'API Rick and Morty
// URL : https://rickandmortyapi.com/api/character
// La réponse contient { info: {...}, results: [...] }
/**
onMounted(async () => {
  try {
    const response = await fetch('https://api.jikan.moe/v4/anime?q=bleach&sfw')

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`)
    }

    const data = await response.json()
    animes.value = data.data

  } catch (err) {
    error.value = `Impossible de charger les animes : ${err.message}`
  } finally {
    loading.value = false
  }
})
*/

import { useAnimeStore } from '@/stores/animeStore'
import { storeToRefs } from 'pinia'

const animeStore = useAnimeStore()
const { animes, isLoading, error } = storeToRefs(animeStore)
</script>
