import { useState, useEffect } from "react";
import { useTurnContext } from "@/context/TurnContext";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Función para obtener los barberos de una sucursal
const fetchBarbers = async (token: string, sucursal: string) => {
  try {
    const response = await fetch(`http://localhost:3000/admin/branches/${sucursal}/barbers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
    const data = await response.json();
    return data.barbers;
  } catch (error) {
    console.error("Error fetching barbers:", error);
    return [];
  }
};

// Función para obtener turnos disponibles de un barbero
const fetchAppointmentsByBarber = async (barberId: string) => {
  try {
    const response = await fetch(`http://localhost:3000/api/appointments/barber/${barberId}`);
    if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
    const data = await response.json();

    return data.availableAppointments.map((appointment: any) => ({
      id: appointment._id,
      date: parseISO(appointment.date),
      time: appointment.time,
      isAvailable: appointment.isAvailable,
    }));
  } catch (error) {
    console.error("Error fetching appointments by barber:", error);
    return [];
  }
};

const DatePickerDemo: React.FC = () => {
  const { turnData, updateTurnData, user } = useTurnContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    turnData.date ? new Date(turnData.date) : undefined
  );
  const [availableAppointments, setAvailableAppointments] = useState<
    { id: string; date: Date; time: string; isAvailable: boolean }[]
  >([]);
  const [barbers, setBarbers] = useState<{ _id: string; fullName: string }[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<string | undefined>(turnData.barber || undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(turnData.time || undefined);
  const [open, setOpen] = useState(false);

  // Cargar barberos al montar el componente
  useEffect(() => {
    const loadBarbers = async () => {
      if (user?.token && turnData?.sucursal) {
        const barbersData = await fetchBarbers(user.token, turnData.sucursal.id);
        setBarbers(barbersData);
      }
    };

    loadBarbers();
  }, [user, turnData.sucursal]);

  // Cargar turnos cuando se seleccione un barbero
  useEffect(() => {
    const loadAppointmentsByBarber = async () => {
      if (selectedBarber) {
        const appointments = await fetchAppointmentsByBarber(selectedBarber);
        setAvailableAppointments(appointments);
      }
    };

    loadAppointmentsByBarber();
  }, [selectedBarber]);

  // Cambiar barbero seleccionado
  const handleBarberChange = (value: string) => {
    setSelectedBarber(value);
    setSelectedDate(undefined); // Resetear fecha al cambiar de barbero
    setSelectedTime(undefined); // Resetear horario al cambiar de barbero
    updateTurnData({ barber: value, date: undefined, time: undefined });
  };

  // Manejar la selección de una fecha
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    updateTurnData({ date: date?.toISOString() });
    setSelectedTime(undefined); // Resetear horario al cambiar la fecha
  };

  // Manejar la selección de un horario
  const handleTimeSelect = (value: string) => {
    setSelectedTime(value);
    updateTurnData({ time: value });
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 md:px-0">
      {/* Selector de barbero */}
      <div className="flex flex-col space-y-1.5 mb-2">
        <Label htmlFor="peluquero">Peluquero</Label>
        <Select value={selectedBarber} onValueChange={handleBarberChange}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar peluquero" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {barbers.map((barber) => (
                <SelectItem key={barber._id} value={barber._id}>
                  {barber.fullName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Selector de fecha */}
      <div className="mt-4">
        <Label htmlFor="diasDisponibles">Días disponibles</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2" />
              {selectedDate ? format(selectedDate, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
              locale={es}
              disabled={(date) =>
                !availableAppointments.some(
                  (appointment) => format(appointment.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd") && appointment.isAvailable
                )
              }
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Selector de horario */}
      {selectedDate && (
        <div className="mt-4">
          <Label htmlFor="horario">Horarios disponibles</Label>
          <Select value={selectedTime} onValueChange={handleTimeSelect}>
            <SelectTrigger id="horario">
              <SelectValue placeholder="Seleccionar horario" />
            </SelectTrigger>
            <SelectContent>
              {availableAppointments
                .filter(
                  (appointment) => format(appointment.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
                )
                .map((appointment) => (
                  <SelectItem key={appointment.id} value={appointment.time}>
                    {appointment.time}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default DatePickerDemo;
