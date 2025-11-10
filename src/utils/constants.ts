import { UserRole, RequestStatus, AdvisoryStatus, InvitationStatus, AttendanceStatus } from '../types/backend.types';

// ===== USER ROLES =====
export const USER_ROLES = {
  STUDENT: UserRole.STUDENT,
  PROFESSOR: UserRole.PROFESSOR,  
  ADMIN: UserRole.ADMIN,
} as const;

// ===== REQUEST STATUS =====
export const REQUEST_STATUS = {
  PENDING: RequestStatus.PENDING,
  APPROVED: RequestStatus.APPROVED,
  REJECTED: RequestStatus.REJECTED,
  CANCELLED: RequestStatus.CANCELLED,
} as const;

// ===== ADVISORY STATUS =====
export const ADVISORY_STATUS = {
  ACTIVE: AdvisoryStatus.ACTIVE,
  INACTIVE: AdvisoryStatus.INACTIVE,
  COMPLETED: AdvisoryStatus.COMPLETED,
  CANCELLED: AdvisoryStatus.CANCELLED,
} as const;

// ===== INVITATION STATUS =====
export const INVITATION_STATUS = {
  PENDING: InvitationStatus.PENDING,
  ACCEPTED: InvitationStatus.ACCEPTED,
  DECLINED: InvitationStatus.DECLINED,
  EXPIRED: InvitationStatus.EXPIRED,
} as const;

// ===== ATTENDANCE STATUS =====
export const ATTENDANCE_STATUS = {
  PRESENT: AttendanceStatus.PRESENT,
  ABSENT: AttendanceStatus.ABSENT,
  LATE: AttendanceStatus.LATE,
} as const;

// ===== NAVIGATION ITEMS =====
export const NAVIGATION_ITEMS = {
  STUDENT: [
    { label: 'Dashboard', path: '/dashboard', icon: 'Dashboard' },
    { label: 'Request Advisory', path: '/request-advisory', icon: 'Add' },
    { label: 'My Requests', path: '/my-requests', icon: 'Assignment' },
    { label: 'My Sessions', path: '/my-sessions', icon: 'Event' },
    { label: 'Invitations', path: '/invitations', icon: 'Mail' },
  ],
  PROFESSOR: [
    { label: 'Dashboard', path: '/dashboard', icon: 'Dashboard' },
    { label: 'Pending Requests', path: '/pending-requests', icon: 'Pending' },
    { label: 'My Sessions', path: '/professor-sessions', icon: 'Event' },
    { label: 'Create Session', path: '/create-session', icon: 'Add' },
    { label: 'My Availability', path: '/availability', icon: 'Schedule' },
    { label: 'My Subjects', path: '/subjects', icon: 'Book' },
  ],
  ADMIN: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'Dashboard' },
    { label: 'Users', path: '/admin/users', icon: 'People' },
    { label: 'Subjects', path: '/admin/subjects', icon: 'Book' },
    { label: 'Venues', path: '/admin/venues', icon: 'Room' },
    { label: 'Reports', path: '/admin/reports', icon: 'Analytics' },
    { label: 'System Config', path: '/admin/config', icon: 'Settings' },
  ],
} as const;

// ===== STATUS COLORS FOR UI =====
export const REQUEST_STATUS_COLORS = {
  [REQUEST_STATUS.PENDING]: 'warning',
  [REQUEST_STATUS.APPROVED]: 'success', 
  [REQUEST_STATUS.REJECTED]: 'error',
  [REQUEST_STATUS.CANCELLED]: 'default',
} as const;

export const ADVISORY_STATUS_COLORS = {
  [ADVISORY_STATUS.ACTIVE]: 'info',
  [ADVISORY_STATUS.INACTIVE]: 'default',
  [ADVISORY_STATUS.COMPLETED]: 'success',
  [ADVISORY_STATUS.CANCELLED]: 'error',
} as const;

export const INVITATION_STATUS_COLORS = {
  [INVITATION_STATUS.PENDING]: 'warning',
  [INVITATION_STATUS.ACCEPTED]: 'success',
  [INVITATION_STATUS.DECLINED]: 'error', 
  [INVITATION_STATUS.EXPIRED]: 'default',
} as const;

export const ATTENDANCE_STATUS_COLORS = {
  [ATTENDANCE_STATUS.PRESENT]: 'success',
  [ATTENDANCE_STATUS.ABSENT]: 'error',
  [ATTENDANCE_STATUS.LATE]: 'warning',
} as const;

// ===== API ENDPOINTS =====
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh', 
    PROFILE: '/auth/profile',
    LOGOUT: '/auth/logout',
  },
  ADVISORY_REQUESTS: {
    CREATE: '/advisory-requests',
    MY_REQUESTS: '/advisory-requests/my-requests',
    PENDING: '/advisory-requests/pending',
    BY_ID: (id: string) => `/advisory-requests/${id}`,
    APPROVE: (id: string) => `/advisory-requests/${id}/approve`,
    REJECT: (id: string) => `/advisory-requests/${id}/reject`,
    CANCEL: (id: string) => `/advisory-requests/${id}/cancel`,
  },
  ADVISORIES: {
    DIRECT_SESSION: '/advisories/direct-session',
    MY_ADVISORIES: '/advisories/my-advisories',
    BY_ID: (id: string) => `/advisories/${id}`,
    PROFESSOR: (id: string) => `/advisories/professor/${id}`,
    STUDENT_SESSIONS: '/advisories/student/my-advisories',
    CANCEL: (id: string) => `/advisories/${id}/cancel`,
    COMPLETE: (id: string) => `/advisories/${id}/complete`,
    INVITE: (id: string) => `/advisories/${id}/invite`,
  },
  INVITATIONS: {
    MY_INVITATIONS: '/student-invitations/my-invitations',
    RESPOND: (id: string) => `/student-invitations/${id}/respond`,
  },
  USERS: {
    BY_ROLE: (role: string) => `/users/role/${role}`,
    STUDENTS: '/users/role/student',
    PROFESSORS: '/users/role/professor',
    ADMINS: '/users/role/admin',
  },
  SUBJECTS: {
    ALL: '/subjects',
    BY_ID: (id: string) => `/subjects/${id}`,
    PROFESSOR_SUBJECTS: (professorId: string) => `/subjects/professor/${professorId}`,
  },
  AVAILABILITY: {
    MY_AVAILABILITY: '/professor-availability/my-availability',
    SLOTS: '/professor-availability/slots',
    BY_PROFESSOR: (professorId: string) => `/professor-availability/professor/${professorId}`,
  },
} as const;

