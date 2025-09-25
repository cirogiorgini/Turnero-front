import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useTurnContext } from "@/context/TurnContext";

interface Sucursal {
  _id: string;
  name: string;
  address: string;
}

const SucursalSelector: React.FC = () => {
  const { turnData, updateTurnData, user } = useTurnContext();
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = user?.token

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const response = await fetch("http://localhost:3000/admin/branches", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error al obtener las sucursales");
        }

        // Guardar las sucursales en el estado
        setSucursales(data.branches);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSucursales();
    } else {
      setError("No se encontró el token de autenticación");
      setLoading(false);
    }
  }, [token]);

  // Manejar la selección de una sucursal
  const handleSelection = (sucursal: Sucursal) => {
    updateTurnData({ sucursal: { id: sucursal._id, nombre: sucursal.name, direccion: sucursal.address } });
  };

  if (loading) {
    return <div>Cargando sucursales...</div>; // Mostrar un indicador de carga
  }

  if (error) {
    return <div>Error: {error}</div>; // Mostrar un mensaje de error
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Selecciona una Sucursal</h2>
      <div className="grid gap-4">
        {sucursales.map((sucursal) => (
          <motion.div key={sucursal._id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card
              className={`cursor-pointer transition-colors flex items-center gap-4 p-4 ${
                turnData.sucursal?.id === sucursal._id ? "border-primary bg-primary/10" : "hover:border-primary/50"
              }`}
              onClick={() => handleSelection(sucursal)}
            >
              <input
                type="checkbox"
                checked={turnData.sucursal?.id === sucursal._id}
                onChange={() => handleSelection(sucursal)}
                className="w-5 h-5 accent-black cursor-pointer"
              />
              <CardContent className="p-0">
                <h3 className="text-lg font-semibold">{sucursal.name}</h3>
                <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{sucursal.address}</span>
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