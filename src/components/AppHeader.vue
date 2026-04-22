<template>
  <v-app-bar flat>
    <v-container class="d-flex align-center">
      <v-avatar
          class="mr-4 pa-0 cursor-pointer"
          image="@/assets/gojoicon.png"
          size="64"
          @click="$router.push('/')"
      />

      <v-toolbar-title>Anipeak</v-toolbar-title>

      <v-btn
          v-for="link in menuItems"
          :key="link.title"
          :icon="link.icon"
          :to="link.path"
      />
    </v-container>
  </v-app-bar>
</template>

<script setup>
const menuItems = [
  { title: 'Accueil', path: '/', icon: 'mdi-image-filter-hdr-outline' },
  { title: 'Favoris', path: '/favoris', icon: 'mdi-heart' },
  { title: 'À propos', path: '/a-propos', icon: 'mdi-information' },
]
</script>