// ===== PERMISSIONS =====
export const PERMISSIONS = {
  // Student permissions
  REQUEST_ADVISORY: 'request_advisory',
  VIEW_MY_REQUESTS: 'view_my_requests',
  VIEW_MY_SESSIONS: 'view_my_sessions',
  RESPOND_INVITATIONS: 'respond_invitations',

  // Professor permissions  
  MANAGE_REQUESTS: 'manage_requests',
  CREATE_SESSIONS: 'create_sessions',
  MANAGE_AVAILABILITY: 'manage_availability',
  INVITE_STUDENTS: 'invite_students',
  MANAGE_ATTENDANCE: 'manage_attendance',

  // Admin permissions
  MANAGE_USERS: 'manage_users',
  MANAGE_SUBJECTS: 'manage_subjects',
  MANAGE_VENUES: 'manage_venues',
  VIEW_REPORTS: 'view_reports',
  SYSTEM_CONFIG: 'system_config',
} as const;

// ===== UI CONFIGURATION =====
export const UI_CONFIG = {
  DRAWER_WIDTH: 280,
  NAVBAR_HEIGHT: 64,
  MAX_CONTENT_WIDTH: 1200,
  DEFAULT_PAGE_SIZE: 25,
  
  // Breakpoints (matching MUI defaults)
  BREAKPOINTS: {
    XS: 0,
    SM: 600,
    MD: 900,
    LG: 1200,
    XL: 1536,
  },

  // Common spacing values
  SPACING: {
    XS: 8,
    SM: 16,
    MD: 24,
    LG: 32,
    XL: 48,
  },
} as const;

// ===== TIME CONFIGURATION =====
export const TIME_CONFIG = {
  // Horarios de trabajo (formato 24h)
  WORK_HOURS_START: '08:00',
  WORK_HOURS_END: '18:00',
  
  // Duraciones en minutos
  DEFAULT_SESSION_DURATION: 60,
  MIN_SESSION_DURATION: 30,
  MAX_SESSION_DURATION: 120,
  
  // Límites de tiempo
  MIN_ADVANCE_BOOKING_HOURS: 24, // Mínimo 24h de anticipación
  MAX_ADVANCE_BOOKING_DAYS: 30,  // Máximo 30 días de anticipación
  
  // Recordatorios
  REMINDER_TIMES: {
    '24h': '24 hours before',
    '2h': '2 hours before', 
    '30m': '30 minutes before',
  },
} as const;

// ===== ERROR MESSAGES =====
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. Insufficient permissions.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  
  // Specific errors
  LOGIN_FAILED: 'Invalid email or password.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  REQUEST_ALREADY_EXISTS: 'You already have a pending request for this subject.',
  PROFESSOR_NOT_AVAILABLE: 'Professor is not available at the selected time.',
  SESSION_FULL: 'This session is already at maximum capacity.',
  CANNOT_MODIFY_PAST_SESSION: 'Cannot modify sessions that have already occurred.',
} as const;

// ===== SUCCESS MESSAGES =====
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back!',
  LOGOUT_SUCCESS: 'You have been logged out successfully.',
  REQUEST_SUBMITTED: 'Your advisory request has been submitted successfully.',
  REQUEST_APPROVED: 'Advisory request has been approved.',
  REQUEST_REJECTED: 'Advisory request has been rejected.',
  SESSION_CREATED: 'Session has been created successfully.',
  INVITATION_SENT: 'Invitations have been sent successfully.',
  INVITATION_ACCEPTED: 'Invitation accepted successfully.',
  INVITATION_DECLINED: 'Invitation declined.',
  ATTENDANCE_RECORDED: 'Attendance has been recorded successfully.',
} as const;

// ===== VALIDATION RULES =====
export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'Please enter a valid email address.',
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MESSAGE: 'Password must be at least 8 characters long.',
  },
  MESSAGE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 500,
    MIN_MESSAGE: 'Message must be at least 10 characters long.',
    MAX_MESSAGE: 'Message cannot exceed 500 characters.',
  },
  SUBJECT: {
    REQUIRED: 'Subject selection is required.',
  },
  PROFESSOR: {
    REQUIRED: 'Professor selection is required.',
  },
} as const;

// ===== DEFAULTS =====
export const DEFAULTS = {
  AVATAR_SIZE: 40,
  CARD_ELEVATION: 2,
  MODAL_MAX_WIDTH: 'sm' as const,
  NOTIFICATION_DURATION: 5000, // 5 seconds
  DEBOUNCE_DELAY: 300, // milliseconds
} as const;