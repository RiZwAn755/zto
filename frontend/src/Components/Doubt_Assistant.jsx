import React, { useState, useEffect } from 'react';
import './Doubt_assistant.css';

const AskAI = ({ onAIResponse }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [displayed, setDisplayed] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Typewriter effect
  useEffect(() => {
    if (!response) {
      setDisplayed('');
      return;
    }
    setDisplayed('');
    let i = 0;
    const str = String(response);
    const interval = setInterval(() => {
      if (i < str.length) {
        setDisplayed(prev => prev + str[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [response]);

  const handleAsk = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponse('');
    try {
      const res = await fetch('http://localhost:3000/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error('Failed to get response');
      const data = await res.json();
      const x = String(data.result);
      setResponse(x + `\n Thank you :)`);
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ask-ai" style={{ marginTop: 24, padding: 16, background: '#f8f9fa', borderRadius: 8 }}>
      <h3>ZTO Doubt Assistant</h3>
      <form onSubmit={handleAsk} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Ask ZTO Assistan anything..."
          style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !prompt.trim()} style={{ padding: '8px 18px', borderRadius: 4, background: '#2b4eff', color: '#fff', border: 'none' }}>
          {loading ? 'Asking...' : 'Ask'}
        </button>
      </form>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      {response && (
        <div
          style={{
            background: '#e6f7ff',
            padding: 16,
            borderRadius: 8,
            border: '2px solid #2b4eff',
            minHeight: 40,
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            marginTop: 16,
            boxShadow: '0 2px 8px rgba(43,78,255,0.07)'
          }}
        >
          <strong>ZTO Assistant:</strong> {displayed}
          {displayed.length < response.length && <span className="blinking-cursor">|</span>}
        </div>
      )}
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
        `}
      </style>
    </div>
  );
};

export default AskAI;