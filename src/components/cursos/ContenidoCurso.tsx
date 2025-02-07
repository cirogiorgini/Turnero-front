import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface ContenidoCursoProps {
  contenido: {
    modulos: string[];
  };
}

const ContenidoCurso: React.FC<ContenidoCursoProps> = ({ contenido }) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Módulos del Curso:</h3>
      <Accordion type="single" collapsible>
        {contenido.modulos.map((modulo, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              Módulo {index + 1}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-gray-700">{modulo}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ContenidoCurso;