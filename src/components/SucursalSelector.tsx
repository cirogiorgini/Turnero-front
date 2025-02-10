import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion"
import { MapPin, Clock, Users } from "lucide-react"

interface Sucursal {
  id: string
  nombre: string
  direccion: string
  horario: string
  capacidad: string
  imagen: string
}

const sucursales: Sucursal[] = [
  {
    id: "centro",
    nombre: "Sucursal Centro",
    direccion: "Av. Principal 123",
    horario: "9:00 - 20:00",
    capacidad: "Alta disponibilidad",
    imagen: "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=o44GQ5ZT0FMz077vvLrU5Q&cb_client=search.gws-prod.gps&w=408&h=240&yaw=102.21424&pitch=0&thumbfov=100",
  },
  {
    id: "norte",
    nombre: "Sucursal Norte",
    direccion: "Calle Norte 456",
    horario: "10:00 - 19:00",
    capacidad: "Disponibilidad media",
    imagen: "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=28J2BsOGAWReJqaxT4WptA&cb_client=search.gws-prod.gps&w=408&h=240&yaw=240.07298&pitch=0&thumbfov=100",
  },
]

const SucursalSelector: React.FC = () => {
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<string>("")

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Selecciona una Sucursal</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {sucursales.map((sucursal) => (
          <motion.div key={sucursal.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card
              className={`cursor-pointer transition-colors ${
                sucursalSeleccionada === sucursal.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
              }`}
              onClick={() => setSucursalSeleccionada(sucursal.id)}
            >
              <CardContent className="p-6">
                <div className="aspect-video rounded-lg bg-muted mb-4 overflow-hidden">
                  <img
                    src={sucursal.imagen || "/placeholder.svg"}
                    alt={sucursal.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-4">{sucursal.nombre}</h3>
                <div className="space-y-3 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{sucursal.direccion}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{sucursal.horario}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{sucursal.capacidad}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SucursalSelector;