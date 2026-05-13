import { BookOpen, Users, FileText, Facebook, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Fonctionnalités */}
        <div className="border border-gray-700 p-6 rounded-xl bg-gray-800">
          <h2 className="text-2xl font-bold text-white mb-4">Fonctionnalités</h2>

          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-center space-x-2">
              <BookOpen size={18} className="text-blue-500" />
              <span>Les professeurs de l’IFT peuvent ajouter leurs cours ici.</span>
            </li>
            <li className="flex items-center space-x-2">
              <Users size={18} className="text-blue-500" />
              <span>Les étudiants peuvent accéder aux cours n’importe où.</span>
            </li>
            <li className="flex items-center space-x-2">
              <FileText size={18} className="text-blue-500" />
              <span>Génération automatique de quiz à partir des PDF.</span>
            </li>
            <li className="flex items-center space-x-2">
              <FileText size={18} className="text-blue-500" />
              <span>Résumés intelligents pour mieux comprendre le cours.</span>
            </li>
          </ul>
        </div>

        {/* A propos */}
        <div className="border border-gray-700 p-6 rounded-xl bg-gray-800">
          <h3 className="text-2xl font-bold text-white mb-4">À propos</h3>

          <p className="text-gray-400 text-sm leading-relaxed">
            Cette plateforme aide les étudiants de l’IFT à accéder rapidement aux cours,
            aux quiz, et à un système d’apprentissage moderne basé sur l’IA.
          </p>

          <p className="text-gray-400 text-sm leading-relaxed mt-3">
            Nous avons pour objectif de simplifier l’éducation et d’offrir une
            expérience numérique rapide, intuitive et accessible.
          </p>
        </div>

        {/* Contact */}
        <div className="border border-gray-700 p-6 rounded-xl bg-gray-800">
          <h3 className="text-2xl font-bold text-white mb-4">Contact</h3>

          <div className="space-y-4 text-sm text-gray-400">

            <p className="flex items-center space-x-2">
              <Mail size={18} className="text-blue-500" />
              <span>support@ift-platform.com</span>
            </p>

            <p className="flex items-center space-x-2">
              <Phone size={18} className="text-blue-500" />
              <span>+261 32 123 4567</span>
            </p>

            {/* Facebook + texte */}
            <p className="flex items-center space-x-2">
              <Facebook size={20} className="text-blue-500" />
              <span>IFT Fianarantsoa</span>
            </p>

            <p className="mt-3 text-gray-500">
              Disponible 7j/7 — Nous répondons rapidement.
            </p>
          </div>
        </div>

        {/* Liens utiles */}
        <div className="border border-gray-700 p-6 rounded-xl bg-gray-800">
          <h3 className="text-2xl font-bold text-white mb-4">Liens utiles</h3>

          <ul className="space-y-3 text-sm">
            <li><a href="/" className="hover:text-blue-500 transition">Accueil</a></li>
            <li><a href="/cours" className="hover:text-blue-500 transition">Cours disponibles</a></li>
            <li><a href="/quiz" className="hover:text-blue-500 transition">Quiz intelligents</a></li>
            <li><a href="/support" className="hover:text-blue-500 transition">Support étudiant</a></li>
            <li><a href="/conditions" className="hover:text-blue-500 transition">Conditions d'utilisation</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} IFT Fianarantsoa — Tous droits réservés.
      </div>
    </footer>
  );
}
