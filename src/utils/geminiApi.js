const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are "Smart Bharat", a helpful and knowledgeable AI civic assistant for Indian citizens. Your role is to:

1. Explain government schemes, policies, and services in simple, easy-to-understand language
2. Guide citizens through processes like applying for documents, registering complaints, or accessing welfare programs
3. Provide accurate information about required documents, eligibility criteria, and step-by-step procedures
4. Be empathetic and patient, understanding that many users may not be familiar with bureaucratic processes

Guidelines:
- Respond in the same language the user writes in (English or Hindi)
- Be concise and structured — use bullet points and numbered steps when explaining processes
- If you're unsure about specific details (like exact fees or office addresses), say so and suggest official sources
- Always be respectful and encouraging
- Format your responses with clear headings and sections when appropriate
- Keep responses focused and practical`;

export async function sendMessage(messages) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    // Return a mock response for demo when no API key is set
    return getMockResponse(messages[messages.length - 1]?.parts?.[0]?.text || '');
  }

  try {
    const contents = [
      {
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT }]
      },
      {
        role: 'model',
        parts: [{ text: 'Namaste! I am Smart Bharat, your AI civic companion. I\'m here to help you navigate government services, schemes, and processes. How can I assist you today? आप हिंदी या English में बात कर सकते हैं।' }]
      },
      ...messages
    ];

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, I was unable to generate a response. Please try again.';
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'I\'m having trouble connecting right now. Please check your internet connection and try again. If the problem persists, the API key might need to be configured.';
  }
}

export async function analyzeImage(base64Data, mimeType) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve("Pothole on main road causing traffic disruption and safety hazard.");
      }, 1500);
    });
  }

  try {
    // Remove the data:image/jpeg;base64, prefix if present
    const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, "");
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: "Describe this civic issue in one sentence for a complaint report." },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Clean
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 100,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Could not analyze the image.';
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'Failed to analyze the image. Please describe the issue manually.';
  }
}

function getMockResponse(userMessage) {
  const msg = userMessage.toLowerCase();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      if (msg.includes('aadhaar') || msg.includes('आधार')) {
        resolve(`## Aadhaar Card Services 🪪

Here's how you can apply for or update your Aadhaar card:

### New Aadhaar Card
1. Visit your nearest **Aadhaar Enrollment Center**
2. Carry the following documents:
   - Proof of Identity (Passport, PAN, Voter ID)
   - Proof of Address (Utility bill, Bank statement)
   - Proof of Date of Birth
3. Biometric data (fingerprints, iris scan, photo) will be captured
4. You'll receive an **enrollment slip** with a 14-digit EID

### Update Existing Aadhaar
- Visit [myaadhaar.uidai.gov.in](https://myaadhaar.uidai.gov.in)
- You can update: Name, Address, Mobile, Email, Date of Birth
- Some updates require visiting an enrollment center

### Timeline
- New Aadhaar: **60-90 days**
- Updates: **7-15 days** (online), **30 days** (offline)

Would you like more details about any specific Aadhaar service?`);
      } else if (msg.includes('passport') || msg.includes('पासपोर्ट')) {
        resolve(`## Passport Application Guide 🛂

### Types of Passport
- **Ordinary Passport** (Blue) — for regular citizens
- **Official Passport** (White) — for government officials
- **Diplomatic Passport** (Red) — for diplomats

### How to Apply
1. Register on [passportindia.gov.in](https://passportindia.gov.in)
2. Fill the online application form
3. Pay the fee online:
   - Normal (36 pages): **₹1,500**
   - Tatkal: **₹3,500**
4. Book an appointment at your nearest Passport Seva Kendra
5. Visit with original documents for verification

### Documents Required
- Aadhaar Card
- PAN Card
- Address Proof
- Birth Certificate (for minors)

### Processing Time
- Normal: **30-45 days**
- Tatkal: **1-3 days**

Need help with anything else?`);
      } else if (msg.includes('hindi') || msg.includes('हिंदी') || msg.includes('हिन्दी')) {
        resolve(`## नमस्ते! 🙏

मैं **स्मार्ट भारत** हूँ, आपका AI नागरिक सहायक।

मैं आपकी इन विषयों में मदद कर सकता हूँ:

- 📋 **सरकारी योजनाएं** — पीएम किसान, आयुष्मान भारत, आदि
- 🪪 **पहचान पत्र** — आधार, पैन, वोटर आईडी
- 📝 **शिकायत दर्ज करना** — नागरिक समस्याओं की रिपोर्ट
- 🏥 **स्वास्थ्य सेवाएं** — स्वास्थ्य बीमा और अस्पताल
- 🎓 **छात्रवृत्ति** — शिक्षा सहायता योजनाएं

कृपया बताएं, आपको किस विषय में मदद चाहिए?`);
      } else if (msg.includes('scheme') || msg.includes('योजना') || msg.includes('welfare')) {
        resolve(`## Popular Government Schemes 📋

Here are some key welfare schemes you should know about:

### 💰 Financial Support
- **PM Kisan Samman Nidhi** — ₹6,000/year for farmers
- **PM Ujjwala Yojana** — Free LPG connections for BPL families
- **PM Awas Yojana** — Housing subsidy up to ₹2.67 lakh

### 🏥 Health & Insurance
- **Ayushman Bharat** — ₹5 lakh health coverage/family/year
- **PM Suraksha Bima Yojana** — Accident insurance at ₹20/year

### 🎓 Education
- **National Scholarship Portal** — Various scholarships for students
- **PM Vidya Lakshmi** — Education loans at subsidized rates

### 👩 Women Empowerment
- **Beti Bachao Beti Padhao** — Girl child welfare
- **PM Matru Vandana Yojana** — ₹5,000 for pregnant women

Would you like detailed information about any specific scheme?`);
      } else {
        resolve(`## Welcome to Smart Bharat! 🇮🇳

I'm your AI civic companion, here to help you navigate government services and schemes.

### I can help you with:

- 🪪 **Identity Documents** — Aadhaar, PAN, Passport, Voter ID
- 📋 **Government Schemes** — PM Kisan, Ayushman Bharat, Scholarships
- 🚗 **Transport Services** — Driving License, Vehicle Registration
- 🏠 **Property** — Registration, Land Records
- 📝 **Complaints** — File and track civic issues
- 💰 **Finance** — Tax, Banking, Insurance schemes

### Try asking me:
- *"How do I apply for a new Aadhaar card?"*
- *"पासपोर्ट के लिए कौन से documents चाहिए?"*
- *"Tell me about PM Kisan Yojana"*
- *"मुझे आयुष्मान भारत के बारे में बताएं"*

What would you like to know?`);
      }
    }, 800 + Math.random() * 1200);
  });
}
