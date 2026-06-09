import { motion } from 'framer-motion';
import {
  Home,
  Users,
  MessageCircle,
  FileText,
  Video,
  Bell,
  Settings,
  Sparkles,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', icon: Home, label: 'Accueil' },
  { id: 'community', icon: Users, label: 'Communauté' },
  { id: 'chat', icon: MessageCircle, label: 'Chat' },
  { id: 'docs', icon: FileText, label: 'Documents' },
  { id: 'video', icon: Video, label: 'Vidéo' },
  { id: 'notif', icon: Bell, label: 'Notifications' },
  { id: 'settings', icon: Settings, label: 'Paramètres' },
];

export default function Sidebar({ activeNav, onNavChange }) {
  return (
    <aside className="relative flex w-[72px] shrink-0 flex-col items-center bg-gradient-to-b from-persona-900 via-persona-800 to-persona-950 py-5 z-10">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
        className="mb-8 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm"
      >
        <Sparkles className="h-5 w-5 text-persona-200" />
      </motion.div>

      <nav className="flex flex-1 flex-col items-center gap-2">
        {NAV_ITEMS.map((item, i) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;

          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavChange(item.id)}
              title={item.label}
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-2xl bg-white shadow-float"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                className={`relative z-10 h-5 w-5 transition-colors ${
                  isActive ? 'text-persona-700' : 'text-white/70'
                }`}
              />
            </motion.button>
          );
        })}
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4"
      >
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-persona-300 to-persona-500 ring-2 ring-white/30" />
      </motion.div>
    </aside>
  );
}
