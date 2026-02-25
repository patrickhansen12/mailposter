<template>
  <div id="app">
    <div class="app-container">
      <!-- Login Screen -->
      <div v-if="!isLoggedIn" class="login-screen">
        <div class="login-container">
          <div class="app-logo">
            <span class="logo-icon">✉️</span>
            <h1>MailApp</h1>
          </div>
          <p class="login-subtitle">Please login to start sending emails</p>
          <form @submit.prevent="login" class="login-form">
            <div class="form-group">
              <input
                  type="email"
                  v-model="loginData.email"
                  placeholder="Email address"
                  required
                  class="form-input"
              >
            </div>
            <div class="form-group">
              <input
                  type="password"
                  v-model="loginData.password"
                  placeholder="Password"
                  required
                  class="form-input"
              >
            </div>
            <button type="submit" class="login-btn">Login</button>
          </form>
          <div class="demo-credentials">
            <p>Demo: any email/password works</p>
          </div>
        </div>
      </div>

      <!-- Main App -->
      <div v-else class="main-app">
        <!-- Header -->
        <header class="app-header">
          <div class="header-content">
            <div class="header-left">
              <button @click="toggleSidebar" class="menu-btn">
                <span class="menu-icon">☰</span>
              </button>
              <h1>MailApp</h1>
            </div>
            <button @click="logout" class="logout-btn">Logout</button>
          </div>
        </header>

        <!-- Main Content -->
        <div class="main-content">
          <!-- Sidebar -->
          <div :class="['sidebar', { 'sidebar-open': isSidebarOpen }]">
            <div class="sidebar-content">
              <nav class="sidebar-nav">
                <button
                    :class="['nav-item', { 'active': currentView === 'compose' }]"
                    @click="setView('compose')"
                >
                  <span class="nav-icon">📝</span>
                  <span>Compose</span>
                </button>
                <button
                    :class="['nav-item', { 'active': currentView === 'sent' }]"
                    @click="setView('sent')"
                >
                  <span class="nav-icon">📤</span>
                  <span>Sent</span>
                  <span class="badge" v-if="mailStore.sentEmails.length > 0">{{ mailStore.sentEmails.length }}</span>
                </button>
                <button
                    :class="['nav-item', { 'active': currentView === 'drafts' }]"
                    @click="setView('drafts')"
                >
                  <span class="nav-icon">📁</span>
                  <span>Drafts</span>
                  <div v-if="draftStore.drafts.length > 0">
                  <span class="badge" v-if="draftStore.drafts.length > 0">{{ draftStore.drafts.length ?? 0 }}</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          <!-- Content Area -->
          <div class="content-area">
            <!-- Compose View -->
            <div v-if="currentView === 'compose'" class="view-container">
              <EmailComposer
                  @send-email="sendEmail"
                  @save-draft="saveDraft"
              />
            </div>

            <!-- Sent Emails View -->
            <div v-if="currentView === 'sent'" class="view-container">
              <div class="view-header">
                <h2>Sent Emails</h2>
                <p class="view-subtitle">Your sent email history</p>
              </div>
              <div class="email-list">
                <div
                    v-for="email in mailStore.sentEmails"
                    :key="email.id"
                    class="email-item"
                    @click="viewEmail(email)"
                >
                  <div class="email-header">
                    <div class="email-to"> Reciever: {{ email.recipientEmail }}</div>
                    <div class="email-time">{{ formatTime(email.sentAt) }}</div>
                  </div>
                  <div class="email-subject">Subject: {{ email.subject || '(No subject)' }}</div>
                  <div class="email-preview">{{ getMessagePreview(email.body) }}</div>
                </div>
                <div v-if="mailStore.sentEmails.length === 0" class="empty-state">
                  <span class="empty-icon">📤</span>
                  <h3>No sent emails</h3>
                  <p>Your sent emails will appear here</p>
                </div>
              </div>
            </div>

            <!-- Drafts View -->
            <!-- Drafts View -->
            <div v-if="currentView === 'drafts'" class="view-container">
              <div class="view-header">
                <h2>Drafts</h2>
                <p class="view-subtitle">Your saved drafts</p>
              </div>

              <div class="email-list">
                <div
                    v-for="draft in draftStore.drafts"
                    :key="draft.id"
                    class="email-item draft-item"
                    @click="editDraft(draft)"
                >
                  <div class="email-header">
                    <div class="email-to">
                      {{ draft.recipientEmail || 'No recipient' }}
                    </div>

                    <div style="display:flex; align-items:center; gap:12px;">
                      <div class="email-time">
                        {{ formatTime(draft.updatedAt || draft.createdAt) }}
                      </div>

                      <button
                          class="delete-draft-btn"
                          @click.stop="confirmDeleteDraft(draft)"
                          title="Delete draft"
                      >
                        🗑
                      </button>
                    </div>
                  </div>

                  <div class="email-subject">
                    {{ draft.subject || '(No subject)' }}
                  </div>

                  <div class="email-preview">
                    {{ getMessagePreview(draft.body) }}
                  </div>

                  <div class="draft-info">
                    Created: {{ formatTime(draft.createdAt) }} |
                    Updated: {{ formatTime(draft.updatedAt) }}
                  </div>
                </div>

                <div v-if="draftStore.drafts.length === 0" class="empty-state">
                  <span class="empty-icon">📁</span>
                  <h3>No drafts</h3>
                  <p>Your saved drafts will appear here</p>
                </div>
              </div>
            </div>
        </div>

        <!-- Mobile Overlay -->
        <div
            v-if="isSidebarOpen"
            class="sidebar-overlay"
            @click="toggleSidebar"
        ></div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import EmailComposer from './components/mail/EmailComposer.vue'
