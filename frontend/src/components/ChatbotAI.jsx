import React, { useState } from 'react';

const ChatbotAI = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = { sender: 'user', text: input };
    const currentInput = input;
    
    // Add user message immediately
    setMessages(prevMessages => [...prevMessages, userMsg]);
    setInput('');
    setLoading(true);
    
    try {
      console.log('Sending message:', currentInput); // Debug log
      
      const response = await fetch('http://localhost:3000/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput })
      });
      
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const botMsg = { sender: 'bot', text: data.reply || 'No response received' };
      setMessages(prevMessages => [...prevMessages, botMsg]);
      
    } catch (error) {
      console.error('Chat error:', error); // Debug log
      
      const errorMsg = { 
        sender: 'bot', 
        text: `Sorry, I couldn't process your request. Error: ${error.message}` 
      };
      setMessages(prevMessages => [...prevMessages, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '20px auto', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#f5f5f5', 
        borderBottom: '1px solid #ddd',
        borderRadius: '8px 8px 0 0'
      }}>
        <h3 style={{ margin: 0, color: '#0066cc' }}>Ask TripThreads AI</h3>
      </div>
      
      <div style={{ 
        height: '300px', 
        overflowY: 'auto', 
        padding: '15px',
        backgroundColor: '#fafafa'
      }}>
        {messages.length === 0 && (
          <div style={{ color: '#666', fontStyle: 'italic' }}>
            Start a conversation by typing a message below...
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: '10px',
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div
              style={{
                maxWidth: '70%',
                padding: '8px 12px',
                borderRadius: '18px',
                backgroundColor: msg.sender === 'user' ? '#0066cc' : '#e9ecef',
                color: msg.sender === 'user' ? 'white' : 'black',
                wordWrap: 'break-word'
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '8px 12px',
              borderRadius: '18px',
              backgroundColor: '#e9ecef',
              color: '#666'
            }}>
              Thinking...
            </div>
          </div>
        )}
      </div>
      
      <div style={{ 
        padding: '15px', 
        borderTop: '1px solid #ddd',
        display: 'flex',
        gap: '10px'
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything..."
          disabled={loading}
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '20px',
            outline: 'none',
            fontSize: '14px'
          }}
        />
        <button 
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            opacity: loading || !input.trim() ? 0.6 : 1
          }}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatbotAI;