import React, { useState, useEffect, useRef } from 'react';
import { aiCompanionAPI, bloodSugarAPI } from '../services/api';
import toast from 'react-hot-toast';
import '../styles/ai-companion.css';

const AICompanion = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [currentGlucose, setCurrentGlucose] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
    loadCurrentGlucose();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const response = await aiCompanionAPI.getChatHistory();
      // Format history from DB: split into user/ai pairs if needed
      const history = response.data.messages.flatMap(m => [
        { id: m.id + '_u', text: m.message_text, type: 'user', time: m.created_at },
        { id: m.id + '_a', text: m.response_text, type: 'ai', time: m.created_at }
      ]);
      setMessages(history);
    } catch (error) {
      console.error('Failed to load chat history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const loadCurrentGlucose = async () => {
    try {
      const response = await bloodSugarAPI.getRecords(2);
      setCurrentGlucose(response.data.records?.[0]?.glucose_level ?? null);
    } catch (error) {
      setCurrentGlucose(null);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e, text = null) => {
    if (e) e.preventDefault();
    const msgText = text || inputMessage;

    if (!msgText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: msgText,
      type: 'user',
      time: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await aiCompanionAPI.sendMessage(msgText);
      const aiMessage = {
        id: Date.now() + 1,
        text: response.data.aiResponse,
        type: 'ai',
        time: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      toast.error('Échec de la connexion avec GlycoAI');
    } finally {
      setLoading(false);
    }
  };

  const suggestions = currentGlucose !== null && currentGlucose < 70
    ? [
      `🚨 Que faire en cas d'hypo (${currentGlucose} mg/dL) ?`,
      'Jai une sensation de malaise, que faire maintenant ?',
      'sokkor t7et bzzaf, chno ndiro daba ?',
      'Prépare un résumé d urgence pour mon médecin',
    ]
    : [
      "Analyse ma glycémie d'aujourd'hui",
      "Quel est l'impact glycémique d'un couscous ?",
      'Je suis mrid b sokkor, comment stabiliser apres repas ?',
      'Prépare un rapport pour mon médecin',
    ];

  if (isLoadingHistory) {
    return <div className="loading-screen">Connexion sécurisée à GlycoAI...</div>;
  }

  return (
    <div className="ai-chat-v2 animate-fade-in">
      <div className="chat-header-pro">
        <div className="ai-status-group">
          <div className="ai-avatar-large">🤖</div>
          <div className="ai-info">
            <h2>GlycoAI Clinical Assistant</h2>
            <div className="status-badge"><span className="dot"></span> En ligne | Expert Diabétologie</div>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-icon-clear" onClick={() => setMessages([])}>🗑️ Effacer</button>
        </div>
      </div>

      <div className="chat-window">
        <div className="messages-flow">
          {messages.length === 0 ? (
            <div className="chat-welcome-v2">
              <div className="welcome-icon">🏥</div>
              <h3>Bonjour ! Je suis votre assistant GlycoAI.</h3>
              <p>Comment puis-je vous aider aujourd'hui ? Je peux analyser vos données, vous conseiller sur votre alimentation ou répondre à vos questions médicales.</p>
              <div className="suggestion-grid">
                {suggestions.map((s, i) => (
                  <button key={i} className="suggestion-chip" onClick={() => handleSendMessage(null, s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`message-wrapper ${msg.type}`}>
                <div className="message-bubble-v2">
                  <div className="message-text">{msg.text}</div>
                  <div className="message-time">{new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="message-wrapper ai">
              <div className="message-bubble-v2 typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="chat-input-v2">
        <form onSubmit={handleSendMessage} className="input-form-v2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Posez votre question à GlycoAI (Français, Arabe, Darija...)"
            disabled={loading}
          />
          <button type="submit" className="btn-send-v2" disabled={loading || !inputMessage.trim()}>
            Envoyer ➔
          </button>
        </form>
        <p className="ai-disclaimer">GlycoAI fournit des conseils informatifs. Consultez toujours votre médecin pour vos décisions médicales.</p>
      </div>
    </div>
  );
};

export default AICompanion;
