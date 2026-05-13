import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";


export default function DetailsCours() {
  const { id } = useParams();
  const [cours, setCours] = useState(null);
  const [explications, setExplications] = useState([]);
  const [exercices, setExercices] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();


  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {
    const res = await fetch(`http://127.0.0.1:8000/api/cours/${id}/detail/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.log("Erreur lors du chargement du détail");
      return;
    }

    const data = await res.json();
    setCours(data.cours);
    setExplications(data.explications);
    setExercices(data.exercices);
  };

  if (!cours) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <div className="p-8 pt-[80px] max-w-7xl mx-auto">
      {/* ---------- LEÇON ---------- */}
      {/* ---------- LEÇON ---------- */}
<div className="mb-10 border border-blue-500 rounded-lg p-6 shadow-lg bg-white">
  <button
  onClick={() => navigate(-1)}
  className="
    flex items-center gap-2
    text-blue-600 hover:text-blue-800
    mb-4
  "
>
  <ArrowLeft size={22} />
  <span>Retour</span>
</button>

  <h1 className="text-4xl font-bold text-blue-700 mb-4">{cours.titre}</h1>
  <p className="text-gray-700 text-lg">{cours.description}</p>
</div>


      {/* ---------- GRILLE : EXPLICATIONS + EXERCICES ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ---- EXPLICATIONS ---- */}
        <div>
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
            🎧 Explications
          </h2>
          {explications.length === 0 ? (
            <p className="text-gray-500">Aucune explication trouvée.</p>
          ) : (
            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={10}
              slidesPerView={1}
            >
              {explications.map((exp) => (
                <SwiperSlide key={exp.id}>
                  <div className="bg-white border border-gray-300 p-5 rounded-xl shadow">
                    <h3 className="text-lg font-bold text-blue-600">{exp.titre}</h3>
                    <p className="text-gray-700 mt-2">{exp.description}</p>

                    {exp.video && (
                      <video
                        controls
                        className="w-full rounded-lg mt-3"
                        src={`http://127.0.0.1:8000${exp.video}`}
                      />
                    )}
                    {exp.audio && (
                      <audio
                        controls
                        className="w-full mt-3"
                        src={`http://127.0.0.1:8000${exp.audio}`}
                      />
                    )}
                    {exp.texte && (
                      <p className="bg-gray-100 p-3 rounded-lg text-gray-700 mt-3">
                        {exp.texte}
                      </p>
                    )}
                    <p className="text-gray-400 text-sm mt-2">
                      Publié le : {new Date(exp.date_creation).toLocaleString()}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* ---- EXERCICES ---- */}
        <div>
          <h2 className="text-2xl font-semibold text-green-700 mb-4">📝 Exercices</h2>
          {exercices.length === 0 ? (
            <p className="text-gray-500">Aucun exercice trouvé.</p>
          ) : (
            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={10}
              slidesPerView={1}
            >
              {exercices.map((exo) => (
                <SwiperSlide key={exo.id}>
                  <div className="bg-white border border-gray-300 p-5 rounded-xl shadow">
                    <h3 className="text-lg font-bold text-green-600">{exo.titre}</h3>
                    <p className="text-gray-700 mt-2">{exo.consigne}</p>
                    {exo.fichier && (
                      <a
                        href={`http://127.0.0.1:8000${exo.fichier}`}
                        target="_blank"
                        className="text-blue-600 underline block mt-3"
                      >
                        📄 Télécharger l'exercice
                      </a>
                    )}
                    <p className="text-gray-400 text-sm mt-2">
                      Publié le : {new Date(exo.date_pub).toLocaleString()}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
}
