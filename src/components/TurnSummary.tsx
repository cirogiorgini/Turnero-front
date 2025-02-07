import { useTurnContext } from "@/context/TurnContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TurnSummary: React.FC = () => {
  const { turnData } = useTurnContext();
  const { toast } = useToast();

  // Función para obtener las iniciales del nombre del barbero
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  // Función para confirmar el turno
  const handleConfirmTurn = async () => {
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
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Resumen del Turno</CardTitle>
        <CardDescription>
          Aquí tienes un resumen de los datos ingresados para tu turno.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sección de datos del cliente */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Datos del Cliente</Label>
          <Separator />
          <div className="flex items-baseline space-x-2">
            <Label className="font-medium">Nombre:</Label>
            <span
              className={
                turnData.clientName ? "text-muted-foreground" : "text-red-500"
              }
            >
              {turnData.clientName || "No proporcionado"}
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <Label className="font-medium">Email:</Label>
            <span
              className={
                turnData.clientEmail ? "text-muted-foreground" : "text-red-500"
              }
            >
              {turnData.clientEmail || "No proporcionado"}
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <Label className="font-medium">Teléfono:</Label>
            <span
              className={
                turnData.clientPhone ? "text-muted-foreground" : "text-red-500"
              }
            >
              {turnData.clientPhone || "No proporcionado"}
            </span>
          </div>
        </div>

        {/* Sección de detalles del turno */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Detalles del Turno</Label>
          <Separator />
          <div className="flex items-baseline space-x-2">
            <Label className="font-medium">Fecha:</Label>
            <span
              className={
                turnData.date ? "text-muted-foreground" : "text-red-500"
              }
            >
              {turnData.date || "No seleccionada"}
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <Label className="font-medium">Hora:</Label>
            <span
              className={
                turnData.time ? "text-muted-foreground" : "text-red-500"
              }
            >
              {turnData.time || "No seleccionada"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Label className="font-medium">Barbero:</Label>
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`/images/barberos/${turnData.barber}.jpg`} // Ruta de la imagen del barbero
                  alt={turnData.barber}
                />
                <AvatarFallback>
                  {turnData.barber ? getInitials(turnData.barber) : "N/A"}
                </AvatarFallback>
              </Avatar>
              <span
                className={
                  turnData.barber ? "text-muted-foreground" : "text-red-500"
                }
              >
                {turnData.barber || "No seleccionado"}
              </span>
            </div>
          </div>
        </div>

        {/* Botón de confirmación */}
        <Button
          className="w-full mt-6"
          variant="default"
          onClick={handleConfirmTurn}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Confirmar Turno
        </Button>
      </CardContent>
    </Card>
  );
};

export default TurnSummary;