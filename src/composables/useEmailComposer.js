import { ref, computed } from 'vue'

export function useEmailComposer() {
    const email = ref({
        to: '',
        subject: '',
        message: ''
    })

    const hasContent = computed(() =>
        email.value.to || email.value.subject || email.value.message
    )

    function resetForm() {
        email.value = { to: '', subject: '', message: '' }
    }

    function insertTemplate() {
        email.value.message =
            'Dear recipient,\n\nThank you for your email.\n\nBest regards,\n[Your Name]'
    }

    function sendEmail(emit) {
        if (!email.value.to) return
        emit('send-email', { ...email.value })
        resetForm()
        showNotification('Email sent successfully!')
    }

    function saveDraft(emit) {
        if (!hasContent.value) return
        emit('save-draft', { ...email.value })
        showNotification('Draft saved successfully!')
    }

    function clearForm() {
        resetForm()
        showNotification('Form cleared')
    }

    function showNotification(message) {
        const notification = document.createElement('div')
        notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 10000;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
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
        clearForm
    }
}
