import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebars from "../components/Sidebar";

export default function Notifications( {setIsAuth }) {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/notifications/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen p-6 pt-24 bg-gray-100 dark:bg-slate-900">
      
      <h1 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Notifications</h1>
      <div className="space-y-2">
        {notifications.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Aucune notification</p>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              className={`p-4 rounded-lg cursor-pointer ${!n.lu ? "bg-slate-100 dark:bg-slate-800" : "bg-white dark:bg-slate-700"}`}
              onClick={() => navigate(`/cours/${n.cours_titre}`)}
            >
              <p className="font-semibold text-slate-900 dark:text-white">{n.cours_titre} - {n.prof_nom}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{n.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
