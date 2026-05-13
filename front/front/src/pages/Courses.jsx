import { useEffect, useState } from "react";
import CoursModal from "./Mescours";
import { toast } from "react-toastify";
import { Trash2, Edit } from "lucide-react";
import { Transition } from "@headlessui/react";
import pdfIcon from "../assets/pdf.png";

export default function Cours() {
  const [coursEdit, setCoursEdit] = useState(null); // Pour modifier
  const [modalOpen, setModalOpen] = useState(false);
  const [mentions, setMentions] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [cours, setCours] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [resMentions, resNiveaux, resCours] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/mentions/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://127.0.0.1:8000/api/niveaux/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://127.0.0.1:8000/api/cours/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setMentions(await resMentions.json());
        setNiveaux(await resNiveaux.json());
        setCours(await resCours.json());
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, []);

 

  // Ouvrir modal pour édition
  const openEditModal = (cours) => {
    setCoursEdit(cours);
    setModalOpen(true);
  };

  // Ajouter ou modifier cours
  const saveCours = async (formDataToSend) => {
    try {
      let res;
      if (coursEdit) {
        // Modification
        res = await fetch(`http://127.0.0.1:8000/api/updated/${coursEdit.id}/`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formDataToSend,
        });
      } else {
        // Ajout
        res = await fetch("http://127.0.0.1:8000/api/cours/", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formDataToSend,
        });
      }

      if (!res.ok) {
        toast.error(`❌ Impossible de ${coursEdit ? "modifier" : "ajouter"} le cours.`);
        return;
      }

      const saved = await res.json();

      if (coursEdit) {
        setCours(cours.map((c) => (c.id === saved.id ? saved : c)));
        toast.success("✏️ Cours modifié avec succès !");
        setCoursEdit(null);
      } else {
        setCours([...cours, saved]);
        toast.success("📘 Nouveau cours ajouté avec succès !");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Supprimer cours
  const supprimerCours = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce cours ?")) return;

    const res = await fetch(`http://127.0.0.1:8000/api/delete/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      toast.error("❌ Erreur lors de la suppression du cours.");
      return;
    }

    setCours(cours.filter((c) => c.id !== id));
    toast.success("📚 Cours supprimé avec succès !");
  };

  // Ouvrir modal PDF
  const openModal = (url) => {
    setLoadingPdf(true);
    setPdfUrl(encodeURI(url));
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setPdfUrl(null), 300);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto pt-24">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">📚 Mes Cours</h1>
        <button
          onClick={() => {
            setCoursEdit(null); // Reset pour ajout
            setModalOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow hover:bg-indigo-700"
        >
          ➕ Nouveau Cours
        </button>
      </div>

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
            <div className="bg-white rounded-2xl shadow-2xl w-[90%] h-[90%] relative overflow-hidden">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm shadow-lg transition"
              >
                ✖
              </button>
              {loadingPdf && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
                  <div className="border-t-4 border-indigo-600 rounded-full w-12 h-12 animate-spin"></div>
                  <p className="mt-3 text-indigo-600 font-medium">Chargement du PDF...</p>
                </div>
              )}
              <iframe
                src={pdfUrl}
                className="w-full h-full rounded-2xl"
                onLoad={() => setLoadingPdf(false)}
              />
            </div>
          </div>
        </Transition>
      )}

      {/* GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cours.map((c) => (
          <div
  key={c.id}
  className="relative bg-white border border-gray-300 rounded-xl hover:border-indigo-500 transition duration-300 p-2"
>

            <div className="relative">
              <img
                src={pdfIcon}
                className="w-full h-48 object-contain bg-gray-100 p-4"
              />

              <button
                onClick={() => supprimerCours(c.id)}
                className="absolute top-3 right-3 bg-red-100 hover:bg-red-200 p-2 rounded-full shadow-lg transition"
                title="Supprimer le cours"
              >
                <Trash2 size={20} className="text-red-600" />
              </button>

              <button
                onClick={() => openEditModal(c)}
                className="absolute top-3 left-3 bg-yellow-100 hover:bg-yellow-200 p-2 rounded-full shadow-lg transition"
                title="Modifier le cours"
              >
                <Edit size={20} className="text-yellow-600" />
              </button>
            </div>

            <div className="p-5 bg-slate-900 rounded-2xl text-white flex flex-col h-56 justify-between">
              <h2 className="text-lg font-bold mb-2">{c.titre}</h2>
              <p className="text-sm line-clamp-3">{c.description}</p>

              <div className="flex flex-wrap gap-2 text-xs font-semibold mt-3">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  🏛️ {c.mention?.nom}
                </span>
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  🎓 {c.niveau?.nom}
                </span>
              </div>
<div className="flex flex-col mt-2 text-sm text-gray-200">
  <span>📅 Début : {new Date(c.date_debut).toLocaleString()}</span>
  <span>⏰ Fin : {new Date(c.date_fin).toLocaleString()}</span>
</div>

              <button
                onClick={() => openModal(`http://localhost:8000/api/pdf/${c.id}/`)}
                className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition text-sm shadow-md"
              >
                📄 Voir le PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      <CoursModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveCours}
        mentions={mentions}
        niveaux={niveaux}
        coursData={coursEdit}
      />
    </div>
  );
}
