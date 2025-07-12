import React, { useState, useEffect, useRef } from 'react';
import './Doubt_assistant.css';
import ReactMarkdown from "react-markdown";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const baseUrl = import.meta.env.VITE_BASE_URL ;


const AskAI = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]); // {role: 'user'|'assistant', content: string}
  const [displayed, setDisplayed] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const chatEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, displayed]);

  // Typewriter effect for latest assistant message
  useEffect(() => {
    if (!messages.length) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role !== 'assistant') return;
    setDisplayed('');
    let i = 0;
    const str = String(lastMsg.content);
    const interval = setInterval(() => {
      if (i < str.length) {
        setDisplayed(prev => prev + str[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [messages]);

  // Voice assistant logic
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecognition(null);
      return;
    }
    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.interimResults = false;
    recog.lang = 'en-US';

    recog.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
      setListening(false);
    };
    recog.onerror = (event) => {
      setListening(false);
      setError('Voice recognition error: ' + event.error);
    };
    recog.onend = () => setListening(false);

    setRecognition(recog);
  }, []);

  const token = localStorage.getItem('token');

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: prompt }]);
    setPrompt('');
    try {
      

      const res = await fetch(`${baseUrl}/gemini`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
         },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error('Failed to get response');
      const data = await res.json();
      let x = data.result;
      if (x === undefined || x === null || x === "undefined") x = "";
      x = x + `\n\n Thank you :)`;
      setMessages(prev => [...prev, { role: 'assistant', content: x }]);
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render chat bubbles
  const renderMessages = () => {
    return messages.map((msg, idx) => {
      const isUser = msg.role === 'user';
      const isLastAssistant = msg.role === 'assistant' && idx === messages.length - 1;
      return (
        <div
          key={idx}
          style={{
            display: 'flex',
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            marginBottom: 10,
          }}
        >
          <div
            style={{
              maxWidth: '80%',
              background: isUser ? '#2b4eff' : '#f4f8ff',
              color: isUser ? '#fff' : '#222',
              borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              padding: '12px 16px',
              fontSize: 16,
              fontFamily: 'inherit',
              boxShadow: isUser ? '0 2px 8px #2b4eff22' : '0 2px 8px #2b4eff11',
              border: isUser ? '1.5px solid #2b4eff' : '1.5px solid #e6e8ec',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
              position: 'relative',
              minWidth: 40,
            }}
          >
            {isUser ? (
              msg.content
            ) : isLastAssistant ? (
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {displayed || ''}
              </ReactMarkdown>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {msg.content}
              </ReactMarkdown>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="ask-ai-chatgpt" style={{ maxWidth: 650, margin: '32px auto', height: '80vh', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(43,78,255,0.08)', border: '1.5px solid #e6e8ec', overflow: 'hidden' }}>
      <h3 style={{ color: '#2b4eff', fontWeight: 700, fontSize: 28, margin: '18px 0 0 0', textAlign: 'center', letterSpacing: 0.5, flexShrink: 0 }}>ZTO Doubt Assistant</h3>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 12px 12px 12px', background: '#f8f9fa', marginTop: 10 }}>
        {renderMessages()}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleAsk} style={{ display: 'flex', gap: 8, padding: 12, background: '#fff', borderTop: '1.5px solid #e6e8ec', alignItems: 'center', flexShrink: 0, position: 'relative' }}>
        <input
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Ask ZTO Assistant anything..."
          style={{ flex: 1, minWidth: 0, padding: 14, borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16, background: '#f4f6fb', outline: 'none', transition: 'border 0.2s' }}
          disabled={loading}
        />
        <button
          type="button"
          onClick={() => {
            if (!recognition) {
              setError('Voice recognition not supported in this browser.');
              return;
            }
            if (!listening) {
              setError('');
              recognition.start();
              setListening(true);
            } else {
              recognition.stop();
              setListening(false);
            }
          }}
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: listening ? '#ff4d4f' : '#2b4eff',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontSize: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: listening ? '0 0 0 2px #ff4d4f33' : '0 0 0 2px #2b4eff22',
            transition: 'background 0.2s, box-shadow 0.2s'
          }}
          disabled={loading}
          aria-label="Start voice input"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="2" width="6" height="12" rx="3" fill="white" stroke="white"/>
            <path d="M5 10v2a7 7 0 0 0 14 0v-2" stroke="white" fill="none"/>
            <line x1="12" y1="19" x2="12" y2="22" stroke="white"/>
            <line x1="8" y1="22" x2="16" y2="22" stroke="white"/>
          </svg>
        </button>
        <button type="submit" disabled={loading || !prompt.trim()} style={{ padding: '0 18px', height: 44, borderRadius: 8, background: '#2b4eff', color: '#fff', border: 'none', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px rgba(43,78,255,0.07)', transition: 'background 0.2s' }}>
          {loading ? 'Asking...' : 'Send'}
        </button>
      </form>
      {listening && <span style={{ marginLeft: 18, color: '#2b4eff', fontWeight: 500, fontSize: 15, position: 'absolute', bottom: 60, left: 24 }}>Listening...</span>}
      {error && <div style={{ color: 'red', margin: '8px 0', fontWeight: 500, textAlign: 'center' }}>{error}</div>}
      <style>
        {`
          .blinking-cursor {
            display: inline-block;
            width: 10px;
            animation: blink 1s steps(1) infinite;
          }
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
          @media (max-width: 600px) {
            .ask-ai-chatgpt {
              max-width: 99vw !important;
              padding: 0 !important;
              border-radius: 8px !important;
              margin: 8px auto !important;
              box-shadow: 0 2px 8px rgba(43,78,255,0.08) !important;
              height: 98vh !important;
            }
            .ask-ai-chatgpt h3 {
              font-size: 20px !important;
              margin-bottom: 6px !important;
            }
            .ask-ai-chatgpt form {
              flex-direction: column !important;
              gap: 8px !important;
              padding: 8px !important;
            }
            .ask-ai-chatgpt input {
              font-size: 15px !important;
              padding: 10px !important;
            }
            .ask-ai-chatgpt button {
              font-size: 15px !important;
              height: 40px !important;
              padding: 0 10px !important;
            }
            .ask-ai-chatgpt div[style*='background: #f4f8ff'] {
              font-size: 15px !important;
              padding: 12px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default AskAI;