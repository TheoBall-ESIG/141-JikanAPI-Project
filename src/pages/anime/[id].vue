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

        <!-- IMAGE paysage -->
        <v-col v-if="isLandscape" cols="12">
          <v-img
              :src="anime.images.webp.large_image_url"
              :alt="anime.title"
              max-height="400"
              contain
          />
        </v-col>

        <!-- IMAGE portrait -->
        <v-col v-else cols="12" sm="5">
          <v-img
              :src="anime.images.webp.large_image_url"
              :alt="anime.title"
              :aspect-ratio="3/4"
              contain
          />
        </v-col>

        <!-- INFOS -->
        <v-col :cols="isLandscape ? 12 : undefined" :sm="isLandscape ? 12 : 7">

          <!-- Titre + favori -->
          <div class="d-flex align-center px-4 pt-4 pb-2">
            <div class="flex-grow-1">
              <h1 class="text-h5 font-weight-bold text-wrap">{{ anime.title }}</h1>
              <div v-if="anime.title_english && anime.title_english !== anime.title"
                   class="text-caption text-medium-emphasis mt-1">
                {{ anime.title_english }}
              </div>
              <div v-if="anime.title_japanese" class="text-caption text-medium-emphasis">
                {{ anime.title_japanese }}
              </div>
            </div>
            <v-btn
                :icon="animeStore.isFavorite(anime) ? 'mdi-heart' : 'mdi-heart-outline'"
                :color="animeStore.isFavorite(anime) ? 'secondary' : ''"
                variant="text"
                @click="animeStore.toggleFavorite(anime)"
            />
          </div>

          <!-- Badges type + statut + rating -->
          <div class="d-flex flex-wrap gap-2 px-4 pb-3">
            <v-chip v-if="anime.type" size="small" color="primary">
              {{ anime.type }}
            </v-chip>
            <v-chip v-if="anime.status" size="small" :color="statusColor">
              {{ anime.status }}
            </v-chip>
            <v-chip v-if="anime.rating" size="small" variant="outlined">
              {{ anime.rating }}
            </v-chip>
            <v-chip v-if="anime.source" size="small" variant="outlined">
              {{ anime.source }}
            </v-chip>
          </div>

          <v-divider class="mx-4 mb-3" />

          <!-- Stats en grille -->
          <v-row class="px-4 pb-2" dense>
            <v-col cols="6">
              <div class="text-caption text-medium-emphasis">Score MAL</div>
              <div class="d-flex align-center">
                <v-icon size="16" color="secondary" class="mr-1">mdi-star</v-icon>
                <span class="font-weight-bold">{{ anime.score ?? '—' }}</span>
                <span v-if="anime.scored_by" class="text-caption text-medium-emphasis ml-1">
                  ({{ formatNumber(anime.scored_by) }})
                </span>
              </div>
            </v-col>

            <v-col cols="6">
              <div class="text-caption text-medium-emphasis">Classement</div>
              <div class="font-weight-bold">#{{ anime.rank ?? '—' }}</div>
            </v-col>

            <v-col cols="6">
              <div class="text-caption text-medium-emphasis">Épisodes</div>
              <div class="font-weight-bold">{{ anime.episodes ?? '—' }}</div>
            </v-col>

            <v-col cols="6">
              <div class="text-caption text-medium-emphasis">Durée / épisode</div>
              <div class="font-weight-bold">{{ anime.duration ?? '—' }}</div>
            </v-col>

            <v-col cols="6">
              <div class="text-caption text-medium-emphasis">Diffusion</div>
              <div class="font-weight-bold">{{ anime.aired?.string ?? '—' }}</div>
            </v-col>

            <v-col cols="6">
              <div class="text-caption text-medium-emphasis">Popularité</div>
              <div class="font-weight-bold">#{{ anime.popularity ?? '—' }}</div>
            </v-col>
          </v-row>

          <v-divider class="mx-4 my-2" />

          <!-- Genres -->
          <div v-if="anime.genres?.length" class="px-4 pb-2">
            <div class="text-caption text-medium-emphasis mb-1">Genres</div>
            <div class="d-flex flex-wrap gap-1">
              <v-chip
                  v-for="genre in anime.genres"
                  :key="genre.mal_id"
                  size="small"
                  variant="outlined"
                  color="primary"
              >
                {{ genre.name }}
              </v-chip>
            </div>
          </div>

          <!-- Studios -->
          <div v-if="anime.studios?.length" class="px-4 pb-3">
            <div class="text-caption text-medium-emphasis mb-1">Studios</div>
            <div class="d-flex flex-wrap gap-1">
              <v-chip
                  v-for="studio in anime.studios"
                  :key="studio.mal_id"
                  size="small"
                  color="surface-variant"
              >
                {{ studio.name }}
              </v-chip>
            </div>
          </div>

        </v-col>

        <!-- SYNOPSIS -->
        <v-col cols="12">
          <v-divider />
          <v-card-text>
            <div class="text-caption text-medium-emphasis text-uppercase mb-2 font-weight-bold">
              Synopsis
            </div>
            <p v-if="anime.synopsis" class="text-body-2" style="line-height: 1.7">
              {{ anime.synopsis }}
            </p>
            <p v-else class="text-medium-emphasis">Aucun synopsis disponible.</p>
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

const isLandscape = ref(false)
watch(anime, (val) => {
  if (!val) return
  const img = new Image()
  img.onload = () => {
    isLandscape.value = (img.naturalWidth / img.naturalHeight) > 0.8
  }
  img.src = val.images.webp.large_image_url
}, { immediate: true })

// Couleur du chip statut selon l'état de diffusion
const statusColor = computed(() => {
  switch (anime.value?.status) {
    case 'Currently Airing': return 'success'
    case 'Finished Airing':  return 'default'
    case 'Not yet aired':    return 'warning'
    default:                 return 'default'
  }
})

// Formate un grand nombre : 123456 → 123k
function formatNumber(n) {
  if (!n) return '—'
  return n >= 1000 ? `${Math.round(n / 1000)}k` : n
}
</script>