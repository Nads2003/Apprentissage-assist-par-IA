// Profile.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import avatarDefault from "../assets/profile.png";
import { Edit, Mail, Phone, User, Settings } from "lucide-react";
import axios from "axios";
import Sidebars from "../components/Sidebar";

export default function Profile({ setIsAuth }) {
  useEffect(() => {
  fetchNotifications();
}, []);

  const [user, setUser] = useState({
    username: localStorage.getItem("username") || "Invité",
    email: localStorage.getItem("email") || "user@example.com",
    role: localStorage.getItem("role") || "Personne",
    phone: localStorage.getItem("phone") || "+261 34 00 000 00",
    photo: localStorage.getItem("photo") || null,
  });
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter(n => !n.lu).length;
  const [isOpen, setIsOpen] = useState(false);
  const [newUsername, setNewUsername] = useState(user.username);
  const [newPhoto, setNewPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
//notification
const fetchNotifications = async () => {
  try {
    const res = await axios.get("http://127.0.0.1:8000/api/notifications/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setNotifications(res.data);
  } catch (err) {
    console.error("Erreur fetch notifications :", err);
  }
};

  // 👉 Preview image avant upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setNewPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

 const handleUpdate = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("username", newUsername);
  if (newPhoto) formData.append("photo", newPhoto);

  try {
    const res = await axios.put(
      "http://127.0.0.1:8000/api/compte/update/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // Mise à jour du state
    setUser({
      ...user,
      username: res.data.username,
      photo: res.data.photo ? res.data.photo : user.photo,
    });

    // Mise à jour du localStorage
    localStorage.setItem("username", res.data.username);
    if (res.data.photo) localStorage.setItem("photo", res.data.photo);

    setIsOpen(false); // fermer modal
    setPreview(null);
  } catch (error) {
    // 🔥 Affiche la vraie erreur renvoyée par Django
    if (error.response) {
      console.log("Erreur update :", error.response.data);
    } else {
      console.log("Erreur update (pas de réponse serveur) :", error);
    }
  }
};


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-6 pt-24">
      
      <div className="max-w-4xl mx-auto">
        {/* Card principale */}
        <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Image profil */}
            <div className="md:w-1/3 bg-gradient-to-b from-cyan-400 to-blue-500 flex items-center justify-center p-6">
              <div className="relative">
                <img
                  src={`http://127.0.0.1:8000${user.photo}`|| avatarDefault}
                  alt="avatar"
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white dark:border-slate-700"
                />
                <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
              </div>
            </div>

            {/* Infos utilisateur */}
            <div className="md:w-2/3 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {user.username}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {user.role === "professeur" ? "Professeur" : "Étudiant"}
                    </p>
                  </div>

                  {/* Bouton Modifier */}
                  <button
                    onClick={() => setIsOpen(true)}
                    className="text-cyan-500 hover:text-cyan-600 flex items-center gap-1"
                  >
                    <Edit size={18} /> Modifier
                  </button>
                </div>

                {/* Infos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Mail size={18} /> <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Phone size={18} /> <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <User size={18} /> <span>Rôle : {user.role}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Settings size={18} /> <span>Paramètres</span>
                  </div>
                </div>
              </div>

              {/* Boutons */}
              <div className="mt-6 flex gap-4">
                <Link
                  to="/profile/cours"
                  className="flex-1 text-center py-2 px-4 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition"
                >
                  Mes Cours
                </Link>
                <Link
                  to="/profile/favorite"
                  className="flex-1 text-center py-2 px-4 rounded-lg border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white transition"
                >
                  Favoris
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Section activité */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-4 text-center">
            <h3 className="text-gray-500 dark:text-gray-400">Cours suivis</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">12</p>
          </div>
          <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-4 text-center">
            <h3 className="text-gray-500 dark:text-gray-400">Quiz complétés</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">8</p>
          </div>
          <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-4 text-center cursor-pointer" onClick={() => navigate("/notifications")}>
  <h3 className="text-gray-500 dark:text-gray-400">Notifications</h3>
  <p className="text-2xl font-bold text-slate-900 dark:text-white">{unreadCount}</p>
</div>

        </div>
      </div>

      {/* 🔥 MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-80 shadow-xl">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Modifier Profil
            </h2>

            <form onSubmit={handleUpdate}>
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full mt-1 mb-4 px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white"
              />

              <label className="text-sm text-gray-700 dark:text-gray-300">
                Nouvelle photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="w-full mt-1 mb-4"
              />

              {/* 🔥 Aperçu photo */}
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border"
                />
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setPreview(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-slate-700 dark:text-white"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
