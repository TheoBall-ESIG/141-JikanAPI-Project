<template>
  <v-container>
    <h1 class="text-h3 text-center my-6">
      Mes favoris ({{ animeStore.totalFavorites }})
    </h1>

    <v-alert
        v-if="animeStore.totalFavorites === 0"
        type="info"
        variant="tonal"
        class="mb-6"
    >
      Vous n'avez pas encore d'anime favoris.
      Cliquez sur le coeur d'un anime pour l'ajouter !
    </v-alert>

    <v-row v-else>
      <v-col
          v-for="anime in animeStore.getFavorites"
          :key="anime.mal_id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
      >
        <anime-card :anime="anime" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useAnimeStore } from '@/stores/animeStore'
import AnimeCard from '@/components/AnimeCard.vue'

const animeStore = useAnimeStore()
</script>