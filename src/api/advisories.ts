import axiosInstance from "../lib/axios"

// Types para el sistema de asesorías
export interface Advisory {
  advisory_id: number;
  max_students: number;
  subject_detail_id: number;
  professor: {
    user_id: number;
    name: string;
    last_name: string;
    full_name: string;
    email: string;
  };
  subject_detail: {
    subject_detail_id: number;
    subject_name: string;
    schedules: Array<{
      subject_schedule_id: number;
      subject_details_id: number;
      day: string;
      start_time: string;
      end_time: string;
    }>;
  };
  schedules: Array<{
    advisory_schedule_id: number;
    day: string;
    begin_time: string;
    end_time: string;
  }>;
}

export interface CreateAdvisoryDto {
  subject_detail_id: number;
  max_students: number;
  schedules: Array<{
    day: string;
    begin_time: string;
    end_time: string;
  }>;
}

export interface UpdateAdvisoryDto {
  max_students?: number;
  schedules?: Array<{
    day: string;
    begin_time: string;
    end_time: string;
  }>;
}

// API para Advisories
export const advisoriesApi = {
  // Obtener todas las asesorías
  getAll: async (): Promise<Advisory[]> => {
    const response = await axiosInstance.get("/advisories")
    return response.data
  },

  // Obtener asesoría por ID
  getById: async (id: number): Promise<Advisory> => {
    const response = await axiosInstance.get(`/advisories/${id}`)
    return response.data
  },

  // Obtener asesorías de un profesor específico
  getByProfessor: async (professorId: number): Promise<Advisory[]> => {
    const response = await axiosInstance.get(`/advisories/professor/${professorId}`)
    return response.data
  },

  // Crear nueva asesoría
  create: async (data: CreateAdvisoryDto): Promise<Advisory> => {
    const response = await axiosInstance.post("/advisories", data)
    return response.data
  },

  // Actualizar asesoría
  update: async (id: number, data: UpdateAdvisoryDto): Promise<Advisory> => {
    const response = await axiosInstance.patch(`/advisories/${id}`, data)
    return response.data
  },

  // Eliminar asesoría
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/advisories/${id}`)
  }
}
