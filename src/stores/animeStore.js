import { defineStore } from 'pinia'
import api from "@/plugins/axios.js";

/**
 * Store Pinia pour gérer les données des Animes.
 * Centralise les appels API et partage les données entre les pages.
 */
export const useAnimeStore = defineStore('anime', {

    state: () => ({
        animes: [],
        favorites: [],
        isLoading: false,
        error: null,
        // Etat des filtres et tris (stockés ici pour la persistance)
        searchQuery: '',
        selectedRanges: [],
        selectedEpisodeRanges: [],
        lastSort: 'title',
        titleSortOrder: 'asc',
        scoreSortOrder: 'desc',
    }),

    /**
     * Getters — propriétés calculées basées sur le state.
     * Équivalent de computed() dans un composant.
     */
    getters: {
        /**
         * Nombre total d'Animes dans le store.
         * @param {Object} state - Le state du store
         * @returns {number}
         */
        totalAnimes: (state) => {
            return state.animes.length
        },

        /**
         * Trouve un Anime par son identifiant.
         * Retourne une fonction (getter avec paramètre).
         * @param {Object} state Le state du store
         * @returns {function(string): Object|undefined}
         */
        getAnimeById: (state) => {
            return (animeId) => {
                // Cherche d'abord dans les animes chargés
                const fromAnimes = state.animes.find(anime => anime.mal_id === Number(animeId))
                if (fromAnimes) return fromAnimes

                // Sinon cherche dans les favoris (objets complets stockés)
                return state.favorites.find(anime => anime.mal_id === Number(animeId))
            }
        },

        totalFavorites: state => {
            return state.favorites.length
        },

        // Indique si l'anime est favoris
        isFavorite: state => {
            return anime => state.favorites.some(f => f.mal_id === anime.mal_id)
        },

        // Liste des favoris
        getFavorites: state => state.favorites,

    },

    /**
     * Actions — méthodes qui modifient le state.
     * Peuvent être asynchrones (appels API).
     * On accède au state avec `this`.
     */
    actions: {

        /**
         * Initialise le store au démarrage de l'application.
         * Charge les favoris depuis le localStorage puis les animes depuis l'API.
         * Appelé une seule fois dans App.vue.
         */
        async init() {
            this.loadFavorites()
            this.isLoading = true
            this.error = null
            try {
                await Promise.all([ this.fetchAnimes({ withLoader: false }) ])
                console.log('Store Anime initialisé')
            } catch (error) {
                this.error = 'Erreur lors du chargement des données'
                console.error(error)
            } finally {
                this.isLoading = false
            }
        },


        /**
         * Charge 25 animes aléatoires depuis l'API (page aléatoire).
         * @param {boolean} withLoader Gère isLoading si true
         * @returns {Promise<void>}
         */
        async fetchAnimes({ withLoader = true } = {}) {
            if (withLoader) this.isLoading = true

            try {
                const randomPage = Math.floor(Math.random() * 1000) + 1
                const response = await api.get(`/anime?page=${randomPage}&sfw`)

                this.animes = response.data.data
                //this.cleanupFavorites()
            } catch (error) {
                console.error('Erreur lors du chargement des Animes:', error.message)
                this.animes = []
            } finally {
                if (withLoader) this.isLoading = false
            }
        },

        /**
         * Charge un anime spécifique par son ID MyAnimeList (site sur lequel est basé l'API)
         * @param id identifiant MyAnimeList utilisé comme id pour l'API également
         * @returns {Promise<*|null>}
         */
        async fetchAnimeById(id) {
            try {
                const response = await api.get(`/anime/${id}`)
                const anime = response.data.data
                // On l'ajoute dans la liste si pas déjà présent
                if (!this.animes.find(a => a.mal_id === anime.mal_id)) {
                    this.animes.push(anime)
                }
                return anime
            } catch (error) {
                console.error('Erreur chargement anime:', error.message)
                return null
            }
        },

        /**
         * Recherche des animes par titre via l'API
         * @param query terme de recherche
         * @returns {Promise<void>}
         */
        async searchAnimes(query) {
            this.isLoading = true
            try {
                const url = query
                    ? `/anime?q=${encodeURIComponent(query)}&sfw`
                    : `/anime?page=${Math.floor(Math.random() * 100) + 1}&sfw`
                const response = await api.get(url)
                this.animes = response.data.data
            } catch (error) {
                console.error('Erreur recherche:', error.message)
            } finally {
                this.isLoading = false
            }
        },

        /**
         * Charge les favoris depuis le localStorage
         */
        loadFavorites() {
            try {
                const savedFavorites = localStorage.getItem('anime_favorites')
                if (savedFavorites) {
                    this.favorites = JSON.parse(savedFavorites)
                    console.log('Favoris chargés :', this.favorites.length, 'éléments')
                } else {
                    this.favorites = []
                }
            } catch (error) {
                console.error('Erreur lors du chargement des favoris :', error)
                this.favorites = []
            }
        },

        /**
         * Enregistre les favoris dans le localStorage
         */
        saveFavorites() {
            try {
                localStorage.setItem('anime_favorites', JSON.stringify(this.favorites))
            } catch (error) {
                console.error('Erreur lors de la sauvegarde des favoris :', error)
            }
        },

        /**
         * Ajoute ou retire un anime des favoris puis sauvegarde les favoris
         * @param anime
         */
        toggleFavorite(anime) {
            const index = this.favorites.findIndex(f => f.mal_id === anime.mal_id)
            if (index === -1) {
                this.favorites.push(anime)
            } else {
                this.favorites.splice(index, 1)
            }
            this.saveFavorites()
        },
    },
})