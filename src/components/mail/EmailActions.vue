<template>
  <div class="button-container">
    <div class="quick-actions">
      <button class="quick-btn" @click="$emit('insert-template')">
        📝 Use Template
      </button>

      <button class="quick-btn" @click="$emit('clear')">
        🗑️ Clear
      </button>
    </div>

    <div class="action-buttons">
      <button
          class="btn btn-secondary"
          :disabled="!hasContent"
          @click="$emit('save')"
      >
        Save Draft
      </button>

      <button
          class="btn btn-primary"
          :disabled="!canSendEmail"
          @click="$emit('send')"
      >
        Send Email
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmailActions',
  props: {
    email: {
      type: Object,
      required: true
    },
    hasContent: {
      type: Boolean,
      required: true
    },
    canSendEmail: {
      type: Boolean,
      required: true
    }
  }
}
</script>
<style scoped>
.button-container{
  margin:15px;
}
</style>/
