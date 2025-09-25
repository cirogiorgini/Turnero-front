import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/Navbar"; 
import Encuentranos from "@/components/FindUs"; 
import Turnos from "@/components/TurnForm"; 
import DatePickerDemo from "@/components/DatePickerDemo";
import Stepper from "@/components/stepper/stepper";
import CursosContainer from "./components/cursos/CursosContainer";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserProfilePage from "@/pages/UserProfilePage";
import AdminBranches from "@/pages/dashboard/AdminBranches";
import BarbersList from "@/pages/dashboard/BarberList";
import CreateBranch from "@/components/admin/CreateBranch";
import BarbersPage from "@/components/admin/BarbersPage";
import BarberSchedule from "@/components/admin/BarberSchedule";
import BarberOwnSchedule from "@/components/barber/BarberOwnSchedule";
import ServicesManager from "@/components/admin/ServicesManager";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster/>
      <Routes>
        <Route path="/stepper" element={< Stepper />}/>
        <Route path="/encuentranos" element={< Encuentranos />} />
        <Route path="/turnos" element={< Turnos />} />
        <Route path="/calendario" element={< DatePickerDemo />}/>
        <Route path="/cursos" element={< CursosContainer />}/>
        <Route path="/Login" element={< LoginPage />}/>
        <Route path="/register" element={< RegisterPage />}/>
        <Route path="/profile" element={< UserProfilePage />}/>
        <Route path="/dashboard/sucursales" element={< AdminBranches />}/>
        <Route path="/dashboard/sucursal/crear" element={< CreateBranch />}/>
        <Route path="/dashboard/usuarios" element={< BarbersList />}/>
        <Route path="/dashboard/sucursal/:branchId/barbers" element={<BarbersPage />} />
        <Route path="/dashboard/agenda" element={<BarberSchedule />} />
        <Route path="/dashboard/mi-agenda" element={<BarberOwnSchedule />} />
        <Route path="/dashboard/servicios" element={<ServicesManager />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
