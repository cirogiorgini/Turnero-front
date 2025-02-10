import React, { useState } from "react";
import ContenidoCurso from "./ContenidoCurso";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CursoProps {
  curso: {
    id: number;
    titulo: string;
    descripcion: string;
    imagen: string;
    contenido: {
      modulos: string[];
    };
  };
}

const Curso: React.FC<CursoProps> = ({ curso }) => {
  const [mostrarContenido, setMostrarContenido] = useState(false);

  const toggleContenido = () => {
    setMostrarContenido(!mostrarContenido);
  };

  return (
    <Card className="overflow-hidden">
      {/* Imagen del curso con borde redondeado */}
      <div className="w-full h-48 overflow-hidden rounded-t-lg">
        <img
          src={curso.imagen}
          alt={curso.titulo}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle>{curso.titulo}</CardTitle>
        <CardDescription>{curso.descripcion}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={toggleContenido}
          variant="outline"
          className="w-full"
        >
          {mostrarContenido ? "Ocultar Contenido" : "Ver Contenido"}
        </Button>
        {mostrarContenido && <ContenidoCurso contenido={curso.contenido} />}
      </CardContent>
    </Card>
  );
};

export default Curso;