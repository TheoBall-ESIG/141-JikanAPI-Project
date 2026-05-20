<template>
  <v-footer color="surface" elevation="4">
    <v-container>
      <v-row align="center" justify="space-between">

        <!-- Gauche : logo + nom -->
        <v-col cols="12" sm="4" class="d-flex align-center justify-center justify-sm-start">
          <v-icon color="primary" class="mr-2">mdi-television-play</v-icon>
          <span class="font-weight-bold text-primary">Anipeak</span>
        </v-col>

        <!-- Centre : copyright -->
        <v-col cols="12" sm="4" class="text-center text-caption text-medium-emphasis">
          ESIG · C141 · {{ currentYear }}
        </v-col>

        <!-- Droite : lien API -->
        <v-col cols="12" sm="4" class="d-flex align-center justify-center justify-sm-end">
          <span class="text-caption text-medium-emphasis mr-2">Données :</span>
          <v-btn
              href="https://jikan.moe/"
              target="_blank"
              rel="noopener noreferrer"
              variant="text"
              color="secondary"
              density="compact"
              prepend-icon="mdi-api"
              size="small"
          >
            jikan.moe
          </v-btn>
        </v-col>

      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>