import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  Calendar,
  Shield,
  Sparkles,
  Newspaper,
  MessageSquare,
  RotateCcw,
} from 'lucide-react';

const FEATURES = [
  { icon: Newspaper, label: 'Preview instantané', desc: 'Commande aperçu' },
  { icon: Sparkles, label: 'IA explicable', desc: 'Pourquoi cette actu ?' },
  { icon: Shield, label: 'RGPD signé', desc: 'Liens HMAC 72h' },
  { icon: MessageSquare, label: 'Feedback email', desc: 'Répondez à la newsletter' },
];

const QUICK_COMMANDS = [
  { label: 'Inscription', cmd: 'inscription' },
  { label: 'Connexion', cmd: 'connexion' },
  { label: 'Aperçu newsletter', cmd: 'aperçu' },
  { label: 'Mon profil', cmd: 'profil' },
  { label: 'RGPD', cmd: 'rgpd' },
  { label: 'Aide', cmd: 'aide' },
];

const MEDIA_ITEMS = [
  { color: 'from-violet-300 to-purple-400' },
  { color: 'from-blue-300 to-indigo-400' },
  { color: 'from-rose-300 to-pink-400' },
  { color: 'from-amber-300 to-orange-400' },
  { color: 'from-emerald-300 to-teal-400' },
  { color: 'from-cyan-300 to-sky-400' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

export default function ProfilePanel({ onQuickCommand, onResetChat }) {
  return (
    <motion.div
      className="flex h-full flex-col rounded-3xl bg-white shadow-card overflow-hidden overflow-y-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="relative px-5 pt-6 pb-4 text-center">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-persona-400 via-persona-500 to-persona-700 shadow-float"
        >
          <span className="text-3xl font-bold text-white">P</span>
        </motion.div>
        <h3 className="text-lg font-bold text-gray-800">Persona</h3>
        <p className="text-xs text-persona-500 font-medium mt-0.5">
          Newsletter IA personnalisée
        </p>
        <p className="text-[11px] text-gray-400 mt-1">Epitech · Prompt Engineering</p>
      </motion.div>

      <motion.div variants={itemVariants} className="px-5 py-3 border-t border-gray-50">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Commandes rapides
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_COMMANDS.map(({ label, cmd }) => (
            <motion.button
              key={cmd}
              whileHover={{ scale: 1.03, backgroundColor: '#f3f0ff' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onQuickCommand?.(cmd)}
              className="rounded-xl bg-gray-50 py-2 px-2 text-[11px] font-semibold text-persona-700 ring-1 ring-gray-100"
            >
              {label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="px-5 py-3 border-t border-gray-50">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Informations
        </h4>
        <div className="space-y-2.5">
          {[
            { icon: Phone, label: 'Backend', value: 'N8N (webhook)' },
            { icon: Mail, label: 'Email', value: 'Newsletter HTML' },
            { icon: Calendar, label: 'Planification', value: 'Horaire personnalisé' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-persona-50">
                <Icon className="h-3.5 w-3.5 text-persona-500" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400">{label}</p>
                <p className="text-xs font-medium text-gray-700">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="px-5 py-3 border-t border-gray-50">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Fonctionnalités
        </h4>
        <div className="space-y-2">
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <motion.div
              key={label}
              whileHover={{ x: 4, backgroundColor: '#f3f0ff' }}
              className="flex items-center gap-2.5 rounded-xl p-2 transition-colors cursor-default"
            >
              <Icon className="h-4 w-4 text-persona-500 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-700">{label}</p>
                <p className="text-[10px] text-gray-400">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="px-5 py-3 border-t border-gray-50 flex-1">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Sources ({MEDIA_ITEMS.length})
          </h4>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {MEDIA_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className={`aspect-square rounded-xl bg-gradient-to-br ${item.color} cursor-pointer`}
            />
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="px-5 py-4 border-t border-gray-50">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onResetChat}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-100 py-3 text-xs font-semibold text-gray-600"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Nouvelle conversation
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
