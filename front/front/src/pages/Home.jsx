import { motion } from "framer-motion";
import { BookOpen, Sparkles, ChevronRight } from "lucide-react";

import Footer from "./footer";
export default function Accueil() {
  return (
    <div
      className="relative min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600 
                 overflow-x-hidden"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Gradient animé */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent)] animate-pulse"></div>

      {/* Contenu principal */}
      <div className="pt-32 flex flex-col items-center justify-center text-center px-6 md:px-20">

        {/* Badge */}
        <motion.div
          className="px-6 py-2 bg-white/10 backdrop-blur-xl rounded-full text-white text-sm mb-6 
                     border border-white/20 shadow-lg flex items-center gap-2"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Sparkles size={16} className="text-yellow-300" />
          Plateforme IA moderne de l’IFT
        </motion.div>

        {/* TITRE */}
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight drop-shadow-2xl"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Bienvenue sur <span className="text-yellow-300">IAcademy</span>
        </motion.h1>

        {/* Sous-titre */}
        <motion.p
          className="text-lg md:text-2xl text-white/90 max-w-3xl leading-relaxed mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          Une nouvelle manière d’apprendre : cours interactifs, assistant IA intelligent,
          quiz générés automatiquement et outils modernes pour étudiants et professeurs.
        </motion.p>

        {/* Boutons */}
        <motion.div
          className="flex flex-col md:flex-row gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.94 }}
            className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl shadow-xl 
                       hover:bg-blue-100 transition border border-white/50"
          >
            Commencer
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.94 }}
            className="bg-black/30 text-white backdrop-blur-xl font-semibold px-8 py-3 
                       rounded-xl border border-white/20 shadow-lg hover:bg-black/40 transition"
          >
            Explorer les cours
          </motion.button>
        </motion.div>

        {/* MENTIONS */}
        <motion.div
          className="mt-20 bg-white/10 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-white/20 max-w-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <h2 className="text-3xl font-bold text-white mb-5">Mentions disponibles</h2>

          <ul className="text-white space-y-3 text-xl">
            <li className="flex items-center gap-3"><BookOpen size={20} /> Droit</li>
            <li className="flex items-center gap-3"><BookOpen size={20} /> BTP</li>
            <li className="flex items-center gap-3"><BookOpen size={20} /> CJI</li>
            <li className="flex items-center gap-3"><BookOpen size={20} /> Gestion</li>
            <li className="flex items-center gap-3"><BookOpen size={20} /> Informatique</li>
          </ul>
        </motion.div>

        {/* Petite flèche vers le bas */}
        <motion.div
          className="mt-10 text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <ChevronRight size={30} className="rotate-90 animate-bounce" />
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
