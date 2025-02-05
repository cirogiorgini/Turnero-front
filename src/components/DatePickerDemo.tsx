import { useState, useEffect } from "react";
import { useTurnContext } from "@/context/TurnContext";
import { format } from "date-fns";
import { es } from "date-fns/locale"; // Importar el locale en español
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fetchAvailableDates = async (): Promise<{
  freeSlots: string[];
  date: string;
  isAvailable: boolean;
}[]> => {
  try {
    const response = await fetch("http://localhost:3000/api/appointments/available");
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.availableAppointments.map(
      (appointment: { date: string; freeSlots: string[] }) => ({
        date: appointment.date,
        freeSlots: appointment.freeSlots,
        isAvailable: appointment.freeSlots.length > 0,
      })
    );
  } catch (error) {
    console.error("Error fetching available dates:", error);
    return [];
  }
};

const DatePickerDemo: React.FC = () => {
  const { turnData, updateTurnData } = useTurnContext(); // Obtener datos del contexto
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    turnData.date ? new Date(turnData.date) : undefined
  ); // Inicializar con la fecha del contexto
  const [expandedDate, setExpandedDate] = useState<Date | undefined>(
    turnData.date ? new Date(turnData.date) : undefined
  );
  const [open, setOpen] = useState(false);
  const [availablesDates, setAvailablesDates] = useState<{
    date: string;
    freeSlots: string[];
    isAvailable: boolean;
  }[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<string | undefined>(
    turnData.barber || undefined
  ); // Inicializar con el barbero del contexto
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    turnData.time || undefined
  ); // Inicializar con la hora del contexto

  useEffect(() => {
    const loadAvailableDates = async () => {
      const dates = await fetchAvailableDates();
      setAvailablesDates(dates);
    };
    loadAvailableDates();
  }, []);

  const handleDateClick = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      updateTurnData({ date: formattedDate }); // Guardar fecha en el contexto
      setSelectedDate(date);
      setExpandedDate(date);
      setOpen(false);
    }
  };

  const handleBarberChange = (value: string) => {
    setSelectedBarber(value);
    updateTurnData({ barber: value }); // Guardar barbero en el contexto
  };

  const handleTimeSelect = (value: string) => {
    setSelectedTime(value);
    updateTurnData({ time: value }); // Guardar hora en el contexto
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 md:px-0">
      <div className="flex flex-col space-y-1.5 mb-2">
        <Label htmlFor="peluquero">Peluquero</Label>
        <Select onValueChange={handleBarberChange} value={selectedBarber}>
          <SelectTrigger id="peluquero">
            <SelectValue placeholder="Seleccionar un peluquero" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="matias">Matias</SelectItem>
            <SelectItem value="joaquin">Joaquin</SelectItem>
            <SelectItem value="facundo">Facundo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4">
        <Label htmlFor="diasDisponibles">Días disponibles</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2" />
              {selectedDate ? (
                format(selectedDate, "PPP", { locale: es }) // Formato en español
              ) : (
                <span>Selecciona una fecha</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateClick}
              initialFocus
              locale={es} // Calendario en español
              disabled={(date) => {
                const dateString = format(date, "yyyy-MM-dd");
                return !availablesDates.some(
                  (availableDate) =>
                    availableDate.date === dateString &&
                    availableDate.isAvailable
                );
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {expandedDate && (
        <div className="mt-4">
          <Label htmlFor="horario">Horarios disponibles</Label>
          <Select onValueChange={handleTimeSelect} value={selectedTime}>
            <SelectTrigger id="horario">
              <SelectValue placeholder="Seleccionar un horario" />
            </SelectTrigger>
            <SelectContent position="popper">
              {Array.from({ length: 10 }).map((_, index) => {
                const hour = 9 + index;
                const slot = `${hour.toString().padStart(2, "0")}:00`;
                const isAvailable = availablesDates
                  .filter(
                    (date) =>
                      date.date === format(expandedDate, "yyyy-MM-dd")
                  )
                  .some((date) => date.freeSlots.includes(slot));
                const formattedSlot = `${hour % 12 || 12}:00 ${
                  hour >= 12 ? "PM" : "AM"
                }`;

                return (
                  <SelectItem
                    key={slot}
                    value={slot}
                    className={cn(
                      !isAvailable && "text-gray-400 cursor-not-allowed"
                    )}
                    disabled={!isAvailable}
                  >
                    {formattedSlot}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default DatePickerDemo;