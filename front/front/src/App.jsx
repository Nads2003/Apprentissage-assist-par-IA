import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebars from './components/Sidebar';
import DetailsCours from "./pages/details";
import Chat from './pages/ChatAI';
import Accueil from './pages/Home';
import Cours from './pages/Courses';
import QuizIAFree from './pages/Quiz';
import AuthPage from './pages/login';
import CoursModal from './pages/Mescours';
import LoginForm from './pages/LoginForm';
import Layout from './components/Layout';
import CoursEtudiant from './pages/coursEtudiant';
import FavorisPage from './pages/FavorisPage';
import Navbar from './pages/test';
import Profile from './pages/Profile'; 
import Notifications from './pages/notify';
import Exercice from './pages/Exercice';
import Explications from './pages/Explications';
function App() {
  // 🔥 initialisation depuis localStorage pour persistance
  const [isAuth, setIsAuth] = useState(() => !!localStorage.getItem('token'));

  return (
    <div className="App">
      <Router>
         {/* 🔔 Notifications globales */}
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
        <Routes>
          {/* Page login */}
          <Route
            path="/"
            element={!isAuth ? (
              <AuthPage setIsAuth={setIsAuth} />
            ) : (
              <Navigate to="/accueil" replace />
            )}
          />

          {/* Routes protégées */}
          <Route element={<Layout setIsAuth={setIsAuth}/>}>
            <Route
              path="/accueil"
              element={isAuth ? <Accueil setIsAuth={setIsAuth} /> : <Navigate to="/" replace />}
            />
            <Route
              path="/chat"
              element={isAuth ? <Chat setIsAuth={setIsAuth} /> : <Navigate to="/" replace />}
            />
            <Route
              path="/cours"
              element={isAuth ? <CoursEtudiant setIsAuth={setIsAuth} /> : <Navigate to="/" replace />}
            />
            <Route
              path="/mescours"
              element={isAuth ? <Cours setIsAuth={setIsAuth} /> : <Navigate to="/" replace />}
            />
            <Route
              path="/farovite"
              element={isAuth ? <FavorisPage setIsAuth={setIsAuth} /> : <Navigate to="/" replace />}
            />
            <Route
              path="/quiz"
              element={isAuth ? <QuizIAFree setIsAuth={setIsAuth} /> : <Navigate to="/" replace />}
            />

               {/* Route Profil */}
            <Route
              path="/profile"
              element={isAuth ? <Profile  setIsAuth={setIsAuth}/> : <Navigate to="/" replace />}
            />
            <Route
              path="/notifications"
              element={isAuth ? <Notifications  setIsAuth={setIsAuth}/> : <Navigate to="/" replace />}
            />
             <Route
              path="/exercice"
              element={isAuth ? <Exercice  setIsAuth={setIsAuth}/> : <Navigate to="/" replace />}
            />
             <Route
              path="/explication"
              element={isAuth ? <Explications  setIsAuth={setIsAuth}/> : <Navigate to="/" replace />}
            />
            <Route path="/cours/:id" element={<DetailsCours />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
