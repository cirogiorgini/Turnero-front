import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTurnContext } from "@/context/TurnContext";
import BranchService from "@/utils/branchService";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  date: Date;
  time: string;
  isAvailable: boolean;
}

interface Barber {
  _id: string;
  fullName: string;
}

interface Branch {
  _id: string;
  name: string;
}

const BarberSchedule: React.FC = () => {
  const { user } = useTurnContext();
  const { toast } = useToast();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string | undefined>();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<string | undefined>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar sucursales al montar el componente
  useEffect(() => {
    const loadBranches = async () => {
      if (!user?.token) {
        toast({
          title: "Error",
          description: "No se encontró el token de autenticación.",
          variant: "destructive",
        });
        return;
      }

      try {
        setIsLoading(true);
        const branchesData = await BranchService.getBranchesForSchedule(user.token);
        setBranches(branchesData);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBranches();
  }, [user?.token, toast]);

  // Cargar barberos cuando se seleccione una sucursal
  useEffect(() => {
    const loadBarbers = async () => {
      if (!selectedBranch || !user?.token) return;

      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3000/admin/branches/${selectedBranch}/barbers`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setBarbers(data.barbers);
        setSelectedBarber(undefined); // Resetear barbero seleccionado
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Error al cargar los barberos",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBarbers();
  }, [selectedBranch, user?.token, toast]);

  // Cargar turnos cuando se seleccione un barbero
  useEffect(() => {
    const loadAppointments = async () => {
      if (!selectedBarber) return;

      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3000/api/appointments/barber/${selectedBarber}`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();

        const formattedAppointments = data.availableAppointments.map((appointment: any) => ({
          id: appointment._id,
          date: parseISO(appointment.date),
          time: appointment.time,
          isAvailable: appointment.isAvailable,
        }));

        setAppointments(formattedAppointments);
      } catch (error: any) {
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
  }, [selectedBarber, toast]);

  // Agrupar turnos por fecha
  const groupedAppointments = appointments.reduce((acc, appointment) => {
    const date = format(appointment.date, "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(appointment);
    return acc;
  }, {} as Record<string, Appointment[]>);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Agenda de Turnos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Selector de Sucursal */}
            <div className="space-y-2">
              <Label>Seleccionar Sucursal</Label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sucursal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {branches.map((branch) => (
                      <SelectItem key={branch._id} value={branch._id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Selector de Barbero */}
            {selectedBranch && (
              <div className="space-y-2">
                <Label>Seleccionar Barbero</Label>
                <Select value={selectedBarber} onValueChange={setSelectedBarber}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar barbero" />
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
            )}

            {/* Lista de Turnos */}
            {selectedBarber && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Turnos Disponibles</h3>
                {Object.entries(groupedAppointments).map(([date, dayAppointments]) => (
                  <div key={date} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">
                      {format(parseISO(date), "EEEE, d 'de' MMMM", { locale: es })}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {dayAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className={`p-2 rounded ${
                            appointment.isAvailable
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {appointment.time}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarberSchedule; 