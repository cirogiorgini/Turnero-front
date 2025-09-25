import { useEffect, useState } from "react";
import UserService from "@/utils/userService";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import UserRolChanger from "@/components/admin/UserRolChanger";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, User } from "lucide-react";

interface Barber {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

const BarbersList = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);

  useEffect(() => {
    const fetchBarbers = async () => {
      const data = await UserService.getBarbers();
      setBarbers(data);
    };
    fetchBarbers();
  }, []);

  // Función para obtener iniciales del nombre
  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="p-4">
      {/* Título de la sección */}
      <h2 className="text-2xl font-bold mb-4 text-center">Lista de Barberos</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {barbers.length > 0 ? (
            barbers.map((barber) => (
              <motion.div
                key={barber._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-4 flex items-center gap-4 hover:shadow-lg transition-shadow duration-300">
                  <Avatar className="w-12 h-12 flex items-center justify-center bg-gray-400 text-white font-semibold">
                    {barber.avatarUrl ? (
                      <img
                        src={barber.avatarUrl}
                        className="rounded-full"
                        alt={barber.fullName}
                      />
                    ) : (
                      <span>{getInitials(barber.fullName)}</span>
                    )}
                  </Avatar>
                  <CardContent className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-gray-500" />
                      <h3 className="font-semibold">{barber.fullName}</h3>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <p className="text-sm text-gray-500">{barber.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <p className="text-sm text-gray-500">{barber.phone}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center col-span-3"
            >
              No hay barberos disponibles.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <UserRolChanger/>
    </div>
  );
};

export default BarbersList;
