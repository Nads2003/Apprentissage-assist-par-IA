import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";

export default function CoursModal({
  isOpen,
  onClose,
  onSave,
  mentions,
  niveaux,
  coursData,
}) {
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    mention: "",
    niveau: "",
    date_debut: "",
    date_fin: "",
    fichier: null,
  });

  useEffect(() => {
    if (coursData) {
      setFormData({
        titre: coursData.titre || "",
        description: coursData.description || "",
        mention: coursData.mention?.id || "",
        niveau: coursData.niveau?.id || "",
        date_debut: coursData.date_debut || "",
        date_fin: coursData.date_fin || "",
        fichier: null,
      });
    } else {
      setFormData({
        titre: "",
        description: "",
        mention: "",
        niveau: "",
        date_debut: "",
        date_fin: "",
        fichier: null,
      });
    }
  }, [coursData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const now = new Date();
    const debut = new Date(formData.date_debut);
    const fin = new Date(formData.date_fin);

    if (!coursData && debut <= now) {
      alert("❌ La date de début doit être supérieure à aujourd'hui.");
      return;
    }

    if (fin <= now) {
      alert("❌ La date de fin doit être supérieure à aujourd'hui.");
      return;
    }

    if (debut >= fin) {
      alert("❌ La date de début doit être inférieure à la date de fin.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("titre", formData.titre);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("mention_id", formData.mention);
    formDataToSend.append("niveau_id", formData.niveau);
    formDataToSend.append("date_debut", formData.date_debut);
    formDataToSend.append("date_fin", formData.date_fin);
    if (formData.fichier) formDataToSend.append("fichier", formData.fichier);

    onSave(formDataToSend);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* BACKDROP */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md" />

      {/* MODAL */}
      <div className="relative w-full max-w-2xl mx-4">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700 p-6 animate-in fade-in zoom-in duration-200">

          <Dialog.Title className="text-2xl font-bold text-center mb-6 text-indigo-600 dark:text-indigo-400">
            {coursData ? "✏️ Modifier le Cours" : "➕ Ajouter un Cours"}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              name="titre"
              placeholder="Titre du cours"
              className="p-3 border rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-400 col-span-2"
              value={formData.titre}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Description"
              className="p-3 border rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-400 col-span-2"
              value={formData.description}
              onChange={handleChange}
            />

            <select
              name="mention"
              className="p-3 border rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-400"
              value={formData.mention}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner Mention</option>
              {mentions.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nom}
                </option>
              ))}
            </select>

            <select
              name="niveau"
              className="p-3 border rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-400"
              value={formData.niveau}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner Niveau</option>
              {niveaux.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.nom}
                </option>
              ))}
            </select>

            <input
              type="datetime-local"
              name="date_debut"
              className="p-3 border rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-400"
              value={formData.date_debut}
              onChange={handleChange}
              required
            />

            <input
              type="datetime-local"
              name="date_fin"
              className="p-3 border rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-400"
              value={formData.date_fin}
              onChange={handleChange}
              required
            />

            <input
              type="file"
              name="fichier"
              accept="application/pdf"
              className="p-3 border rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-400 col-span-2"
              onChange={(e) =>
                setFormData({ ...formData, fichier: e.target.files[0] })
              }
            />

            {/* ACTIONS */}
            <div className="flex justify-end col-span-2 gap-2 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-slate-700 dark:text-white hover:bg-gray-300 transition"
              >
                Annuler
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition"
              >
                {coursData ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}