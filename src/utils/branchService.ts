import { BranchesResponse } from '@/pages/dashboard/AdminBranches'
const BASE_URL = "http://localhost:3000";


interface Barber {
  _id: string;
  name: string;
}


class BranchService {
  static async getBranches(token: string): Promise<BranchesResponse> {
    try {
      const response = await fetch(`${BASE_URL}/admin/branches`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        return { branches: data.branches };
      } else {
        throw new Error(data.message || "Error al obtener las sucursales");
      }
    } catch (error) {
      throw error;
    }
  }
  
  

  static async getBarbersByBranch(branchId: string, token: string): Promise<Barber[]> {
    try {
      const response = await fetch(`${BASE_URL}/admin/branches/${branchId}/barbers`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        return data.barbers;
      } else {
        throw new Error(data.message || "Error al obtener los barberos");
      }
    } catch (error) {
      throw error;
    }
  }

  static async addBarberToBranch(branchId: string, barberId: string, token: string): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/admin/branches/${branchId}/barbers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ barberId }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al agregar el barbero");
      }
    } catch (error) {
      throw error;
    }
  }

  static async deleteBranch(branchId: string, token: string): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/admin/branches/${branchId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al eliminar la sucursal");
      }
    } catch (error) {
      throw error;
    }
  }

  static async getBranchesForSchedule(token: string): Promise<{ _id: string; name: string }[]> {
    try {
      const response = await fetch(`${BASE_URL}/admin/branches`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        return data.branches.map((branch: any) => ({
          _id: branch._id,
          name: branch.name
        }));
      } else {
        throw new Error(data.message || "Error al obtener las sucursales");
      }
    } catch (error) {
      throw error;
    }
  }
}

export default BranchService;