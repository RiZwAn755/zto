import React, { useState, useEffect, useRef } from 'react';
import './Doubt_assistant.css';
import ReactMarkdown from "react-markdown";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { FiSend, FiSquare } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { handleFetchRateLimitError } from '../utils/rateLimitHandler.js';

const baseUrl = import.meta.env.VITE_BASE_URL;

const AskAI = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [predefinedPrompts, setPredefinedPrompts] = useState([]);
  const [showPrompts, setShowPrompts] = useState(false);
  const [abortController, setAbortController] = useState(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
      
      // Handle rate limit error
      if (res.status === 429) {
        const isRateLimitHandled = await handleFetchRateLimitError(res);
        if (isRateLimitHandled) {
          return; // Exit early if rate limit was handled
        }
      }
      
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

  // Function to preprocess AI response for better formatting
  const preprocessAIResponse = (content) => {
    if (!content) return '';
    
    let processed = content;
    
    // Add line breaks after sentences but be very conservative
    processed = processed.replace(/([.!?])\s+/g, '$1 ');
    
    // Add line breaks before numbered lists
    processed = processed.replace(/(\d+\.\s)/g, '\n$1');
    
    // Add line breaks before bullet points
    processed = processed.replace(/(\*\s)/g, '\n$1');
    processed = processed.replace(/(-\s)/g, '\n$1');
    
    // Add colorful formatting for common section headers
    const headers = ['Key characteristics:', 'Characteristics:', 'Features:', 'Definition:', 'Examples:', 'Types:', 'Structure:', 'Function:', 'Process:', 'Benefits:', 'Advantages:', 'Disadvantages:'];
    headers.forEach(header => {
      const regex = new RegExp(`(${header})`, 'gi');
      processed = processed.replace(regex, `\n**${header}**`);
    });
    
    // Add colorful formatting for important terms
    const importantTerms = ['Exoskeleton', 'Segmented Body', 'Jointed appendages', 'Chitin', 'Molting', 'Ecdysis', 'Tagmata', 'Cephalothorax', 'Thorax', 'Head'];
    importantTerms.forEach(term => {
      const regex = new RegExp(`\\b(${term})\\b`, 'gi');
      processed = processed.replace(regex, '**$1**');
    });
    
    // Add line breaks before bold text patterns (but minimal)
    processed = processed.replace(/(\*\*[^*]+\*\*)/g, ' $1 ');
    
    // Clean up multiple line breaks - keep only single line breaks
    processed = processed.replace(/\n{2,}/g, '\n');
    
    // Add markdown formatting for better structure
    processed = processed.replace(/^(.+)$/gm, (match, line) => {
      // If line starts with a number and period, make it a list item
      if (/^\d+\./.test(line)) {
        return line;
      }
      // If line is all caps or looks like a header, make it bold
      if (/^[A-Z\s]+$/.test(line.trim()) && line.trim().length > 3 && line.trim().length < 50) {
        return `**${line.trim()}**`;
      }
      return line;
    });
    
    // Add colorful emojis for different content types
    processed = processed.replace(/\*\*Definition:\*\*/g, '📖 **Definition:**');
    processed = processed.replace(/\*\*Key characteristics:\*\*/g, '🔑 **Key characteristics:**');
    processed = processed.replace(/\*\*Examples:\*\*/g, '💡 **Examples:**');
    processed = processed.replace(/\*\*Types:\*\*/g, '📋 **Types:**');
    processed = processed.replace(/\*\*Structure:\*\*/g, '🏗️ **Structure:**');
    processed = processed.replace(/\*\*Function:\*\*/g, '⚙️ **Function:**');
    processed = processed.replace(/\*\*Process:\*\*/g, '🔄 **Process:**');
    processed = processed.replace(/\*\*Benefits:\*\*/g, '✅ **Benefits:**');
    processed = processed.replace(/\*\*Advantages:\*\*/g, '👍 **Advantages:**');
    processed = processed.replace(/\*\*Disadvantages:\*\*/g, '👎 **Disadvantages:**');
    
    return processed.trim();
  };

  // Render chat bubbles
  const renderMessages = () => {
    return messages.map((msg, idx) => {
      const isUser = msg.role === 'user';
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
            ) : (
              <div className="message-content ai-content">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {preprocessAIResponse(msg.content)}
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
        <div className="header-actions">
          <button
            className={`toggle-prompts-btn ${showPrompts ? 'active' : ''}`}
            onClick={() => setShowPrompts(!showPrompts)}
          >
            <span className="btn-icon">💡</span>
            {showPrompts ? 'Hide' : 'Show'} Quick Questions
          </button>
        </div>
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
                <span className="feature-icon">💬</span>
                <span>Text chat</span>
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
              {loading && (
                <button
                  type="button"
                  className="stop-btn"
                  onClick={stopAIResponse}
                  aria-label="Stop AI response"
                >
                  <FiSquare size={20} />
                </button>
              )}
              
              <button 
                type="submit" 
                className={`send-btn ${loading ? 'loading' : ''}`}
                disabled={loading || !prompt.trim()}
              >
                {loading ? (
                  <AiOutlineLoading3Quarters size={20} className="animate-spin" />
                ) : (
                  <FiSend size={20} />
                )}
              </button>
            </div>
          </div>
        </form>
        
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <div className="error-content">
              <div className="error-text">{error}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AskAI;