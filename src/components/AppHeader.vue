<template>
  <v-app-bar flat color="surface" elevation="2">
    <v-container class="d-flex align-center">
      <v-avatar
          class="mr-3 cursor-pointer"
          image="@/assets/gojoicon.png"
          size="40"
          @click="$router.push('/')"
      />

      <v-toolbar-title class="font-weight-bold text-primary">
        Anipeak
      </v-toolbar-title>

      <v-spacer />

      <!-- Desktop : boutons avec labels -->
      <template v-if="!mobile">
        <v-btn
            v-for="link in menuItems"
            :key="link.title"
            :to="link.path"
            :prepend-icon="link.icon"
            variant="text"
            color="primary"
            class="ml-1"
        >
          {{ link.title }}
        </v-btn>
      </template>

      <!-- Mobile : icônes seules -->
      <template v-else>
        <v-btn
            v-for="link in menuItems"
            :key="link.title"
            :to="link.path"
            :icon="link.icon"
            variant="text"
            color="primary"
        />
      </template>
    </v-container>
  </v-app-bar>
</template>

<script setup>
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()

const menuItems = [
  { title: 'Accueil',  path: '/',         icon: 'mdi-television-play'    },
  { title: 'Favoris',  path: '/favoris',  icon: 'mdi-heart'              },
  { title: 'À propos', path: '/a-propos', icon: 'mdi-information-outline' },
]
</script>