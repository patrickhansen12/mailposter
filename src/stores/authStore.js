import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        userId: null,
        email: null
    }),

    persist: true,

    actions: {
        login(user) {
            this.userId = user.id
            this.email = user.email
        },
        logout() {
            this.$reset()
        }
    }
})