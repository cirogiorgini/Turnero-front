import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTurnContext } from "@/context/TurnContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";
import ServicesTable from "@/components/admin/ServicesTable";

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

const ServicesManager: React.FC = () => {
  const { user } = useTurnContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    barberCommission: "",
    lmgCoins: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleView = (service: Service) => {
    // Implementar vista detallada
    console.log("Ver servicio:", service);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      price: service.price.toString(),
      barberCommission: service.barberCommission.toString(),
      lmgCoins: service.lmgCoins.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (service: Service) => {
    try {
      const response = await fetch(`http://localhost:3000/api/services/${service._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al eliminar el servicio");
      }

      toast({
        title: "Éxito",
        description: "Servicio eliminado exitosamente",
      });
      
      // Indicar que se debe refrescar la lista
      setShouldRefresh(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.token) {
      toast({
        title: "Error",
        description: "No se encontró el token de autenticación",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const serviceData = {
        name: formData.name,
        price: Number(formData.price),
        barberCommission: Number(formData.barberCommission),
        lmgCoins: Number(formData.lmgCoins)
      };

      const url = editingService
        ? `http://localhost:3000/api/services/${editingService._id}`
        : "http://localhost:3000/api/services";

      const response = await fetch(url, {
        method: editingService ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(serviceData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error al ${editingService ? 'actualizar' : 'crear'} el servicio`);
      }

      toast({
        title: "Éxito",
        description: `Servicio ${editingService ? 'actualizado' : 'creado'} exitosamente`,
      });

      setIsDialogOpen(false);
      setEditingService(null);
      setFormData({
        name: "",
        price: "",
        barberCommission: "",
        lmgCoins: "",
      });
      
      // Indicar que se debe refrescar la lista
      setShouldRefresh(true);
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

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <Card className="border-none shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Gestión de Servicios</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingService(null);
                setFormData({
                  name: "",
                  price: "",
                  barberCommission: "",
                  lmgCoins: "",
                });
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Servicio
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingService ? "Editar Servicio" : "Crear Nuevo Servicio"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Servicio</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ej: Corte de Cabello"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Precio</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Ej: 5000"
                      required
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="barberCommission">Comisión del Barbero (%)</Label>
                    <Input
                      id="barberCommission"
                      name="barberCommission"
                      type="number"
                      value={formData.barberCommission}
                      onChange={handleInputChange}
                      placeholder="Ej: 70"
                      required
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lmgCoins">LMG Coins</Label>
                    <Input
                      id="lmgCoins"
                      name="lmgCoins"
                      type="number"
                      value={formData.lmgCoins}
                      onChange={handleInputChange}
                      placeholder="Ej: 50"
                      required
                      min="0"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {editingService ? "Actualizando..." : "Creando..."}
                    </>
                  ) : (
                    editingService ? "Actualizar Servicio" : "Crear Servicio"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <ServicesTable
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            shouldRefresh={shouldRefresh}
            onRefreshComplete={() => setShouldRefresh(false)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesManager; 