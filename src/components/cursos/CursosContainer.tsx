import React from "react";
import Curso from "./Curso";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

// Datos de ejemplo para los cursos
const cursos = [
  {
    id: 1,
    titulo: "Corte de Cabello Básico",
    descripcion: "Aprende las técnicas básicas para cortar cabello.",
    imagen: "/images/corte-basico.jpg",
    contenido: {
      modulos: [
        "Introducción al corte de cabello",
        "Uso de herramientas",
        "Técnicas básicas",
      ],
    },
  },
  {
    id: 2,
    titulo: "Coloración Profesional",
    descripcion: "Domina las técnicas de coloración para cabello.",
    imagen: "/images/coloracion.jpg",
    contenido: {
      modulos: [
        "Teoría del color",
        "Técnicas de aplicación",
        "Cuidados post-coloración",
      ],
    },
  },
  // Agrega más cursos aquí
];

const CursosContainer: React.FC = () => {
  return (
    <div className="p-6">
      <Card className="mb-6 border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Cursos de Peluquería
          </CardTitle>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cursos.map((curso) => (
          <Curso key={curso.id} curso={curso} />
        ))}
      </div>
    </div>
  );
};

export default CursosContainer;