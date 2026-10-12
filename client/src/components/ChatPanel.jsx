import React, { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import { formatTime } from '../utils/constants';

const ChatPanel = ({ messages, onSendMessage, currentUserId }) => {
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', color: '#000' }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 'bold' }}>
        Session Chat
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {messages.map((msg, idx) => {
          const isOwn = msg.userId === currentUserId;
          return (
            <div key={idx} style={{ alignSelf: isOwn ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
              {!isOwn && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>{msg.userName}</div>}
              <div style={{ 
                background: isOwn ? 'var(--primary)' : 'var(--bg-primary)', 
                color: isOwn ? 'white' : 'inherit',
                padding: '0.5rem 0.75rem', 
                borderRadius: '8px',
                borderBottomRightRadius: isOwn ? '0' : '8px',
                borderBottomLeftRadius: !isOwn ? '0' : '8px',
              }}>
                {msg.message}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', textAlign: isOwn ? 'right' : 'left', marginTop: '2px' }}>
                {formatTime(msg.timestamp)}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} style={{ display: 'flex', padding: '1rem', borderTop: '1px solid var(--border)', gap: '0.5rem' }}>
        <input 
          type="text" 
          value={text} 
          onChange={e => setText(e.target.value)} 
          placeholder="Type a message..." 
          style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', outline: 'none' }}
        />
        <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', padding: '0 1rem', cursor: 'pointer' }}>
          <FiSend />
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
