import { useState } from "react";
import DatePickerDemo from "../DatePickerDemo";
import TurnSummary from "../TurnSummary";
import SucursalSelector from "../SucursalSelector";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProgressBar from "@ramonak/react-progress-bar";

const Stepper = () => {
  // Pasos del stepper sin el TurnForm
  const steps = ["Sucursal", "Horario", "Resumen"];
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Renderizar el contenido del paso actual
  const renderCurrentStepContent = () => {
    switch (currentStep) {
      case 1:
        return <SucursalSelector />;
      case 2:
        return <DatePickerDemo />;
      case 3:
        return <TurnSummary />;
      default:
        return null;
    }
  };

  // Calcular el progreso en porcentaje
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center my-4 bg-white text-zinc-900 px-4 sm:px-6">
      {/* Barra de progreso */}
      <div className="w-full max-w-lg mt-4">
        <ProgressBar
          completed={progress}
          bgColor="#111"
          height="10px"
          borderRadius="50px"
          transitionDuration="0.3s"
          animateOnRender
          isLabelVisible={false} // Oculta el porcentaje
        />
        <div className="flex justify-between mt-2 text-sm text-zinc-600">
          {steps.map((step, i) => (
            <span
              key={i}
              className={`${
                currentStep === i + 1 ? "font-bold text-zinc-900" : ""
              }`}
            >
              {step}
            </span>
          ))}
        </div>
      </div>

      {/* Contenido del paso actual */}
      <div className="mt-8 w-full max-w-lg">{renderCurrentStepContent()}</div>

      {/* Botones de navegación */}
      <div className="flex justify-between mt-8 w-full max-w-lg px-4 md:px-0">
        {/* Botón "Volver" */}
        <button
          onClick={handlePrevious}
          className={`px-6 py-2 bg-zinc-300 text-zinc-700 font-medium rounded-md transition flex items-center gap-2 ${
            currentStep === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-zinc-400"
          }`}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="w-4 h-4" />
          Volver
        </button>

        {/* Botón "Siguiente" (no aparece en el último paso) */}
        {currentStep !== steps.length && (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-zinc-900 text-white font-medium rounded-md transition flex items-center gap-2 hover:bg-zinc-800"
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Estilos adicionales para móviles */}
      <style>
        {`
          @media (max-width: 640px) {
            .max-w-lg {
              width: 100%;
            }
            button {
              font-size: 14px;
              padding: 10px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Stepper;