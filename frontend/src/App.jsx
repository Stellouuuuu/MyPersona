import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import ContactList from './components/ContactList';
import ChatWindow from './components/ChatWindow';
import ProfilePanel from './components/ProfilePanel';
import usePersonaChat from './hooks/usePersonaChat';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const columnVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 24 },
  },
};

export default function App() {
  const [activeNav, setActiveNav] = useState('chat');
  const [activeContact, setActiveContact] = useState('assistant');
  const [showProfile, setShowProfile] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { messages, loading, connected, sendMessage, clearChat } = usePersonaChat();

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-[#edeaf8]">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <div className="flex flex-1 flex-col min-w-0">
        <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} connected={connected} />

        <motion.main
          className="flex flex-1 gap-3 sm:gap-4 p-3 sm:p-4 pt-2 sm:pt-3 min-h-0"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={columnVariants} className="w-[280px] shrink-0 hidden lg:block">
            <ContactList
              searchQuery={searchQuery}
              activeContact={activeContact}
              onSelect={setActiveContact}
              onQuickCommand={sendMessage}
            />
          </motion.div>

          <motion.div variants={columnVariants} className="flex-1 min-w-0">
            <ChatWindow
              activeContact={activeContact}
              onToggleProfile={() => setShowProfile((v) => !v)}
              messages={messages}
              loading={loading}
              connected={connected}
              sendMessage={sendMessage}
            />
          </motion.div>

          <AnimatePresence mode="popLayout">
            {showProfile && (
              <motion.div
                key="profile"
                variants={columnVariants}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="w-[260px] shrink-0 hidden xl:block"
              >
                <ProfilePanel onQuickCommand={sendMessage} onResetChat={clearChat} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
      </div>
    </div>
  );
}
