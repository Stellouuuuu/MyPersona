import { motion } from 'framer-motion';
import { Search, Plus } from 'lucide-react';

const CONTACTS = [
  {
    id: 'assistant',
    name: 'Assistant Persona',
    status: 'online',
    preview: 'Bienvenue ! Tapez inscription pour commencer.',
    time: 'Maintenant',
    unread: 2,
    avatar: 'from-persona-500 to-persona-700',
    initials: 'AP',
  },
  {
    id: 'newsletter',
    name: 'Newsletter Bot',
    status: 'online',
    preview: 'Commande aperçu → email HTML instantané',
    time: '2 min',
    unread: 0,
    avatar: 'from-violet-400 to-purple-600',
    initials: 'NB',
  },
  {
    id: 'rgpd',
    name: 'RGPD Service',
    status: 'away',
    preview: 'Liens signés HMAC dans chaque email',
    time: '1h',
    unread: 0,
    avatar: 'from-emerald-400 to-teal-600',
    initials: 'RG',
  },
  {
    id: 'feedback',
    name: 'Feedback Email',
    status: 'offline',
    preview: 'Répondez à la newsletter pour ajuster',
    time: 'Hier',
    unread: 1,
    avatar: 'from-rose-400 to-pink-600',
    initials: 'FE',
  },
];

const GROUPS = [
  { id: 'ia', name: 'IA & Tech', members: 3, color: 'from-blue-400 to-indigo-500' },
  { id: 'espace', name: 'Espace & Science', members: 2, color: 'from-cyan-400 to-blue-500' },
  { id: 'sport', name: 'Sport & Santé', members: 4, color: 'from-green-400 to-emerald-500' },
];

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

const STATUS_COLORS = {
  online: 'bg-emerald-400',
  away: 'bg-amber-400',
  offline: 'bg-gray-300',
};

export default function ContactList({ searchQuery, activeContact, onSelect, onQuickCommand }) {
  const filtered = CONTACTS.filter(
    (c) =>
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col rounded-3xl bg-white shadow-card overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-xl font-bold text-gray-800">Chat</h2>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full rounded-full bg-gray-50 py-2 pl-9 pr-3 text-xs text-gray-600 outline-none ring-1 ring-gray-100 focus:ring-persona-200"
            readOnly
          />
        </div>
      </div>

      <motion.div
        className="flex-1 overflow-y-auto px-3"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {filtered.map((contact) => {
          const isActive = activeContact === contact.id;
          return (
            <motion.button
              key={contact.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(124, 92, 252, 0.06)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(contact.id)}
              className={`mb-1 flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors ${
                isActive ? 'bg-persona-50 ring-1 ring-persona-100' : ''
              }`}
            >
              <div className="relative shrink-0">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${contact.avatar} text-xs font-bold text-white`}
                >
                  {contact.initials}
                </div>
                <span
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${STATUS_COLORS[contact.status]}`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="truncate text-sm font-semibold text-gray-800">
                    {contact.name}
                  </span>
                  <span className="shrink-0 text-[10px] text-gray-400">{contact.time}</span>
                </div>
                <p className="truncate text-xs text-gray-400 mt-0.5">{contact.preview}</p>
              </div>
              {contact.unread > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-persona-600 text-[10px] font-bold text-white"
                >
                  {contact.unread}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      <div className="px-4 py-3 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onQuickCommand?.('aperçu')}
          className="flex-1 rounded-full bg-persona-600 py-2 text-center text-xs font-semibold text-white shadow-md shadow-persona-200"
        >
          Aperçu
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onQuickCommand?.('profil')}
          className="flex-1 rounded-full bg-gray-100 py-2 text-xs font-semibold text-gray-600"
        >
          Profil
        </motion.button>
      </div>

      <div className="border-t border-gray-50 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500">
            Intérêts ({GROUPS.length})
          </span>
          <motion.button whileHover={{ rotate: 90 }} className="text-persona-500">
            <Plus className="h-4 w-4" />
          </motion.button>
        </div>
        <motion.div variants={listVariants} initial="hidden" animate="visible">
          {GROUPS.map((group) => (
            <motion.div
              key={group.id}
              variants={itemVariants}
              whileHover={{ x: 4 }}
              className="flex items-center gap-2.5 py-2 cursor-pointer"
            >
              <div
                className={`h-8 w-8 rounded-xl bg-gradient-to-br ${group.color} flex items-center justify-center`}
              >
                <span className="text-[10px] font-bold text-white">
                  {group.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-gray-700">{group.name}</p>
                <div className="flex -space-x-1.5 mt-0.5">
                  {Array.from({ length: Math.min(group.members, 3) }).map((_, i) => (
                    <div
                      key={i}
                      className="h-4 w-4 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 ring-1 ring-white"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
