import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export default function TopBar({ searchQuery, onSearchChange, connected }) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="flex h-[60px] shrink-0 items-center gap-4 bg-gradient-to-r from-persona-900 via-persona-800 to-persona-900 px-5"
    >
      <motion.div
        className="flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15">
          <span className="text-sm font-bold text-white">P</span>
        </div>
        <span className="hidden sm:block text-lg font-bold tracking-tight text-white">
          Persona
        </span>
      </motion.div>

      <div className="relative mx-auto w-full max-w-xl">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-persona-300/60" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher commandes, contacts..."
          className="w-full rounded-full border-0 bg-white/10 py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-white/40 outline-none ring-1 ring-white/10 transition-all focus:bg-white/15 focus:ring-white/25"
        />
      </div>

      <motion.div
        className="hidden sm:flex items-center gap-2.5 shrink-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 ring-2 ring-white/20" />
        <div className="text-right">
          <p className="text-xs font-semibold text-white leading-tight">Démo</p>
          <p className="text-[10px] text-white/50">{connected ? 'En ligne' : 'Hors ligne'}</p>
        </div>
      </motion.div>
    </motion.header>
  );
}
