import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Loader2, Sparkles, Lightbulb, History, Trash2, Download, Clock } from 'lucide-react';
import { streamDentalChatResponse, getSuggestedQuestions } from '../../../services/dentalChatService';
import { getIntelligentFollowUps } from '../../../services/procedureAnalysisService';
import { saveMessage, getConversationsByProcedure, deleteConversation, exportConversations } from '../../../services/conversationHistoryService';

const PatientChatAssistant = ({ procedure, language = 'en' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const [isLoadingFollowUps, setIsLoadingFollowUps] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const isEnglish = language === 'en';

  useEffect(() => {
    if (procedure?.id) {
      const history = getConversationsByProcedure(procedure?.id);
      setConversationHistory(history);
    }
  }, [procedure?.id]);

  useEffect(() => {
    if (messages?.length === 0 && !currentConversationId) {
      const welcomeMessage = isEnglish
        ? `Hi! I'm ChairIQ's AI assistant. I can answer detailed questions about your ${procedure?.name_en || 'dental procedure'}, including pain management, recovery, costs, and alternatives. Your conversations are automatically saved so you can revisit them anytime. What would you like to know?`
        : `¡Hola! Soy el asistente AI de ChairIQ. Puedo responder preguntas detalladas sobre tu ${procedure?.name_es || 'procedimiento dental'}, incluyendo manejo del dolor, recuperación, costos y alternativas. Tus conversaciones se guardan automáticamente para que puedas revisarlas en cualquier momento. ¿Qué te gustaría saber?`;
      
      setMessages([{
        role: 'assistant',
        content: welcomeMessage,
        timestamp: new Date()
      }]);
    }
  }, [procedure, language, messages?.length, currentConversationId, isEnglish]);

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef?.current) {
      inputRef?.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const loadFollowUps = async () => {
      if (messages?.length > 2 && !isStreaming && messages?.[messages?.length - 1]?.role === 'assistant') {
        setIsLoadingFollowUps(true);
        try {
          const followUps = await getIntelligentFollowUps(messages, procedure, language);
          setFollowUpQuestions(followUps);
        } catch (err) {
          console.error('Error loading follow-up questions:', err);
          setFollowUpQuestions([]);
        } finally {
          setIsLoadingFollowUps(false);
        }
      }
    };

    loadFollowUps();
  }, [messages, isStreaming, procedure, language]);

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText?.trim() || isStreaming) return;

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsStreaming(true);
    setError(null);
    setFollowUpQuestions([]);

    const convId = saveMessage(procedure?.id, userMessage, currentConversationId);
    if (!currentConversationId && convId) {
      setCurrentConversationId(convId);
    }

    const assistantMessageId = Date.now();
    setMessages(prev => [...prev, {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true
    }]);

    try {
      const conversationHistory = messages?.slice(-6)?.map(msg => ({
          role: msg?.role,
          content: msg?.content
        }));

      let fullResponse = '';

      await streamDentalChatResponse(
        messageText,
        procedure,
        language,
        (chunk) => {
          fullResponse += chunk;
          setMessages(prev => prev?.map(msg =>
            msg?.id === assistantMessageId
              ? { ...msg, content: fullResponse }
              : msg
          ));
        },
        conversationHistory
      );

      const assistantMessage = {
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date()
      };

      saveMessage(procedure?.id, assistantMessage, convId || currentConversationId);

      setMessages(prev => prev?.map(msg =>
        msg?.id === assistantMessageId
          ? { ...msg, isStreaming: false }
          : msg
      ));

      const updatedHistory = getConversationsByProcedure(procedure?.id);
      setConversationHistory(updatedHistory);
    } catch (err) {
      setError(err?.message || (isEnglish ? 'Failed to get response. Please try again.' : 'No se pudo obtener respuesta. Por favor intente de nuevo.'));
      setMessages(prev => prev?.filter(msg => msg?.id !== assistantMessageId));
    } finally {
      setIsStreaming(false);
    }
  };

  const handleLoadConversation = (conversation) => {
    setMessages(conversation?.messages || []);
    setCurrentConversationId(conversation?.id);
    setShowHistory(false);
  };

  const handleNewConversation = () => {
    setMessages([]);
    setCurrentConversationId(null);
    setShowHistory(false);
  };

  const handleDeleteConversation = (conversationId, e) => {
    e?.stopPropagation();
    if (window?.confirm(isEnglish ? 'Delete this conversation?' : '¿Eliminar esta conversación?')) {
      deleteConversation(procedure?.id, conversationId);
      const updatedHistory = getConversationsByProcedure(procedure?.id);
      setConversationHistory(updatedHistory);
      
      if (currentConversationId === conversationId) {
        handleNewConversation();
      }
    }
  };

  const handleExportConversations = () => {
    const jsonData = exportConversations(procedure?.id);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL?.createObjectURL(blob);
    const a = document?.createElement('a');
    a.href = url;
    a.download = `chairiq-conversations-${procedure?.id}-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
    document?.body?.appendChild(a);
    a?.click();
    document?.body?.removeChild(a);
    URL?.revokeObjectURL(url);
  };

  const handleSuggestedQuestion = (question) => {
    handleSendMessage(question);
  };

  const suggestedQuestions = getSuggestedQuestions(procedure, language);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-6 right-6 bg-accent text-white rounded-full p-4 shadow-lg z-50 flex items-center gap-2 group hover:brightness-110"
          aria-label={isEnglish ? 'Open AI chat assistant' : 'Abrir asistente de chat AI'}
        >
          <MessageCircle className="w-6 h-6" />
          <span className="hidden group-hover:inline-block text-sm font-medium whitespace-nowrap mr-2">
            {isEnglish ? 'Ask AI Assistant' : 'Preguntar a AI'}
          </span>
          <Sparkles className="w-4 h-4" />
        </button>
      )}

      {isOpen && (
        <div className="fixed top-20 right-6 w-96 max-w-[calc(100vw-3rem)] h-[600px] bg-bg0 rounded-2xl shadow-lg flex flex-col z-50 border border-bd">
          <div className="bg-accent text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <div>
                <h3 className="font-bold text-lg">
                  {isEnglish ? 'AI Assistant' : 'Asistente AI'}
                </h3>
                <p className="text-xs opacity-80">
                  {isEnglish ? 'Powered by ChairIQ' : 'Impulsado por ChairIQ'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors relative"
                aria-label={isEnglish ? 'View conversation history' : 'Ver historial de conversaciones'}
                title={isEnglish ? 'Conversation History' : 'Historial de Conversaciones'}
              >
                <History className="w-5 h-5" />
                {conversationHistory?.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-danger text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {conversationHistory?.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label={isEnglish ? 'Close chat' : 'Cerrar chat'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {showHistory ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-bg1">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-t1">
                  {isEnglish ? 'Conversation History' : 'Historial de Conversaciones'}
                </h4>
                <div className="flex gap-2">
                  <button
                    onClick={handleExportConversations}
                    className="p-2 hover:bg-bg2 rounded-lg transition-colors text-t3 hover:text-accent"
                    title={isEnglish ? 'Export conversations' : 'Exportar conversaciones'}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNewConversation}
                    className="px-3 py-2 bg-accent hover:brightness-110 text-white text-xs rounded-lg transition-colors font-medium"
                  >
                    {isEnglish ? 'New Chat' : 'Nuevo Chat'}
                  </button>
                </div>
              </div>

              {conversationHistory?.length === 0 ? (
                <div className="text-center text-t3 py-8">
                  <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    {isEnglish ? 'No saved conversations yet' : 'Aún no hay conversaciones guardadas'}
                  </p>
                </div>
              ) : (
                conversationHistory
                  ?.sort((a, b) => new Date(b?.updatedAt) - new Date(a?.updatedAt))
                  ?.map((conv) => (
                    <button
                      key={conv?.id}
                      onClick={() => handleLoadConversation(conv)}
                      className={`w-full text-left p-3 rounded-xl transition-all ${
                        currentConversationId === conv?.id
                          ? 'bg-accent/10 border-2 border-accent' :'bg-bg2 hover:bg-bg3 border border-bd'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-t1 font-medium truncate">
                            {conv?.title || (isEnglish ? 'Untitled conversation' : 'Conversación sin título')}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-t3">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(conv?.updatedAt)?.toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{conv?.messages?.length} {isEnglish ? 'messages' : 'mensajes'}</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleDeleteConversation(conv?.id, e)}
                          className="p-1 hover:bg-danger/10 rounded transition-colors text-t3 hover:text-danger"
                          aria-label={isEnglish ? 'Delete conversation' : 'Eliminar conversación'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </button>
                  ))
              )}
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg1">
                {messages?.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message?.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 ${
                        message?.role === 'user' ?' bg-accent text-white' :'bg-bg2 text-t1 shadow-md border border-bd'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message?.content}
                        {message?.isStreaming && (
                          <span className="inline-block w-2 h-4 bg-accent animate-pulse ml-1" />
                        )}
                      </p>
                      <p className={`text-xs mt-1 ${message?.role === 'user' ? 'opacity-80' : 'text-t3'}`}>
                        {message?.timestamp?.toLocaleTimeString?.([], { hour: '2-digit', minute: '2-digit' }) || 
                         new Date(message?.timestamp)?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}

                {messages?.length <= 1 && !isStreaming && (
                  <div className="space-y-2">
                    <p className="text-xs text-t3 font-medium flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" />
                      {isEnglish ? 'Suggested questions:' : 'Preguntas sugeridas:'}
                    </p>
                    {suggestedQuestions?.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestedQuestion(question)}
                        className="w-full text-left text-sm bg-bg2 hover:bg-bg3 text-t1 p-3 rounded-xl shadow-sm border border-bd transition-all duration-200 hover:border-accent"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                )}

                {followUpQuestions?.length > 0 && !isStreaming && (
                  <div className="space-y-2 mt-4">
                    <p className="text-xs text-accent font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {isEnglish ? 'You might also want to ask:' : 'También podrías preguntar:'}
                    </p>
                    {followUpQuestions?.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestedQuestion(question)}
                        className="w-full text-left text-sm bg-bg2 hover:bg-bg3 text-t1 p-3 rounded-xl shadow-sm border border-bd transition-all duration-200 hover:border-accent"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                )}

                {isLoadingFollowUps && (
                  <div className="flex items-center gap-2 text-xs text-t3">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>{isEnglish ? 'Analyzing conversation...' : 'Analizando conversación...'}</span>
                  </div>
                )}

                {error && (
                  <div className="bg-danger/10 border border-danger/30 text-danger p-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-bd bg-bg0 rounded-b-2xl">
                <form
                  onSubmit={(e) => {
                    e?.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e?.target?.value)}
                    placeholder={isEnglish ? 'Ask a question...' : 'Haz una pregunta...'}
                    disabled={isStreaming}
                    className="flex-1 px-4 py-3 bg-bg2 border border-bd text-t1 rounded-xl focus:border-accent focus:outline-none disabled:bg-bg3 disabled:cursor-not-allowed text-sm placeholder-t3"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage?.trim() || isStreaming}
                    className="bg-accent text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
                    aria-label={isEnglish ? 'Send message' : 'Enviar mensaje'}
                  >
                    {isStreaming ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </form>
                <p className="text-xs text-t3 mt-2 text-center">
                  {isEnglish
                    ? 'Conversations saved automatically • Always consult your dentist' :'Conversaciones guardadas automáticamente • Siempre consulte a su dentista'}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default PatientChatAssistant;
