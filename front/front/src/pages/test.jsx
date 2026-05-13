import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-cyan-400 text-slate-900 font-bold grid place-items-center rounded-lg">
            NF
          </div>
          <span className="font-semibold text-lg">MonSite</span>
        </div>

        {/* Liens desktop */}
        <nav className="hidden md:flex items-center gap-4">
          <a href="#" className="hover:text-cyan-400">Accueil</a>
          <a href="#" className="hover:text-cyan-400">Cours</a>
          <a href="#" className="hover:text-cyan-400">À propos</a>
          <a href="#" className="hover:text-cyan-400">Contact</a>
        </nav>

        {/* Actions + hamburger */}
        <div className="flex items-center gap-3">
          <button className="px-3 py-1 border border-white/20 rounded-md">Se connecter</button>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 border border-white/20 rounded-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {open && (
        <nav className="md:hidden flex flex-col gap-2 px-4 pb-3 bg-slate-900 border-t border-white/10 animate-fadeIn">
          <a href="#" className="py-2 hover:text-cyan-400">Accueil</a>
          <a href="#" className="py-2 hover:text-cyan-400">Cours</a>
          <a href="#" className="py-2 hover:text-cyan-400">À propos</a>
          <a href="#" className="py-2 hover:text-cyan-400">Contact</a>
        </nav>
      )}
    </header>
  );
}

// Exemple d'utilisation dans App.jsx :
// import Navbar from "./Navbar";
// export default function App() {
//   return (
//     <div>
//       <Navbar />
//       <h1 className="text-3xl p-4">Contenu principal</h1>
//     </div>
//   );
// }
