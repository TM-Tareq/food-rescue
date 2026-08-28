import React, { useState } from 'react';
import { Send, PhoneCall, ShieldCheck, User } from 'lucide-react';
import Modal from '../../../../components/Modal/Modal';
import Button from '../../../../components/Button/Button';
import './InAppChatModal.css';

/**
 * Masked In-App Chat Modal between Restaurant and Volunteer Rider
 */
export default function InAppChatModal({ isOpen, onClose, volunteerName = 'Tanvir Hossain' }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'volunteer', text: 'Hello Chef! I am on Progati Sarani, heading towards Banani. ETA 12 mins.', time: '5 mins ago' },
    { id: 2, sender: 'me', text: 'Great! The biryani package is hot, sealed, and ready for pickup at front counter.', time: '3 mins ago' },
    { id: 3, sender: 'volunteer', text: 'Awesome! Will reach soon and provide OTP code 4892.', time: 'Just now' }
  ]);

  const [inputMsg, setInputMsg] = useState('');

  if (!isOpen) return null;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    setMessages([
      ...messages,
      { id: Date.now(), sender: 'me', text: inputMsg, time: 'Just now' }
    ]);
    setInputMsg('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="chat-modal">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-avatar">🛵</div>
        <div className="chat-title-info">
          <h3 className="chat-name">{volunteerName}</h3>
          <span className="chat-status">● Live Active Rescue • Masked Privacy Chat</span>
        </div>
      </div>

      {/* Messages Body */}
      <div className="chat-body">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-bubble-wrapper ${msg.sender === 'me' ? 'bubble-me' : 'bubble-other'}`}
          >
            <div className="chat-bubble">
              <p className="bubble-text">{msg.text}</p>
              <span className="bubble-time">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Footer */}
      <form onSubmit={handleSendMessage} className="chat-footer">
        <input
          type="text"
          placeholder="Type a masked message to volunteer..."
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          className="chat-input"
        />
        <Button type="submit" variant="primary" size="md" icon={Send}>
          Send
        </Button>
      </form>
    </Modal>
  );
}
