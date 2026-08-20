'use client';
import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error connecting to backend:', error);
    }
    setLoading(false);
  };

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <h1>🛡️ Blind Click Protector</h1>
      <p>Paste a website's Terms of Service below to reveal hidden risks.</p>
      
      <textarea
        rows="8"
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        placeholder="Paste terms & conditions text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      
      <button 
        onClick={handleAnalyze}
        style={{ padding: '10px 20px', background: '#0070f3', color: '#fff', border: 'none', cursor: 'pointer' }}
      >
        {loading ? 'Analyzing...' : 'Analyze Terms'}
      </button>

      {result && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f4f4f4', borderRadius: '5px' }}>
          <h3>Analysis Result: Risk Level ({result.risk_level})</h3>
          <p><strong>Data Tracking:</strong> {result.summary.data_tracking}</p>
          <p><strong>Data Sharing:</strong> {result.summary.data_selling}</p>
          <p><strong>Red Flags:</strong> {result.summary.red_flags}</p>
        </div>
      )}
    </main>
  );
}
