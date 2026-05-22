<template>
  <v-container>
    <div class="d-flex align-baseline my-4">
      <h1 class="text-h4 mr-3">Liste anime</h1>
      <span class="text-body-2 text-medium-emphasis">
        ({{ animeStore.animes.length }} animes aléatoires)
      </span>
    </div>

    <v-row class="mb-4">
      <!-- Champ de recherche -->
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
        <!-- Tris par score/titre -->
        <div class="d-flex mb-3">
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

        <!-- Reroll des 25 animes -->
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

    <!-- Si erreur de chargement -->
    <v-alert
        v-else-if="animeStore.animes.length === 0"
        type="error"
        variant="tonal"
        class="mb-6"
    >
      Impossible de charger les Animes.
    </v-alert>

    <!-- Si aucun résultat -->
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

// Initialisé depuis store pour reprendre la valeur si retour sur la page
const searchQuery = ref(animeStore.searchQuery)

/**
 * Attend 500ms après la dernière entrée avant d'appeler l'API pour ne pas dépasser les limites de l'API
 * @type {null}
 */
let debounceTimer = null
watch(searchQuery, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    animeStore.searchQuery = val
    animeStore.searchAnimes(val)
  }, 500)
})

// Computed en lecture écriture pour synchroniser avec le store
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

// Données statiques de référence
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

/**
 * Ferme les menus de filtres sur mobile pour éviter des conflits de focus
 */
function closeMenus() {
  scoreMenuOpen.value = false
  episodeMenuOpen.value = false
}


/**
 * Tris (le premier active le tri, les suivants alternent l'ordre)
 */
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

/**
 * Filtres par score, épisodes puis recherche
 * @type {ComputedRef<[]|never[]>}
 */
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

/**
 * Recherche les animes par titre japonais et (s'il existe) anglais
 * @type {ComputedRef<[]|never[]|T[]>}
 */
const filteredBySearch = computed(() => {
  if (!animeStore.searchQuery) return filteredByEpisodes.value
  const query = animeStore.searchQuery.toLowerCase()
  return filteredByEpisodes.value.filter(anime =>
      anime.title.toLowerCase().includes(query) ||
      (anime.title_english && anime.title_english.toLowerCase().includes(query))
  )
})

/**
 * Filtre et tri les animes grâce aux filtres et tris précédents
 * @type {ComputedRef<*[]>}
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