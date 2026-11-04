import React, { useState } from 'react';
import { useChat } from './useChat';
import {
  Send,
  UserPlus,
  Copy,
  Check,
  MessageSquare,
  ArrowLeft,
  Wifi,
  WifiOff,
  Sparkles
} from 'lucide-react';

export default function App() {
  const {
    myId,
    userName,
    setUserName,
    activePeerId,
    setActivePeerId,
    contacts,
    messages,
    status,
    connectToPeer,
    sendMessage,
    isConnected,
  } = useChat();

  const [inputMsg, setInputMsg] = useState('');
  const [newPeerId, setNewPeerId] = useState('');
  const [copied, setCopied] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingName, setEditingName] = useState(false);

  const handleCopy = () => {
    if (!myId) return;
    navigator.clipboard.writeText(myId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = (e) => {
    e.preventDefault();
    if (newPeerId.trim()) {
      connectToPeer(newPeerId.trim());
      setNewPeerId('');
      setShowAddModal(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (inputMsg.trim()) {
      sendMessage(inputMsg);
      setInputMsg('');
    }
  };

  const activeContact = contacts[activePeerId];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className={`sidebar ${activePeerId ? 'hidden-mobile' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-row">
            <div className="brand">
              <div className="brand-icon">
                <Sparkles size={20} />
              </div>
              <span>P2P Chat</span>
            </div>

            <div className={`status-badge ${status === 'ready' ? 'online' : 'connecting'}`}>
              <span className={`dot ${status === 'ready' ? 'pulse' : ''}`} />
              {status === 'ready' ? 'Online' : 'Conectando...'}
            </div>
          </div>

          <div className="user-card">
            <div className="user-card-header">
              <span>Seu ID de Usuário</span>
              <button
                onClick={() => setEditingName(!editingName)}
                className="btn-link"
              >
                {editingName ? 'Salvar' : 'Editar Nome'}
              </button>
            </div>

            {editingName ? (
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="input-sm"
              />
            ) : (
              <div className="user-name-box">{userName}</div>
            )}

            <div className="id-box">
              <span>{myId || 'Gerando ID...'}</span>
              <button onClick={handleCopy} disabled={!myId} className="btn-icon" title="Copiar ID">
                {copied ? <Check size={16} style={{ color: '#10b981' }} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="action-btn-container">
          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            <UserPlus size={18} />
            <span>Iniciar nova conversa</span>
          </button>
        </div>

        <div className="contacts-list">
          {Object.keys(contacts).length === 0 ? (
            <div className="empty-state">
              <MessageSquare size={36} />
              <p style={{ fontWeight: 600 }}>Nenhuma conversa</p>
              <p>Adicione o ID de alguém para conversar.</p>
            </div>
          ) : (
            Object.values(contacts).map((contact) => (
              <div
                key={contact.id}
                onClick={() => setActivePeerId(contact.id)}
                className={`contact-item ${activePeerId === contact.id ? 'active' : ''}`}
              >
                <div className="avatar">
                  {contact.name.charAt(0).toUpperCase()}
                  <span className={`online-dot ${contact.online ? 'active' : ''}`} />
                </div>
                <div className="contact-info">
                  <div className="contact-name">{contact.name}</div>
                  <div className="contact-id">{contact.id}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`chat-window ${!activePeerId ? 'hidden-mobile' : ''}`}>
        {activePeerId ? (
          <>
            <div className="chat-header">
              <div className="chat-user-info">
                <button onClick={() => setActivePeerId('')} className="back-btn">
                  <ArrowLeft size={20} />
                </button>
                <div className="avatar-gradient">
                  {(activeContact?.name || activePeerId).charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="chat-title">{activeContact?.name || 'Contato'}</div>
                  <div className="chat-subtitle">{activePeerId}</div>
                </div>
              </div>

              <div className={`badge-conn ${isConnected ? 'connected' : ''}`}>
                {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
                <span>{isConnected ? 'Conectado P2P' : 'Aguardando / Offline'}</span>
              </div>
            </div>

            <div className="messages-container">
              {messages.length === 0 ? (
                <div className="empty-state">
                  <p>Sua conversa começa aqui. Envie uma mensagem!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message-bubble ${msg.isMe ? 'me' : 'peer'}`}
                  >
                    <div className="bubble-content">{msg.text}</div>
                    <div className="bubble-time">{msg.time}</div>
                  </div>
                ))
              )}
            </div>

            <div className="chat-input-bar">
              <form onSubmit={handleSend} className="input-form">
                <input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="text-input"
                />
                <button type="submit" disabled={!inputMsg.trim()} className="send-btn">
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <MessageSquare size={48} />
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Nenhum chat selecionado</p>
            <p>Escolha um contato na lista ou adicione um novo ID para começar.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-title">Conectar a um usuário</div>
            <div className="modal-desc">
              Informe o ID gerado da pessoa com quem você deseja conversar.
            </div>

            <form onSubmit={handleConnect}>
              <input
                type="text"
                placeholder="Ex: user-x9a2b1"
                value={newPeerId}
                onChange={(e) => setNewPeerId(e.target.value)}
                className="modal-input"
                autoFocus
              />

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newPeerId.trim()}
                  className="btn-primary"
                  style={{ width: 'auto' }}
                >
                  Conectar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
