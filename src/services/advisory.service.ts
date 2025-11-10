import { apiClient } from './api.client';
import type { 
  AdvisoryRequest,
  Advisory,
  StudentInvitation
} from '../types/backend.types';
import { RequestStatus, AdvisoryStatus } from '../types/backend.types';

// DTOs para crear solicitudes y sesiones
export interface CreateAdvisoryRequestDto {
  studentId: string;
  professorId: string;
  subjectId: string;
  message: string;
  preferredDateTime: string;
}

export interface CreateDirectSessionDto {
  professorId: string;
  subjectId: string;
  dateTime: string;
  duration: number;
  venue: string;
  topic: string;
  maxStudents: number;
}

export interface ApproveRequestDto {
  response: string;
  proposedDateTime?: string;
}

export interface RejectRequestDto {
  reason: string;
}

class AdvisoryService {
  // ===== SOLICITUDES DE ASESORÍA =====
  
  async createRequest(data: CreateAdvisoryRequestDto): Promise<AdvisoryRequest> {
    const response = await apiClient.post<AdvisoryRequest>('/advisory-requests', data);
    return response;
  }

  async getMyRequests(): Promise<AdvisoryRequest[]> {
    const response = await apiClient.get<AdvisoryRequest[]>('/advisory-requests/my-requests');
    return response;
  }

  async getPendingRequests(): Promise<AdvisoryRequest[]> {
    const response = await apiClient.get<AdvisoryRequest[]>('/advisory-requests/pending');
    return response;
  }

  async getRequestById(requestId: string): Promise<AdvisoryRequest> {
    const response = await apiClient.get<AdvisoryRequest>(`/advisory-requests/${requestId}`);
    return response;
  }

  async approveRequest(requestId: string, data: ApproveRequestDto): Promise<AdvisoryRequest> {
    const response = await apiClient.patch<AdvisoryRequest>(
      `/advisory-requests/${requestId}/approve`,
      data
    );
    return response;
  }

  async rejectRequest(requestId: string, data: RejectRequestDto): Promise<AdvisoryRequest> {
    const response = await apiClient.patch<AdvisoryRequest>(
      `/advisory-requests/${requestId}/reject`,
      data
    );
    return response;
  }

  async cancelRequest(requestId: string): Promise<AdvisoryRequest> {
    const response = await apiClient.patch<AdvisoryRequest>(
      `/advisory-requests/${requestId}/cancel`
    );
    return response;
  }

  // ===== SESIONES DE ASESORÍA =====

  async createDirectSession(data: CreateDirectSessionDto): Promise<Advisory> {
    const response = await apiClient.post<Advisory>('/advisories/direct-session', data);
    return response;
  }

  async getProfessorAdvisories(professorId: string): Promise<Advisory[]> {
    const response = await apiClient.get<Advisory[]>(`/advisories/professor/${professorId}`);
    return response;
  }

  async getMyAdvisories(): Promise<Advisory[]> {
    const response = await apiClient.get<Advisory[]>('/advisories/my-advisories');
    return response;
  }

  async getStudentAdvisories(): Promise<Advisory[]> {
    const response = await apiClient.get<Advisory[]>('/advisories/student/my-advisories');
    return response;
  }

  async getAdvisoryById(advisoryId: string): Promise<Advisory> {
    const response = await apiClient.get<Advisory>(`/advisories/${advisoryId}`);
    return response;
  }

  async updateAdvisory(advisoryId: string, updates: Partial<Advisory>): Promise<Advisory> {
    const response = await apiClient.patch<Advisory>(`/advisories/${advisoryId}`, updates);
    return response;
  }

  async cancelAdvisory(advisoryId: string, reason?: string): Promise<Advisory> {
    const response = await apiClient.patch<Advisory>(`/advisories/${advisoryId}/cancel`, {
      reason,
    });
    return response;
  }

  async completeAdvisory(advisoryId: string, notes?: string): Promise<Advisory> {
    const response = await apiClient.patch<Advisory>(`/advisories/${advisoryId}/complete`, {
      notes,
    });
    return response;
  }

  // ===== INVITACIONES =====

  async inviteStudentsToSession(
    advisoryId: string,
    studentIds: string[],
    message?: string
  ): Promise<StudentInvitation[]> {
    const response = await apiClient.post<StudentInvitation[]>(
      `/advisories/${advisoryId}/invite`,
      { studentIds, message }
    );
    return response;
  }

  async getMyInvitations(): Promise<StudentInvitation[]> {
    const response = await apiClient.get<StudentInvitation[]>('/student-invitations/my-invitations');
    return response;
  }

  async respondToInvitation(
    invitationId: string,
    response: 'accept' | 'decline',
    message?: string
  ): Promise<StudentInvitation> {
    const res = await apiClient.post<StudentInvitation>(
      `/student-invitations/${invitationId}/respond`,
      { response, message }
    );
    return res;
  }

  async acceptInvitation(invitationId: string, message?: string): Promise<StudentInvitation> {
    return this.respondToInvitation(invitationId, 'accept', message);
  }

  async declineInvitation(invitationId: string, message?: string): Promise<StudentInvitation> {
    return this.respondToInvitation(invitationId, 'decline', message);
  }

  // ===== UTILITY METHODS =====

  // Filtrar solicitudes por estado
  filterRequestsByStatus(requests: AdvisoryRequest[], status: RequestStatus): AdvisoryRequest[] {
    return requests.filter(request => request.status === status);
  }

  // Filtrar asesorías por estado
  filterAdvisoriesByStatus(advisories: Advisory[], status: AdvisoryStatus): Advisory[] {
    return advisories.filter(advisory => advisory.status === status);
  }

  // Obtener solicitudes pendientes (helper)
  async getPendingRequestsCount(): Promise<number> {
    const requests = await this.getPendingRequests();
    return requests.length;
  }

  // Obtener próximas sesiones (helper)
  async getUpcomingSessions(limit = 5): Promise<Advisory[]> {
    const sessions = await this.getMyAdvisories();
    // Note: Necesitaremos acceder a advisory_dates para obtener las fechas
    // Este es un ejemplo simplificado que puede necesitar ajustes según el API real
    return sessions.slice(0, limit);
  }

  // Verificar si una sesión puede ser modificada
  canModifySession(advisory: Advisory): boolean {
    // Esta lógica necesitará ajustarse según cómo el backend maneja las fechas
    // Por ahora devolvemos true como placeholder
    return advisory.status === AdvisoryStatus.ACTIVE;
  }

  // Verificar si una solicitud puede ser cancelada
  canCancelRequest(request: AdvisoryRequest): boolean {
    return request.status === RequestStatus.PENDING;
  }

  // Formatear fecha para mostrar (helper genérico)
  formatDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

export const advisoryService = new AdvisoryService();