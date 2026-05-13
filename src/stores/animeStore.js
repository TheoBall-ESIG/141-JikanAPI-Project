import { defineStore } from 'pinia'
import {onMounted} from "vue";
import api from "@/plugins/axios.js";

/**
 * Store Pinia pour gérer les données des Animes.
 * Centralise les appels API et partage les données entre les pages.
 */
export const useAnimeStore = defineStore('anime', {
    /**
     * State — les données brutes du store.
     * Retourne une fonction qui retourne un objet (comme data() dans Options API).
     */
    state: () => ({
        // Liste de tous les Anime chargés depuis l'API
        animes: [],
        favorites: [],
        // Liste des types de Pokémon (Feu, Eau, Plante, etc.)
        // types: [],
        // Indicateur de chargement — true pendant les appels API
        isLoading: false,
        // Message d'erreur en cas de problème
        error: null,
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
         * @param {Object} state - Le state du store
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

        isFavorite: state => {
            return anime => state.favorites.some(f => f.mal_id === anime.mal_id)
        },

        getFavorites: state => state.favorites,

    },

    /**
     * Actions — méthodes qui modifient le state.
     * Peuvent être asynchrones (appels API).
     * On accède au state avec `this`.
     */
    actions: {

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
         * Charge tous les Animes depuis l'API.
         * Note : ne gère pas isLoading — c'est init() qui s'en charge. /anime?q=bleach&sfw
         */
        async fetchAnimes({ withLoader = true } = {}) {
            if (withLoader) this.isLoading = true

            try {
                const randomPage = Math.floor(Math.random() * 100) + 1
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

        saveFavorites() {
            try {
                localStorage.setItem('anime_favorites', JSON.stringify(this.favorites))
            } catch (error) {
                console.error('Erreur lors de la sauvegarde des favoris :', error)
            }
        },

        toggleFavorite(anime) {
            const index = this.favorites.findIndex(f => f.mal_id === anime.mal_id)
            if (index === -1) {
                this.favorites.push(anime)
            } else {
                this.favorites.splice(index, 1)
            }
            this.saveFavorites()
        },
/**
        cleanupFavorites() {
            const initialCount = this.favorites.length

            this.favorites = this.favorites.filter(favoriteId => {
                return this.animes.some(anime => anime.mal_id === favoriteId)
            })

            const removedCount = initialCount - this.favorites.length
            if (removedCount > 0) {
                console.log('Nettoyage :', removedCount, 'favoris obsolètes supprimés')
                this.saveFavorites()
            }
        },
        */


        /**
         * Charge tous les types de Pokémon depuis l'API.
         * Note : ne gère pas isLoading — c'est init() qui s'en charge.
         */
/**         async fetchTypes() {
            const response = await fetch('http://localhost:3535/types')

            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`)
            }

            this.types = await response.json()
            console.log('Types chargés :', this.types.length)
        },
*/
        /**
         * Initialise le store : charge les Animes et les types en parallèle.
         * À appeler une seule fois au démarrage de l'application (dans App.vue).
         */

    },
})