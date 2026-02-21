import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'

export const useMailStore = defineStore('mail', {
    state: () => ({
        sentEmails: []
    }),

    actions: {
        async fetchSentEmails() {
            const authStore = useAuthStore()

            if (!authStore.email) return

            const response = await fetch(
                `http://localhost:5170/api/mail?userEmail=${authStore.email}`
            )

            if (!response.ok) {
                throw new Error('Failed to fetch emails')
            }

            this.sentEmails = await response.json()
        },

        clear() {
            this.sentEmails = []
        }
    }
})