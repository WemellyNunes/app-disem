import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "../pages/login";
import Dashboard from "../pages/dashboard";
import Form from "../pages/form";
import Programing from "../pages/programing";
import Listing from "../pages/listing";
import Sidebar from "../components/sideBar";
import MobileMenu from "../components/sideBar/mobile";
import UserPage from "../pages/users";
import TeamPage from "../pages/team";
import InstitutePage from "../pages/institute";
import { useState } from 'react';

function AppRoutes() {
    const location = useLocation(); // Captura a rota atual
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
  
    // Verifica se a rota atual é a tela de login
    const isLoginPage = location.pathname === "/";
  
    return (
      <div className="flex">
        {/* Renderiza o Sidebar apenas se não estiver na tela de login */}
        {!isLoginPage && (
          <Sidebar
            isCollapsed={isCollapsed}
            toggleSidebar={() => setIsCollapsed(!isCollapsed)}
          />
        )}
  
        {/* Renderiza o MobileMenu apenas se não estiver na tela de login */}
        {!isLoginPage && (
          <MobileMenu isOpen={isOpen} toggleMenu={() => setIsOpen(!isOpen)} />
        )}
  
        {/* Área principal (conteúdo das rotas) */}
        <div
          className={`transition-all duration-300 ease-in w-full flex-grow px-1 ${
            !isLoginPage
              ? isCollapsed
                ? "ml-0 md:ml-14" // Sidebar colapsada
                : "ml-0 md:ml-60" // Sidebar expandida
              : "" // Tela de login não possui deslocamento
          }`}
        >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/form" element={<Form />} />
            <Route path="/form/:id" element={<Form />} />
            <Route path="/programing/:id" element={<Programing />} />
            <Route path="/listing" element={<Listing />} />
            <Route path="/users" element={<UserPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/instituteAndUnit" element={<InstitutePage />} />
          </Routes>
        </div>
      </div>
    );
}

export default function AppWrapper() {
    return (
      <Router basename="/">
        <AppRoutes />
      </Router>
    );
}
  