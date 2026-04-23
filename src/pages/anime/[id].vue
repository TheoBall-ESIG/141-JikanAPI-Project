<template>
  <v-container>
    <v-btn
        variant="text"
        prepend-icon="mdi-arrow-left"
        class="mb-4"
        @click="$router.back()"
    >
      Retour
    </v-btn>

    <v-alert
        v-if="!anime"
        type="error"
        variant="tonal"
    >
      Anime non trouvé.
    </v-alert>

    <v-card
        v-else
        max-width="1000"
        class="mx-auto"
    >
      <v-row no-gutters>
        <v-col cols="6">
          <v-img
              :src="anime.images.webp.large_image_url"
              :alt="anime.title"
              height="100%"
              cover
          />
        </v-col>

        <v-col cols="6">
          <v-card-title class="text-h4 text-wrap">
            {{ anime.title }}
          </v-card-title>

          <v-card-subtitle>
            Titre japonais : {{ anime.title_japanese }}
          </v-card-subtitle>
          <v-card-subtitle>
          Titre anglais : {{ anime.title_english }}
          </v-card-subtitle>
          <v-card-subtitle>
            Score : {{ anime.score }}
          </v-card-subtitle>
          <v-card-subtitle>
            Episodes : {{ anime.episodes }}
          </v-card-subtitle>
          <v-card-subtitle>
            Statut : {{ anime.status }}
          </v-card-subtitle>

        </v-col>
        <v-card-text>
          <p v-if="anime.synopsis" class="text-body-1 mb-4">
            {{ anime.synopsis }}
          </p>
        </v-card-text>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>

import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";

//const route = useRoute()

//const animes = ref([])
const loading = ref(false);
const error = ref(null);
/**
const anime = computed(() => {
  return animes.value.find(p => p.mal_id === Number(route.params.id))
})

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

const route = useRoute()
const animeStore = useAnimeStore()

const anime = computed(() => {
  return animeStore.getAnimeById(route.params.id)
})
</script>