<template>
  <div class="email-composer">
    <div class="composer-header">
      <h2>Compose New Email</h2>
    </div>

    <form @submit.prevent="sendEmail" class="email-form">
      <div class="form-group">
        <label for="to">To</label>
        <input
            type="email"
            id="to"
            v-model="email.to"
            placeholder="recipient@example.com"
            required
            class="form-input"
            @focus="handleFocus"
            @blur="handleBlur"
        >
      </div>

      <div class="form-group">
        <label for="subject">Subject</label>
        <input
            type="text"
            id="subject"
            v-model="email.subject"
            placeholder="Email subject"
            class="form-input"
            @focus="handleFocus"
            @blur="handleBlur"
        >
      </div>

      <div class="form-group">
        <label for="message">Message</label>
        <textarea
            id="message"
            v-model="email.message"
            placeholder="Write your message here..."
            rows="12"
            class="form-textarea"
            @focus="handleFocus"
            @blur="handleBlur"
        ></textarea>
      </div>

      <!-- Email Preview -->
      <div class="email-preview" v-if="hasContent">
        <h3>Email Preview</h3>
        <div class="preview-content">
          <div class="preview-field">
            <strong>To:</strong> {{ email.to || 'patrickbroehansenwor' }}
          </div>
          <div class="preview-field">
            <strong>Subject:</strong> {{ email.subject || 'test' }}
          </div>
          <div class="preview-field">
            <strong>Message:</strong>
            <div class="message-preview">{{ email.message || 'No message content' }}</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <button type="button" class="quick-btn" @click="insertTemplate">
          📝 Insert Template
        </button>
        <button type="button" class="quick-btn" @click="clearForm">
          🗑️ Clear
        </button>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button
            type="button"
            @click="saveDraft"
            class="btn btn-secondary"
            :disabled="!hasContent"
        >
          Save Draft
        </button>
        <button
            type="submit"
            class="btn btn-primary"
            :disabled="!email.to"
        >
          Send Email
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'EmailComposer',
  data() {
    return {
      email: {
        to: '',
        subject: '',
        message: ''
      }
    }
  },
  computed: {
    hasContent() {
      return this.email.to || this.email.subject || this.email.message
    }
  },
  methods: {
    sendEmail() {
      if (this.email.to) {
        this.$emit('send-email', { ...this.email })
        this.resetForm()
        this.showNotification('Email sent successfully!')
      }
    },
    saveDraft() {
      if (this.hasContent) {
        this.$emit('save-draft', { ...this.email })
        this.showNotification('Draft saved successfully!')
      }
    },
    resetForm() {
      this.email = {
        to: '',
        subject: '',
        message: ''
      }
    },
    insertTemplate() {
      this.email.message = 'Dear recipient,\n\nThank you for your email.\n\nBest regards,\n[Your Name]'
    },
    clearForm() {
      this.resetForm()
      this.showNotification('Form cleared')
    },
    showNotification(message) {
      // Simple notification
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
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 3000)
    },
    handleFocus(event) {
      event.target.classList.add('focused')
      event.target.classList.remove('blurred')
    },
    handleBlur(event) {
      if (!event.target.value) {
        event.target.classList.remove('focused')
        event.target.classList.add('blurred')
      }
    }
  },
  mounted() {
    // Tilføj blur klasse til alle input/textarea ved start
    setTimeout(() => {
      const inputs = this.$el.querySelectorAll('.form-input, .form-textarea')
      inputs.forEach(input => {
        if (!input.value && document.activeElement !== input) {
          input.classList.add('blurred')
        }
      })
    }, 100)
  }
}
</script>

<style scoped>
.email-composer {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.15);
  border: 1px solid #e1e5e9;
  max-width: 900px;
  margin: 0 auto;
}

.composer-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px 35px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.composer-header h2 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.draft-indicator {
  display: flex;
  align-items: center;
  gap: 15px;
}

.draft-badge {
  background: rgba(255, 193, 7, 0.25);
  color: #ffc107;
  padding: 6px 12px;
  border-radius: 14px;
  font-size: 0.9rem;
  font-weight: 500;
}

.clear-draft-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.clear-draft-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.email-form {
  padding: 35px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  font-size: 1.1rem;
}

/* INPUT STYLES - Desktop størrelser */
.form-input, .form-textarea {
  padding: 18px 20px;
  border: 2px solid #e1e5e9;
  border-radius: 14px;
  font-size: 17px;
  font-family: inherit;
  transition: all 0.3s ease;
  background: white;
  width: 100%;
}

/* FOCUSED - Mørkeblå tekst */
.form-input.focused, .form-textarea.focused {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15);
  color: #1a365d !important;
  font-weight: 500;
  border-width: 3px;
}

/* BLURRED - Lys blå tekst */
.form-input.blurred, .form-textarea.blurred {
  color: #90cdf4 !important;
  opacity: 0.9;
}

/* Placeholder */
.form-input::placeholder, .form-textarea::placeholder {
  color: #a0aec0;
  font-size: 16px;
  transition: color 0.3s ease;
}

.form-input.blurred::placeholder, .form-textarea.blurred::placeholder {
  color: #90cdf4 !important;
  opacity: 0.8;
}

.form-input.focused::placeholder, .form-textarea.focused::placeholder {
  color: #a0aec0 !important;
}

.form-textarea {
  resize: vertical;
  min-height: 250px;
  line-height: 1.6;
}

