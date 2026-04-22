<template>
  <v-card :to="`/anime/${anime.mal_id}`" hover>
    <v-img
        :src="anime.images.webp.large_image_url"
        :alt="anime.title"
        height="400"
        cover
    />
    <v-card-title>{{ anime.title }}</v-card-title>
    <v-card-text>
      <v-chip
          size="small"
          class="mr-2"
      >
        {{ anime.episodes }} episodes
      </v-chip>
      <v-chip size="small" variant="outlined">
        score : {{ anime.score }}
      </v-chip>
    </v-card-text>
  </v-card>
</template>

<script setup>

defineProps({
  anime: {
    type: Object,
    required: true,
  },
})
</script>