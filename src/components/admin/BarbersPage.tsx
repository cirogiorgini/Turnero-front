import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserService from "@/utils/userService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useTurnContext } from "@/context/TurnContext";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Mail, Phone, User, ArrowLeft, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Barber {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    avatarUrl?: string;
}

const BarbersPage = () => {
    const { branchId } = useParams();
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [allBarbers, setAllBarbers] = useState<Barber[]>([]);
    const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [removingBarber, setRemovingBarber] = useState<string | null>(null);
    const { user } = useTurnContext();
    const { toast } = useToast();
    const token = user?.token;

    useEffect(() => {
        const fetchBranchBarbers = async () => {
            if (!token) {
                toast({ title: "Error", description: "No se encontró el token.", variant: "destructive" });
                return;
            }

            try {
                setIsLoading(true);
                const response = await fetch(`http://localhost:3000/admin/branches/${branchId}/barbers`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Error al obtener los barberos de la sucursal");

                const data = await response.json();
                setBarbers(data.barbers);
            } catch (error: any) {
                toast({ title: "Error", description: error.message, variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };

        fetchBranchBarbers();
    }, [branchId, token, toast]);

    useEffect(() => {
        const fetchAllBarbers = async () => {
            try {
                const data = await UserService.getBarbers();
                setAllBarbers(data);
            } catch (error: any) {
                toast({ title: "Error", description: "No se pudieron cargar los barberos.", variant: "destructive" });
            }
        };

        fetchAllBarbers();
    }, []);

    const handleAddBarber = async () => {
        if (!selectedBarber || !token) return;

        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/admin/branches/${branchId}/barbers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ barberId: selectedBarber }),
            });

            if (!response.ok) throw new Error("Error al añadir el barbero a la sucursal");

            const newBarber = allBarbers.find((barber) => barber._id === selectedBarber);
            if (newBarber) setBarbers((prev) => [...prev, newBarber]);

            toast({ title: "Éxito", description: "Barbero añadido correctamente." });
            setSelectedBarber(null);
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveBarber = async (barberId: string) => {
        if (!token) {
            toast({ title: "Error", description: "No se encontró el token.", variant: "destructive" });
            return;
        }

        setRemovingBarber(barberId);
        try {
            const response = await fetch(`http://localhost:3000/admin/branches/${branchId}/barbers/${barberId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Error al eliminar el barbero de la sucursal");

            setBarbers((prev) => prev.filter((barber) => barber._id !== barberId));
            toast({ title: "Éxito", description: "Barbero eliminado correctamente." });
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setRemovingBarber(null);
        }
    };

    const getInitials = (fullName: string) => {
        return fullName
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase();
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Barberos de la Sucursal</h2>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="default" className="">
                            <span className="hidden sm:inline">Añadir barbero</span>
                            <span className="sm:hidden">+</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Seleccionar barbero para agregar</DialogTitle>
                        </DialogHeader>
                        <Select onValueChange={(value) => setSelectedBarber(value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecciona un barbero" />
                            </SelectTrigger>
                            <SelectContent>
                                {allBarbers
                                    .filter((barber) => !barbers.some((b) => b._id === barber._id))
                                    .map((barber) => (
                                        <SelectItem key={barber._id} value={barber._id}>
                                            {barber.fullName}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                        <Button
                            onClick={handleAddBarber}
                            disabled={isLoading || !selectedBarber}
                            className="w-full mt-4"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin mr-2" />
                            ) : (
                                "Añadir Barbero"
                            )}
                        </Button>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading && barbers.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                </div>
            ) : barbers.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                >
                    <p className="text-gray-600 text-lg">No hay barberos en esta sucursal.</p>
                    <p className="text-gray-500 mt-2">Agrega barberos usando el botón superior</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                        {barbers.map((barber) => (
                            <motion.div
                                key={barber._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="hover:shadow-md transition-shadow">
                                    <div className="p-4 flex items-start gap-4">
                                        <Avatar className="w-12 h-12 flex-shrink-0 bg-gray-200 flex items-center justify-center">
                                            {barber.avatarUrl ? (
                                                <img
                                                    src={barber.avatarUrl}
                                                    className="rounded-full w-full h-full object-cover"
                                                    alt={barber.fullName}
                                                />
                                            ) : (
                                                <span className="text-gray-700 font-semibold flex items-center justify-center w-full h-full">
                                                    {getInitials(barber.fullName)}
                                                </span>
                                            )}
                                        </Avatar>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-gray-500" />
                                                <h3 className="font-semibold">{barber.fullName}</h3>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-gray-500" />
                                                <p className="text-sm text-gray-600">{barber.email}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-gray-500" />
                                                <p className="text-sm text-gray-600">{barber.phone}</p>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() => handleRemoveBarber(barber._id)}
                                                disabled={removingBarber === barber._id}
                                                className="w-full mt-2"
                                            >
                                                {removingBarber === barber._id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Eliminar de sucursal
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <div className="mt-6 flex justify-end">
                <Button
                    variant="outline"
                    onClick={() => window.history.back()}
                    className="border-gray-300"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver
                </Button>
            </div>
        </div>
    );
};

export default BarbersPage;