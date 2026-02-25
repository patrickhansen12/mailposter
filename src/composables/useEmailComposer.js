import { ref, computed } from 'vue'
import { sendMail } from '../services/mailService'
import {useDraftStore} from "../stores/draftStore.js";
import { useAuthStore } from '../stores/authStore'



export function useEmailComposer() {
    const draftStore = useDraftStore();
    const authStore = useAuthStore();
    const email = ref({
        to: '',
        subject: '',
        message: ''
    })

    const isSending = ref(false)

    const hasContent = computed(() =>
        email.value.to ||
        email.value.subject ||
        email.value.message
    )

    function resetForm() {
        email.value = { to: '', subject: '', message: '' }
    }

    async function sendEmail() {
        try {
            await sendMail(email.value)

            resetForm()
            showNotification('Email sent successfully!', 'success')
        } catch (error) {
            showNotification('Email failed!', 'error')
        }
    }

    async function saveDraft() {
        if (!hasContent.value) return

        if (draftStore.currentDraft) {
            await draftStore.editDraft(draftStore.currentDraft.id, {
                ...email.value,
                senderEmail: authStore.userEmail
            })
        } else {
            await draftStore.addDraft({
                ...email.value,
                senderEmail: authStore.userEmail
            })
        }

        draftStore.clearCurrentDraft()
        resetForm()
    }

    function insertTemplate() {
        email.value.message =
            'Dear recipient,\n\nThank you for your email.\n\nBest regards,\nPatrick'
    }

    function clearForm() {
        resetForm()
        showNotification('Form cleared')
    }


    function showNotification(message, type = 'success') {
        const notification = document.createElement('div')

        notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#dc3545' : '#28a745'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        `
        notification.textContent = message
        document.body.appendChild(notification)

        setTimeout(() => {
            document.body.contains(notification) &&
            document.body.removeChild(notification)
        }, 3000)
    }

    return {
        email,
        hasContent,
        sendEmail,
        saveDraft,
        insertTemplate,
        clearForm,
        isSending
    }
}