import { defineStore } from 'pinia'
import {
    getDrafts,
    createDraft,
    updateDraft,
    deleteDraft
} from '../services/draftService'

export const useDraftStore = defineStore('draft', {
    state: () => ({
        drafts: [],
        currentDraft: null,
        isLoading: false
    }),

    actions: {
        async loadDrafts() {
            try {
                const data = await getDrafts()
                this.drafts = data
            } catch (error) {
                console.error(error)
                this.drafts = [] // fallback så UI ikke crasher
            }
        },

        async addDraft(draft) {
            const created = await createDraft(draft)
            this.drafts.unshift(created)
        },

        async editDraft(id, draft) {
            const updated = await updateDraft(id, draft)
            const index = this.drafts.findIndex(d => d.id === id)
            if (index !== -1) this.drafts[index] = updated
        },

        async removeDraft(id) {
            await deleteDraft(id)

            this.drafts = this.drafts.filter(d => d.id !== id)

            if (this.currentDraft?.id === id) {
                this.currentDraft = null
            }
        },

        setCurrentDraft(draft) {
            this.currentDraft = draft
        },

        clearCurrentDraft() {
            this.currentDraft = null
        }
    }
})