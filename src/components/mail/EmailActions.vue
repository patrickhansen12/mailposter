<template>
  <div>
    <div class="quick-actions">
      <button class="quick-btn" @click="$emit('insert-template')">
        📝 Insert Template
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
          :disabled="!email.to"
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
    email: Object,
    hasContent: Boolean
  }
}
</script>
