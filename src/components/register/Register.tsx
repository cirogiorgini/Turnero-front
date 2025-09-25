import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, Calendar, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { registerUser, RegisterData } from "@/utils/authService";
import { useToast } from "@/hooks/use-toast"; // 🔥 Importamos el hook de shadcn

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>();

  const navigate = useNavigate();
  const { toast } = useToast(); // 🔥 Hook para mostrar el toast
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: RegisterData) => {
    setIsSubmitting(true);
    setErrorMessage("");

    const formattedData = {
      ...data,
      birthdate: new Date(data.birthdate).toISOString().split("T")[0],
    };

    try {
      const result = await registerUser(formattedData);
      console.log("Registro exitoso:", result);

      // ✅ Mostramos el toast con el nombre del usuario
      toast({
        title: "Registro exitoso",
        description: `Bienvenido, ${data.fullName}! 🎉`,
      });

      // ✅ Redirigimos a "/stepper" después de 1 segundo
      setTimeout(() => {
        navigate("/stepper");
      }, 1000);
      
    } catch (error) {
      setErrorMessage("Error en el registro. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-2 py-6 max-w-md">
      <Card className="border-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Registro</CardTitle>
          <CardDescription>Crea una cuenta para acceder a todos los beneficios</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Nombre Completo */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Juan Pérez"
                    {...register("fullName", { required: "Este campo es obligatorio" })}
                    className="pl-8"
                  />
                </div>
                {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
              </div>

              {/* Correo Electrónico */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@ejemplo.com"
                    {...register("email", {
                      required: "Este campo es obligatorio",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Correo electrónico no válido",
                      },
                    })}
                    className="pl-8"
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="123-456-7890"
                    {...register("phone", { required: "Este campo es obligatorio" })}
                    className="pl-8"
                  />
                </div>
                {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: "Este campo es obligatorio" })}
                    className="pl-8 pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="h-3 w-3 text-muted-foreground" /> : <Eye className="h-3 w-3 text-muted-foreground" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>

              {/* Fecha de Nacimiento */}
              <div className="space-y-2">
                <Label htmlFor="birthdate">Fecha de Nacimiento</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
                  <Input
                    id="birthdate"
                    type="date"
                    {...register("birthdate", { required: "Este campo es obligatorio" })}
                    className="pl-8"
                  />
                </div>
                {errors.birthdate && <p className="text-sm text-red-500">{errors.birthdate.message}</p>}
              </div>
            </div>

            {/* Mensaje de Error */}
            {errorMessage && <p className="text-sm text-red-500 mt-4">{errorMessage}</p>}

            {/* Botón de Registro */}
            <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Registrarse"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground mt-2">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Inicia Sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
