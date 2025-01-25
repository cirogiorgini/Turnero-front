export const fetchUnavailableDates = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/appointments/unavailable");
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Respuesta del servidor:", data);
  
      // Accede a availableAppointments y procesa las fechas no disponibles
      const unavailableDates = data.availableAppointments.map((appointment: { date: string; freeSlots: string[] }) => ({
        date: appointment.date,
        isAvailable: appointment.freeSlots.length > 0, // Disponible si tiene horarios libres
      }));
  
      console.log("Fechas procesadas:", unavailableDates);
      return unavailableDates;
    } catch (error) {
      console.error("Error fetching unavailable dates:", error);
      return [];
    }
  };
  