import { useAuthStore } from './stores/authStore'
import { useMailStore } from './stores/mailStore'
import { useDraftStore } from './stores/draftStore'

export default {
  name: 'App',
  components: { EmailComposer },

  data() {
    return {
      isSidebarOpen: false,
      currentView: 'compose',
      loginData: {
        email: '',
        password: ''
      },
    }
  },

  computed: {
    authStore() {
      return useAuthStore()
    },
    isLoggedIn() {
      return !!this.authStore.userId
    },
    mailStore() {
      return useMailStore()
    },
    draftStore() {
      return useDraftStore()
    }
  },


  methods: {
    login() {
      if (this.loginData.email && this.loginData.password) {
        this.authStore.login({
          id: crypto.randomUUID(),
          email: this.loginData.email
        })
        //gets the sent mails
        const mailStore = useMailStore()
        mailStore.fetchSentEmails()

        //gets all the logged in users drafts
        const draftStore = useDraftStore()
        draftStore.loadDrafts(this.loginData.email)

        this.loginData = { email: '', password: '' }
      }
    },
    async confirmDeleteDraft(draft) {
      const recipient = draft.recipientEmail || 'No recipient'
      const subject = draft.subject || '(No subject)'

      const confirmed = confirm(
          `Are you sure you want to delete this draft?\n\nTo: ${recipient}\nSubject: ${subject}`
      )

      if (!confirmed) return

      await this.draftStore.removeDraft(draft.id)
    },
    logout() {
      this.authStore.logout()
      this.currentView = 'compose'
      this.isSidebarOpen = false
      const draftStore = useDraftStore()
      const mailStore = useMailStore()
      draftStore.$reset()
      mailStore.$reset()
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    },
    setView(view) {
      this.currentView = view
      // On mobile, close sidebar after selecting view
      if (window.innerWidth < 768) {
        this.isSidebarOpen = false
      }
    },
    handleResize() {
      // Auto-show sidebar on desktop, hide on mobile
      if (window.innerWidth >= 768) {
        this.isSidebarOpen = true
      } else {
        this.isSidebarOpen = false
      }
    },
    sendEmail(emailData) {
      this.sentEmails.unshift({
        ...emailData,
        id: Date.now(),
        timestamp: new Date().toISOString()
      })
    },
    saveDraft(draftData) {
      if (draftData.to || draftData.subject || draftData.message) {
        // Remove existing draft with same content to avoid duplicates
        this.drafts = this.drafts.filter(draft =>
            draft.to !== draftData.to ||
            draft.subject !== draftData.subject
        )
        this.drafts.unshift({
          ...draftData,
          id: Date.now()
        })
      }
    },
    viewEmail(email) {
      alert(`To: ${email.recipientEmail}\nSubject: ${email.subject}\n\n${email.body}`)
    },
    editDraft(draft) {
      const draftStore = useDraftStore()
      draftStore.setCurrentDraft(draft)
      this.currentView = 'compose'
    },
    formatTime(timestamp) {
      try {
        const date = new Date(timestamp)
        // Check if date is valid
        if (isNaN(date.getTime())) {
          return 'Recent'
        }
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch (error) {
        return 'Recent'
      }
    },
    getMessagePreview(message) {
      if (!message) return 'No message content'
      return message.length > 60 ? message.substring(0, 60) + '...' : message
    }
  }
}
</script>

<style>
/* App Container */
.app-container {
  min-height: 100vh;
}

/* Login Screen */
.login-screen {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.login-container {
  background: white;
  padding: 50px 40px;
  border-radius: 24px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  text-align: center;
  max-width: 480px;
  width: 100%;
}

.app-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.logo-icon {
  font-size: 2.5rem;
}

.app-logo h1 {
  color: #333;
  font-size: 2.2rem;
  font-weight: 700;
}

.login-subtitle {
  color: #666;
  margin-bottom: 35px;
  font-size: 1.2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-input {
  width: 100%;
  padding: 18px;
  border: 2px solid #e1e5e9;
  border-radius: 14px;
  font-size: 17px;
  transition: all 0.3s;
  background: white;
  color: #333;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15);
}

.login-btn {
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}

.login-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.demo-info {
  margin-top: 25px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  border: 1px solid #e1e5e9;
}

.demo-info p {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

/* Main App */
.main-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: white;
  border-bottom: 1px solid #e1e5e9;
  padding: 20px 40px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.menu-btn {
  display: none; /* Skjult på desktop */
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  padding: 10px;
  border-radius: 10px;
  transition: background-color 0.3s;
}

.menu-btn:hover {
  background: #f5f5f5;
}

.app-header h1 {
  color: #333;
  font-size: 1.6rem;
  font-weight: 700;
}

.logout-btn {
  padding: 12px 24px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: #c82333;
  transform: translateY(-2px);
}

/* Main Content - DESKTOP FIRST */
.main-content {
  flex: 1;
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  position: relative;
}

/* Sidebar - ALTID synlig på desktop */
.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e1e5e9;
  padding: 40px 0;
  flex-shrink: 0;
}

.sidebar-content {
  padding: 0 25px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 18px 25px;
  background: none;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  text-align: left;
  font-size: 1.1rem;
  color: #666;
  transition: all 0.3s;
  position: relative;
  font-weight: 500;
}

.nav-item:hover {
  background: #f8f9fa;
  color: #333;
  transform: translateX(5px);
}

.nav-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.nav-icon {
  font-size: 1.4rem;
}

.badge {
  background: #dc3545;
  color: white;
  border-radius: 12px;
  padding: 5px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-left: auto;
}

/* Content Area */
.content-area {
  flex: 1;
  padding: 40px;
  background: #f8f9fa;
  min-height: calc(100vh - 80px);
  overflow-y: auto;
}

.view-container {
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

.view-header {
  margin-bottom: 35px;
}

.view-header h2 {
  color: #333;
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.view-subtitle {
  color: #666;
  font-size: 1.1rem;
}

/* Email List */
.email-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.email-item {
  background: white;
  padding: 25px;
  border-radius: 18px;
  border: 1px solid #e1e5e9;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.email-item:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  transform: translateY(-3px);
  border-color: #667eea;
}

.email-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  gap: 20px;
}

.email-to {
  font-weight: 600;
  color: #333;
  font-size: 1.1rem;
  word-break: break-all;
}

.email-time {
  font-size: 0.9rem;
  color: #666;
  white-space: nowrap;
  flex-shrink: 0;
}

.email-subject {
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.email-preview {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
}

/* Draft specific styling */
.email-item.draft {
  border-left: 5px solid #ffc107;
  background: #fffbf0;
  position: relative;
}

.email-item.draft:hover {
  background: #fff8e1;
}

.draft-info {
  margin-top: 10px;
  color: #666;
  font-size: 0.9rem;
}

.delete-draft-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s;
}

.delete-draft-btn:hover {
  background-color: rgba(220, 53, 69, 0.1);
  transform: scale(1.1);
}

.edit-btn {
  margin-top: 15px;
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.edit-btn:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 40px;
  color: #666;
  background: white;
  border-radius: 20px;
  border: 2px dashed #e1e5e9;
  margin-top: 20px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 25px;
  display: block;
  opacity: 0.7;
}

.empty-state h3 {
  margin-bottom: 15px;
  color: #333;
  font-size: 1.5rem;
}

.empty-state p {
  font-size: 1.1rem;
  opacity: 0.8;
  max-width: 400px;
  margin: 0 auto;
  line-height: 1.6;
}

/* MOBILE STYLES - Kun aktiv på mobile */
@media (max-width: 1024px) {
  .header-content,
  .main-content {
    max-width: 95%;
  }

  .content-area {
    padding: 30px;
  }

  .email-item {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .login-screen {
    padding: 20px;
  }

  .login-container {
    padding: 40px 30px;
    max-width: 90%;
  }

  .app-header {
    padding: 15px 20px;
  }

  .header-content {
    max-width: 100%;
    padding: 0 10px;
  }

  /* Vis menu knap på mobile */
  .menu-btn {
    display: block;
  }

  /* Sidebar som drawer på mobile */
  .sidebar {
    position: fixed;
    top: 0;
    left: -300px;
    width: 300px;
    height: 100vh;
    z-index: 1000;
    transition: left 0.3s ease;
    padding-top: 80px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  }

  .sidebar-open {
    left: 0;
  }

  .main-content {
    max-width: 100%;
  }

  .content-area {
    padding: 25px 20px;
    width: 100%;
  }

  .view-header h2 {
    font-size: 1.8rem;
  }

  .view-subtitle {
    font-size: 1rem;
  }

  .empty-state {
    padding: 50px 20px;
  }

  .empty-icon {
    font-size: 3rem;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 30px 25px;
  }

  .app-logo h1 {
    font-size: 1.8rem;
  }

  .app-header {
    padding: 12px 15px;
  }

  .app-header h1 {
    font-size: 1.3rem;
  }

  .logout-btn {
    padding: 8px 16px;
    font-size: 0.9rem;
  }

  .content-area {
    padding: 20px 15px;
  }

  .email-item {
    padding: 18px;
  }

  .email-header {
    flex-direction: column;
    gap: 10px;
  }

  .email-time {
    align-self: flex-start;
  }

  .view-header h2 {
    font-size: 1.6rem;
  }

  .empty-state {
    padding: 40px 15px;
  }

  .empty-state h3 {
    font-size: 1.3rem;
  }

  .empty-state p {
    font-size: 1rem;
  }
}

/* Sidebar Overlay - Kun på mobile */
.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

@media (max-width: 768px) {
  .sidebar-overlay {
    display: block;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .login-container {
    background: #2d2d2d;
  }

  .app-logo h1 {
    color: #e1e5e9;
  }

  .login-subtitle {
    color: #a0aec0;
  }

  .form-input {
    background: #2d3748;
    border-color: #4a5568;
    color: #e1e5e9;
  }

  .demo-info {
    background: #2d3748;
    border-color: #4a5568;
  }

  .demo-info p {
    color: #a0aec0;
  }

  .app-header {
    background: #2d2d2d;
    border-color: #404040;
  }

  .app-header h1 {
    color: #e1e5e9;
  }

  .menu-btn:hover {
    background: #404040;
  }

  .sidebar {
    background: #2d2d2d;
    border-color: #404040;
  }

  .nav-item:hover {
    background: #404040;
    color: #e1e5e9;
  }

  .content-area {
    background: #1a1a1a;
  }

  .email-item {
    background: #2d2d2d;
    border-color: #404040;
  }

  .email-to, .email-subject {
    color: #e1e5e9;
  }

  .email-time, .email-preview {
    color: #a0aec0;
  }

  .email-item.draft {
    background: #3d2d1a;
    border-left-color: #ffc107;
  }

  .email-item.draft:hover {
    background: #4a381f;
  }

  .draft-info {
    color: #a0aec0;
  }

  .empty-state {
    background: #2d2d2d;
    border-color: #404040;
    color: #a0aec0;
  }

  .empty-state h3 {
    color: #e1e5e9;
  }
}
</style>