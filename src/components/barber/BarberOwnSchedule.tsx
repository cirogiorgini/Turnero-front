import { useState, useEffect } from "react";
import { format, parseISO, startOfWeek, endOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTurnContext } from "@/context/TurnContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Calendar, Copy, Check, Scissors, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Appointment {
  _id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  barber: string;
  branch: string;
  date: Date;
  time: string;
  status: string;
  service?: string;
  price?: string;
}

interface JwtPayload {
  id: string;
  email: string;
  rol: string;
  iat: number;
  exp: number;
}

const DAYS_OF_WEEK = [
  { value: "all", label: "Semanal" },
  { value: "1", label: "Lunes" },
  { value: "2", label: "Martes" },
  { value: "3", label: "Miércoles" },
  { value: "4", label: "Jueves" },
  { value: "5", label: "Viernes" },
  { value: "6", label: "Sábado" },
];

const BarberOwnSchedule: React.FC = () => {
  const { user } = useTurnContext();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Función para decodificar el token JWT
  const decodeToken = (token: string): JwtPayload | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decodificando el token:', error);
      return null;
    }
  };

  // Cargar turnos al montar el componente
  useEffect(() => {
    const loadAppointments = async () => {
      if (!user?.token) {
        toast({
          title: "Error",
          description: "No se encontró el token de autenticación.",
          variant: "destructive",
        });
        return;
      }

      const decodedToken = decodeToken(user.token);
      if (!decodedToken?.id) {
        toast({
          title: "Error",
          description: "No se pudo obtener el ID del usuario.",
          variant: "destructive",
        });
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3000/api/appointments/barber/${decodedToken.id}/assigned`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();

        const formattedAppointments = data.appointments.map((appointment: any) => ({
          ...appointment,
          date: parseISO(appointment.date),
        }));

        setAppointments(formattedAppointments);
      } catch (error: any) {
        console.error("Error al cargar turnos:", error);
        toast({
          title: "Error",
          description: "Error al cargar los turnos",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, [user?.token, toast]);

  // Filtrar turnos por día seleccionado
  const filteredAppointments = appointments.filter(appointment => {
    if (selectedDay === "all") {
      const today = new Date();
      const weekStart = startOfWeek(today, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
      return appointment.date >= weekStart && appointment.date <= weekEnd;
    }
    
    // Obtenemos el día de la semana (0-6, donde 0 es domingo)
    const appointmentDayOfWeek = appointment.date.getDay();
    // Convertimos a nuestro formato (1-6, donde 1 es lunes)
    const normalizedAppointmentDay = appointmentDayOfWeek === 0 ? 6 : appointmentDayOfWeek;
    // Convertimos el día seleccionado a número
    const selectedDayNumber = parseInt(selectedDay);
    
    return normalizedAppointmentDay === selectedDayNumber;
  });

  // Agrupar turnos por fecha
  const groupedAppointments = filteredAppointments.reduce((acc, appointment) => {
    const date = format(appointment.date, "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(appointment);
    return acc;
  }, {} as Record<string, Appointment[]>);

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleCopyPhone = async () => {
    if (selectedAppointment?.clientPhone) {
      try {
        await navigator.clipboard.writeText(selectedAppointment.clientPhone);
        setIsCopied(true);
        toast({
          title: "Copiado",
          description: "El número de teléfono se ha copiado al portapapeles",
        });
        setTimeout(() => setIsCopied(false), 2000);
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo copiar el número de teléfono",
          variant: "destructive",
        });
      }
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedAppointment) return;

    try {
      setIsUpdatingStatus(true);
      const response = await fetch(`http://localhost:3000/api/appointments/${selectedAppointment._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Error al actualizar el estado');

      // Actualizar el estado local
      setAppointments(appointments.map(app => 
        app._id === selectedAppointment._id 
          ? { ...app, status: newStatus }
          : app
      ));

      toast({
        title: "Actualizado",
        description: "El estado del turno se ha actualizado correctamente",
      });

      // Pequeña pausa para mostrar la animación
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del turno",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="border-none shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="w-6 h-6" />
               Agenda
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por día" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {!user?.token ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8 text-gray-500"
              >
                No se encontró el token de autenticación. Por favor, inicie sesión nuevamente.
              </motion.div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {isLoading ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-center items-center py-8"
                    >
                      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    </motion.div>
                  ) : filteredAppointments.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-8 text-gray-500"
                    >
                      No hay turnos programados para el día seleccionado
                    </motion.div>
                  ) : (
                    Object.entries(groupedAppointments).map(([date, dayAppointments], index) => (
                      <motion.div
                        key={date}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-medium mb-4 text-lg text-gray-800">
                          {format(parseISO(date), "EEEE, d 'de' MMMM", { locale: es })}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {dayAppointments.map((appointment, appointmentIndex) => (
                            <motion.div
                              key={appointment._id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: appointmentIndex * 0.05 }}
                              onClick={() => handleAppointmentClick(appointment)}
                              className="group cursor-pointer"
                            >
                              <Card className="border shadow-sm hover:shadow-md transition-all duration-200">
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                      <Clock className="w-4 h-4 text-gray-500" />
                                      <span className="font-medium">{appointment.time}</span>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      appointment.status === 'pending'
                                        ? "bg-yellow-100 text-yellow-800"
                                        : appointment.status === 'completed'
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}>
                                      {appointment.status === 'pending' ? 'Pendiente' : 
                                       appointment.status === 'completed' ? 'Completada' : 'Cancelada'}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 mb-2">
                                    <Scissors className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium">{appointment.service || "Corte de cabello"}</span>
                                  </div>

                                  <Separator className="my-3" />

                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                        {appointment.clientName.charAt(0).toUpperCase()}
                                      </div>
                                      <span className="text-sm font-medium">{appointment.clientName}</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                      ${appointment.price || "25"}
                                    </span>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Turno</DialogTitle>
            <DialogDescription>
              Gestiona el estado del turno y la información del cliente
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">Estado actual:</span>
                <motion.span 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedAppointment.status === 'pending'
                      ? "bg-yellow-100 text-yellow-800"
                      : selectedAppointment.status === 'completed'
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedAppointment.status === 'pending' ? 'Pendiente' : 
                   selectedAppointment.status === 'completed' ? 'Completado' : 'Cancelado'}
                </motion.span>
              </div>

              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Cliente:</span> {selectedAppointment.clientName}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {selectedAppointment.clientEmail}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-sm">
                    <span className="font-medium">Teléfono:</span> {selectedAppointment.clientPhone}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyPhone}
                    className="flex items-center gap-2"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Cambiar estado:</span>
                <div className="flex gap-2">
                  {selectedAppointment.status === 'pending' && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleStatusChange('completed')}
                      disabled={isUpdatingStatus}
                      className="relative"
                    >
                      {isUpdatingStatus ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Actualizando...
                        </>
                      ) : (
                        'Marcar como Completado'
                      )}
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleStatusChange('canceled')}
                    disabled={isUpdatingStatus}
                    className="relative"
                  >
                    {isUpdatingStatus ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Cancelando...
                      </>
                    ) : (
                      'Cancelar'
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={isUpdatingStatus}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BarberOwnSchedule; 