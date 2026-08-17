'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { mockChatThreads, mockCreators } from '@/lib/mock-data';
import { Search, Send, Paperclip, Phone, Video, Info, User, Check, CheckCheck, MessageSquare } from 'lucide-react';
import { ChatThread, Message as ChatMessage } from '@/lib/types';

function MessagesContent() {
  const searchParams = useSearchParams();
  const initialChatId = searchParams ? searchParams.get('chat') : null;

  const [threads, setThreads] = useState<ChatThread[]>(mockChatThreads);
  const [selectedThreadId, setSelectedThreadId] = useState<string>('');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Select initial chat thread
  useEffect(() => {
    if (initialChatId) {
      // Find thread by participantId or threadId
      const found = threads.find(t => t.id === initialChatId || t.participantId === initialChatId);
      if (found) {
        setSelectedThreadId(found.id);
      } else {
        // Create new temporary thread for this creator if they exist
        const creator = mockCreators.find(c => c.id === initialChatId);
        if (creator) {
          const newThread: ChatThread = {
            id: `t_${creator.id}`,
            participantId: creator.id,
            participantName: creator.name,
            participantAvatar: '',
            participantTitle: creator.title,
            lastMessage: 'Started a new conversation',
            lastMessageTime: 'Now',
            unreadCount: 0,
            messages: []
          };
          setThreads(prev => [newThread, ...prev]);
          setSelectedThreadId(newThread.id);
        }
      }
    } else if (threads.length > 0 && !selectedThreadId) {
      setSelectedThreadId(threads[0].id);
    }
  }, [initialChatId, threads, selectedThreadId]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedThreadId, threads]);

  const activeThread = threads.find(t => t.id === selectedThreadId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread) return;

    const newMsg: ChatMessage = {
      id: `m_new_${Date.now()}`,
      senderId: 'user',
      senderName: 'Demo User',
      senderAvatar: '',
      content: inputText.trim(),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedThreads = threads.map(t => {
      if (t.id === activeThread.id) {
        return {
          ...t,
          lastMessage: newMsg.content,
          lastMessageTime: 'Now',
          unreadCount: 0,
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    });

    setThreads(updatedThreads);
    setInputText('');
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr',
      height: 'calc(100vh - 120px)',
      background: 'white',
      border: '1.5px solid var(--gray-200)',
      borderRadius: '24px',
      overflow: 'hidden',
    }} className="messages-layout-grid">
      
      {/* 1. Threads Sidebar */}
      <div style={{
        borderRight: '1.5px solid var(--gray-200)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--cream)',
      }} className="messages-sidebar">
        
        {/* Sidebar Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--gray-200)', background: 'white' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--navy)', marginBottom: '12px' }}>Inbox</h2>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
            <input
              type="text"
              placeholder="Search conversations..."
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '8px',
                border: '1.5px solid var(--gray-200)',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Threads List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          {threads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>No conversations yet</div>
          ) : (
            threads.map(thread => {
              const active = thread.id === selectedThreadId;
              return (
                <button
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: 'none',
                    background: active ? 'var(--navy)' : 'transparent',
                    color: active ? 'white' : 'var(--navy)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    marginBottom: '4px',
                    transition: 'all 0.15s',
                  }}
                  className="thread-item-btn"
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: active ? 'rgba(255,255,255,0.15)' : 'var(--orange-light)',
                    color: active ? 'white' : 'var(--orange)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    flexShrink: 0,
                  }}>
                    {thread.participantName.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                      <h4 style={{ fontWeight: 700, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: active ? 'white' : 'var(--navy)' }}>
                        {thread.participantName}
                      </h4>
                      <span style={{ fontSize: '0.68rem', color: active ? 'rgba(255,255,255,0.5)' : 'var(--gray-400)' }}>{thread.lastMessageTime}</span>
                    </div>
                    <p style={{
                      fontSize: '0.78rem',
                      color: active ? 'rgba(255,255,255,0.7)' : 'var(--gray-500)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {thread.lastMessage}
                    </p>
                  </div>

                  {thread.unreadCount > 0 && (
                    <span style={{
                      padding: '2px 6px',
                      background: 'var(--orange)',
                      color: 'white',
                      borderRadius: '100px',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      {thread.unreadCount}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Conversation Pane */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {activeThread ? (
          <>
            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1.5px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--cyan-light)', color: 'var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.85rem' }}>
                  {activeThread.participantName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--navy)' }}>{activeThread.participantName}</h3>
                  <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)' }}>{activeThread.participantTitle}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}><Phone size={18} /></button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}><Video size={18} /></button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}><Info size={18} /></button>
              </div>
            </div>

            {/* Messages Thread Log */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeThread.messages.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '10px' }}>
                  <div style={{ padding: '14px', borderRadius: '50%', background: 'var(--cream)', color: 'var(--gray-400)' }}><MessageSquare size={24} /></div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Start typing to begin conversation...</div>
                </div>
              ) : (
                activeThread.messages.map(msg => {
                  const isMe = msg.senderId === 'user';
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isMe ? 'flex-end' : 'flex-start',
                        maxWidth: '75%',
                        alignSelf: isMe ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <div style={{
                        padding: '12px 16px',
                        borderRadius: '16px',
                        borderTopRightRadius: isMe ? '4px' : '16px',
                        borderTopLeftRadius: !isMe ? '4px' : '16px',
                        background: isMe ? 'var(--navy)' : 'white',
                        color: isMe ? 'white' : 'var(--navy)',
                        fontSize: '0.875rem',
                        lineHeight: 1.5,
                        boxShadow: isMe ? 'none' : '0 1px 3px rgba(0,0,0,0.05)',
                        border: isMe ? 'none' : '1px solid var(--gray-200)',
                      }}>
                        {msg.content}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem', color: 'var(--gray-400)', marginTop: '4px' }}>
                        <span>{msg.timestamp}</span>
                        {isMe && <CheckCheck size={12} color="var(--cyan)" />}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Action Form */}
            <form onSubmit={handleSendMessage} style={{ padding: '16px 20px', borderTop: '1.5px solid var(--gray-200)', display: 'flex', gap: '12px', alignItems: 'center', background: 'white' }}>
              <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', padding: '6px' }}>
                <Paperclip size={18} />
              </button>
              <input
                type="text"
                required
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message here..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--gray-200)',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'var(--navy)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  width: '42px',
                  height: '42px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', color: 'var(--gray-400)' }}>
            <Search size={32} />
            <span>Select a conversation to start messaging</span>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media (min-width: 768px) {
          .messages-layout-grid {
            grid-template-columns: 280px 1fr !important;
          }
        }
        .thread-item-btn:hover {
          background: rgba(13, 44, 91, 0.05) !important;
        }
        .thread-item-btn.active:hover {
          background: var(--navy) !important;
        }
      `}</style>
    </div>
  );
}

export default function AppMessagesPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--navy)' }}>
        Loading inbox dashboard...
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}
