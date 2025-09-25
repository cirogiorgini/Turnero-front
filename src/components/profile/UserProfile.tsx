import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import EditProfileDialog from "@/components/profile/EditProfileDialog";
import Foto from "@/components/profile/Screenshot 2025-03-01 120623.png";
import { useTurnContext } from "@/context/TurnContext"; // Importar el contexto
import { useToast } from "@/hooks/use-toast"; // Hook de notificaciones

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  points: number;
  birthdate: string;
  role: string;
  token: string;
}

const UserProfile: React.FC = () => {
  const { user } = useTurnContext(); // Obtener el usuario del contexto
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  // Verificar si el usuario está disponible
  if (!user) {
    return <div>No se encontró el usuario.</div>; // Mensaje si no hay datos del usuario
  }

  const handleSave = (updatedData: Partial<User>) => {
    // Aquí puedes implementar la lógica para actualizar el usuario en el contexto o en el backend
    console.log("Datos actualizados:", updatedData);
    toast({
      title: "Perfil actualizado",
      description: "Los datos del perfil se han actualizado correctamente.",
      variant: "default",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="border-none shadow-sm">
        <CardHeader className="text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarImage src={Foto} alt={user.fullName} />
            <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-bold">{user.fullName}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {user.rol}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sección de Información Personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Personal</h3>
            <div className="space-y-2">
              <div className="flex justify-between md:flex-col">
                <span className="text-muted-foreground">Correo Electrónico:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Teléfono:</span>
                <span>{user.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Usuario desde:</span>
                <span>{user.createdAt}</span>
              </div>
            </div>
          </div>

          {/* Sección de Puntos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Puntos Acumulados</h3>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Puntos:</span>
              <span className="font-bold">{user.points} puntos</span>
            </div>
          </div>

          {/* Botón de Editar Perfil */}
          <div className="flex justify-center">
            <Button onClick={() => setIsEditDialogOpen(true)}>
              Editar Perfil
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de Edición de Perfil */}
      <EditProfileDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        user={user}
        onSave={handleSave}
      />
    </div>
  );
};

export default UserProfile;