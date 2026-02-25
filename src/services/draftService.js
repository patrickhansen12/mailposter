import { useAuthStore } from '../stores/authStore'

const BASE_URL = 'http://localhost:5170/api/draft'

export async function getDrafts() {
    const authStore = useAuthStore()

    const response = await fetch('http://localhost:5170/api/draft', {
        headers: {
            'X-User-Email': authStore.email
        }
    })

    if (!response.ok) {
        throw new Error('Failed to fetch drafts')
    }

    return await response.json()
}
export async function createDraft(payload) {
    const authStore = useAuthStore()

    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-User-Email': authStore.email
        },
        body: JSON.stringify({
            recipientEmail: payload.to,
            subject: payload.subject,
            body: payload.message
        })
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to create draft')
    }

    return await response.json()
}
export async function updateDraft(id, payload) {
    const authStore = useAuthStore()

    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-User-Email': authStore.email
        },
        body: JSON.stringify({
            recipientEmail: payload.to,
            subject: payload.subject,
            body: payload.message
        })
    })

    if (!response.ok) {
        throw new Error('Failed to update draft')
    }

    return await response.json()
}

export async function deleteDraft(id) {
    const authStore = useAuthStore()

    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'X-User-Email': authStore.email
        }
    })

    if (!response.ok) {
        throw new Error('Failed to delete draft')
    }

    return true
}