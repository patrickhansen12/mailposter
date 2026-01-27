<template>
  <div class="email-preview" v-if="hasContent">
    <h3>Email Preview</h3>

    <div class="preview-field">
      <strong>To:</strong> {{ email.to || '—' }}
    </div>

    <div class="preview-field">
      <strong>Subject:</strong> {{ email.subject || '—' }}
    </div>

    <div class="preview-field">
      <strong>Message:</strong>
      <div class="message-preview">
        {{ email.message || 'No message content' }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmailPreview',
  props: {
    email: Object,
    hasContent: Boolean
  }
}
</script>
