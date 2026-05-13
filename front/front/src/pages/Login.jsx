import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';


function AuthPage({ setIsAuth }) {
  const [activeForm, setActiveForm] = useState('login'); // 'login' par défaut

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
       <div className="bg-white rounded-2xl h-100  shadow-lg w-full  relative overflow-hidden max-w-sm
    sm:max-w-220
    p-6 sm:p-8">

        {/* Formulaire de connexion */}
        <div className={`absolute top-0 left-0 w-full transition-all duration-500 
                        ${activeForm === 'login' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none'}`}>
          <LoginForm onSwitch={() => setActiveForm('signup')} setIsAuth={setIsAuth} />
        </div>

        {/* Formulaire d’inscription */}
        <div className={`absolute top-0 left-0 w-full transition-all duration-500 
                        ${activeForm === 'signup' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}>
          <SignupForm onSwitch={() => setActiveForm('login')} />
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
