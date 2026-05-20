<template>
  <v-card :to="`/anime/${anime.mal_id}`" hover>

    <div style="position: relative">
      <v-img
          :src="anime.images.webp.large_image_url"
          :alt="anime.title"
          height="320"
          cover
      />

      <!-- Badge type — fond sombre pour lisibilité -->
      <v-chip
          v-if="anime.type"
          size="small"
          style="position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,0.65); color: white;"
      >
        {{ anime.type }}
      </v-chip>

      <!-- Badge score — fond sombre pour lisibilité -->
      <v-chip
          v-if="anime.score"
          size="small"
          prepend-icon="mdi-star"
          style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.65); color: white;"
      >
        {{ anime.score }}
      </v-chip>
    </div>

    <v-card-title class="text-body-1 font-weight-bold text-wrap pb-1">
      {{ anime.title }}
    </v-card-title>

    <v-card-text class="pt-1 pb-2">
      <!-- Année + épisodes -->
      <div class="d-flex align-center mb-2 text-caption text-medium-emphasis">
        <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
        {{ anime.year ?? '—' }}
        <span class="mx-2">·</span>
        <v-icon size="14" class="mr-1">mdi-television-play</v-icon>
        {{ anime.episodes ? `${anime.episodes} ép.` : '—' }}
      </div>

      <!-- Genres + favori sur la même ligne -->
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex flex-wrap gap-1">
          <v-chip
              v-for="genre in anime.genres?.slice(0, 3)"
              :key="genre.mal_id"
              size="x-small"
              variant="outlined"
              color="primary"
          >
            {{ genre.name }}
          </v-chip>
        </div>

        <!-- Bouton favori aligné avec les genres -->
        <v-btn
            :icon="animeStore.isFavorite(anime) ? 'mdi-heart' : 'mdi-heart-outline'"
            :color="animeStore.isFavorite(anime) ? 'secondary' : ''"
            :class="{ 'favorite-active': isAnimating }"
            variant="text"
            size="small"
            @click.stop.prevent="handleToggleFavorite()"
        />
      </div>
    </v-card-text>

    <v-snackbar v-model="showSnackbar" :timeout="2000" color="primary">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-card>
</template>

<script setup>
import { useAnimeStore } from '@/stores/animeStore'
import { ref } from 'vue'

const animeStore = useAnimeStore()
const showSnackbar = ref(false)
const snackbarMessage = ref('')
const isAnimating = ref(false)

const { anime } = defineProps({
  anime: { type: Object, required: true },
})

function handleToggleFavorite() {
  const wasFavorite = animeStore.isFavorite(anime)
  animeStore.toggleFavorite(anime)
  snackbarMessage.value = wasFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris'
  showSnackbar.value = true
  isAnimating.value = true
  setTimeout(() => { isAnimating.value = false }, 600)
}
</script>

<style scoped>
.favorite-active {
  animation: heartbeat 0.6s ease-in-out;
}
</style>