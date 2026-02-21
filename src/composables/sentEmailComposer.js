import { ref, onMounted } from 'vue'
import { getSentMails } from '../services/mailService'

export function getSentEmails(userEmail) {
    const emails = ref([])
    const loading = ref(false)
    const error = ref(null)

    async function fetchEmails() {
        try {
            loading.value = true
            emails.value = await getSentMails(userEmail)
        } catch (err) {
            error.value = 'Could not load emails'
        } finally {
            loading.value = false
        }
    }

    onMounted(fetchEmails)

    return {
        emails,
        loading,
        error,
        fetchEmails
    }
}