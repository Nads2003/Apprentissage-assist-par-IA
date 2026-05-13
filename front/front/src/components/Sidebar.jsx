// Sidebars.jsx
import { useEffect, useState, useRef } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import avatarDefault from "../assets/profile.png";

import axios from "axios";
import {
  Menu,
  X,
  Bell,
  LogOut,
  Moon,
  Sun,
  User,
  Settings,
} from "lucide-react";

export default function Sidebars({ setIsAuth }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
   const [unreadCount, setUnreadCount] = useState(
  notifications.filter(n => !n.lu).length
);

const [dark, setDark] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  const location = useLocation();
  const navigate = useNavigate(); // <-- navigation pour logout

 const toggleDarkMode = () => {
  setDark(prev => {
    const newDark = !prev;

    localStorage.setItem("theme", newDark ? "dark" : "light");

    const root = document.documentElement;
    if (newDark) root.classList.add("dark");
    else root.classList.remove("dark");

    return newDark;
  });
};
const p=localStorage.getItem("photo")

  const [user, setUser] = useState(() => {
   return {
    username: localStorage.getItem("username") || "Invité",
    role: localStorage.getItem("role") || "",
    id: localStorage.getItem("user_id") || null,
    photo: localStorage.getItem("photo") || avatarDefault,// si tu as une photo, tu peux l’ajouter ici
  };
});

useEffect(() => {
  const savedTheme = localStorage.getItem("theme");

  const isDark = savedTheme === "dark";

  setDark(isDark);

  const root = document.documentElement;

  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}, []);
// Ajoute ceci dans Sidebars.jsx, à la place de ton useEffect existant pour le WebSocket

const socketRef = useRef(null);

 useEffect(() => {
    if (!user || user.role !== "etudiant") return;

    const connectWebSocket = () => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) return;

      socketRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/${user.id}/`);
      const socket = socketRef.current;

      socket.onopen = () => console.log("✅ WebSocket connecté");

  socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "old_notifications") {
    setNotifications(data.data);
    setUnreadCount(data.data.filter(n => !n.lu).length);
  }

  if (data.type === "new_notification") {
    if (data.content) {
      // Nouvelle notification -> ajouter à la liste
      setNotifications(prev => [data.content, ...prev]);
    }
    // Toujours mettre à jour le compteur si fourni
    if (typeof data.unread_count === "number") {
      setUnreadCount(data.unread_count);
    }
  }

  if (data.type === "unread_count") {
    // Pour les mises à jour de compteur (ex: suppression)
    setUnreadCount(data.count);
  }
};
      socket.onclose = (e) => {
        console.log("🔌 WebSocket fermé, reconnexion dans 2s...");
        setTimeout(connectWebSocket, 2000);
      };

      socket.onerror = (err) => {
        console.error("❌ WebSocket error:", err);
        socket.close();
      };
    };

    connectWebSocket();

    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, [user.id]);


  const isActive = (path) =>
    location.pathname === path
      ? "text-yellow-400 border-b-2 border-yellow-400 pb-1"
      : "hover:text-yellow-400 transition";

    const handleLogout = () => {
    // 🔥 Correction ici
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // INFORMER REACT : utilisateur déconnecté
    setIsAuth(false);

    // fermer modal
    setShowLogoutConfirm(false);

    // rediriger vers login
    navigate("/");
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50">
        {/* Navbar principale */}
        <div
          className="max-w-7xl mx-auto flex items-center justify-between gap-4 py-3 px-4
          backdrop-blur-xl transition-colors duration-300
          bg-white dark:bg-slate-900 text-slate-900 dark:text-white
          shadow-lg border-b border-slate-200 dark:border-slate-700"
        >
          {/* Logo */}
       <div className="flex items-center gap-2">
          <div className="w-30 h-10 bg-cyan-400 text-slate-900 font-bold grid place-items-center rounded-lg">
            IAcademy
          </div>
          
        </div>

          {/* Menu */}
          <nav className="hidden sm:flex items-center gap-6 text-lg font-medium">
            <Link to="/" className={isActive("/")}>
              Accueil
            </Link>
            <Link to="/chat" className={isActive("/chat")}>
              Assistant
            </Link>
            {localStorage.getItem("role") === "etudiant" && ( 
          <Link to="/cours" className={isActive("/cours")}> Mes Cours </Link> )
            }
            {localStorage.getItem("role") === "professeur" && (
           <Link to="/mescours" className={isActive("/mescours")}> Leçon </Link>
           )}
           {localStorage.getItem("role") === "professeur" && (
           <Link to="/exercice" className={isActive("/exercice")}> Exercices </Link>
           )}
           {localStorage.getItem("role") === "professeur" && (
           <Link to="/explication" className={isActive("/explication")}> Explications </Link>
           )}
           {localStorage.getItem("role") === "etudiant" && ( 
            <Link to="/farovite" className={isActive("/farovite")}>
              Favorite
            </Link>)}
             {localStorage.getItem("role") === "etudiant" && ( 
            <Link to="/quiz" className={isActive("/quiz")}>
              QCM
            </Link>)}
          </nav>

          {/* Icônes + Dark Mode */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div
  className="relative group cursor-pointer"
  onClick={() => navigate("/notifications")}
>
  <Bell className="w-6 h-6" />
  {unreadCount > 0 && (
    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full animate-pulse">
      {unreadCount}
    </div>
  )}
  <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition">
    Notifications
  </span>
</div>


            {/* Déconnexion */}
            <div className="relative group cursor-pointer">
              <LogOut className="w-6 h-6" onClick={() => setShowLogoutConfirm(true)} />
              <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition">
                Déconnexion
              </span>
            </div>

            {/* Dark / Light toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Avatar */}
            <div className="relative">
             <button
                onClick={() => setShowAvatarMenu((s) => !s)}
                className="flex items-center gap-2 p-1 rounded-full hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.12)] transition"
                aria-haspopup="true"
                aria-expanded={showAvatarMenu}
              >
                <div className="relative">
                  <img
                     src={`http://127.0.0.1:8000${user.photo}`|| avatarDefault}
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  {/* online dot */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
                </div>
                 <div className="hidden sm:flex flex-col text-left leading-4">
      <span className="text-sm font-semibold">{user.username}</span>
      <span className="text-xs text-white/60">
        {user.role === "professeur" ? "Professeur" : "Etudiant"}
      </span>
    </div>
              </button>

              {/* Avatar dropdown */}
              {showAvatarMenu && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md rounded-lg shadow-lg py-2 z-50"
                  onMouseLeave={() => setShowAvatarMenu(false)}
                >
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-2 hover:bg-white/20 dark:hover:bg-white/5 text-slate-900 dark:text-white transition"
                    onClick={() => setShowAvatarMenu(false)}
                  >
                    <User size={16} /> Profil
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-3 py-2 hover:bg-white/20 dark:hover:bg-white/5 text-slate-900 dark:text-white transition"
                    onClick={() => setShowAvatarMenu(false)}
                  >
                    <Settings size={16} /> Paramètres
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="sm:hidden p-2"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`sm:hidden fixed left-0 right-0 top-16 bg-white/90 dark:bg-slate-900/90 dark:text-white backdrop-blur-md transition-transform duration-300 z-40 ${
            open ? "translate-y-0" : "-translate-y-2 scale-y-95 pointer-events-none opacity-0"
          }`}
        >
          <nav className="flex flex-col gap-3 px-50 py-4">
            <Link to="/" className={isActive("/")} onClick={() => setOpen(false)}>
              Accueil
            </Link>
            <Link to="/chat" className={isActive("/chat")} onClick={() => setOpen(false)}>
              Assistant
            </Link>
              {localStorage.getItem("role") === "etudiant" && (
            <Link to="/cours" className={isActive("/cours")} onClick={() => setOpen(false)}>
              Mes Cours
            </Link>)}
              {localStorage.getItem("role") === "professeur" && (
            <Link to="/mescours" className={isActive("/mescours")} onClick={() => setOpen(false)}>
              Leçons
            </Link>)}
            {localStorage.getItem("role") === "professeur" && (
            <Link to="/exercice" className={isActive("/exercice")} onClick={() => setOpen(false)}>
              Exercices
            </Link>)}
              {localStorage.getItem("role") === "professeur" && (
            <Link to="/axplication" className={isActive("/axplication")} onClick={() => setOpen(false)}>
              Explication
            </Link>)}
             {localStorage.getItem("role") === "etudiant" && ( 
            <Link to="/farovite" className={isActive("/farovite")} onClick={() => setOpen(false)}>
              Favorite
            </Link>)}
             {localStorage.getItem("role") === "etudiant" && ( 
            <Link to="/quiz" className={isActive("/quiz")} onClick={() => setOpen(false)}>
              QCM
            </Link>)}
          </nav>
        </div>
      </header>

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
              Confirmer la déconnexion
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
              Voulez-vous vraiment vous déconnecter ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700"
              >
                Annuler
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
