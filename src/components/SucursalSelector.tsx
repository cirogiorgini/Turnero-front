import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const SucursalSelector: React.FC = () => {
  const [sucursal, setSucursal] = useState<string>("");

  return (
    <Card className="w-full max-w-md mx-auto shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Selecciona    una Sucursal
        </CardTitle>
        <CardDescription>
         Seleccione el local donde quiera sacar su turno
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Grupo de opciones de sucursal */}
        <RadioGroup
          value={sucursal}
          onValueChange={(value) => setSucursal(value)}
          className="space-y-4"
        >
          {/* Opción 1: Sucursal Centro */}
          <div className="flex items-center space-x-4">
            <RadioGroupItem value="centro" id="centro" />
            <Label htmlFor="centro" className="text-base font-medium">
              Sucursal Centro
            </Label>
          </div>

          {/* Opción 2: Sucursal Norte */}
          <div className="flex items-center space-x-4">
            <RadioGroupItem value="norte" id="norte" />
            <Label htmlFor="norte" className="text-base font-medium">
              Sucursal Norte
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default SucursalSelector;