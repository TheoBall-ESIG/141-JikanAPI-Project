<template>
  <v-container>
    <h1 class="text-h4 my-4">Liste anime</h1>

    <!-- Chargement (skeleton) -->
    <v-row v-if="loading">
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
          :key="anime.id"
          cols="12" sm="6" md="4" lg="3"
      >
        <v-card class="h-100">
          <v-img :src="anime.images.webp.large_image_url" :alt="anime.title" height="400" cover />
          <v-card-title>{{ anime.title }}</v-card-title>
          <v-card-text>
            <v-chip
                size="small"
                class="mr-2"
            >
              {{ anime.episodes }} episodes
            </v-chip>
            <v-chip size="small" variant="outlined">
              score : {{ anime.score }}
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// État réactif
const animes = ref([])
const loading = ref(true)
const error = ref(null)

// TODO : Charger les personnages depuis l'API Rick and Morty
// URL : https://rickandmortyapi.com/api/character
// La réponse contient { info: {...}, results: [...] }
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
</script>
