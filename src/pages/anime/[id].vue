<template>
  <v-container>
    <v-btn variant="text" prepend-icon="mdi-arrow-left" class="mb-4" @click="$router.back()">
      Retour
    </v-btn>

    <v-alert v-if="!anime" type="error" variant="tonal">
      Anime non trouvé.
    </v-alert>

    <v-card v-else max-width="1000" class="mx-auto">
      <v-row no-gutters>

        <!-- IMAGE -->
        <!-- Paysage : pleine largeur -->
        <v-col v-if="isLandscape" cols="12">
          <v-img
              :src="anime.images.webp.large_image_url"
              :alt="anime.title"
              max-height="400"
              contain
          />
        </v-col>

        <!-- Portrait : demi-largeur sur sm+, pleine largeur sur mobile -->
        <v-col v-else cols="12" sm="5">
          <v-img
              :src="anime.images.webp.large_image_url"
              :alt="anime.title"
              :aspect-ratio="3/4"
              contain
          />
        </v-col>

        <!-- INFOS -->
        <!-- S'adapte selon le layout -->
        <v-col :cols="isLandscape ? 12 : undefined" :sm="isLandscape ? 12 : 7">
          <v-card-title class="text-h5 text-wrap py-4">
            {{ anime.title }}
          </v-card-title>
          <v-card-subtitle style="white-space: normal; opacity: 1" class="pb-1">
            Titre japonais : {{ anime.title_japanese }}
          </v-card-subtitle>
          <v-card-subtitle style="white-space: normal; opacity: 1" class="pb-1">
            Titre anglais : {{ anime.title_english }}
          </v-card-subtitle>
          <v-card-subtitle style="white-space: normal; opacity: 1" class="pb-1">
            Score : {{ anime.score }}
          </v-card-subtitle>
          <v-card-subtitle style="white-space: normal; opacity: 1" class="pb-1">
            Episodes : {{ anime.episodes }}
          </v-card-subtitle>
          <v-card-subtitle style="white-space: normal; opacity: 1" class="pb-1">
            Statut : {{ anime.status }}
          </v-card-subtitle>
        </v-col>

        <!-- SYNOPSIS : toujours pleine largeur -->
        <v-col cols="12">
          <v-card-text>
            <p v-if="anime.synopsis" class="text-body-1">
              {{ anime.synopsis }}
            </p>
          </v-card-text>
        </v-col>

      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import { useAnimeStore } from '@/stores/animeStore'
import { useRoute } from 'vue-router'
import { computed, ref, watch } from 'vue'

const route = useRoute()
const animeStore = useAnimeStore()

const anime = computed(() => animeStore.getAnimeById(route.params.id))

// true si l'image est trop large pour le layout deux colonnes
const isLandscape = ref(false)

// On vérifie le ratio dès que l'anime est disponible
watch(anime, (val) => {
  if (!val) return
  const img = new Image()
  img.onload = () => {
    isLandscape.value = (img.naturalWidth / img.naturalHeight) > 0.8
  }
  img.src = val.images.webp.large_image_url
}, { immediate: true })
</script>