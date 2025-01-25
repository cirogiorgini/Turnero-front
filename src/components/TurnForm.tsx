import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTurnContext } from "@/context/TurnContext";

interface FormData {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
}

const TurnForm: React.FC = () => {
    const { updateTurnData } = useTurnContext();
    const {
        register,
        watch,
        formState: { errors },
    } = useForm<FormData>();

    const formValues = watch();

    useEffect(() => {
        const timeout = setTimeout(() => {
            updateTurnData(formValues);
        }, 500);

        return () => clearTimeout(timeout);
    }, [formValues, updateTurnData]);

    return (
        <div className="w-full max-w-md mx-auto md:px-0">
            <Card className="border-none shadow-none">
                <CardHeader>
                    <CardTitle>Datos</CardTitle>
                    <CardDescription>
                        Completa el siguiente formulario para poder solicitar el turno
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="name">Nombre y apellido</Label>
                        <Input
                            id="name"
                            className="w-full"
                            placeholder="Introduce tu nombre y apellido"
                            {...register("clientName", { required: "Este campo es obligatorio" })}
                        />
                        {errors.clientName && (
                            <p className="text-red-500 text-sm">{errors.clientName.message}</p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                            type="email"
                            id="email"
                            className="w-full"
                            placeholder="Introduce tu correo electrónico"
                            {...register("clientEmail", {
                                required: "Este campo es obligatorio",
                                pattern: {
                                    value: /^\S+@\S+\.\S+$/,
                                    message: "Por favor, introduce un correo válido",
                                },
                            })}
                        />
                        {errors.clientEmail && (
                            <p className="text-red-500 text-sm">{errors.clientEmail.message}</p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="phone">Número de teléfono</Label>
                        <Input
                            type="text"
                            id="phone"
                            className="w-full"
                            placeholder="Introduce tu número de teléfono"
                            {...register("clientPhone", {
                                required: "Este campo es obligatorio",
                                pattern: {
                                    value: /^\d+$/,
                                    message: "El número de teléfono solo puede contener dígitos",
                                },
                            })}
                        />
                        {errors.clientPhone && (
                            <p className="text-red-500 text-sm">{errors.clientPhone.message}</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TurnForm;
