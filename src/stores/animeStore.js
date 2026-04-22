import { defineStore } from 'pinia'
import {onMounted} from "vue";

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
        // Liste des types de Pokémon (Feu, Eau, Plante, etc.)
        // types: [],
        // Indicateur de chargement — true pendant les appels API
        isLoading: false,
        // Message d'erreur en cas de problème
        error: null,
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
                return state.animes.find(anime => anime.mal_id === animeId)
            }
        },
    },

    /**
     * Actions — méthodes qui modifient le state.
     * Peuvent être asynchrones (appels API).
     * On accède au state avec `this`.
     */
    actions: {
        /**
         * Charge tous les Animes depuis l'API.
         * Note : ne gère pas isLoading — c'est init() qui s'en charge.
         */
        async fetchAnimes() {
            const response = await fetch('https://api.jikan.moe/v4/anime?q=bleach&sfw')

            // Vérifier que la réponse est OK (status 200-299)
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`)
            }

            this.animes = await response.json()
            console.log('Anime chargés :', this.animes.length)
        },


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
        async init() {
            console.log('Initialisation du store Anime...')

            this.isLoading = true
            this.error = null

            try {
                // Promise.all exécute les deux requêtes en parallèle
                // Plus rapide que de les faire l'une après l'autre
                await Promise.all([
                    this.fetchAnimes(),
                    //this.fetchTypes(),
                ])

                console.log('Store Anime initialisé')
            } catch (error) {
                this.error = 'Erreur lors du chargement des données'
                console.error(error)
            } finally {
                this.isLoading = false
            }
        },
    },
})