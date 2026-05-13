import { BookOpen } from "lucide-react";

export default function FooterInstruction() {
  return (
    <footer className="mt-20 bg-slate-900 backdrop-blur-lg border-t  py-16 rounded-t-4xl relative overflow-hidden">
      
      {/* Gradient décoratif derrière */}
      <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 via-black to-gray-800 opacity-40 rounded-t-4xl -z-10"></div>

      {/* Titre et icône */}
      <div className="flex flex-col items-center mb-12">
        <div className="w-24 h-24 border-4 border-gray-700 rounded-full flex items-center justify-center shadow-2xl bg-black/40 backdrop-blur-xl animate-bounce-slow">
          <BookOpen size={36} className="text-white" />
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-4 tracking-wide drop-shadow-lg">
          Instruction
        </h2>
        <p className="text-gray-400 mt-3 text-center max-w-xl text-lg md:text-xl">
          Suivez les étapes ci-dessous pour utiliser efficacement les fonctionnalités de cette page.
        </p>
      </div>

      {/* Grid des instructions */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {[
          ["📌 Choisissez votre cours dans la liste.", "⭐ Ajoutez un cours en favori pour y accéder rapidement."],
          ["👨‍🏫 Consultez le nom et le profil du professeur.", "📄 Cliquez sur 'Voir le PDF' pour ouvrir le cours."],
          ["🔍 Utilisez la barre de recherche pour filtrer vos cours.", "📥 Téléchargez le PDF si l’option est disponible."]
        ].map((col, idx) => (
          <div key={idx} className="space-y-5">
            {col.map((text, i) => (
              <div key={i} className="bg-black/60 border border-gray-700 p-5 rounded-3xl shadow-lg hover:bg-black/50 hover:scale-105 transition-transform duration-300 cursor-pointer">
                <p className="text-white text-base md:text-lg">{text}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Bas du footer */}
      <div className="text-center text-gray-500 text-sm mt-16">
        © {new Date().getFullYear()} IAcademy — Instructions des cours.
      </div>
    </footer>
  );
}
