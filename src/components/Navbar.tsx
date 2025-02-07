import  { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Iconos para el menú

const Navbar:React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-zinc-900 text-zinc-50 px-6 py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-lg font-bold flex items-center">
            <img
              src="/logo.png" // Cambia al archivo de tu logo
              alt="Logo"
              className="h-8 mr-2"
            />
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/cursos"
            className="text-zinc-50 hover:text-zinc-300 transition-colors"
          >
            Cursos
          </Link>
          <Link
            to="/stepper"
            className="text-zinc-50 hover:text-zinc-300 transition-colors"
          >
            Turnos
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-zinc-50 hover:text-zinc-300 focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Dropdown Menu for Mobile */}
      {isOpen && (
        <div className="md:hidden bg-zinc-800 rounded-md mt-2 p-4">
          <Link
            to="/stepper"
            className="block py-2 text-zinc-50 hover:text-zinc-300 transition-colors"
            onClick={toggleMenu} // Cerrar el menú al hacer clic
          >
            Turnos
          </Link>
          <Link
            to="/cursos"
            className="block py-2 text-zinc-50 hover:text-zinc-300 transition-colors"
            onClick={toggleMenu} // Cerrar el menú al hacer clic
          >
            Cursos
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
