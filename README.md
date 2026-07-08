#  Vakratunda AI — AI-Powered Civic Companion

> Divine Intelligence for Every Citizen

Built for **PromptWars x Devengers Hackathon** — Google for Developers | Build with AI

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat&logo=tailwindcss)
![Groq](https://img.shields.io/badge/Groq-Llama3-F55036?style=flat&logo=groq)

---

## 📌 Problem Statement

**Smart Bharat – AI-Powered Civic Companion**

Build a GenAI-powered civic platform that helps citizens access government services, report public issues, and receive personalized assistance through an intelligent AI companion. The solution must simplify complex government information, answer citizen queries, recommend relevant public services, assist with document requirements, track complaints, and provide multilingual support.

---

## ✨ Features

### 🤖 AI Chat Companion
- Conversational AI powered by **Groq (Llama 3 8B)** — ultra-fast free inference
- Answers questions about government schemes, documents, and eligibility
- Bilingual support — responds in **English or Hindi** automatically
- Markdown rendering for structured AI responses
- Animated typing indicator and smooth message bubbles
- Suggested question chips for first-time users
- Built-in mock responses as fallback (works offline/without API key)

### 🗂️ Service Directory
- 10 government services with full bilingual data
- Search bar + category filter chips (8 categories)
- Service detail modal with documents required
- "Ask AI about this" button — pre-fills chat with a contextual question

### 📝 Report an Issue
- Clean dark-themed complaint form
- Auto-generates a unique ticket ID (e.g., `CIV-2026-0431`)
- Stores complaints in localStorage
- Copy-to-clipboard on ticket ID
- Optional photo upload feature

### 📍 Track Complaint
- Enter ticket ID to see live status
- Beautiful stepper timeline (horizontal on desktop, vertical on mobile)
- Pink glow on current step, muted for pending

### 🌐 Bilingual UI
- One-click toggle between English and हिंदी
- All UI labels, headings, and descriptions switch instantly
- AI chat adapts language to match user preference

### 🎙️ Voice Input
- Speak your query instead of typing
- Uses browser Web Speech API (no extra cost)
- Auto-detects language — `hi-IN` for Hindi, `en-IN` for English

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite 8 |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| Routing | react-router-dom |
| AI | Groq API (Llama 3 8B — free tier) |
| Storage | localStorage (mock backend) |
| Deploy | Vercel |

---

## 🎨 Design System

- **Base background:** `#0a0a0b`
- **Surface:** `#16161a`
- **Cards:** `#1c1c21`
- **Accent:** `#ec4899` (pink) — used sparingly
- **Font:** Inter (Google Fonts)
- Effects: gradient mesh hero, floating orbs, glassmorphism navbar, glow buttons

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Glass-effect navbar with language toggle
│   ├── Hero.jsx            # Animated hero with quick-access cards
│   ├── ChatWidget.jsx      # Full AI chat interface
│   ├── ServiceCard.jsx     # Government service cards
│   ├── ServiceModal.jsx    # Service detail modal
│   ├── ComplaintForm.jsx   # Issue reporting form
│   ├── StatusTracker.jsx   # Complaint status stepper
│   └── Footer.jsx          # Footer with links
├── pages/
│   ├── HomePage.jsx
│   ├── ChatPage.jsx
│   ├── ServicesPage.jsx
│   ├── ReportPage.jsx
│   └── TrackPage.jsx
├── context/
│   └── LanguageContext.jsx # English/Hindi translations
├── data/
│   └── services.json       # 10 government services (bilingual)
├── utils/
│   └── geminiApi.js        # Groq API wrapper + mock fallback
├── index.css               # Tailwind v4 theme + custom CSS
├── App.jsx                 # Router setup
└── main.jsx                # Entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A free Groq API key from [console.groq.com](https://console.groq.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/vakratunda-ai.git
cd vakratunda-ai

# Install dependencies
npm install

# Add your Groq API key
echo "VITE_GROQ_API_KEY=gsk_your_key_here" > .env

# Start the development server
npm run dev
```

App runs at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Deploy to Vercel (one command)

```bash
npx vercel --prod
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
VITE_GROQ_API_KEY=gsk_your_groq_api_key_here
```

> **Note:** The app works without an API key using built-in mock responses — useful for offline demos.

> **Never commit your `.env` file.** It's already in `.gitignore`.

---

## 🤖 Getting Your Free Groq API Key

1. Go to 👉 [console.groq.com](https://console.groq.com)
2. Sign up with your Google account
3. Click **"API Keys"** → **"Create API Key"**
4. Copy the key — it starts with `gsk_`
5. Paste it in your `.env` file as `VITE_GROQ_API_KEY`

---

## 🧪 API Key Verification

Test your Groq key in the browser console:

```javascript
fetch(`https://api.groq.com/openai/v1/chat/completions`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer gsk_YOUR_KEY_HERE"
  },
  body: JSON.stringify({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: "Say hello." }],
    max_tokens: 50
  })
})
.then(r => r.json())
.then(d => console.log("✅", d?.choices?.[0]?.message?.content))
.catch(e => console.error("❌", e))
```

---

## 📊 Groq Free Tier Limits

| Limit | Value |
|---|---|
| Requests per day | 14,400 |
| Requests per minute | 30 RPM |
| Tokens per minute | 6,000 TPM |
| Cost | Free (no credit card) |

---

## 🗺️ Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero, quick-access cards |
| `/chat` | AI Chat | Groq-powered civic assistant |
| `/services` | Services | Government service directory |
| `/report` | Report Issue | File a civic complaint |
| `/track` | Track Complaint | Check complaint status |

---

## 🏆 Hackathon Challenge Coverage

| Requirement | Status |
|---|---|
| Simplify government information | ✅ AI Chat |
| Answer citizen queries | ✅ Groq Llama 3 |
| Recommend public services | ✅ Service Directory + AI |
| Assist with document requirements | ✅ Service Modal |
| Track complaints | ✅ Status Tracker |
| Multilingual support | ✅ English + Hindi |
| Promote transparency | ✅ Open ticket tracking |
| Digital inclusion | ✅ Voice input + simple UI |

---

## 👥 Team

Built with ❤️ for **PromptWars x Devengers** — Google for Developers Build with AI Hackathon, 2026.

---

## ⚠️ Disclaimer

This is a hackathon demo project. Vakratunda AI is not affiliated with any government body. All government service data is for demonstration purposes only. Always verify information on official government portals.

---

