import { useState } from "react";
import { TiTick } from "react-icons/ti";
import "./stepper.css"; // Incluye aquí el CSS proporcionado
import DatePickerDemo from "../DatePickerDemo";
import TurnForm from "../TurnForm";
import TurnSummary from "../TurnSummary";
import SucursalSelector from "../SucursalSelector";
import { ChevronLeft, ChevronRight } from "lucide-react"

const Stepper = () => {
  const steps = ["Sucursal", "Horario", "Datos", "Resumen"];
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

  const renderCurrentStepContent = () => {
    switch (currentStep) {
      case 1:
        return <SucursalSelector />;
      case 2:
        return <DatePickerDemo />;
      case 3:
        return <TurnForm />;
      case 4:
        return <TurnSummary />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center my-4 bg-white text-zinc-900">
      {/* Stepper Container */}
      <div className="flex items-center mt-4 justify-between w-full max-w-md md:max-w-xl">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`step-item ${currentStep === i + 1 ? "active" : ""
              } ${(i + 1 < currentStep || complete) && "complete"}`}
          >
            {/* Step Circle */}
            <div
              className={`step ${currentStep === i + 1
                ? "border-zinc-900 bg-zinc-900 text-white"
                : (i + 1 < currentStep || complete) && "border-green-600 bg-green-600"
                }`}
            >
              {i + 1 < currentStep || complete ? (
                <TiTick size={20} />
              ) : (
                <span className="text-lg">{i + 1}</span>
              )}
            </div>
            {/* Step Label */}
            <p
              className={`${currentStep === i + 1
                ? "text-zinc-900"
                : (i + 1 < currentStep || complete) && "text-green-600"
                }`}
            >
              {step}
            </p>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="mt-8 w-full max-w-lg">{renderCurrentStepContent()}</div>

      {/* Botones de navegación */}
      <div className="flex justify-between mt-8 w-full max-w-lg px-4 md:px-0">
        {/* Botón "Volver" */}
        <button
          onClick={handlePrevious}
          className={`px-6 py-2 bg-zinc-300 text-zinc-700 font-medium rounded-md transition flex items-center gap-2 ${currentStep === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-zinc-400"
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
            className="px-6 py-2 bg-zinc-900 text-white font-medium rounded-md transition flex items-center gap-2"
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Stepper;