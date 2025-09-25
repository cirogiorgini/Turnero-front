import { useEffect, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTurnContext } from "@/context/TurnContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  barberCommission: number;
  lmgCoins: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ServicesTableProps {
  onView: (service: Service) => void;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  shouldRefresh: boolean;
  onRefreshComplete: () => void;
}

const ServicesTable = ({ onView, onEdit, onDelete, shouldRefresh, onRefreshComplete }: ServicesTableProps) => {
  const { user } = useTurnContext();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [serviceStatus, setServiceStatus] = useState<{ [key: string]: boolean }>({});

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/api/services", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al cargar los servicios");
      }

      setServices(data.services);
      // Inicializar el estado de los servicios
      const initialStatus = data.services.reduce((acc: { [key: string]: boolean }, service: Service) => {
        acc[service._id] = service.isActive;
        return acc;
      }, {});
      setServiceStatus(initialStatus);
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

  useEffect(() => {
    fetchServices();
  }, []);

  // Efecto para recargar los servicios cuando shouldRefresh cambia a true
  useEffect(() => {
    if (shouldRefresh) {
      fetchServices();
      onRefreshComplete();
    }
  }, [shouldRefresh]);

  const handleDeleteClick = (service: Service) => {
    setServiceToDelete(service);
  };

  const handleConfirmDelete = async () => {
    if (serviceToDelete) {
      await onDelete(serviceToDelete);
      setServiceToDelete(null);
    }
  };

  const handleStatusChange = async (service: Service, newStatus: boolean) => {
    try {
      setIsUpdatingStatus(true);
      const response = await fetch(`http://localhost:3000/api/services/${service._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          isActive: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al actualizar el estado del servicio");
      }

      toast({
        title: "Éxito",
        description: "Estado del servicio actualizado exitosamente",
      });

      // Actualizar el estado local
      setServiceStatus(prev => ({
        ...prev,
        [service._id]: newStatus
      }));

      // Actualizar el servicio en el estado local
      setServices(prevServices =>
        prevServices.map(s =>
          s._id === service._id ? { ...s, isActive: newStatus } : s
        )
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Comisión</TableHead>
              <TableHead>LMG Coins</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha Creación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No se encontraron servicios
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service._id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{formatCurrency(service.price)}</TableCell>
                  <TableCell>{service.barberCommission}%</TableCell>
                  <TableCell>{service.lmgCoins}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={serviceStatus[service._id] ?? service.isActive}
                        onCheckedChange={(checked) => handleStatusChange(service, checked)}
                        disabled={isUpdatingStatus}
                        aria-label={`Cambiar estado del servicio ${service.name}`}
                      />
                      <span className="text-sm text-muted-foreground">
                        {serviceStatus[service._id] ?? service.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(service.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onView(service)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Ver</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onEdit(service)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(service)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!serviceToDelete} onOpenChange={() => setServiceToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el servicio "{serviceToDelete?.name}"? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setServiceToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServicesTable; 