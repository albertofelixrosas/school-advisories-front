import axiosInstance from "../lib/axios"

// Types para el sistema de materias
export interface Subject {
  subject_id: number;
  subject: string;
}

export interface SubjectDetail {
  subject_detail_id: number;
  subject_id: number;
  professor_id: number;
  subject: Subject;
  professor: {
    user_id: number;
    full_name: string;
    last_name: string;
    email: string;
  };
  schedules?: Array<{
    schedule_id: number;
    day: string;
    begin_time: string;
    end_time: string;
  }>;
  advisories?: Array<{
    advisory_id: number;
    max_students: number;
    created_at: string;
  }>;
}

export interface CreateSubjectDto {
  subject: string;
}

export interface CreateSubjectDetailDto {
  subject_id: number;
  professor_id: number;
}

export interface UpdateSubjectDto {
  subject?: string;
}

// API para Subjects (solo ADMIN)
export const subjectsApi = {
  // Obtener todas las materias del sistema
  getAll: async (): Promise<Subject[]> => {
    const response = await axiosInstance.get('/subjects');
    return response.data;
  },

  // Obtener materia por ID
  getById: async (id: number): Promise<Subject> => {
    const response = await axiosInstance.get(`/subjects/${id}`);
    return response.data;
  },

  // Crear nueva materia
  create: async (data: CreateSubjectDto): Promise<Subject> => {
    const response = await axiosInstance.post('/subjects', data);
    return response.data;
  },

  // Actualizar materia
  update: async (id: number, data: UpdateSubjectDto): Promise<Subject> => {
    const response = await axiosInstance.patch(`/subjects/${id}`, data);
    return response.data;
  },

  // Eliminar materia
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/subjects/${id}`);
  }
};

// API para Subject Details (asignaciones profesor-materia)
export const subjectDetailsApi = {
  // Obtener todas las asignaciones
  getAll: async (): Promise<SubjectDetail[]> => {
    const response = await axiosInstance.get('/subject-details');
    return response.data;
  },

  // Obtener asignaciones de un profesor específico
  getByProfessor: async (professorId: number): Promise<SubjectDetail[]> => {
    const response = await axiosInstance.get('/subject-details');
    const allDetails = response.data;
    // Filtrar por professor_id
    return allDetails.filter((detail: SubjectDetail) => 
      detail.professor_id === professorId
    );
  },

  // Obtener asignación por ID
  getById: async (id: number): Promise<SubjectDetail> => {
    const response = await axiosInstance.get(`/subject-details/${id}`);
    return response.data;
  },

  // Crear nueva asignación profesor-materia
  create: async (data: CreateSubjectDetailDto): Promise<SubjectDetail> => {
    const response = await axiosInstance.post('/subject-details', data);
    return response.data;
  },

  // Actualizar asignación
  update: async (id: number, data: Partial<CreateSubjectDetailDto>): Promise<SubjectDetail> => {
    const response = await axiosInstance.patch(`/subject-details/${id}`, data);
    return response.data;
  },

  // Eliminar asignación
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/subject-details/${id}`);
  }
};
