import {useMailStore} from "../Stores/mailStore.js";

const BASE_URL = 'http://localhost:5170/api/mail'


import { useAuthStore } from '../stores/authStore'

export async function sendMail(payload) {
    const authStore = useAuthStore()
    const mailStore = useMailStore()
    const response = await fetch('http://localhost:5170/api/mail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-User-Id': authStore.userId,
            'X-User-Email': authStore.email
        },
        body: JSON.stringify({
            to: payload.to,
            subject: payload.subject,
            body: payload.message
        })
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to send email')
    }

    await mailStore.fetchSentEmails();
    return true

}

export async function getSentMails(userEmail) {
    try {
        const response = await fetch(`${BASE_URL}?userEmail=${encodeURIComponent(userEmail)}`)
        if (!response.ok) {
            throw new Error('Failed to fetch emails')
        }

        return await response.json()
    } catch (error) {
        console.error('Fetch mail error:', error)
        throw error
    }
}