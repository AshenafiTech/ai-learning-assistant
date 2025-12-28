import React, { useState, useEffect, useRef} from 'react'
import { Send, MessageSquare, Sparkles } from 'lucide-react';
import { useParams } from 'react-router-dom';
import aiService from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../common/Spinner';
import MarkdownRenderer from '../common/MarkdownRenderer';

const ChatInterface = () => {

    const { id: documentId } = useParams();
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const messagesEndRef = useRef(null); 

    const scrollBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchInitialMessages = async () => {
            try {
                setInitialLoading(true);
                const response = await aiService.getChatHistory(documentId);
                setHistory(response);
            } catch (error) {
                console.error("Failed to load chat history:", error);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchInitialMessages();
    }, [documentId]);

    useEffect(() => {
        scrollBottom();
    }, [history]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newMessage = {
            role: 'user',
            content: message,
            timestamp: new Date(),
        };
        setHistory((prev) => [...prev, newMessage]);
        setMessage('');
        setLoading(true);

        try {
            const response = await aiService.sendMessage(documentId, message);
            console.debug('AI response:', response);

            const extractAnswer = (res) => {
                if (!res) return null;
                // If service returns inner data object
                if (typeof res === 'object') {
                    if (res.answer) return res.answer;
                    if (res.data && typeof res.data === 'object') {
                        if (res.data.answer) return res.data.answer;
                        // if data itself is a string
                        if (typeof res.data === 'string') return res.data;
                    }
                }
                // if it's a plain string
                if (typeof res === 'string') return res;
                return null;
            };

            const answerText = extractAnswer(response) || 'No response';
            const relevantChunks = (response && (response.relevantChunks || (response.data && response.data.relevantChunks))) || [];

            const assistantMessage = {
                role: 'assistant',
                content: answerText,
                timestamp: new Date(),
                relevantChunks: relevantChunks,
            };
            setHistory(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage = {
                role: 'assistant',
                content: "Sorry, something went wrong. Please try again.",
                timestamp: new Date(),
            };
            setHistory(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const renderMessage = (msg, index) => {
        const isUser = msg.role === 'user';
        return (
            <div key={index} className={`flex items-start gap-3 my-4 ${isUser ? "justify-end" : ""}`}>
                {!isUser && (
                    <div className='w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 flex items-center justify-center shrink-0'>
                        <Sparkles className='w-4 h-4 text-white' strokeWidth={2}/>
                    </div>
                )}
                <div className={`max-w-lg p-4 rounded-2xl shadow-sm ${
                    isUser
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-md'
                    : 'bg-white border border-indigo-100/60 text-slate-800 rounded-bl-md'
                }`}>

                    {isUser ? (
                        <p className='text-sm leading-relaxed'>{msg.content}</p>
                    ) : (
                        <div className='prose prose-sm max-w-none prose-slate'>
                            <MarkdownRenderer>{msg.content}</MarkdownRenderer>
                        </div>
                    )}
                </div>
                {isUser && (
                    <div className='w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-400 text-white font-semibold text-sm shadow-lg shadow-indigo-500/30 flex items-center justify-center shrink-0 '>
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                )}
            </div>
        );
    };

    if (initialLoading) {
        return (
            <div className="flex flex-col h-[70vh] bg-white/90 backdrop-blur-xl border border-indigo-100/60 rounded-2xl items-center justify-center shadow-xl shadow-indigo-200/30">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
                    <MessageSquare className="w-7 h-7 text-indigo-600" strokeWidth={2} />
                </div>
                <Spinner />
                <p className='text-sm text-indigo-600/70 mt-3 font-medium'>Loading chat history...</p>
            </div>
        )
    }
  return (
    <div className='flex flex-col h-[70vh] bg-white/90 backdrop-blur-xl border border-indigo-100/60 rounded-2xl shadow-xl shadow-indigo-200/30 overflow-hidden'>
        {/* Chat Messages Area */}
        <div className='flex-1 p-6 overflow-y-auto bg-gradient-to-br from-indigo-50/30 via-white/50 to-purple-50/30'>
            {history.length === 0 ? (
               <div className='flex flex-col items-center justify-center h-full text-center'>
                <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/10'>
                    <MessageSquare className="w-8 h-8 text-indigo-600" strokeWidth={2} />
                </div>
                <h3 className='text-base font-semibold text-slate-900 mb-2'>Start a Conversation</h3>
                <p className='text-sm text-indigo-600/70'>Ask me anything about the document</p>
               </div> 
            ) : (
                history.map(renderMessage)   
            )}
            <div ref={messagesEndRef} />
            {loading && (
                <div className='flex items-center gap-3 my-4'>
                    <div className='w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 flex items-center justify-center shrink-0'>
                        <Sparkles className='w-4 h-4 text-white' strokeWidth={2} />
                    </div>
                    <div className='flex items-center gap-2 px-3 py-3 rounded-2xl rounded-bl-md bg-white border border-indigo-100/60'>
                        <div className='flex gap-1'>
                            <span className='w-2 h-2 bg-indigo-400 rounded-full animate-bounce' style={{ animationDelay: '0ms'}}></span>
                            <span className='w-2 h-2 bg-indigo-400 rounded-full animate-bounce' style={{ animationDelay: '150ms'}}></span>
                            <span className='w-2 h-2 bg-indigo-400 rounded-full animate-bounce' style={{ animationDelay: '300ms'}}></span>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Input Area */}
        <div className="p-5 border-t border-indigo-100/60 bg-white/90">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <input
                        type='text'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder='Ask a follow up question...'
                        disabled={loading}
                        className='flex-1 h-12 px-4 border-2 border-indigo-100 rounded-xl bg-indigo-50/30 text-slate-900 placeholder-indigo-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:bg-white focus:shadow-lg focus:shadow-indigo-500/10'
                    />
                <button
                    type='submit'
                    disabled={loading || !message.trim()}
                    className='shrink-0 w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg shadow-indigo-500/30 disable:opacity-50 disable:cursor-not-allowed active:scale-95'
                >
                    <Send className="w-5 h-5" strokeWidth={2} />
                </button>
            </form>
        </div>
     </div>
  )
}

export default ChatInterface
