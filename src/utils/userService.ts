const BASE_URL = "http://localhost:3000";

class UserService {
  static async getBarbers() {
    try {
      const response = await fetch(`${BASE_URL}/api/users/barbers`);
      if (!response.ok) {
        throw new Error("Error al obtener los barberos");
      }
      return response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  static async changeUserRole(userId: string) {
    try {
      const response = await fetch(`${BASE_URL}/admin/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol: "barbero" }),
      });
      if (!response.ok) throw new Error("Error al cambiar el rol");
      return response.json();
    } catch (error) {
      console.error(error);
    }
  }

  static async removeBarberFromBranch(barberId: string) {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/barbers/${barberId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Error al eliminar el barbero");
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

export default UserService;
