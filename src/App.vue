<template>
  <v-app>
    <!-- Barre de navigation -->
    <app-header />

    <v-main>
      <RouterView />
    </v-main>
    <app-footer />
  </v-app>
</template>

<script setup>
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";

import { useAnimeStore } from '@/stores/animeStore'
import {onMounted} from "vue";

onMounted(async () => {
  const animeStore = useAnimeStore()
  await animeStore.init()
})
</script>
