import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules"; // ✅ Import correct pour v10+

export default function Exercices() {
  const [showForm, setShowForm] = useState(false);
  const [coursList, setCoursList] = useState([]);
  const [exosByCours, setExosByCours] = useState({});
  const [selectedCours, setSelectedCours] = useState("");
  const token = localStorage.getItem("token");

  // Charger les cours et leurs exercices
  useEffect(() => {
    const loadCours = async () => {
      const res = await fetch("http://127.0.0.1:8000/api/cours/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCoursList(data);
      if (data.length > 0) setSelectedCours(data[0].id);
      data.forEach((c) => loadExercices(c.id));
    };

    const loadExercices = async (coursId) => {
      const res = await fetch(
        `http://127.0.0.1:8000/api/exercices/?cours_id=${coursId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setExosByCours((prev) => ({ ...prev, [coursId]: data }));
    };

    loadCours();
  }, []);

  // Ajouter un exercice
  const handleAddExercice = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("cours", selectedCours);

    const res = await fetch("http://127.0.0.1:8000/api/exercices/", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      toast.error("❌ Impossible d'ajouter l'exercice");
      return;
    }

    const newEx = await res.json();
    setExosByCours((prev) => ({
      ...prev,
      [selectedCours]: [newEx, ...(prev[selectedCours] || [])],
    }));

    toast.success("✅ Exercice ajouté !");
    setShowForm(false);
    e.target.reset();
  };

  return (
    <div className="p-8 pt-[80px] max-w-6xl mx-auto">
      {/* Bouton Ajouter */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition mb-4"
      >
        ➕ Ajouter un exercice
      </button>

      {/* Formulaire */}
      {showForm && (
        <form
          onSubmit={handleAddExercice}
          className="p-6 bg-white border border-gray-300 rounded-xl shadow mb-10"
        >
          <select
            value={selectedCours}
            onChange={(e) => setSelectedCours(e.target.value)}
            className="w-full p-2 border rounded-lg mb-3"
          >
            {coursList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.titre}
              </option>
            ))}
          </select>

          <input
            name="titre"
            placeholder="Titre"
            required
            className="w-full p-2 border rounded-lg mb-3"
          />
          <textarea
            name="consigne"
            placeholder="Consigne"
            required
            className="w-full p-2 border rounded-lg mb-3"
          />
          <input type="file" name="fichier" className="mb-3" />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      )}

      {/* Cards avec carousel */}
      <h2 className="text-2xl font-bold mb-4">📘 Exercices par cours</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coursList.map((cours) => (
          <div key={cours.id} className="bg-white border shadow rounded-xl p-4">
            <h3 className="text-xl font-semibold text-blue-600 mb-3">
              {cours.titre}
            </h3>

            {exosByCours[cours.id]?.length > 0 ? (
              <Swiper
                modules={[Navigation]} // ✅ Navigation ici
                navigation
                spaceBetween={10}
                slidesPerView={1}
              >
                {exosByCours[cours.id].map((exo) => (
                  <SwiperSlide key={exo.id}>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-bold text-lg">{exo.titre}</h4>
                      <p className="text-gray-700 mt-1">{exo.consigne}</p>
                      {exo.fichier && (
                        <a
                          href={`http://127.0.0.1:8000${exo.fichier}`}
                          className="text-blue-500 underline block mt-2"
                          target="_blank"
                        >
                          📄 Télécharger fichier
                        </a>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(exo.date_pub).toLocaleDateString()}
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p className="text-gray-500 text-center py-4">Aucun exercice</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
