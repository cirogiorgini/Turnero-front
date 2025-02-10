import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronLeft, Calendar, Clock, User, Mail, Phone, Scissors, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTurnContext } from "@/context/TurnContext";
import { useToast } from "@/hooks/use-toast";

const TurnSummary: React.FC = () => {
  const { turnData } = useTurnContext();
  const { toast } = useToast();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirmar = async () => {
    setIsConfirming(true);
    try {
      const response = await fetch("http://localhost:3000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...turnData,
        }),
      });

      if (response.ok) {
        setIsConfirmed(true);
        toast({
          title: "Turno asignado",
          description: "Su turno ha sido asignado exitosamente.",
        });
      } else {
        const error = await response.json();
        toast({
          variant: "destructive",
          title: "Error al asignar el turno",
          description: error.message || "Hubo un problema al asignar el turno.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un problema al conectar con el servidor.",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const steps = [
    { name: "Sucursal", status: "complete" },
    { name: "Horario", status: "complete" },
    { name: "Datos", status: "complete" },
    { name: "Resumen", status: "current" },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      {isConfirmed ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-800">¡Turno confirmado!</AlertTitle>
            <AlertDescription className="text-green-700">
              Te hemos enviado un email con los detalles de tu turno.
            </AlertDescription>
          </Alert>
        </motion.div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Resumen del Turno</CardTitle>
            <CardDescription>Aquí tienes un resumen de los datos ingresados para tu turno</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Datos del Cliente */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Datos del Cliente</h3>
              <div className="grid gap-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Nombre:</p>
                    <p className="font-medium">{turnData.clientName || "No proporcionado"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email:</p>
                    <p className="font-medium">{turnData.clientEmail || "No proporcionado"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono:</p>
                    <p className="font-medium">{turnData.clientPhone || "No proporcionado"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detalles del Turno */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Detalles del Turno</h3>
              <div className="grid gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha:</p>
                    <p className="font-medium">{turnData.date || "No seleccionada"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Hora:</p>
                    <p className="font-medium">{turnData.time || "No seleccionada"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Scissors className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Barbero:</p>
                    <p className="font-medium">{turnData.barber || "No seleccionado"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button onClick={handleConfirmar} disabled={isConfirming} className="flex items-center gap-2">
                {isConfirming ? (
                  <>
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    Confirmando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Confirmar Turno
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TurnSummary;