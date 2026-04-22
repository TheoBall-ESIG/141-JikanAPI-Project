<template>
  <v-container>
    <h1 class="text-h4 my-4">À propos</h1>

    <!-- TODO : Présentation de l'application avec des composants Vuetify -->
    <!-- Idées : v-card, v-list, v-icon, v-chip -->
    <v-card max-width="800" class="mx-auto">
      <v-card-text>
        <p class="text-body-1 mb-4">
          <strong>Anipeak</strong> est une base de données qui répertorie tous les animes présents sur MyAnimeList.
          Le but est de permettre à tout le monde de disposer des informations qu'il souhaite sur les animes catalogués sur le site.
        </p>
        <p class="text-body-1 mb-4">
          Cette application web a été développée dans le cadre du cours <strong>C141</strong>
          à l'ESIG, en utilisant <strong>Vue.js 3</strong>, <strong>Vuetify 3</strong>,
          <strong>Pinia</strong> et <strong>Axios</strong>.
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
  //
</script>
