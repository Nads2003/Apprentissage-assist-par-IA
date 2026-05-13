import React, { useState } from 'react';
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginForm({ onSwitch, setIsAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // 🔹 Loading
  const navigate = useNavigate();

  const handlelogin = async (e) => {
    e.preventDefault();
    setLoading(true); // démarre le loading

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login/", { email, password });
      const access=res.data.access;
      const payload=JSON.parse(atob(access.split('.')[1]));
         console.log("Payload décodé :", payload);
      localStorage.setItem("token", access);
      localStorage.setItem("user_id", payload.user_id);
      localStorage.setItem("role",payload.role);
      localStorage.setItem("email", payload.email);
      localStorage.setItem("username", payload.username);
      localStorage.setItem("photo", payload.photo); // stocke la photo
      setIsAuth(true);
      navigate("/accueil");
    } catch {
      alert("Erreur d'identifiants !");
    } finally {
      setLoading(false); // stop le loading
    }
  };

  return (
   <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div className="bg-gray-100 p-4 rounded-2xl h-100">
        <form onSubmit={handlelogin} className="p-4 animate-fadeIn">
          <h2 className="text-2xl font-bold mb-7 text-center">Se connecter</h2>

          <input 
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full mb-6 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <div className="relative mb-6">
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-2 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-800"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button 
            type="submit"
            disabled={loading} // 🔹 désactive pendant le loading
            className={`w-full py-2 rounded-xl font-semibold transition
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            {loading ? "Connexion..." : "Connexion"} {/* 🔹 texte loading */}
          </button>

          <p className="mt-4 text-center text-gray-500">
            Pas encore de compte ?{' '}
            <button 
              type="button"
              onClick={onSwitch}
              className="text-blue-600 underline"
            >
              S’inscrire
            </button>
          </p>
        </form>
      </div>

      {/* Partie droite inchangée */}
      <div className="bg-gray-900 p-4 max-h-[500px] sm:max-h-[450px] md:max-h-[500px] overflow-y-auto rounded-2xl">
        <h1 className="text-white text-3xl text-center font-bold mb-6 animate-pulse">
          Assistant IFT
        </h1>

        <p className="text-white text-xl mb-4 font-semibold text-center">Mentions :</p>

        <div className="grid grid-cols-2 gap-2 mb-2">
          {[{ title: 'BTP', desc: 'Techniques de construction et travaux publics.' },
            { title: 'Gestion', desc: 'Gestion d’entreprise, finance et management.' }].map(mention => (
            <div key={mention.title} className="border border-white rounded-lg p-2 bg-gray-800 hover:bg-gray-700 transition">
              <h2 className="font-bold text-white text-sm">{mention.title}</h2>
              <p className="text-gray-300 text-xs">{mention.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2">
          {[{ title: 'ICJ', desc: 'Information Communication et Journalisme.' },
            { title: 'Droit', desc: 'Bases du droit et réglementations.' }].map(mention => (
            <div key={mention.title} className="border border-white rounded-lg p-2 bg-gray-800 hover:bg-gray-700 transition">
              <h2 className="font-bold text-white text-sm">{mention.title}</h2>
              <p className="text-gray-300 text-xs">{mention.desc}</p>
            </div>
          ))}
        </div>

        <div className="border border-white rounded-lg p-2 bg-gray-800 hover:bg-gray-700 transition">
          <h2 className="font-bold text-white text-sm">Informatique</h2>
          <p className="text-gray-300 text-xs">Développement, réseaux et technologies numériques.</p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
