import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export default function Explications() {
  const [showForm, setShowForm] = useState(false);
  const [coursList, setCoursList] = useState([]);
  const [expByCours, setExpByCours] = useState({});
  const [selectedCours, setSelectedCours] = useState("");
  const token = localStorage.getItem("token");

  // Charger cours + explications
  useEffect(() => {
    const loadCours = async () => {
      const res = await fetch("http://127.0.0.1:8000/api/cours/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setCoursList(data);

      if (data.length > 0) setSelectedCours(data[0].id);

      data.forEach((c) => loadExplications(c.id));
    };

    const loadExplications = async (coursId) => {
      const res = await fetch(
        `http://127.0.0.1:8000/api/explications/?cours_id=${coursId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setExpByCours((prev) => ({ ...prev, [coursId]: data }));
    };

    loadCours();
  }, []);

  // Ajouter explication
  const handleAddExplication = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append("cours", selectedCours);

    const res = await fetch("http://127.0.0.1:8000/api/explications/", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      toast.error("❌ Impossible d'ajouter l'explication");
      return;
    }

    const newExp = await res.json();

    setExpByCours((prev) => ({
      ...prev,
      [selectedCours]: [newExp, ...(prev[selectedCours] || [])],
    }));

    toast.success("✅ Explication ajoutée !");
    setShowForm(false);
    e.target.reset();
  };

  return (
    <div className="p-8 pt-[80px] max-w-6xl mx-auto">
      
      {/* Bouton Ajouter */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition mb-4"
      >
        ➕ Ajouter une explication
      </button>

      {/* FORM */}
      {showForm && (
        <form
          onSubmit={handleAddExplication}
          className="p-6 bg-white border border-gray-300 rounded-xl shadow mb-10"
        >
          <select
            value={selectedCours}
            onChange={(e) => setSelectedCours(e.target.value)}
            className="w-full p-2 border rounded-lg mb-3"
          >
            {coursList.map((c) => (
              <option key={c.id} value={c.id}>{c.titre}</option>
            ))}
          </select>

          <input
            name="titre"
            placeholder="Titre"
            required
            className="w-full p-2 border rounded-lg mb-3"
          />

          <textarea
            name="description"
            placeholder="Description"
            className="w-full p-2 border rounded-lg mb-3"
          />

          <textarea
            name="texte"
            placeholder="Explication texte (facultatif)"
            className="w-full p-2 border rounded-lg mb-3"
          />

          <label>Audio :</label>
          <input type="file" name="audio" accept="audio/*" className="mb-3 block" />

          <label>Vidéo :</label>
          <input type="file" name="video" accept="video/*" className="mb-3 block" />

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

      {/* AFFICHAGE */}
      <h2 className="text-2xl font-bold mb-4">🎧 Explications par cours</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coursList.map((cours) => (
          <div key={cours.id} className="bg-white border shadow rounded-xl p-4">
            <h3 className="text-xl font-semibold text-purple-700 mb-3">
              {cours.titre}
            </h3>

            {expByCours[cours.id]?.length > 0 ? (
              <Swiper modules={[Navigation]} navigation spaceBetween={10} slidesPerView={1}>
                {expByCours[cours.id].map((exp) => (
                  <SwiperSlide key={exp.id}>
                    <div className="bg-purple-50 p-4 rounded-lg">

                      <h4 className="font-bold text-lg">{exp.titre}</h4>
                      <p className="text-gray-700 mt-1">{exp.description}</p>

                      {exp.texte && (
                        <p className="text-gray-600 mt-2 italic">{exp.texte}</p>
                      )}

                      {exp.audio && (
                        <audio controls className="w-full mt-3">
                          <source src={`http://127.0.0.1:8000${exp.audio}`} />
                        </audio>
                      )}

                      {exp.video && (
                        <video controls className="w-full rounded-lg mt-3">
                          <source src={`http://127.0.0.1:8000${exp.video}`} />
                        </video>
                      )}

                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(exp.date_creation).toLocaleDateString()}
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p className="text-gray-500 text-center py-4">Aucune explication</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
