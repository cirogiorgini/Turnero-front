import { useTurnContext } from "@/context/TurnContext";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const TurnSummary: React.FC = () => {
    const { turnData } = useTurnContext();

    return (
        <Card className="w-full max-w-md mx-auto shadow-none boder-none">
            <CardHeader>
                <CardTitle>Resumen del Turno</CardTitle>
                <CardDescription>
                    Aquí tienes un resumen de los datos ingresados para tu turno.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-baseline space-x-2">
                    <Label className="text-base font-semibold">Nombre:</Label>
                    <span className="text-muted-foreground">{turnData.clientName || "No proporcionado"}</span>
                </div>
                <div className="flex items-baseline space-x-2">
                    <Label className="text-base font-semibold">Email:</Label>
                    <span className="text-muted-foreground">{turnData.clientEmail || "No proporcionado"}</span>
                </div>
                <div className="flex items-baseline space-x-2">
                    <Label className="text-base font-semibold">Teléfono:</Label>
                    <span className="text-muted-foreground">{turnData.clientPhone || "No proporcionado"}</span>
                </div>
                <div className="flex items-baseline space-x-2">
                    <Label className="text-base font-semibold">Fecha:</Label>
                    <span className="text-muted-foreground">{turnData.date || "No seleccionada"}</span>
                </div>
                <div className="flex items-baseline space-x-2">
                    <Label className="text-base font-semibold">Hora:</Label>
                    <span className="text-muted-foreground">{turnData.time || "No seleccionada"}</span>
                </div>
                <div className="flex items-baseline space-x-2">
                    <Label className="text-base font-semibold">Barbero:</Label>
                    <span className="text-muted-foreground">{turnData.barber || "No seleccionado"}</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default TurnSummary;
