export type Locale = 'es' | 'en';

export interface Translations {
  // Navigation
  signOut: string;
  adminPanel: string;
  viewSchedule: string;

  // Admin sidebar
  adminTitle: string;
  navUsers: string;
  navGroups: string;
  navSlots: string;

  // Login
  loginTitle: string;
  loginSubtitle: string;
  usernamePlaceholder: string;
  passwordPlaceholder: string;
  signingIn: string;
  signIn: string;
  noAccount: string;
  registerLink: string;
  loginError: string;

  // Register
  registerTitle: string;
  registerSubtitle: string;
  emailPlaceholder: string;
  passwordConfirmPlaceholder: string;
  registering: string;
  register: string;
  hasAccount: string;
  loginLink: string;
  registerError: string;

  // Setup
  setupTitle: string;
  setupSubtitle: string;
  administratorSection: string;
  firstNamePlaceholder: string;
  lastNamePlaceholder: string;
  usernameSectionPlaceholder: string;
  passwordSetupPlaceholder: string;
  confirmPasswordPlaceholder: string;
  firstGroupSection: string;
  groupNamePlaceholder: string;
  groupDescPlaceholder: string;
  passwordMismatch: string;
  setupError: string;
  settingUp: string;
  completeSetup: string;

  // Pending
  pendingTitle: string;
  pendingMessage: string;

  // Common
  tagline: string;
  settingLanguage: string;
  settingTheme: string;
  switchToLight: string;
  switchToDark: string;

  // Schedule
  currentWeek: string;
  errorLoadingSlots: string;
  errorUpdatingSlot: string;
  scheduleHeader: string;
  noSlotsThisWeek: string;
  noRecentActivity: string;
  recentActivity: string;
  today: string;
  slotReserved: string;
  slotFull: string;
  slotAvailable: string;
  days: [string, string, string, string, string];

  // Mobile navigation
  navMore: string;
  reserveSlot: string;
  cancelSlot: string;
  scheduleNav: string;

  // Activity feed (dynamic)
  activityReserved: (userName: string, slotLabel: string, attendeeCount: number, capacity: number) => string;
  activityCancelled: (userName: string, slotLabel: string, attendeeCount: number, capacity: number) => string;
  activitySlotCreated: (slotLabel: string, capacity: number) => string;
  activitySlotDeleted: (slotLabel: string) => string;

  // Admin — users
  pendingApprovals: string;
  noPendingRequests: string;
  userCol: string;
  fullNameCol: string;
  actionsCol: string;
  approve: string;
  reject: string;
  allUsers: string;
  emailCol: string;
  roleCol: string;
  groupCol: string;
  noGroup: string;
  statusPending: string;

  // Admin — groups members
  membersSection: string;
  noMembers: string;
  addMember: string;
  selectUserPlaceholder: string;
  removeFromGroup: string;
  viewMembers: string;
  hideMembers: string;

  // Admin — slots
  slotManagement: string;
  newSlot: string;
  slotLabelPlaceholder: string;
  createSlot: string;
  deleteAction: string;
  reservationsLabel: string;
  capacityAbbr: string;

  // Admin — groups
  groupsTitle: string;
  newGroup: string;
  groupNameFieldPlaceholder: string;
  groupDescFieldPlaceholder: string;
  createGroup: string;

  // Password strength
  passwordStrengthWeak: string;
  passwordStrengthFair: string;
  passwordStrengthGood: string;
  passwordStrengthStrong: string;
  passwordReqLength: string;
  passwordReqUppercase: string;
  passwordReqLowercase: string;
  passwordReqNumber: string;
  passwordReqSpecial: string;
}
