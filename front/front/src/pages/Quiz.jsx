import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { BookOpen, Brain, Loader2, CheckCircle } from "lucide-react";
import Sidebars from "../components/Sidebar";

export default function QuizIAFree({ setIsAuth }) {
  const [cours, setCours] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCours, setSelectedCours] = useState(null);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [inputValue, setInputValue] = useState(""); // pour les textes à trous
  const token = localStorage.getItem("token");

  // Récupération des cours
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/cours/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCours(res.data))
      .catch((err) => console.error("Erreur récupération cours:", err));
  }, [token]);

  // Génération du quiz
  const generateQuiz = async (coursId) => {
    try {
      setLoading(true);
      setSelectedCours(coursId);

      const res = await axios.post(
        "http://127.0.0.1:8000/api/generate-quiz-ia-free/",
        { cours_id: coursId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.error) {
        console.error("Erreur backend :", res.data.error);
        setSelectedCours(null);
        return;
      }

      const quizData = res.data.quiz || {};
      const allQuestions = [
        ...(quizData.qcm || []),
        ...((quizData.vrai_faux || []).map(q => ({
          question: q.statement,
          options: ["Vrai", "Faux"],
          answer: q.answer ? "Vrai" : "Faux"
        }))),
        ...((quizData.textes_trous || []).map(q => ({
          question: q.phrase,
          options: ["..."],
          answer: q.answer
        })))
      ];

      if (allQuestions.length === 0) {
        console.error("Le quiz est vide. L'IA n'a pas renvoyé de questions valides.");
        setSelectedCours(null);
        return;
      }

      setQuiz(allQuestions);
      setCurrent(0);
      setScore(0);
      setFinished(false);

    } catch (err) {
      console.error(
        "Erreur génération quiz :",
        err.response?.data?.error || err.message
      );
      setSelectedCours(null);
    } finally {
      setLoading(false);
    }
  };

  // Gestion des réponses
  const handleAnswer = (input) => {
    const currentQuestion = quiz[current];
    if (!currentQuestion) return;

    let correct = false;

    if (currentQuestion.options?.length === 1 && currentQuestion.options[0] === "...") {
      // Texte à trous
      correct = input.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
      currentQuestion.userAnswer = input;
    } else {
      // QCM ou vrai/faux
      correct = input === currentQuestion.answer;
      currentQuestion.userAnswer = input;
    }

    if (correct) setScore((s) => s + 1);

    if (current + 1 < quiz.length) setCurrent((i) => i + 1);
    else setFinished(true);

    setInputValue("");
    setQuiz([...quiz]); // mettre à jour le state
  };

  const resetQuiz = () => {
    setQuiz([]);
    setSelectedCours(null);
    setCurrent(0);
    setScore(0);
    setFinished(false);
    setInputValue("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 p-8 flex flex-col items-center pt-[80px]">
         
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-10 flex items-center gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Brain className="w-10 h-10 text-indigo-600" />
        Quiz IA Intelligente
      </motion.h1>

      {/* Liste des cours */}
      {!selectedCours && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {cours.map((c) => (
            <motion.div
              key={c.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all flex flex-col justify-between"
              whileHover={{ scale: 1.02 }}
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <BookOpen className="text-indigo-500" />
                  {c.titre}
                </h2>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {c.description || "Aucune description."}
                </p>
              </div>
              <button
                onClick={() => generateQuiz(c.id)}
                className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-500 transition-all font-semibold"
              >
                Générer le Quiz
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Loading */}
      {loading && (
        <motion.div
          className="mt-10 flex flex-col items-center text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="animate-spin text-indigo-500 w-10 h-10 mb-2" />
          <p>L’IA prépare le quiz basé sur le titre...</p>
        </motion.div>
      )}

      {/* Quiz en cours */}
      {quiz.length > 0 && !finished && (
        <motion.div
          key={current}
          className="bg-white shadow-2xl rounded-3xl p-10 mt-6 max-w-3xl w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{quiz[current].question}</h2>

          {quiz[current].options?.length > 0 && quiz[current].options[0] !== "..." ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quiz[current].options.map((opt, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className="py-3 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 font-semibold shadow-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                >
                  {opt}
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Complétez la réponse..."
                className="border rounded-lg py-2 px-3 text-center"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                onClick={() => handleAnswer(inputValue)}
                className="mt-2 py-3 px-6 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 font-semibold"
              >
                Valider
              </button>
            </div>
          )}

          <p className="mt-6 text-gray-600">
            Question {current + 1} / {quiz.length}
          </p>
        </motion.div>
      )}

      {/* Quiz terminé avec corrections */}
      {finished && (
        <motion.div
          className="mt-10 bg-white p-10 rounded-3xl shadow-2xl max-w-3xl w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Quiz terminé !</h2>
          <p className="text-xl text-gray-600 mb-6 text-center">
            Votre score : <span className="font-semibold text-indigo-600">{score} / {quiz.length}</span>
          </p>

          <div className="text-left">
            <h3 className="text-2xl font-semibold mb-4">Corrections :</h3>
            {quiz.map((q, i) => {
              const userAnswer = q.userAnswer || "";
              const isCorrect = userAnswer.trim().toLowerCase() === q.answer.trim().toLowerCase();

              return (
                <div key={i} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                  <p className="font-semibold">{i + 1}. {q.question}</p>

                  {q.options && q.options[0] !== "..." ? (
                    <ul className="list-disc list-inside mt-1">
                      {q.options.map((opt, idx) => (
                        <li key={idx} className={`${opt === q.answer ? "text-green-600 font-bold" : ""}`}>
                          {opt} {opt === userAnswer ? (isCorrect ? "✅" : "❌") : ""}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1">
                      Votre réponse : <span className={`${isCorrect ? "text-green-600" : "text-red-600"} font-bold`}>{userAnswer}</span>
                      {" "} | Correct : <span className="text-green-600 font-bold">{q.answer}</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-6">
            <button
              onClick={resetQuiz}
              className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-500 font-semibold"
            >
              Retour aux cours
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
