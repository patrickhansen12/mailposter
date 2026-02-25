<template>
  <div class="email-form-fields">
    <div class="form-group">
      <label>To</label>
      <input
          type="email"
          :value="modelValue.to"
          @input="updateField('to', $event.target.value)"
          class="form-input"
      />
    </div>

    <div class="form-group">
      <label>Subject</label>
      <input
          type="text"
          :value="modelValue.subject"
          @input="updateField('subject', $event.target.value)"
          class="form-input"
      />
    </div>

    <div class="form-group">
      <label>Message</label>
      <textarea
          :value="modelValue.message"
          @input="updateField('message', $event.target.value)"
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
    modelValue: {
      type: Object,
      required: true
    }
  },

  emits: ['update:modelValue'],

  methods: {
    updateField(field, value) {
      this.$emit('update:modelValue', {
        ...this.modelValue,
        [field]: value
      })
    }
  }
}
</script>
<style scoped>
.email-form-fields{
  padding: 15px 15px 15px 15px;
}
</style>/
