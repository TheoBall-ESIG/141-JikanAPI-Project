<template>
  <v-container>
    <h1 class="text-h4 my-4">Liste anime</h1>

    <v-row class="mb-4">
      <!-- Recherche texte -->
      <v-col cols="12" sm="6" md="4">
        <v-text-field
            v-model="searchQuery"
            label="Rechercher un Anime"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
            variant="outlined"
            density="compact"
            @focus="closeMenus"
        />
      </v-col>

      <!-- Filtre score -->
      <v-col cols="12" sm="6" md="4">
        <v-select
            v-model="selectedRanges"
            v-model:menu="scoreMenuOpen"
            :items="scoreRanges"
            item-title="label"
            item-value="id"
            label="Filtrer par score"
            prepend-inner-icon="mdi-star"
            multiple
            clearable
            hide-details
            variant="outlined"
            density="compact"
        />
      </v-col>

      <!-- Filtre épisodes -->
      <v-col cols="12" sm="6" md="4">
        <v-select
            v-model="selectedEpisodeRanges"
            v-model:menu="episodeMenuOpen"
            :items="episodeRanges"
            item-title="label"
            item-value="id"
            label="Filtrer par épisodes"
            prepend-inner-icon="mdi-television-play"
            multiple
            clearable
            hide-details
            variant="outlined"
            density="compact"
        />
      </v-col>

      <!-- Tri alphabétique -->
      <v-col cols="12" class="d-flex">
        <v-btn
            class="mr-3"
            :variant="lastSort === 'score' ? 'flat' : 'outlined'"
            :color="lastSort === 'score' ? 'primary' : undefined"
            :prepend-icon="scoreSortOrder === 'desc'
        ? 'mdi-sort-numeric-descending'
        : 'mdi-sort-numeric-ascending'"
            @click="toggleScoreSort"
        >
          Score {{ scoreSortOrder === 'desc' ? '9 → 0' : '0 → 9' }}
        </v-btn>

        <v-btn
            :variant="lastSort === 'title' ? 'flat' : 'outlined'"
            :color="lastSort === 'title' ? 'primary' : undefined"
            :prepend-icon="titleSortOrder === 'asc'
        ? 'mdi-sort-alphabetical-ascending'
        : 'mdi-sort-alphabetical-descending'"
            @click="toggleTitleSort"
        >
          Titre {{ titleSortOrder === 'asc' ? 'A → Z' : 'Z → A' }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- Chargement -->
    <v-row v-if="animeStore.isLoading">
      <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader type="image, heading, text" />
      </v-col>
    </v-row>

    <!-- Erreur chargement -->
    <v-alert
        v-else-if="animeStore.animes.length === 0"
        type="error"
        variant="tonal"
        class="mb-6"
    >
      Impossible de charger les Animes.
    </v-alert>

    <!-- Aucun résultat -->
    <v-alert
        v-else-if="sortedAnimes.length === 0"
        type="info"
        variant="tonal"
        class="mb-6"
    >
      Aucun anime ne correspond à votre recherche.
    </v-alert>

    <!-- Liste -->
    <v-row v-else>
      <v-col
          v-for="anime in sortedAnimes"
          :key="anime.mal_id"
          cols="12" sm="6" md="4" lg="3"
      >
        <anime-card :anime="anime" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import AnimeCard from "@/components/AnimeCard.vue"
import { useAnimeStore } from '@/stores/animeStore'

const animeStore = useAnimeStore()

// — Recherche & filtres —
const searchQuery = ref('')
const selectedRanges = ref([])
const selectedEpisodeRanges = ref([])

const scoreRanges = [
  { id: 'excellent', label: 'Excellent (8+)', min: 8,  max: 10 },
  { id: 'bon',       label: 'Bon (6–8)',       min: 6,  max: 8  },
  { id: 'moyen',     label: 'Moyen (4–6)',     min: 4,  max: 6  },
  { id: 'faible',    label: 'Faible (< 4)',    min: 0,  max: 4  },
]

const episodeRanges = [
  { id: 'court',     label: 'Court  (1–12)',   min: 1,   max: 12  },
  { id: 'moyen',     label: 'Moyen  (13–26)',  min: 13,  max: 26  },
  { id: 'long',      label: 'Long   (27–50)',  min: 27,  max: 50  },
  { id: 'treslong',  label: 'Très long (51+)', min: 51,  max: Infinity },
]

const scoreMenuOpen = ref(false)
const episodeMenuOpen = ref(false)

function closeMenus() {
  scoreMenuOpen.value = false
  episodeMenuOpen.value = false
}

// — Tri —
// lastSort mémorise quel bouton a été cliqué en dernier
const lastSort = ref('title')        // 'title' | 'score'
const titleSortOrder = ref('asc')    // 'asc'   | 'desc'
const scoreSortOrder = ref('desc')   // 'desc'  | 'asc'

function toggleTitleSort() {
  titleSortOrder.value = titleSortOrder.value === 'asc' ? 'desc' : 'asc'
  lastSort.value = 'title'
}

function toggleScoreSort() {
  scoreSortOrder.value = scoreSortOrder.value === 'desc' ? 'asc' : 'desc'
  lastSort.value = 'score'
}

// — Pipeline de filtres —
const filteredByScore = computed(() => {
  if (!selectedRanges.value.length) return animeStore.animes
  const ranges = scoreRanges.filter(r => selectedRanges.value.includes(r.id))
  return animeStore.animes.filter(anime =>
      anime.score !== null &&
      ranges.some(range => anime.score >= range.min && anime.score < range.max)
  )
})

const filteredByEpisodes = computed(() => {
  if (!selectedEpisodeRanges.value.length) return filteredByScore.value
  const ranges = episodeRanges.filter(r => selectedEpisodeRanges.value.includes(r.id))
  return filteredByScore.value.filter(anime =>
      anime.episodes !== null &&
      ranges.some(range => anime.episodes >= range.min && anime.episodes <= range.max)
  )
})

const filteredBySearch = computed(() => {
  if (!searchQuery.value) return filteredByEpisodes.value
  const query = searchQuery.value.toLowerCase()
  return filteredByEpisodes.value.filter(anime =>
      anime.title.toLowerCase().includes(query)
  )
})

const sortedAnimes = computed(() => {
  return [...filteredBySearch.value].sort((a, b) => {
    if (lastSort.value === 'score') {
      // Les animes sans score vont à la fin
      if (a.score === null && b.score === null) return 0
      if (a.score === null) return 1
      if (b.score === null) return -1
      return scoreSortOrder.value === 'desc'
          ? b.score - a.score
          : a.score - b.score
    } else {
      const comparison = a.title.localeCompare(b.title, 'fr')
      return titleSortOrder.value === 'asc' ? comparison : -comparison
    }
  })
})
</script>