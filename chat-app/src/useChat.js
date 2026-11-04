import { useState, useEffect, useRef, useCallback } from 'react';
import Peer from 'peerjs';

export function useChat() {
  const [myId, setMyId] = useState('');
  const [userName, setUserName] = useState(() => sessionStorage.getItem('chat_username') || 'Usuário');
  const [activePeerId, setActivePeerId] = useState('');
  const [connections, setConnections] = useState({});
  const [contacts, setContacts] = useState(() => {
    const saved = sessionStorage.getItem('chat_contacts');
    return saved ? JSON.parse(saved) : {};
  });
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('chat_history');
    return saved ? JSON.parse(saved) : {};
  });
  const [status, setStatus] = useState('connecting');

  const peerRef = useRef(null);

  // Guarda apenas no sessionStorage (apaga ao fechar a aba)
  useEffect(() => {
    sessionStorage.setItem('chat_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    sessionStorage.setItem('chat_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    sessionStorage.setItem('chat_username', userName);
  }, [userName]);

  useEffect(() => {
    const randomId = 'user-' + Math.random().toString(36).substring(2, 8);
    const peer = new Peer(randomId, {
      debug: 1,
    });

    peerRef.current = peer;

    peer.on('open', (id) => {
      setMyId(id);
      setStatus('ready');
    });

    peer.on('connection', (conn) => {
      setupConnection(conn);
    });

    peer.on('error', (err) => {
      console.error('Erro de conexão P2P:', err);
      setStatus('error');
    });

    return () => {
      peer.destroy();
    };
  }, []);

  const addMessage = useCallback((peerId, msgObj) => {
    setMessages((prev) => {
      const chatList = prev[peerId] || [];
      return {
        ...prev,
        [peerId]: [...chatList, msgObj],
      };
    });
  }, []);

  const setupConnection = useCallback((conn) => {
    conn.on('open', () => {
      setConnections((prev) => ({ ...prev, [conn.peer]: conn }));
      
      conn.send({
        type: 'INFO',
        senderName: userName,
      });

      setContacts((prev) => ({
        ...prev,
        [conn.peer]: {
          id: conn.peer,
          name: prev[conn.peer]?.name || conn.peer,
          online: true,
        },
      }));
    });

    conn.on('data', (data) => {
      if (data.type === 'INFO') {
        setContacts((prev) => ({
          ...prev,
          [conn.peer]: {
            id: conn.peer,
            name: data.senderName || conn.peer,
            online: true,
          },
        }));
      } else if (data.type === 'TEXT') {
        addMessage(conn.peer, {
          id: Date.now() + Math.random().toString(),
          sender: conn.peer,
          text: data.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false,
        });
      }
    });

    conn.on('close', () => {
      setConnections((prev) => {
        const copy = { ...prev };
        delete copy[conn.peer];
        return copy;
      });
      setContacts((prev) => ({
        ...prev,
        [conn.peer]: { ...prev[conn.peer], online: false },
      }));
    });
  }, [addMessage, userName]);

  const connectToPeer = (targetId) => {
    if (!targetId || targetId === myId || connections[targetId]) return;
    if (!peerRef.current) return;

    const conn = peerRef.current.connect(targetId);
    setupConnection(conn);
    setActivePeerId(targetId);
    
    setContacts((prev) => ({
      ...prev,
      [targetId]: {
        id: targetId,
        name: prev[targetId]?.name || targetId,
        online: false,
      },
    }));
  };

  const sendMessage = (text) => {
    if (!activePeerId || !text.trim()) return;

    const conn = connections[activePeerId];
    const msgObj = {
      id: Date.now() + Math.random().toString(),
      sender: myId,
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    if (conn && conn.open) {
      conn.send({
        type: 'TEXT',
        text: text,
      });
    }

    addMessage(activePeerId, msgObj);
  };

  return {
    myId,
    userName,
    setUserName,
    activePeerId,
    setActivePeerId,
    contacts,
    messages: messages[activePeerId] || [],
    status,
    connectToPeer,
    sendMessage,
    isConnected: !!connections[activePeerId],
  };
}
