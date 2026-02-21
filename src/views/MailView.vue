<script setup>
import { ref, onMounted } from 'vue'
import { getSentMails } from '@/services/mailService'

const emails = ref([])
const loading = ref(false)

const userEmail = 'patrickbroehansenwork@gmail.com'

async function fetchEmails() {
  loading.value = true
  emails.value = await getSentMails(userEmail)
  loading.value = false
}

onMounted(fetchEmails)
</script>

<template>
  <div>
    <h2>Sent Emails</h2>

    <div v-if="loading">Loading...</div>

    <div v-for="mail in emails" :key="mail.id" class="mail-card">
      <h4>{{ mail.subject }}</h4>
      <p><strong>To:</strong> {{ mail.to }}</p>
      <p>{{ mail.message }}</p>
    </div>
  </div>
</template>