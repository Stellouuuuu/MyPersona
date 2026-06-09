import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  Video,
  MoreHorizontal,
  Smile,
  Paperclip,
  Mic,
  Send,
  Loader2,
} from 'lucide-react';

const CONTACT_META = {
  assistant: {
    name: 'Assistant Persona',
    status: 'En ligne',
    avatar: 'from-persona-500 to-persona-700',
    initials: 'AP',
  },
  newsletter: {
    name: 'Newsletter Bot',
    status: 'En ligne',
    avatar: 'from-violet-400 to-purple-600',
    initials: 'NB',
  },
  rgpd: {
    name: 'RGPD Service',
    status: 'Disponible',
    avatar: 'from-emerald-400 to-teal-600',
    initials: 'RG',
  },
  feedback: {
    name: 'Feedback Email',
    status: 'Hors ligne',
    avatar: 'from-rose-400 to-pink-600',
    initials: 'FE',
  },
};

const messageVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.92 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 28,
      delay: Math.min(i * 0.04, 0.3),
    },
  }),
};

export default function ChatWindow({
  activeContact,
  onToggleProfile,
  messages,
  loading,
  connected,
  sendMessage,
}) {
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef(null);
  const meta = CONTACT_META[activeContact] || CONTACT_META.assistant;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;
    const text = inputValue;
    setInputValue('');
    sendMessage(text);
  };

  const formatText = (text) =>
    text.split('\n').map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </span>
    ));

  return (
    <div className="flex h-full flex-col rounded-3xl bg-white shadow-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-50 px-4 sm:px-5 py-3 sm:py-4">
        <motion.div
          key={activeContact}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${meta.avatar} text-xs font-bold text-white`}
          >
            {meta.initials}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">{meta.name}</h3>
            <p className={`text-xs font-medium ${connected ? 'text-emerald-500' : 'text-amber-500'}`}>
              {connected ? meta.status : 'Connexion...'}
            </p>
          </div>
        </motion.div>
        <div className="flex items-center gap-1">
          {[Phone, Video, MoreHorizontal].map((Icon, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1, backgroundColor: '#f3f0ff' }}
              whileTap={{ scale: 0.9 }}
              onClick={i === 2 ? onToggleProfile : undefined}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-colors hover:text-persona-600"
            >
              <Icon className="h-4 w-4" />
            </motion.button>
          ))}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3 bg-gradient-to-b from-gray-50/50 to-white min-h-0"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              custom={i}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              layout
              className={`flex gap-2.5 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white ${
                  msg.from === 'user'
                    ? 'bg-gradient-to-br from-amber-300 to-orange-400'
                    : `bg-gradient-to-br ${meta.avatar}`
                }`}
              >
                {msg.from === 'user' ? 'VO' : meta.initials}
              </div>
              <div className="max-w-[85%] sm:max-w-[75%]">
                <motion.div
                  whileHover={{ scale: 1.005 }}
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.from === 'user'
                      ? 'bg-gradient-to-br from-persona-600 to-persona-700 text-white rounded-br-md'
                      : 'bg-white text-gray-700 shadow-sm ring-1 ring-gray-100 rounded-bl-md'
                  }`}
                >
                  {formatText(msg.text)}
                </motion.div>
                <p
                  className={`mt-1 text-[10px] text-gray-400 ${
                    msg.from === 'user' ? 'text-right' : ''
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2.5 items-center"
          >
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${meta.avatar}`}
            >
              <Loader2 className="h-3.5 w-3.5 text-white animate-spin" />
            </div>
            <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm ring-1 ring-gray-100">
              <div className="flex gap-1">
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="h-2 w-2 rounded-full bg-persona-400"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.15 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSend} className="border-t border-gray-50 px-3 sm:px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="hidden sm:block text-gray-400 hover:text-persona-500"
          >
            <Smile className="h-5 w-5" />
          </motion.button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
            placeholder="inscription, connexion, aperçu..."
            className="flex-1 rounded-full bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none ring-1 ring-gray-100 focus:ring-persona-200 transition-all disabled:opacity-50"
          />
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            className="hidden sm:block text-gray-400"
          >
            <Paperclip className="h-5 w-5" />
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            className="hidden sm:block text-gray-400"
          >
            <Mic className="h-5 w-5" />
          </motion.button>
          <motion.button
            type="submit"
            disabled={loading || !inputValue.trim()}
            whileHover={{ scale: 1.08, rotate: -10 }}
            whileTap={{ scale: 0.92 }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-persona-600 to-persona-700 text-white shadow-md shadow-persona-200 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </div>
      </form>
    </div>
  );
}
