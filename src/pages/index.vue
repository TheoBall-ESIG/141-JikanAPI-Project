<template>
  <v-container>
    <h1 class="text-h4 my-4">Liste anime</h1>

    <v-row class="mb-4">
      <!-- Recherche texte -->
      <v-col cols="12" sm="6" md="4">
        <v-text-field
            class="mb-3"
            v-model="searchQuery"
            label="Rechercher un Anime"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
            variant="outlined"
            density="compact"
            @focus="closeMenus"
        />
        <!-- Score + Titre sur une ligne -->
        <div class="d-flex mb-2">
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
        </div>

        <!-- Reroll en dessous -->
        <v-btn
            variant="outlined"
            prepend-icon="mdi-shuffle"
            :loading="animeStore.isLoading"
            @click="animeStore.fetchAnimes()"
        >
          Reroll
        </v-btn>
      </v-col>
    </v-row>

    <!-- Chargement -->
    <v-row v-if="animeStore.isLoading">
      <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
        <v-card>
          <!-- Image -->
          <v-skeleton-loader type="image" height="320" />
          <!-- Titre -->
          <v-skeleton-loader type="heading" class="px-4 pt-3 pb-1" />
          <!-- Année + épisodes -->
          <v-skeleton-loader type="text" class="px-4 pb-1" />
          <!-- Genres + favori -->
          <v-skeleton-loader type="text" class="px-4 pb-3" />
        </v-card>
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
import { ref, computed, watch } from 'vue'
import AnimeCard from "@/components/AnimeCard.vue"
import { useAnimeStore } from '@/stores/animeStore'

const animeStore = useAnimeStore()

// — Recherche & filtres — liés au store pour persister entre les pages
const searchQuery = ref(animeStore.searchQuery)

let debounceTimer = null
watch(searchQuery, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    animeStore.searchQuery = val
    animeStore.searchAnimes(val)
  }, 500)
})

const selectedRanges = computed({
  get: () => animeStore.selectedRanges,
  set: (val) => { animeStore.selectedRanges = val }
})

const selectedEpisodeRanges = computed({
  get: () => animeStore.selectedEpisodeRanges,
  set: (val) => { animeStore.selectedEpisodeRanges = val }
})

const lastSort = computed({
  get: () => animeStore.lastSort,
  set: (val) => { animeStore.lastSort = val }
})

const titleSortOrder = computed({
  get: () => animeStore.titleSortOrder,
  set: (val) => { animeStore.titleSortOrder = val }
})

const scoreSortOrder = computed({
  get: () => animeStore.scoreSortOrder,
  set: (val) => { animeStore.scoreSortOrder = val }
})

// — Ces données restent locales, pas besoin de les persister —
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
function toggleTitleSort() {
  if (animeStore.lastSort === 'title') {
    animeStore.titleSortOrder = animeStore.titleSortOrder === 'asc' ? 'desc' : 'asc'
  }
  animeStore.lastSort = 'title'
}

function toggleScoreSort() {
  if (animeStore.lastSort === 'score') {
    animeStore.scoreSortOrder = animeStore.scoreSortOrder === 'desc' ? 'asc' : 'desc'
  }
  animeStore.lastSort = 'score'
}

// — Pipeline de filtres —
const filteredByScore = computed(() => {
  if (!animeStore.selectedRanges.length) return animeStore.animes
  const ranges = scoreRanges.filter(r => animeStore.selectedRanges.includes(r.id))
  return animeStore.animes.filter(anime =>
      anime.score !== null &&
      ranges.some(range => anime.score >= range.min && anime.score < range.max)
  )
})

const filteredByEpisodes = computed(() => {
  if (!animeStore.selectedEpisodeRanges.length) return filteredByScore.value
  const ranges = episodeRanges.filter(r => animeStore.selectedEpisodeRanges.includes(r.id))
  return filteredByScore.value.filter(anime =>
      anime.episodes !== null &&
      ranges.some(range => anime.episodes >= range.min && anime.episodes <= range.max)
  )
})
const filteredBySearch = computed(() => {
  if (!animeStore.searchQuery) return filteredByEpisodes.value
  const query = animeStore.searchQuery.toLowerCase()
  return filteredByEpisodes.value.filter(anime =>
      anime.title.toLowerCase().includes(query) ||
      (anime.title_english && anime.title_english.toLowerCase().includes(query))
  )
})
/**
const filteredBySearch = computed(() => {
  if (!animeStore.searchQuery) return filteredByEpisodes.value
  const query = animeStore.searchQuery.toLowerCase()
  return filteredByEpisodes.value.filter(anime =>
      anime.title.toLowerCase().includes(query)
  )
})
*/

const sortedAnimes = computed(() => {
  return [...filteredBySearch.value].sort((a, b) => {
    if (animeStore.lastSort === 'score') {
      if (a.score === null && b.score === null) return 0
      if (a.score === null) return 1
      if (b.score === null) return -1
      return animeStore.scoreSortOrder === 'desc'
          ? b.score - a.score
          : a.score - b.score
    } else {
      const comparison = a.title.localeCompare(b.title, 'fr')
      return animeStore.titleSortOrder === 'asc' ? comparison : -comparison
    }
  })
})
</script>