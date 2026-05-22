<template>
  <v-container>
    <h1 class="text-h4 my-4">À propos</h1>

    <v-row justify="center">
      <v-col cols="12" md="8">

        <!-- Présentation -->
        <v-card class="mb-4">
          <v-card-text>
            <div class="d-flex align-center mb-3">
              <v-icon color="primary" size="28" class="mr-3">mdi-information-outline</v-icon>
              <span class="text-h6 font-weight-bold">Le projet</span>
            </div>
            <p class="text-body-1">
              <strong>Anipeak</strong> est une base de données qui répertorie les animes présents sur MyAnimeList.
              Elle permet de consulter les informations détaillées de chaque anime, de les filtrer, les trier,
              et de constituer sa propre liste de favoris.
            </p>
          </v-card-text>
        </v-card>

        <!-- Stack technique -->
        <v-card class="mb-4">
          <v-card-text>
            <div class="d-flex align-center mb-3">
              <v-icon color="primary" size="28" class="mr-3">mdi-code-tags</v-icon>
              <span class="text-h6 font-weight-bold">Stack technique</span>
            </div>
            <v-list lines="two" bg-color="transparent">
              <v-list-item
                  v-for="tech in stack"
                  :key="tech.name"
                  :prepend-icon="tech.icon"
              >
                <template #title>
                  <span class="font-weight-medium">{{ tech.name }}</span>
                </template>
                <template #subtitle>{{ tech.description }}</template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <!-- Fonctionnalités -->
        <v-card class="mb-4">
          <v-card-text>
            <div class="d-flex align-center mb-3">
              <v-icon color="primary" size="28" class="mr-3">mdi-star-outline</v-icon>
              <span class="text-h6 font-weight-bold">Fonctionnalités</span>
            </div>
            <div class="d-flex flex-wrap gap-2">
              <v-chip
                  v-for="feature in features"
                  :key="feature.label"
                  :prepend-icon="feature.icon"
                  color="primary"
                  variant="tonal"
              >
                {{ feature.label }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>

        <v-card>
          <v-card-text>
            <div class="d-flex align-center mb-3">
              <v-icon color="primary" size="28" class="mr-3">mdi-school-outline</v-icon>
              <span class="text-h6 font-weight-bold">Contexte</span>
            </div>
            <p class="text-body-1 mb-3">
              Développé dans le cadre du cours <strong>C141</strong> à l'ESIG.
              Les données proviennent de l'API publique <strong>Jikan</strong>,
              une interface non officielle de MyAnimeList.
            </p>
            <v-btn
                href="https://docs.api.jikan.moe/"
                target="_blank"
                variant="outlined"
                color="primary"
                prepend-icon="mdi-api"
                size="small"
            >
              Documentation Jikan
            </v-btn>
          </v-card-text>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const stack = [
  {
    name: 'Vue.js 3',
    description: 'Framework JavaScript progressif, avec Composition API et script setup',
    icon: 'mdi-vuejs',
  },
  {
    name: 'Vuetify 3',
    description: 'Bibliothèque de composants Material Design pour Vue',
    icon: 'mdi-material-design',
  },
  {
    name: 'Pinia',
    description: 'Store centralisé pour la gestion de l\'état global de l\'application',
    icon: 'mdi-database-outline',
  },
  {
    name: 'Axios',
    description: 'Client HTTP pour les appels vers l\'API Jikan',
    icon: 'mdi-swap-horizontal',
  },
  {
    name: 'Vue Router',
    description: 'Routeur officiel pour la navigation entre les pages',
    icon: 'mdi-routes',
  },
]

const features = [
  { label: 'Recherche par titre',     icon: 'mdi-magnify'            },
  { label: 'Filtre par score',        icon: 'mdi-star-outline'       },
  { label: 'Filtre par épisodes',     icon: 'mdi-television-play'    },
  { label: 'Tri alphabétique',        icon: 'mdi-sort-alphabetical-ascending' },
  { label: 'Tri par score',           icon: 'mdi-sort-numeric-descending'     },
  { label: 'Reroll aléatoire',        icon: 'mdi-shuffle'            },
  { label: 'Favoris persistants',     icon: 'mdi-heart-outline'      },
  { label: 'Page de détail',          icon: 'mdi-information-outline'},
  { label: 'Responsive mobile',       icon: 'mdi-cellphone'          },
]
</script>