/* Email Preview */
.email-preview {
  background: #f8f9fa;
  border: 1px solid #e1e5e9;
  border-radius: 14px;
  padding: 25px;
  margin-top: 15px;
}

.email-preview h3 {
  color: #333;
  margin-bottom: 18px;
  font-size: 1.3rem;
  font-weight: 600;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.preview-field {
  color: #333;
  line-height: 1.6;
  font-size: 1.05rem;
}

.preview-field strong {
  color: #333;
}

.message-preview {
  background: white;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #e1e5e9;
  margin-top: 10px;
  white-space: pre-wrap;
  color: #333;
  line-height: 1.6;
}

/* Quick Actions */
.quick-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 25px 0 15px 0;
  border-top: 1px solid #e1e5e9;
}

.quick-btn {
  padding: 14px 24px;
  background: #f8f9fa;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
  color: #333;
  font-weight: 500;
  min-width: 140px;
}

.quick-btn:hover:not(:disabled) {
  background: #e9ecef;
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.quick-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.auto-save-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 20px;
  padding-top: 25px;
  border-top: 1px solid #e1e5e9;
}

.btn {
  flex: 1;
  padding: 18px 28px;
  border: none;
  border-radius: 14px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
  min-height: 60px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #545b62;
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(108, 117, 125, 0.4);
}

.btn-secondary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.save-status {
  text-align: center;
  margin-top: 15px;
  color: #666;
  font-size: 0.9rem;
  font-style: italic;
}

/* MOBILE STYLES */
@media (max-width: 768px) {
  .email-composer {
    border-radius: 20px;
    margin: 0 10px;
  }

  .composer-header {
    padding: 25px 30px;
  }

  .composer-header h2 {
    font-size: 1.5rem;
  }

  .email-form {
    padding: 30px 25px;
    gap: 22px;
  }

  .form-input, .form-textarea {
    padding: 16px 18px;
    font-size: 16px;
  }

  .form-textarea {
    min-height: 200px;
  }

  .quick-actions {
    flex-direction: column;
    gap: 12px;
  }

  .quick-btn {
    width: 100%;
    min-width: auto;
    padding: 12px 20px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 15px;
  }

  .btn {
    padding: 16px 24px;
    min-height: 55px;
  }

  .email-preview {
    padding: 20px;
  }

  .email-preview h3 {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .email-composer {
    border-radius: 16px;
    margin: 0 5px;
  }

  .composer-header {
    padding: 20px 25px;
  }

  .composer-header h2 {
    font-size: 1.3rem;
  }

  .email-form {
    padding: 25px 20px;
    gap: 18px;
  }

  .form-input, .form-textarea {
    padding: 14px 16px;
  }

  .form-textarea {
    min-height: 180px;
  }

  .email-preview {
    padding: 18px;
  }
}

/* DARK MODE */
@media (prefers-color-scheme: dark) {
  .email-composer {
    background: #2d2d2d !important;
    border-color: #404040 !important;
  }

  .form-group label {
    color: #e2e8f0 !important;
  }

  .form-input, .form-textarea {
    background: #2d3748 !important;
    border-color: #4a5568 !important;
    color: #e2e8f0 !important;
  }

  .form-input.focused, .form-textarea.focused {
    border-color: #667eea !important;
    background: #2d3748 !important;
    color: #ffffff !important;
    font-weight: 500;
  }

  .form-input.blurred, .form-textarea.blurred {
    color: #a0aec0 !important;
    opacity: 0.8;
  }

  .form-input::placeholder, .form-textarea::placeholder {
    color: #718096 !important;
  }

  .email-preview {
    background: #2d3748 !important;
    border-color: #4a5568 !important;
  }

  .email-preview h3 {
    color: #e2e8f0 !important;
  }

  .preview-field, .preview-field strong {
    color: #e2e8f0 !important;
  }

  .message-preview {
    background: #2d2d2d !important;
    border-color: #4a5568 !important;
    color: #e2e8f0 !important;
  }

  .quick-btn {
    background: #2d3748 !important;
    border-color: #4a5568 !important;
    color: #e2e8f0 !important;
  }

  .quick-btn:hover:not(:disabled) {
    background: #4a5568 !important;
  }

  .save-status {
    color: #a0aec0 !important;
  }
}

/* ANIMATIONS */
@keyframes focusIn {
  from {
    color: #90cdf4;
    opacity: 0.9;
  }
  to {
    color: #1a365d;
    opacity: 1;
  }
}

@keyframes blurOut {
  from {
    color: #1a365d;
    opacity: 1;
  }
  to {
    color: #90cdf4;
    opacity: 0.9;
  }
}

@keyframes focusInDark {
  from {
    color: #a0aec0;
    opacity: 0.8;
  }
  to {
    color: #ffffff;
    opacity: 1;
  }
}

@keyframes blurOutDark {
  from {
    color: #ffffff;
    opacity: 1;
  }
  to {
    color: #a0aec0;
    opacity: 0.8;
  }
}

.form-input.focused, .form-textarea.focused {
  animation: focusIn 0.3s ease forwards;
}

.form-input.blurred, .form-textarea.blurred {
  animation: blurOut 0.3s ease forwards;
}

@media (prefers-color-scheme: dark) {
  .form-input.focused, .form-textarea.focused {
    animation: focusInDark 0.3s ease forwards;
  }

  .form-input.blurred, .form-textarea.blurred {
    animation: blurOutDark 0.3s ease forwards;
  }
}
</style>