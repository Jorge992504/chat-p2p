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
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar - Lista de Conversas / Contatos */}
      <div
        className={`w-full md:w-80 lg:w-96 bg-slate-900 border-r border-slate-800 flex flex-col h-full transition-all duration-300 ${
          activePeerId ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Profile / Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
                <Sparkles size={20} />
              </div>
              <h1 className="font-bold text-lg text-white tracking-wide">P2P Chat</h1>
            </div>

            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 ${
                status === 'ready'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status === 'ready' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              {status === 'ready' ? 'Online' : 'Conectando...'}
            </span>
          </div>

          {/* Meu ID */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Seu ID para compartilhar:</span>
              {editingName ? (
                <button
                  onClick={() => setEditingName(false)}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Salvar
                </button>
              ) : (
                <button
                  onClick={() => setEditingName(true)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  Editar Nome
                </button>
              )}
            </div>

            {editingName ? (
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-slate-900 text-sm text-white px-2 py-1 rounded border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            ) : (
              <div className="text-xs text-slate-300 font-medium truncate mb-2">
                <span className="text-slate-500">Nome: </span>{userName}
              </div>
            )}

            <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono">
              <span className="text-blue-400 truncate mr-2">{myId || 'Gerando ID...'}</span>
              <button
                onClick={handleCopy}
                disabled={!myId}
                className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition"
                title="Copiar ID"
              >
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Action Button: Add Chat */}
        <div className="p-3 border-b border-slate-800">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-[0.98] transition"
          >
            <UserPlus size={18} />
            <span>Iniciar nova conversa</span>
          </button>
        </div>

        {/* Lista de Contatos */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50 p-2">
          {Object.keys(contacts).length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <MessageSquare size={36} className="mb-2 stroke-[1.5] text-slate-600" />
              <p className="text-sm font-medium">Nenhuma conversa iniciada</p>
              <p className="text-xs text-slate-600 mt-1">
                Compartilhe seu ID ou adicione o ID de alguém para começar a conversar.
              </p>
            </div>
          ) : (
            Object.values(contacts).map((contact) => (
              <div
                key={contact.id}
                onClick={() => setActivePeerId(contact.id)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                  activePeerId === contact.id
                    ? 'bg-blue-600/10 border border-blue-500/20'
                    : 'hover:bg-slate-800/50'
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
                      contact.online ? 'bg-emerald-500' : 'bg-slate-600'
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm font-semibold text-slate-200 truncate">{contact.name}</p>
                  </div>
                  <p className="text-xs text-slate-500 truncate font-mono mt-0.5">{contact.id}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div
        className={`flex-1 flex flex-col h-full bg-slate-950 transition-all duration-300 ${
          !activePeerId ? 'hidden md:flex' : 'flex'
        }`}
      >
        {activePeerId ? (
          <>
            {/* Header Chat */}
            <div className="p-3 md:p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActivePeerId('')}
                  className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow">
                  {(activeContact?.name || activePeerId).charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-bold text-slate-100 text-sm md:text-base leading-tight">
                    {activeContact?.name || 'Contato'}
                  </h2>
                  <p className="text-xs text-slate-500 font-mono">{activePeerId}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium ${
                    isConnected
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
                  <span className="hidden sm:inline">{isConnected ? 'Conectado P2P' : 'Off-line'}</span>
                </span>
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center">
                  <p className="text-sm">Nenhuma mensagem ainda.</p>
                  <p className="text-xs text-slate-600 mt-1">Diga olá para iniciar a conversa!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-md ${
                        msg.isMe
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-200 border border-slate-700/50 rounded-bl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                      <span
                        className={`text-[10px] block text-right mt-1 ${
                          msg.isMe ? 'text-blue-200' : 'text-slate-400'
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 md:p-4 border-t border-slate-800 bg-slate-900/50">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="flex-1 bg-slate-900 text-slate-100 placeholder-slate-500 px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 text-sm transition"
                />
                <button
                  type="submit"
                  disabled={!inputMsg.trim()}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white p-3 rounded-xl shadow-lg shadow-blue-600/20 transition active:scale-95"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-6 text-slate-600 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-slate-500">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-300">Nenhum chat selecionado</h3>
            <p className="text-sm text-slate-500 max-w-sm mt-1">
              Selecione uma conversa ao lado ou adicione um novo ID de usuário para conversar via WebRTC.
            </p>
          </div>
        )}
      </div>

      {/* Modal - Adicionar Contato */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Conectar a um usuário</h3>
            <p className="text-xs text-slate-400 mb-4">
              Cole o ID gerado da pessoa com quem você deseja conversar.
            </p>

            <form onSubmit={handleConnect}>
              <input
                type="text"
                placeholder="Ex: user-x9a2b1"
                value={newPeerId}
                onChange={(e) => setNewPeerId(e.target.value)}
                className="w-full bg-slate-950 text-slate-100 px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 text-sm font-mono mb-4"
                autoFocus
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newPeerId.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-blue-600/20"
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
