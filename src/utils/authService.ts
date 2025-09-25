export interface RegisterData {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    birthdate: string;
  }
  
  export const registerUser = async (data: RegisterData): Promise<any> => {
    try {
      const response = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error("Error en el registro");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  export const loginUser = async (email: string, password: string) => {
    try {
        const response = await fetch("http://localhost:3000/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al iniciar sesión");
        }

        return data;
    } catch (error) {
        throw new Error;
    }
};

  