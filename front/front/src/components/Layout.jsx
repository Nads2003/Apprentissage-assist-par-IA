import React from "react";
import Sidebars from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout({ setIsAuth }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar fixe à gauche */}
      <Sidebars setIsAuth={setIsAuth}/>

      {/* Contenu principal */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
