import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Book,
  Scissors,
  User,
  LayoutDashboard,
  ChevronDown,
  Store,
} from "lucide-react"; // Iconos
import { useTurnContext } from "@/context/TurnContext";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { user } = useTurnContext();
  const [isDashboardOpen, setIsDashboardOpen] = useState(false); // Estado para submenú Dashboard

  useEffect(() => {
    if (user?.rol) {
      setUserRole(user.rol);
    }
    console.log("User role in Navbar:", user?.rol);
  }, [user]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDashboard = () => {
    setIsDashboardOpen(!isDashboardOpen);
  };

  const renderDashboardLinks = (isMobile: boolean = false) => {
    const baseClasses = isMobile 
      ? "flex items-center py-2 text-black hover:text-gray-600 transition-colors" 
      : "block px-4 py-2 text-zinc-50 hover:text-zinc-300 transition-colors";

    if (userRole === "admin") {
      return (
        <>
          <Link to="/dashboard/usuarios" className={baseClasses}>
            {isMobile && <User className="w-5 h-5 mr-2" />} Gestión de Usuarios
          </Link>
          <Link to="/dashboard/sucursales" className={baseClasses}>
            {isMobile && <LayoutDashboard className="w-5 h-5 mr-2" />} Gestión sucursales
          </Link>
          <Link to="/dashboard/agenda" className={baseClasses}>
            {isMobile && <Scissors className="w-5 h-5 mr-2" />} Agenda de Turnos
          </Link>
          <Link to="/dashboard/servicios" className={baseClasses}>
            {isMobile && <Store className="w-5 h-5 mr-2" />} Gestión de Servicios
          </Link>
          <Link to="/dashboard/reportes" className={baseClasses}>
            {isMobile && <Book className="w-5 h-5 mr-2" />} Reportes
          </Link>
        </>
      );
    } else if (userRole === "barbero") {
      return (
        <Link to="/dashboard/mi-agenda" className={baseClasses}>
          {isMobile && <Scissors className="w-5 h-5 mr-2" />} Mi Agenda
        </Link>
      );
    }
    return null;
  };

  return (
    <>
      {/* Navbar principal */}
      <nav className="bg-zinc-900 text-zinc-50 px-6 py-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-lg font-bold flex items-center">
              <img src="/logo.png" alt="Logo" className="h-8 mr-2" />
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/cursos" className="flex items-center text-zinc-50 hover:text-zinc-300 transition-colors">
              <Book className="w-5 h-5 mr-1" /> Cursos
            </Link>
            <Link to="/stepper" className="flex items-center text-zinc-50 hover:text-zinc-300 transition-colors">
              <Scissors className="w-5 h-5 mr-1" /> Turnos
            </Link>
            <Link to="/profile" className="flex items-center text-zinc-50 hover:text-zinc-300 transition-colors">
              <User className="w-5 h-5 mr-1" /> Perfil
            </Link>

            {/* Dashboard con sublinks */}
            {(userRole === "admin" || userRole === "barbero") && (
              <div className="relative">
                <button
                  onClick={toggleDashboard}
                  className="flex items-center text-zinc-50 hover:text-zinc-300 transition-colors focus:outline-none"
                >
                  <LayoutDashboard className="w-5 h-5 mr-1" /> Dashboard
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {isDashboardOpen && (
                  <div className="absolute left-0 mt-2 w-40 bg-zinc-800 shadow-lg rounded-md">
                    {renderDashboardLinks(false)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden text-zinc-50 hover:text-zinc-300 focus:outline-none">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Overlay para móviles */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={toggleMenu}></div>}

      {/* Barra lateral para móviles */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white text-black shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          {/* Logo en la barra lateral */}
          <div className="flex items-center mb-6">
            <Link to="/" className="text-lg font-bold flex items-center">
              <img src="/logo.png" alt="Logo" className="h-8 mr-2" />
            </Link>
          </div>

          {/* Enlaces de la barra lateral */}
          <Link to="/cursos" className="flex items-center py-2 text-black hover:text-gray-600 transition-colors" onClick={toggleMenu}>
            <Book className="w-5 h-5 mr-2" /> Cursos
          </Link>
          <Link to="/stepper" className="flex items-center py-2 text-black hover:text-gray-600 transition-colors" onClick={toggleMenu}>
            <Scissors className="w-5 h-5 mr-2" /> Turnos
          </Link>
          <Link to="/profile" className="flex items-center py-2 text-black hover:text-gray-600 transition-colors" onClick={toggleMenu}>
            <User className="w-5 h-5 mr-2" /> Perfil
          </Link>

          {/* Dashboard con sublinks en móviles */}
          {(userRole === "admin" || userRole === "barbero") && (
            <div>
              <button
                onClick={toggleDashboard}
                className="flex items-center w-full py-2 text-black hover:text-gray-600 transition-colors"
              >
                <LayoutDashboard className="w-5 h-5 mr-2" /> Dashboard
                <ChevronDown className="w-4 h-4 ml-auto" />
              </button>
              {isDashboardOpen && (
                <div className="ml-6 border-l border-gray-300">
                  {renderDashboardLinks(true)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
