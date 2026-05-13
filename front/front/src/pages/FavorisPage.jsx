import { useEffect, useState } from "react";
import axios from "axios";
import pdf from "../assets/pdf.png";
import { Transition } from "@headlessui/react";
import { Heart } from "lucide-react";
import Sidebars from "../components/Sidebar";
import Footer from "./footer";

export default function FavorisPage({ setIsAuth }) {
  const [favoris, setFavoris] = useState([]);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(true);
  const token = localStorage.getItem("token");

  // Charger les cours favoris
  useEffect(() => {
    const fetchFavoris = async () => {
      try {
        if (!token) throw new Error("Token JWT introuvable");

        const res = await axios.get("http://localhost:8000/api/favoris/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // on récupère directement le cours lié à chaque favori
        setFavoris(res.data.map(f => f.cours));
      } catch (err) {
        setError(err.message);
      }
    };
    fetchFavoris();
  }, [token]);

  const openModal = (url) => {
    setLoadingPdf(true);
    setPdfUrl(encodeURI(url));
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setPdfUrl(null), 300);
  };

  // Retirer un cours des favoris
  const removeFavori = async (coursId) => {
    try {
      await axios.delete(`http://localhost:8000/api/favori/${coursId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavoris(favoris.filter((c) => c.id !== coursId));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Erreur lors de la suppression du favori");
    }
  };

return (
  <div className="container mx-auto p-6 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
       
    <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 text-center mb-8">
      ❤️ Mes Cours Favoris
    </h1>

    {error && (
      <p className="text-red-500 text-center mb-4">
        Erreur : {error}
      </p>
    )}

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {favoris.map((c) => (
        <div
          key={c.id}
          className="relative bg-white dark:bg-slate-900/70 backdrop-blur-md rounded-2xl shadow-2xl hover:shadow-2xl transition-transform transform hover:-translate-y-3 hover:scale-105 duration-300 overflow-hidden border border-gray-100 dark:border-slate-700"
        >
          <img
            src={pdf}
            alt="PDF"
            className="w-full h-48 object-contain bg-gray-100 dark:bg-slate-800 rounded-t-2xl p-4"
          />

          <div className="p-4">
            <h2 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400 mb-2">
              {c.titre}
            </h2>

            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3">
              {c.description || "Aucune description fournie."}
            </p>

            <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              <p>👨‍🏫 {c.professeur?.compte?.username || "Professeur inconnu"}</p>
              <p>🏛️ {c.mention?.nom}</p>
              <p>🎓 {c.niveau?.nom}</p>
            </div>

            <div className="flex justify-between items-center">

              {c.fichier ? (
                <button
                  onClick={() =>
                    openModal(`http://localhost:8000/api/pdf/${c.id}/`)
                  }
                  className="mt-2 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  📄 Voir le PDF
                </button>
              ) : (
                <p className="text-center text-gray-400 dark:text-gray-500 text-sm italic flex-1">
                  Aucun fichier
                </p>
              )}

              <button
                onClick={() => window.location.href = `/cours/${c.id}`}
                className="mt-2 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                📘 Détails du cours
              </button>

              <button
                onClick={() => removeFavori(c.id)}
                className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 transition"
                title="Retirer des favoris"
              >
                <Heart size={22} fill="red" strokeWidth={1.5} />
              </button>

            </div>
          </div>
        </div>
      ))}
    </div>

      {/* MODAL PDF */}
      {pdfUrl && (
        <Transition
          show={isOpen}
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 scale-90"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-90"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-[90%] h-[90%] relative overflow-hidden">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm shadow-lg transition"
              >
                ✖
              </button>

              {loadingPdf && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
                  <div className="loader border-t-4 border-indigo-600 rounded-full w-12 h-12 animate-spin"></div>
                  <p className="mt-3 text-indigo-600 font-medium">
                    Chargement du PDF...
                  </p>
                </div>
              )}

              <iframe
                src={pdfUrl}
                title="PDF Viewer"
                className="w-full h-full rounded-2xl"
                onLoad={() => setLoadingPdf(false)}
              />
            </div>
          </div>
        </Transition>
      )}
      <Footer />
    </div>
  );
}
