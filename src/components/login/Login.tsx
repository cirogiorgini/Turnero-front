import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast"; // Hook de shadcn para notificaciones
import { loginUser } from "@/utils/authService";
import { useTurnContext } from "@/context/TurnContext"; // Importar el contexto

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();
    const { setUser } = useTurnContext(); // Obtener la función para actualizar el usuario en el contexto

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userData = await loginUser(email, password);
            console.log(userData)

            // Guardar los datos del usuario en el contexto
            setUser(userData.data.user);
            navigate("/stepper");
            toast({ title: "Éxito", description: "Inicio de sesión exitoso 🎉", variant: "default" });
        
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Error desconocido",
                variant: "destructive",
            });
        } finally {
            setLoading(false); // Desactivar el estado de carga
        }
    };

    return (
        <div className="container mx-auto px-2 py-6 max-w-md flex">
            <Card className="border-none shadow-sm">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
                    <CardDescription>Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin}>
                        <div className="space-y-4">
                            {/* Campo de Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <div className="relative">
                                    <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Introduce un correo electrónico"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-9"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Campo de Contraseña */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-9 pr-10"
                                        placeholder="Ingrese una contraseña"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 flex items-center space-x-2">
                            <Checkbox id="rememberMe" />
                            <Label htmlFor="rememberMe">¿Desea mantener la sesión iniciada?</Label>
                        </div>

                        {/* Botón de Iniciar Sesión */}
                        <Button type="submit" className="w-full mt-6" disabled={loading}>
                            {loading ? "Cargando..." : "Iniciar Sesión"}
                        </Button>
                    </form>
                </CardContent>

                {/* Pie de página */}
                <CardFooter className="flex flex-col items-center">
                    <p className="text-sm text-muted-foreground mt-2">
                        ¿No tienes una cuenta?{" "}
                        <Link to="/register" className="text-primary hover:underline">
                            Regístrate
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;