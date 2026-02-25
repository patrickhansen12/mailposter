# MailPoster (Frontend)

MailPoster is a Vue 3 + Pinia single-page application that functions as the frontend client for the MailPosterAPI.

It allows users to compose emails, save drafts, delete drafts, and send emails through a connected backend API.

This project is intended as a portfolio project demonstrating full-stack integration between a Vue frontend and an ASP.NET Core Web API.

---

## 🚀 Features

- Compose and send emails
- Save drafts automatically
- Load and edit saved drafts
- Delete drafts with confirmation
- Email preview before sending
- User separation via custom header (X-User-Email)
- Pinia state management
- Responsive design

---

## 🛠 Tech Stack

Frontend:
- Vue 3 (Options API)
- Pinia (state management)
- Vite

Backend (separate project):
- ASP.NET Core Web API
- Entity Framework Core
- RESTful endpoints

---

## 🔗 Backend Dependency

This frontend requires the **MailPosterAPI** backend to be running locally.

Default API base URL: https://localhost:5001/api

Make sure MailPosterAPI is running before starting this project.

---

