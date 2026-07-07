const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = `https://api.groq.com/openai/v1/chat/completions`;


const SYSTEM_PROMPT = `You are "Vakratunda AI", a helpful and knowledgeable AI civic assistant for Indian citizens. Your role is to:

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
  if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key_here') {
    return getMockResponse(messages[messages.length - 1]?.parts?.[0]?.text || '');
  }

  try {
    // Convert Gemini message format to OpenAI format
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'model' ? 'assistant' : msg.role,
      content: msg.parts?.[0]?.text || msg.content || ''
    }));

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // free, fast model on Groq
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...formattedMessages
        ],
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 0.95
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'I apologize, I was unable to generate a response. Please try again.';

  } catch (error) {
    console.error('Groq API Error:', error);
    return "I'm having trouble connecting right now. Please check your internet connection and try again.";
  }
}

export async function analyzeImage(base64Data, mimeType) {
  // Groq's free tier doesn't support image analysis
  // Keep mock response for image upload feature
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("Civic issue detected in the uploaded image requiring immediate attention.");
    }, 1500);
  });
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

मैं **वक्रतुण्ड AI** हूँ, आपका AI नागरिक सहायक।

मैं आपकी इन विषयों में मदद कर सकता हूँ:

- 📋 **सरकारी योजनाएं** — पीएम किसान, आयुष्मान भारत, आदि
- 🪪 **पहचान पत्र** — आधार, पैन, वोटर आईडी
- 📝 **शिकायत दर्ज करना** — नागरिक समस्याओं की रिपोर्ट
- 🏥 **स्वास्थ्य सेवाएं** — स्वास्थ्य बीमा और अस्पताल
- 🎓 **छात्रवृत्ति** — शिक्षा सहायता योजनाएं

कृपया बताएं, आपको किस विषय में मदद चाहिए?`);
      } else if (msg.includes('scheme') || msg.includes('योजना') || msg.includes('welfare')) {
        resolve(`## Popular Government Schemes 📋

### 💰 Financial Support
- **PM Kisan Samman Nidhi** — ₹6,000/year for farmers
- **PM Ujjwala Yojana** — Free LPG connections for BPL families
- **PM Awas Yojana** — Housing subsidy up to ₹2.67 lakh

### 🏥 Health & Insurance
- **Ayushman Bharat** — ₹5 lakh health coverage/family/year
- **PM Suraksha Bima Yojana** — Accident insurance at ₹20/year

### 🎓 Education
- **National Scholarship Portal** — Various scholarships for students

Would you like detailed information about any specific scheme?`);
      } else {
        resolve(`## Welcome to Vakratunda AI! 🇮🇳

I'm your AI civic companion, here to help you navigate government services and schemes.

### I can help you with:
- 🪪 **Identity Documents** — Aadhaar, PAN, Passport, Voter ID
- 📋 **Government Schemes** — PM Kisan, Ayushman Bharat, Scholarships
- 🚗 **Transport Services** — Driving License, Vehicle Registration
- 📝 **Complaints** — File and track civic issues

### Try asking me:
- *"How do I apply for a new Aadhaar card?"*
- *"पासपोर्ट के लिए कौन से documents चाहिए?"*
- *"Tell me about PM Kisan Yojana"*

What would you like to know?`);
      }
    }, 800 + Math.random() * 1200);
  });
}