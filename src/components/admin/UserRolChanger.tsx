import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useTurnContext } from "@/context/TurnContext";
import { Mail, Search, Loader2, User, Shield, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "usuario" | "barbero" | "gerente";
}

const UserManagement = () => {
  const { user } = useTurnContext();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<User["role"]>("usuario");
  const [isLoadingRoleChange, setIsLoadingRoleChange] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    console.log(users)
    setIsSearching(true);
    try {
      const response = await fetch(`http://localhost:3000/api/users?email=${searchQuery}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (!response.ok) throw new Error("Usuario no encontrado");
      const data = await response.json();
      setFoundUser(data);
    } catch (error) {
      console.error(error);
      setFoundUser(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRoleChange = async () => {
    if (!user?.token || !foundUser) return;
    setIsLoadingRoleChange(true);

    try {
      const response = await fetch(`http://localhost:3000/admin/users/${foundUser._id}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ rol: selectedRole }),
      });

      if (!response.ok) throw new Error("Error al actualizar el rol");

      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === foundUser._id ? { ...u, role: selectedRole } : u))
      );
      setFoundUser({ ...foundUser, role: selectedRole });
      setShowRoleDialog(false);
      toast({
        title: "Rol actualizado",
        description: `El usuario ahora es ${selectedRole}.`,
        variant: "default",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el rol.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRoleChange(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-6">
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Buscar Usuario</CardTitle>
          <CardDescription className="text-sm text-gray-500">Busca usuarios por correo electrónico para gestionar sus roles</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Buscar por correo electrónico"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isSearching}
              />
            </div>
            <Button type="submit" disabled={isSearching} className="w-full sm:w-auto">
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Buscando
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Buscar
                </>
              )}
            </Button>
          </form>

          {foundUser && (
            <div className="mt-6 border rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <User className="h-10 w-10 text-gray-500" />
                <div>
                  <h3 className="font-medium text-lg">{foundUser.firstName} {foundUser.lastName}</h3>
                  <p className="text-sm text-gray-500">{foundUser.email}</p>
                </div>
              </div>
              <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    <Shield className="mr-2 h-4 w-4" /> Cambiar Rol
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cambiar Rol</DialogTitle>
                    <DialogDescription>Selecciona un nuevo rol para {foundUser.firstName}</DialogDescription>
                  </DialogHeader>
                  <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as User["role"]) }>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usuario">Usuario</SelectItem>
                      <SelectItem value="barbero">Barbero</SelectItem>
                      <SelectItem value="gerente">Gerente</SelectItem>
                    </SelectContent>
                  </Select>
                  <DialogFooter>
                    <Button onClick={handleRoleChange} disabled={selectedRole === foundUser.role || isLoadingRoleChange}>
                      {isLoadingRoleChange ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" /> Guardar Cambios
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
