import React, { useState } from 'react';

 export default function SignupForm({onSwitch}) {
 const [formData,setFormData] = useState({
  username:"",
  email:"",
  password:"",
  role:"etudiant",
 });
const [message,setMessage] = useState(null);
const handleChange =(e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};
const handleSubmit = async (e) => {
    e.preventDefault();
    
    // appel url
    console.log("donnes",formData);
    try{
      const response = await fetch("http://127.0.0.1:8000/api/creercompte/", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if(response.ok){
        setMessage({type:"succes",text:"Compte crée avec succès 🎉"});
        setFormData({username:"",email:"",password:"",role:"etudiant"});
      }
      else{
        setMessage({type:"error",text: data.error || "Erreur d'inscription"});
      }
    }catch (error){
    setMessage({type:"error",text: "impossible de se connecter au serveur"});
    }
  };

  return (
     <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div className='bg-gray-100 p-4 rounded-2xl h-120'>
    <form onSubmit={handleSubmit} className="p-4 animate-fadeIn">
      <h2 className="text-2xl font-bold mb text-center">S’inscrire</h2>
      <input 
        type="text" 
        name='username'
        placeholder="Nom d'utilisateur"
        value={formData.username}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded-xl"
        required
      />
  
      <input 
        type="email" 
        name='email'
        placeholder="Email"     
        value={formData.email}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded-xl"
        required
      />
      <input 
        type="password" 
        name='password'
        placeholder="Mot de passe"
        value={formData.password}
        onChange={handleChange}
        className="w-full mb-6 p-2 border rounded-xl"
        required
      />
        <select 
        name='role'
        value={formData.role}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded-xl focus:ring-2 focus:ring-blue-400"
        required
      >
        <option value="etudiant">Etudiant</option>
        <option value="prof">Professeur</option>
        </select>

      {message &&( <p
        className={`mb-4 text-center font-semibold ${
          message.type === "succes" ? "text-green-600":"text-red-600"
        }`}
        > 
        {message.text}
        </p>
      )} 
      <button 
        type="submit"
        className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition"
      >
        S’inscrire
      </button>
      <p className="mt-4 text-center text-gray-500">
        Déjà un compte ?{' '}
        <button 
          type="button"
        onClick={onSwitch}
          className="text-blue-600 underline"
        >
          Se connecter
        </button>
      </p>
    </form>
    </div>
    {/* 🔹 Partie droite (infos IFT) */}
<div className="bg-gray-900 p-4 max-h-[500px] sm:max-h-[450px] md:max-h-[500px] overflow-y-auto rounded-2xl">
  <h1 className="text-white text-3xl text-center font-bold mb-6 animate-pulse">
    Assistant IFT
  </h1>

  <p className="text-white text-xl mb-4 font-semibold text-center">Mentions :</p>

  {/* Ligne 1 : BTP et Gestion */}
  <div className="grid grid-cols-2 gap-2 mb-2">
    {[
      { title: 'BTP', desc: 'Techniques de construction et travaux publics.' },
      { title: 'Gestion', desc: 'Gestion d’entreprise, finance et management.' }
    ].map((mention) => (
      <div key={mention.title} className="border border-white rounded-lg p-2 bg-gray-800 hover:bg-gray-700 transition">
        <h2 className="font-bold text-white text-sm">{mention.title}</h2>
        <p className="text-gray-300 text-xs">{mention.desc}</p>
      </div>
    ))}
  </div>

  {/* Ligne 2 : CJI et Droit */}
  <div className="grid grid-cols-2 gap-2 mb-2">
    {[
      { title: 'ICJ', desc: 'Information Communication et Journalisme' },
      { title: 'Droit', desc: 'Bases du droit et réglementations.' }
    ].map((mention) => (
      <div key={mention.title} className="border border-white rounded-lg p-2 bg-gray-800 hover:bg-gray-700 transition">
        <h2 className="font-bold text-white text-sm">{mention.title}</h2>
        <p className="text-gray-300 text-xs">{mention.desc}</p>
      </div>
    ))}
  </div>

  {/* Ligne 3 : Informatique seule */}
  <div className="border border-white rounded-lg p-2 bg-gray-800 hover:bg-gray-700 transition">
    <h2 className="font-bold text-white text-sm">Informatique</h2>
    <p className="text-gray-300 text-xs">Développement, réseaux et technologies numériques.</p>
  </div>
</div>

    </div>
  );
}


