import type { Translations } from '../types';

export const es: Translations = {
  // Navigation
  signOut: 'Salir',
  adminPanel: 'Panel admin',
  viewSchedule: 'Ver horario',

  // Admin sidebar
  adminTitle: 'Admin',
  navUsers: 'Usuarios',
  navGroups: 'Grupos',
  navSlots: 'Slots',

  // Common
  tagline: 'Reserva tu mesa',
  settingLanguage: 'Idioma',
  settingTheme: 'Tema',
  switchToLight: 'Cambiar a modo claro',
  switchToDark: 'Cambiar a modo oscuro',

  // Login
  loginTitle: 'Iniciar sesión',
  loginSubtitle: 'ScheduleLunch',
  usernamePlaceholder: 'Usuario',
  passwordPlaceholder: 'Contraseña',
  signingIn: 'Ingresando...',
  signIn: 'Ingresar',
  noAccount: '¿No tienes cuenta?',
  registerLink: 'Regístrate',
  loginError: 'Error al iniciar sesión',

  // Register
  registerTitle: 'Crear cuenta',
  registerSubtitle: 'Tu cuenta quedará pendiente de aprobación',
  emailPlaceholder: 'Email',
  passwordConfirmPlaceholder: 'Confirmar contraseña',
  registering: 'Registrando...',
  register: 'Registrarse',
  hasAccount: '¿Ya tienes cuenta?',
  loginLink: 'Inicia sesión',
  registerError: 'Error al registrarse',

  // Setup
  setupTitle: 'Configuración inicial',
  setupSubtitle: 'Crea la cuenta de administrador y el primer grupo para comenzar.',
  administratorSection: 'Administrador',
  firstNamePlaceholder: 'Nombre',
  lastNamePlaceholder: 'Apellido',
  usernameSectionPlaceholder: 'Usuario',
  passwordSetupPlaceholder: 'Contraseña',
  confirmPasswordPlaceholder: 'Confirmar contraseña',
  firstGroupSection: 'Primer grupo',
  groupNamePlaceholder: 'Nombre del grupo',
  groupDescPlaceholder: 'Descripción (opcional)',
  passwordMismatch: 'Las contraseñas no coinciden.',
  setupError: 'Error al crear el administrador.',
  settingUp: 'Configurando...',
  completeSetup: 'Completar configuración',

  // Pending
  pendingTitle: 'Solicitud enviada',
  pendingMessage: 'Un administrador revisará tu solicitud y te dará acceso pronto.',

  // Schedule
  currentWeek: 'Semana actual',
  errorLoadingSlots: 'Error cargando slots',
  errorUpdatingSlot: 'Error al actualizar reserva',
  scheduleHeader: 'Horario',
  noSlotsThisWeek: 'No hay slots esta semana.',
  noRecentActivity: 'Sin actividad reciente.',
  recentActivity: 'Actividad reciente',
  today: 'Hoy',
  slotReserved: 'Reservado',
  slotFull: 'Lleno',
  slotAvailable: 'Disponible',
  days: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'],

  // Mobile navigation
  navMore: 'Más',
  reserveSlot: 'Reservar',
  cancelSlot: 'Cancelar reserva',
  scheduleNav: 'Horario',

  // Activity feed (dynamic)
  activityReserved: (userName, slotLabel, attendeeCount, capacity) =>
    `${userName} reservó ${slotLabel} (${attendeeCount}/${capacity})`,
  activityCancelled: (userName, slotLabel, attendeeCount, capacity) =>
    `${userName} canceló ${slotLabel} (${attendeeCount}/${capacity})`,
  activitySlotCreated: (slotLabel, capacity) =>
    `Nuevo slot ${slotLabel} creado (cap. ${capacity})`,
  activitySlotDeleted: (slotLabel) =>
    `Slot ${slotLabel} eliminado`,

  // Admin — users
  pendingApprovals: 'Aprobaciones pendientes',
  noPendingRequests: 'No hay solicitudes pendientes.',
  userCol: 'Usuario',
  fullNameCol: 'Nombre completo',
  actionsCol: 'Acciones',
  approve: 'Aprobar',
  reject: 'Rechazar',
  allUsers: 'Todos los usuarios',
  emailCol: 'Email',
  roleCol: 'Rol',
  groupCol: 'Grupo',
  noGroup: 'Sin grupo',
  statusPending: 'Pendiente',

  // Admin — groups members
  membersSection: 'Miembros',
  noMembers: 'Sin miembros',
  addMember: 'Añadir miembro',
  selectUserPlaceholder: 'Seleccionar usuario...',
  removeFromGroup: 'Quitar',
  viewMembers: 'Ver miembros',
  hideMembers: 'Ocultar',

  // Admin — slots
  slotManagement: 'Gestión de Slots',
  newSlot: 'Nuevo slot',
  slotLabelPlaceholder: 'Etiqueta (ej: 12:00-12:20)',
  createSlot: 'Crear slot',
  deleteAction: 'Eliminar',
  reservationsLabel: 'reservas',
  capacityAbbr: 'cap.',

  // Admin — groups
  groupsTitle: 'Grupos',
  newGroup: 'Nuevo grupo',
  groupNameFieldPlaceholder: 'Nombre',
  groupDescFieldPlaceholder: 'Descripción (opcional)',
  createGroup: 'Crear grupo',

  // Success toasts
  toastSlotCreated: 'Slot creado',
  toastGroupCreated: 'Grupo creado',
  toastUserApproved: 'Usuario aprobado',

  // Common actions
  cancel: 'Cancelar',
  confirmDeleteTitle: '¿Estás seguro?',
  confirmDeleteMessage: 'Esta acción no se puede deshacer.',
  timeRangeError: 'La hora de fin debe ser posterior a la de inicio.',
  errorGeneric: 'Algo salió mal. Inténtalo de nuevo.',

  // Profile
  navProfile: 'Perfil',
  profileTitle: 'Mi perfil',
  accountSection: 'Cuenta',
  saveChanges: 'Guardar cambios',
  savingProfile: 'Guardando...',
  profileSaved: 'Perfil guardado',
  profileSaveError: 'Error al guardar el perfil',

  // Password strength
  passwordStrengthWeak: 'Débil',
  passwordStrengthFair: 'Regular',
  passwordStrengthGood: 'Buena',
  passwordStrengthStrong: 'Fuerte',
  passwordReqLength: 'Mínimo 8 caracteres',
  passwordReqUppercase: 'Una mayúscula',
  passwordReqLowercase: 'Una minúscula',
  passwordReqNumber: 'Un número',
  passwordReqSpecial: 'Un carácter especial',
};
