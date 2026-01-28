<template>
  <div class="email-form-fields">
    <div class="form-group">
      <label>To</label>
      <input type="email" v-model="email.to" class="form-input" />
    </div>

    <div class="form-group">
      <label>Subject</label>
      <input type="text" v-model="email.subject" class="form-input" />
    </div>

    <div class="form-group">
      <label>Message</label>
      <textarea
          v-model="email.message"
          rows="12"
          class="form-textarea"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmailForm',
  props: {
    email: {
      type: Object,
      required: true
    }
  }
}
</script>
<style scoped>
.email-form-fields{
  padding: 15px 15px 15px 15px;
}
</style>/
