import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, ArrowDown, Mic } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { sendMessage } from '../utils/GroqApi';

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 message-enter">
      <div className="w-8 h-8 rounded-lg bg-[#111115] border border-white/10 flex items-center justify-center shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-[#111115] border border-white/10 rounded-2xl rounded-tl-md px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce-dot" />
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce-dot" style={{ animationDelay: '0.16s' }} />
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce-dot" style={{ animationDelay: '0.32s' }} />
        </div>
      </div>
    </div>
  );
}

function formatMessage(text) {
  // Convert markdown-like formatting to HTML
  const lines = text.split('\n');
  const elements = [];
  let inList = false;
  let listItems = [];

  const processInline = (line) => {
    // Bold
    line = line.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
    // Italic
    line = line.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Inline code
    line = line.replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded bg-white/10 text-pink-400 text-sm font-mono">$1</code>');
    // Links
    line = line.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-pink-400 hover:underline">$1</a>');
    return line;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      if (inList) {
        elements.push(`<ul class="space-y-1 my-2">${listItems.join('')}</ul>`);
        listItems = [];
        inList = false;
      }
      elements.push(`<h3 class="text-base font-semibold text-white mt-3 mb-1.5">${processInline(line.slice(3))}</h3>`);
    } else if (line.startsWith('### ')) {
      if (inList) {
        elements.push(`<ul class="space-y-1 my-2">${listItems.join('')}</ul>`);
        listItems = [];
        inList = false;
      }
      elements.push(`<h4 class="text-sm font-semibold text-pink-400 mt-3 mb-1">${processInline(line.slice(4))}</h4>`);
    } else if (line.match(/^[-*] /)) {
      inList = true;
      listItems.push(`<li class="text-sm text-gray-400 flex items-start gap-2"><span class="text-pink-500 mt-1.5 shrink-0">•</span><span>${processInline(line.slice(2))}</span></li>`);
    } else if (line.match(/^\d+\. /)) {
      inList = true;
      const num = line.match(/^(\d+)\. /)[1];
      listItems.push(`<li class="text-sm text-gray-400 flex items-start gap-2"><span class="text-pink-500 font-medium shrink-0">${num}.</span><span>${processInline(line.replace(/^\d+\. /, ''))}</span></li>`);
    } else if (line.trim() === '') {
      if (inList) {
        elements.push(`<ul class="space-y-1 my-2">${listItems.join('')}</ul>`);
        listItems = [];
        inList = false;
      }
      elements.push('<div class="h-2"></div>');
    } else {
      if (inList) {
        elements.push(`<ul class="space-y-1 my-2">${listItems.join('')}</ul>`);
        listItems = [];
        inList = false;
      }
      elements.push(`<p class="text-sm text-gray-400 leading-relaxed">${processInline(line)}</p>`);
    }
  }

  if (inList) {
    elements.push(`<ul class="space-y-1 my-2">${listItems.join('')}</ul>`);
  }

  return elements.join('');
}

export default function ChatWidget({ initialMessage = null }) {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: t('chatWelcome'),
    }
  ]);
  const [input, setInput] = useState(initialMessage || '');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const initialSent = useRef(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev + ' ' + transcript).trim());
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Auto-send initial message (e.g., from service directory)
  useEffect(() => {
    if (initialMessage && !initialSent.current) {
      initialSent.current = true;
      handleSend(null, initialMessage);
    }
  }, [initialMessage]);

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
  };

  const handleSend = async (e, overrideMessage = null) => {
    e?.preventDefault();
    const msg = overrideMessage || input.trim();
    if (!msg || isLoading) return;

    const userMessage = { role: 'user', content: msg };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for Gemini
      const history = [...messages, userMessage].map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      // Add language context
      if (language === 'hi') {
        history.push({
          role: 'user',
          parts: [{ text: `(System note: User prefers Hindi. Please respond in Hindi. The user's actual message is: ${msg})` }]
        });
        history.pop(); // Remove the duplicate
        // Modify last user message to include language hint
        history[history.length - 1] = {
          role: 'user',
          parts: [{ text: `${msg}\n\n(कृपया हिंदी में उत्तर दें)` }]
        };
      }

      const response = await sendMessage(history);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#0a0a0b]">
      {/* Chat Header */}
      <div className="shrink-0 px-4 sm:px-6 py-4 border-b border-white/10 bg-[#0d0d0f]">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#111115] border border-white/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-pink-500" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-white">{t('chatTitle')}</h1>
            <p className="text-xs text-gray-500">{t('chatSubtitle')}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 border border-success/20">
            <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
            <span className="text-xs text-success font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 message-enter ${msg.role === 'user' ? 'flex-row-reverse' : ''
                }`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user'
                  ? 'bg-white/10 border border-white/20'
                  : 'bg-[#111115] border border-white/10'
                }`}>
                {msg.role === 'user'
                  ? <User className="w-4 h-4 text-white" />
                  : <Bot className="w-4 h-4 text-white" />
                }
              </div>

              {/* Bubble */}
              <div className={`max-w-[85%] sm:max-w-[75%] ${msg.role === 'user'
                  ? 'bg-white text-black rounded-2xl rounded-tr-md px-4 py-3'
                  : 'bg-[#111115] border border-white/10 rounded-2xl rounded-tl-md px-4 py-3'
                }`}>
                {msg.role === 'user' ? (
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                ) : (
                  <div
                    className="prose-chat"
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                  />
                )}
              </div>
            </div>
          ))}

          {messages.length === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 animate-fade-in">
              {[
                "How do I apply for Aadhaar?",
                "What documents for ration card?",
                "How to file RTI?",
                "PM-Kisan eligibility criteria?"
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(null, chip)}
                  className="bg-[#111115] text-white text-sm text-left p-4 rounded-xl border border-white/10 hover:border-pink-500 hover:bg-[#1c1c24] transition-all duration-200"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to bottom button */}
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#111115] border border-white/20 
                     flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1c1c24] 
                     transition-all duration-200 shadow-lg"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      )}

      {/* Input */}
      <div className="shrink-0 px-4 sm:px-6 py-4 border-t border-white/10 bg-[#0d0d0f]">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('chatPlaceholder')}
            disabled={isLoading}
            className="w-full bg-[#111115] border border-white/10 rounded-xl px-4 py-3.5 pr-24 text-sm text-white 
                       placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50
                       disabled:opacity-50 transition-all duration-200"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              type="button"
              onClick={toggleListening}
              className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${isListening
                  ? 'bg-red-500/10 text-red-500'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Mic className="w-4 h-4" />
              {isListening && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
            </button>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-lg bg-pink-500 
                         flex items-center justify-center text-white hover:bg-pink-600 
                         disabled:opacity-30 disabled:hover:bg-pink-500 transition-all duration-200"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
