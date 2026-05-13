<template>
  <v-card :to="`/anime/${anime.mal_id}`" hover>
    <v-img
        :src="anime.images.webp.large_image_url"
        :alt="anime.title"
        height="400"
        cover
    />
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
    <v-card-actions>
      <v-spacer />
      <v-btn
          :icon="animeStore.isFavorite(anime) ? 'mdi-heart' : 'mdi-heart-outline'"
          :color="animeStore.isFavorite(anime) ? 'red' : ''"
          :class="{ 'favorite-active': isAnimating }"
          variant="text"
          @click.stop.prevent="handleToggleFavorite()"
      />
    </v-card-actions>
    <v-snackbar
        v-model="showSnackbar"
        :timeout="2000"
        color="primary"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </v-card>
</template>

<script setup>

import { useAnimeStore } from '@/stores/animeStore'
import {ref} from "vue";

const animeStore = useAnimeStore()
const showSnackbar = ref(false)

const { anime } = defineProps({
  anime: {
    type: Object,
    required: true,
  },
})

const snackbarMessage = ref('')
const isAnimating = ref(false)

function handleToggleFavorite() {
  const wasFavorite = animeStore.isFavorite(anime)
  animeStore.toggleFavorite(anime)
  snackbarMessage.value = wasFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris'
  showSnackbar.value = true

  isAnimating.value = true
  setTimeout(() => { isAnimating.value = false }, 600) // même durée que l'animation
}
</script>

<style scoped>
.favorite-active {
  animation: heartbeat 0.6s ease-in-out;
}

</style>