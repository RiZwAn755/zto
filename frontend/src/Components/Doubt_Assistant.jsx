import React, { useState, useEffect, useRef } from 'react';
import './Doubt_assistant.css';
import ReactMarkdown from "react-markdown";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const baseUrl = import.meta.env.VITE_BASE_URL;

const AskAI = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [displayed, setDisplayed] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [predefinedPrompts, setPredefinedPrompts] = useState([]);
  const [showPrompts, setShowPrompts] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [abortController, setAbortController] = useState(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

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
    
    console.log("Starting typewriter for:", lastMsg.content);
    
    setDisplayed('');
    setIsTyping(true);
    let i = 0;
    const str = String(lastMsg.content || '');
    console.log("Typewriter string:", str);
    console.log("String length:", str.length);
    
    const interval = setInterval(() => {
      if (i < str.length) {
        setDisplayed(prev => {
          const newDisplayed = prev + str[i];
          console.log(`Typewriter step ${i}: "${newDisplayed}"`);
          return newDisplayed;
        });
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        console.log("Typewriter completed");
      }
    }, 15);
    return () => {
      clearInterval(interval);
      setIsTyping(false);
    };
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

  // Fetch predefined prompts on component mount
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await fetch(`${baseUrl}/gemini/prompts`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setPredefinedPrompts(data.prompts || []);
        }
      } catch (err) {
        console.error('Failed to fetch prompts:', err);
      }
    };
    
    if (token) {
      fetchPrompts();
    }
  }, [token]);

  const stopAIResponse = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    setLoading(false);
    setIsTyping(false);
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    await sendMessage(prompt);
  };

  const sendMessage = async (messageText) => {
    setLoading(true);
    setError('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: messageText }]);
    setPrompt('');
    
    // Create abort controller for stopping the request
    const controller = new AbortController();
    setAbortController(controller);
    
    try {
      const res = await fetch(`${baseUrl}/gemini`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: messageText }),
        signal: controller.signal
      });
      
      if (!res.ok) throw new Error('Failed to get response');
      const data = await res.json();
      console.log("Frontend received data:", data);
      
      let x = data.result;
      console.log("Raw result:", x);
      
      if (x === undefined || x === null || x === "undefined" || typeof x !== 'string') {
        x = "No response available";
      } else {
        x = x.trim(); // Remove any leading/trailing whitespace
      }
      
      console.log("Processed result:", x);
      x = x + `\n\n Thank you :)`;
      setMessages(prev => [...prev, { role: 'assistant', content: x }]);
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Response stopped by user');
      } else {
        setError('Error: ' + err.message);
      }
    } finally {
      setLoading(false);
      setAbortController(null);
    }
  };

  const handlePredefinedPrompt = (promptText) => {
    sendMessage(promptText);
  };

  // Render chat bubbles
  const renderMessages = () => {
    return messages.map((msg, idx) => {
      const isUser = msg.role === 'user';
      const isLastAssistant = msg.role === 'assistant' && idx === messages.length - 1;
      return (
        <div
          key={idx}
          className={`message-container ${isUser ? 'user-message' : 'ai-message'}`}
        >
          <div className={`message-bubble ${isUser ? 'user-bubble' : 'ai-bubble'}`}>
            {isUser ? (
              <div className="message-content user-content">
                {msg.content}
              </div>
            ) : isLastAssistant ? (
              <div className="message-content ai-content">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {displayed || ''}
                </ReactMarkdown>
                {isTyping && <span className="typing-indicator">▋</span>}
              </div>
            ) : (
              <div className="message-content ai-content">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="doubt-assistant-container">
      <div className="chat-header">
        <div className="header-content">
          <div className="ai-avatar">
            <div className="avatar-icon">🤖</div>
            <div className="status-indicator"></div>
          </div>
          <div className="header-text">
            <h3>ZTO AI Assistant</h3>
            <p>Ask me anything about your studies!</p>
          </div>
        </div>
        <button
          className={`toggle-prompts-btn ${showPrompts ? 'active' : ''}`}
          onClick={() => setShowPrompts(!showPrompts)}
        >
          <span className="btn-icon">💡</span>
          {showPrompts ? 'Hide' : 'Show'} Quick Questions
        </button>
      </div>
      
      {/* Predefined Prompts Section */}
      {showPrompts && predefinedPrompts.length > 0 && (
        <div className="quick-questions-section">
          <div className="section-header">
            <h4>Quick Questions</h4>
            <p>Tap to ask instantly</p>
          </div>
          <div className="prompts-grid">
            {predefinedPrompts.map((prompt) => (
              <button
                key={prompt.id}
                className="prompt-button"
                onClick={() => handlePredefinedPrompt(prompt.prompt)}
                disabled={loading}
              >
                <span className="prompt-icon">⚡</span>
                <span className="prompt-text">{prompt.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <div className="welcome-icon">👋</div>
            <h2>Welcome to ZTO AI Assistant!</h2>
            <p>I'm here to help you with your studies. Ask me anything!</p>
            <div className="welcome-features">
              <div className="feature">
                <span className="feature-icon">🎯</span>
                <span>Quick answers</span>
              </div>
              <div className="feature">
                <span className="feature-icon">📚</span>
                <span>Study help</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🎤</span>
                <span>Voice input</span>
              </div>
            </div>
          </div>
        )}
        {renderMessages()}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input-container">
        <form onSubmit={handleAsk} className="input-form">
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Ask ZTO Assistant anything..."
              className="message-input"
              disabled={loading}
            />
            <div className="input-actions">
              <button
                type="button"
                className={`voice-btn ${listening ? 'listening' : ''}`}
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
                disabled={loading}
                aria-label="Start voice input"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              </button>
              
              {loading && (
                <button
                  type="button"
                  className="stop-btn"
                  onClick={stopAIResponse}
                  aria-label="Stop AI response"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="6" width="12" height="12"/>
                  </svg>
                </button>
              )}
              
              <button 
                type="submit" 
                className={`send-btn ${loading ? 'loading' : ''}`}
                disabled={loading || !prompt.trim()}
              >
                {loading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                  </div>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22,2 15,22 11,13 2,9"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </form>
        
        {listening && (
          <div className="listening-indicator">
            <div className="listening-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>Listening...</span>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default AskAI;