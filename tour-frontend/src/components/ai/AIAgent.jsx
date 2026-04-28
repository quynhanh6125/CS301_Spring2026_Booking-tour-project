import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { aiService } from '../../api/aiService'; //
import useAuthStore from '../../store/useAuthStore'; //
import useCartStore from '../../store/useCartStore'; //
import toast from 'react-hot-toast';

const AIAgent = () => {
  const { user, isLoggedIn } = useAuthStore();
  const { fetchCart } = useCartStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Chào bạn! Tôi là trợ lý ảo **Tam Anh Travel**. Tôi có thể giúp gì cho bạn?", isAi: true }
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { text: input, isAi: false };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Dùng optional chaining ?. để tránh lỗi nếu user null
      const res = await aiService.chat(input, user?.id || "GUEST", user?.role || "CUSTOMER");
      setMessages(prev => [...prev, { text: res.data, isAi: true }]);

      if (isLoggedIn && user?.id) {
        await fetchCart(user.id);
      }
    } catch (error) {
      toast.error("AI đang bận, bạn thử lại sau nhé!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 gradient-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
      >
        {isOpen ? <X size={24} /> : <Bot size={28} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[380px] h-[550px] bg-white rounded-[32px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            <div className="gradient-primary p-5 text-white font-black uppercase text-sm tracking-widest">
              Tam Anh AI Assistant
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.isAi ? 'justify-start' : 'justify-end'}`}>
                  <div className={`p-4 rounded-2xl max-w-[85%] text-sm shadow-sm ${
                    m.isAi ? 'bg-white text-text-primary' : 'gradient-primary text-white'
                  }`}>
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {loading && <div className="text-xs text-text-muted animate-pulse flex items-center gap-2 px-2"><Loader2 size={12} className="animate-spin" /> AI đang xử lý...</div>}
              <div ref={scrollRef} />
            </div>
            <div className="p-4 bg-white border-t flex gap-2">
              <input 
                className="flex-1 bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="Nhập yêu cầu..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button onClick={handleSend} disabled={loading} className="w-12 h-12 gradient-primary text-white rounded-2xl flex items-center justify-center shadow-md"><Send size={18} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAgent;