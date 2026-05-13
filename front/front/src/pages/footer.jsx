import { BookOpen, Users, FileText, Facebook, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-12 transition-colors duration-300">
      
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Fonctionnalités */}
        <div className="border border-black/10 dark:border-white/20 p-6 rounded-xl bg-white dark:bg-slate-900">
          <h2 className="text-2xl font-bold mb-4">Fonctionnalités</h2>

          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-center space-x-2">
              <BookOpen size={18} />
              <span>Les professeurs de l’IFT peuvent ajouter leurs cours ici.</span>
            </li>
            <li className="flex items-center space-x-2">
              <Users size={18} />
              <span>Les étudiants peuvent accéder aux cours n’importe où.</span>
            </li>
            <li className="flex items-center space-x-2">
              <FileText size={18} />
              <span>Génération automatique de quiz à partir des PDF.</span>
            </li>
            <li className="flex items-center space-x-2">
              <FileText size={18} />
              <span>Résumés intelligents pour mieux comprendre le cours.</span>
            </li>
          </ul>
        </div>

        {/* À propos */}
        <div className="border border-black/10 dark:border-white/20 p-6 rounded-xl bg-white dark:bg-slate-900">
          <h3 className="text-2xl font-bold mb-4">À propos</h3>

          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            Cette plateforme aide les étudiants de l’IFT à accéder rapidement aux cours,
            aux quiz, et à un système d’apprentissage moderne basé sur l’IA.
          </p>

          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mt-3">
            Nous avons pour objectif de simplifier l’éducation et d’offrir une expérience numérique rapide et intuitive.
          </p>
        </div>

        {/* Contact */}
        <div className="border border-black/10 dark:border-white/20 p-6 rounded-xl bg-white dark:bg-slate-900">
          <h3 className="text-2xl font-bold mb-4">Contact</h3>

          <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">

            <p className="flex items-center space-x-2">
              <Mail size={18} />
              <span>support@ift-platform.com</span>
            </p>

            <p className="flex items-center space-x-2">
              <Phone size={18} />
              <span>+261 32 123 4567</span>
            </p>

            <p className="flex items-center space-x-2">
              <Facebook size={18} />
              <span>IFT Fianarantsoa</span>
            </p>

            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Disponible 7j/7 — réponse rapide.
            </p>
          </div>
        </div>

        {/* Liens */}
        <div className="border border-black/10 dark:border-white/20 p-6 rounded-xl bg-white dark:bg-slate-900">
          <h3 className="text-2xl font-bold mb-4">Liens utiles</h3>

          <ul className="space-y-3 text-sm">
            <li><a href="/" className="hover:underline">Accueil</a></li>
            <li><a href="/cours" className="hover:underline">Cours disponibles</a></li>
            <li><a href="/quiz" className="hover:underline">Quiz intelligents</a></li>
            <li><a href="/support" className="hover:underline">Support étudiant</a></li>
            <li><a href="/conditions" className="hover:underline">Conditions d'utilisation</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t border-black/10 dark:border-white/20 pt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} IFT Fianarantsoa — Tous droits réservés.
      </div>
    </footer>
  );
}