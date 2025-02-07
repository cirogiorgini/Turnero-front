import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/Navbar"; 
import Encuentranos from "@/components/FindUs"; 
import Turnos from "@/components/TurnForm"; 
import DatePickerDemo from "@/components/DatePickerDemo";
import Stepper from "@/components/stepper/stepper";
import CursosContainer from "./components/cursos/CursosContainer";

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

      </Routes>
    </BrowserRouter>
  );
}

export default App;
