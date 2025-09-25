import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTurnContext } from "@/context/TurnContext";
import BranchService from "@/utils/branchService";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus } from "lucide-react"; // Importar el ícono
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Interfaz para una sucursal individual
interface Branch {
  _id: string;
  name: string;
  address: string;
  phone: string;
  barbers: string[];
  __v?: number;
}

export interface BranchesResponse {
  branches: Branch[];
}

const AdminBranches = () => {
  const [branches, setBranches] = useState<Branch[]>([]); // Inicializa como array vacío
  const { user } = useTurnContext();
  const { toast } = useToast();
  const token = user?.token;

  useEffect(() => {
    const fetchBranches = async () => {
      if (!token) {
        toast({ title: "Error", description: "No se encontró el token de autenticación.", variant: "destructive" });
        return;
      }
      try {
        const response = await BranchService.getBranches(token);
        if (response && Array.isArray(response.branches)) {
          setBranches(response.branches);
        } else {
          toast({ title: "Error", description: "La respuesta de la API no es válida.", variant: "destructive" });
        }
      } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    };

    fetchBranches();
  }, [token, toast]);

  const handleDeleteBranch = async (branchId: string) => {
    if (!token) {
      toast({ title: "Error", description: "No se encontró el token de autenticación.", variant: "destructive" });
      return;
    }

    try {
      await BranchService.deleteBranch(branchId, token);
      setBranches(branches.filter(branch => branch._id !== branchId));
      toast({ title: "Éxito", description: "Sucursal eliminada correctamente." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">Sucursales</h2>
        <Link to="/dashboard/sucursal/crear">
          <Button>
            <Plus className="mr-2 h-5 w-5" /> Añadir Sucursal
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatePresence>
          {branches.map((branch) => (
            <motion.div
              key={branch._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-xl font-semibold">{branch.name}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <ChevronDown className="text-gray-500" size={20} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDeleteBranch(branch._id)}>
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-2">{branch.address}</p>
                  <p className="text-gray-600 mb-4">Teléfono: {branch.phone}</p>
                  <Link to={`/dashboard/sucursal/${branch._id}/barbers`}>
                    <Button variant="outline" className="w-full">Ver Barberos</Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminBranches;
