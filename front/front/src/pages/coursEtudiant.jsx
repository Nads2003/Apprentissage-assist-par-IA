import { useEffect, useState } from "react";
import axios from "axios";
import pdf from "../assets/pdf.png";
import { toast } from "react-toastify";
import avatarDefault from "../assets/profile.png";
import { Transition } from "@headlessui/react";
import { Heart, Search } from "lucide-react";
import FooterInstruction from "./FonctionaliteInstruction";
import { motion } from "framer-motion";
import Sidebars from "../components/Sidebar";

export default function CoursEtudiant() {
  const [cours, setCours] = useState([]);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(true);
  const [favoris, setFavoris] = useState([]);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) throw new Error("Token JWT introuvable");

        const resCours = await axios.get("http://localhost:8000/api/cours/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCours(resCours.data);

        const resFav = await axios.get("http://localhost:8000/api/favoris/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const favIds = resFav.data
          .map((f) => {
            if (typeof f.cours === "number") return f.cours;
            if (f.cours && typeof f.cours === "object" && f.cours.id)
              return f.cours.id;
            return null;
          })
          .filter(Boolean);

        setFavoris(favIds);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };
    fetchData();
  }, [token]);

  // --- WebSocket pour mise à jour des cours en temps réel ---
useEffect(() => {
  const ws = new WebSocket("ws://127.0.0.1:8000/ws/cours/");

  ws.onopen = () => {
    console.log("✅ WebSocket cours connectée");
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("⚡ Event reçu:", data);

    // --------------------------
    // 📘 1. AJOUT d'un cours
    // --------------------------
    if (data.type === "new_cours") {
      const newCours = data.data;

      setCours((prevCours) => {
        if (prevCours.some((c) => c.id === newCours.id)) return prevCours;
        return [...prevCours, newCours];
      });

      toast.info(`📘 Nouveau cours ajouté : ${newCours.titre}`);
    }

    // --------------------------
    // 🗑️ 2. SUPPRESSION d'un cours
    // --------------------------
    if (data.type === "delete_cours") {
      const deletedId = data.cours_id;

      setCours((prevCours) => prevCours.filter((c) => c.id !== deletedId));

      toast.warning("🗑️ Un cours a été supprimé");
    }
  };

  ws.onclose = () => {
    console.log("❌ WebSocket cours fermée");
  };

  ws.onerror = (err) => {
    console.error("❌ WebSocket cours ERROR:", err);
  };

  return () => ws.close();
}, []);



  const openModal = (url) => {
    setLoadingPdf(true);
    setPdfUrl(encodeURI(url));
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setPdfUrl(null), 300);
  };

  const toggleFavori = async (coursIdRaw) => {
    const coursId = Number(coursIdRaw);
    try {
      if (favoris.includes(coursId)) {
        await axios.delete(`http://localhost:8000/api/favori/${coursId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavoris((prev) => prev.filter((id) => id !== coursId));
      } else {
        await axios.post(
          "http://localhost:8000/api/favori/",
          { cours: coursId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFavoris((prev) => [...prev, coursId]);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Erreur lors du traitement du favori.");
    }
  };

  // Filtrer les cours selon la recherche
  const filteredCours = cours.filter((c) =>
    c.titre.toLowerCase().includes(search.toLowerCase())
  );

return (
  <div className="container mx-auto p-6 pt-[80px] bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">

    {/* --- HEADER MODERNE --- */}
    <motion.div
      className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 
      bg-black/10 dark:bg-slate-900/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex items-center gap-4">
        <span className="text-4xl animate-bounce text-indigo-500">📚</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white drop-shadow-lg">
          Cours disponibles
        </h1>
      </div>

      {/* Barre de recherche */}
      <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl p-2 w-full md:w-1/3 shadow-sm">
        <Search size={20} className="text-gray-500 dark:text-gray-300 mr-2" />
        <input
          type="text"
          placeholder="Rechercher un cours..."
          className="bg-transparent focus:outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </motion.div>

    {error && (
      <p className="text-red-500 text-center mb-4">{error}</p>
    )}

    {/* Modal PDF */}
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-[90%] h-[90%] relative overflow-hidden">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm shadow-lg transition"
            >
              ✖
            </button>

            {loadingPdf && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-slate-900/90 z-10">
                <div className="loader border-t-4 border-indigo-600 rounded-full w-12 h-12 animate-spin"></div>
                <p className="mt-3 text-indigo-600 dark:text-indigo-300 font-medium">
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

    {/* Grid des cours */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCours.map((c) => (
        <div
          key={c.id}
          className="relative bg-white dark:bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-3 hover:scale-105 duration-300 overflow-hidden"
        >
          {/* PDF + Favori */}
          <div className="relative">
            <img
              src={pdf}
              alt="PDF"
              className="w-full h-48 object-contain bg-gray-100 dark:bg-slate-800 rounded-t-2xl p-4"
            />

            <button
              onClick={() => toggleFavori(c.id)}
              className={`absolute top-3 right-3 p-2 rounded-full transition-transform ${
                favoris.includes(c.id)
                  ? "bg-red-100 text-red-600 animate-pulse scale-110"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-500 hover:text-red-500 hover:scale-110"
              }`}
            >
              <Heart
                size={24}
                fill={favoris.includes(c.id) ? "red" : "none"}
                strokeWidth={1.5}
              />
            </button>
          </div>

          {/* Card Content */}
          <div className="p-5 flex bg-white dark:bg-slate-900 flex-col justify-between h-[240px]">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {c.titre}
            </h2>

            <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 max-h-[120px] overflow-y-auto pr-3">
              {c.description || "Aucune description fournie."}
            </p>

            <div className="flex flex-wrap gap-2 mb-1 items-center">
              <div className="flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 px-2 py-1 rounded-full text-xs font-bold">
                <img
                  src={c.professeur?.avatar || avatarDefault}
                  className="w-6 h-6 rounded-full object-cover border border-indigo-300"
                />
                {c.professeur?.compte?.username || "Professeur inconnu"}
              </div>

              <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 px-2 py-1 rounded-full text-xs">
                🏛️ {c.mention?.nom}
              </span>

              <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 px-2 py-1 rounded-full text-xs">
                🎓 {c.niveau?.nom}
              </span>
            </div>

            <button
              onClick={() =>
                openModal(`http://localhost:8000/api/pdf/${c.id}/`)
              }
              className="mt-2 w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition text-sm font-semibold"
            >
              📄 Voir le PDF
            </button>

            <button
              onClick={() => window.location.href = `/cours/${c.id}`}
              className="mt-2 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition text-sm font-semibold"
            >
              📘 Détails du cours
            </button>
          </div>
        </div>
      ))}
    </div>

    <FooterInstruction />
  </div>
);
}
