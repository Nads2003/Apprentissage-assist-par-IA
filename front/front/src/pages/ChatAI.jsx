import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MoreHorizontal, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Sidebars from "../components/Sidebar";

export default function Chat({ setIsAuth }) {
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [input, setInput] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const messagesEndRef = useRef(null);

  const jwtToken = localStorage.getItem("token");

  // Charger toutes les sessions
  const loadSessions = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/ai/sessions/", {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      if (!res.ok) throw new Error("Erreur chargement sessions");
      const data = await res.json();
      setSessions(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Charger messages
  const loadMessages = async (id) => {
    try {
      setSessionId(id);
      setActiveSession(id);
      const res = await fetch(`http://127.0.0.1:8000/api/ai/messages/${id}/`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      if (!res.ok) throw new Error("Erreur chargement messages");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Envoyer message
  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { content: input, sender: "user" }]);
    setInput("");
    setLoadingResponse(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/ai/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ message: input, session_id: sessionId }),
      });

      if (!res.ok) throw new Error("Erreur envoi message");

      const data = await res.json();
      setSessionId(data.session_id);
      setMessages((prev) => [...prev, { content: data.reply, sender: "assistant" }]);
      loadSessions();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingResponse(false);
    }
  };

  // Scroll automatique
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingResponse]);

  // Charger sessions au montage
  useEffect(() => {
    loadSessions();
  }, []);

  // Nouveau chat
  const handleNewChat = () => {
    setMessages([]);
    setSessionId(null);
    setActiveSession(null);
    setSessions((prev) => [
      { session_id: Date.now(), title: "Nouveau chat", messages: 0 },
      ...prev,
    ]);
  };

  // Supprimer session
  const handleDeleteSession = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/ai/sessions/${id}/delete/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      setSessions((prev) => prev.filter((s) => s.session_id !== id));
      if (activeSession === id) {
        setMessages([]);
        setActiveSession(null);
        setSessionId(null);
      }
      setDeleteConfirm(null);
    } catch (err) {
      console.error(err);
    }
  };

return (
  <div className="flex h-screen bg-white dark:bg-slate-950 font-sans text-black dark:text-white pt-[60px]">
       
    {/* ----------------- SIDEBAR SESSIONS ----------------- */}
    <div className="w-72 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Historique</h2>

        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition"
          onClick={handleNewChat}
          title="Nouveau chat"
        >
          <Plus className="w-5 h-5 text-blue-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {sessions.map((s) => (
          <div
            key={s.session_id}
            className={`p-3 rounded-lg cursor-pointer transition-all flex justify-between items-center ${
              activeSession === s.session_id
                ? "bg-blue-100 dark:bg-slate-800"
                : "hover:bg-gray-100 dark:hover:bg-slate-800"
            }`}
            onClick={() => loadMessages(s.session_id)}
          >
            <div>
              <p className="font-medium truncate text-gray-900 dark:text-white">
                {s.title}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {s.messages} message(s)
              </p>
            </div>

            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(menuOpen === s.session_id ? null : s.session_id);
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition"
              >
                <MoreHorizontal size={18} />
              </button>

              <AnimatePresence>
                {menuOpen === s.session_id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-50"
                  >
                    <button
                      className="flex items-center gap-2 px-3 py-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 w-full"
                      onClick={() => setDeleteConfirm(s.session_id)}
                    >
                      <Trash2 size={16} /> Supprimer
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* ----------------- CHAT AREA ----------------- */}
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-white dark:bg-slate-950">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`flex ${
                m.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-5 py-3 rounded-2xl max-w-md break-words ${
                  m.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-600 dark:bg-slate-800 dark:text-white"
                }`}
              >
                {m.sender === "assistant" ? (
                  <ReactMarkdown
                    children={m.content}
                    components={{
                      p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                      li: ({ node, ...props }) => (
                        <li className="ml-5 list-disc" {...props} />
                      ),
                      code: ({ node, inline, ...props }) =>
                        inline ? (
                          <code className="bg-gray-60 dark:bg-slate-700 rounded px-1" {...props} />
                        ) : (
                          <pre className="bg-gray-60 dark:bg-slate-800 p-3 rounded overflow-x-auto" {...props} />
                        ),
                      h1: ({ node, ...props }) => (
                        <h1 className="text-2xl font-bold my-2" {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 className="text-xl font-semibold my-2" {...props} />
                      ),
                    }}
                  />
                ) : (
                  m.content
                )}
              </div>
            </motion.div>
          ))}

          {loadingResponse && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="px-5 py-3 rounded-2xl bg-gray-200 dark:bg-slate-800 text-gray-900 dark:text-white max-w-md flex items-center gap-1">
                <span className="animate-pulse text-lg">•</span>
                <span className="animate-pulse text-lg delay-150">•</span>
                <span className="animate-pulse text-lg delay-300">•</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* ----------------- INPUT ----------------- */}
      <div className="p-4 bg-white dark:bg-slate-900 flex gap-3 border-t border-gray-200 dark:border-slate-700">
        <input
          className="flex-1 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Écrivez un message..."
        />

        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
          onClick={handleSend}
        >
          Envoyer
        </button>
      </div>
    </div>

    {/* ----------------- CONFIRM DELETE ----------------- */}
    {deleteConfirm && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 w-80">
          <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
            Supprimer le chat
          </h3>

          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Voulez-vous vraiment supprimer cette session ?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-3 py-1 rounded-md border border-gray-300 dark:border-slate-700"
            >
              Annuler
            </button>

            <button
              onClick={() => handleDeleteSession(deleteConfirm)}
              className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}
