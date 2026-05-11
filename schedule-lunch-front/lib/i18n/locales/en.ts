import type { Translations } from '../types';

export const en: Translations = {
  // Navigation
  signOut: 'Sign out',
  adminPanel: 'Admin panel',
  viewSchedule: 'View schedule',

  // Admin sidebar
  adminTitle: 'Admin',
  navUsers: 'Users',
  navGroups: 'Groups',
  navSlots: 'Slots',

  // Login
  loginTitle: 'Sign in',
  loginSubtitle: 'ScheduleLunch',
  usernamePlaceholder: 'Username',
  passwordPlaceholder: 'Password',
  signingIn: 'Signing in...',
  signIn: 'Sign in',
  noAccount: "Don't have an account?",
  registerLink: 'Sign up',
  loginError: 'Sign in error',

  // Register
  registerTitle: 'Create account',
  registerSubtitle: 'Your account will be pending approval',
  emailPlaceholder: 'Email',
  passwordConfirmPlaceholder: 'Confirm password',
  registering: 'Registering...',
  register: 'Register',
  hasAccount: 'Already have an account?',
  loginLink: 'Sign in',
  registerError: 'Registration error',

  // Setup
  setupTitle: 'Initial Setup',
  setupSubtitle: 'Create the administrator account and first group to get started.',
  administratorSection: 'Administrator',
  firstNamePlaceholder: 'First name',
  lastNamePlaceholder: 'Last name',
  usernameSectionPlaceholder: 'Username',
  passwordSetupPlaceholder: 'Password',
  confirmPasswordPlaceholder: 'Confirm password',
  firstGroupSection: 'First Group',
  groupNamePlaceholder: 'Group name',
  groupDescPlaceholder: 'Description (optional)',
  passwordMismatch: 'Passwords do not match.',
  setupError: 'Error creating administrator.',
  settingUp: 'Setting up...',
  completeSetup: 'Complete setup',

  // Pending
  pendingTitle: 'Request sent',
  pendingMessage: 'An administrator will review your request and grant you access soon.',

  // Schedule
  currentWeek: 'Current week',
  errorLoadingSlots: 'Error loading slots',
  errorUpdatingSlot: 'Error updating reservation',
  scheduleHeader: 'Schedule',
  noSlotsThisWeek: 'No slots this week.',
  noRecentActivity: 'No recent activity.',
  recentActivity: 'Recent activity',
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],

  // Activity feed (dynamic)
  activityReserved: (userName, slotLabel, attendeeCount, capacity) =>
    `${userName} reserved ${slotLabel} (${attendeeCount}/${capacity})`,
  activityCancelled: (userName, slotLabel, attendeeCount, capacity) =>
    `${userName} cancelled ${slotLabel} (${attendeeCount}/${capacity})`,
  activitySlotCreated: (slotLabel, capacity) =>
    `New slot ${slotLabel} created (cap. ${capacity})`,
  activitySlotDeleted: (slotLabel) =>
    `Slot ${slotLabel} deleted`,

  // Admin — users
  pendingApprovals: 'Pending Approvals',
  noPendingRequests: 'No pending requests.',
  userCol: 'User',
  fullNameCol: 'Full name',
  actionsCol: 'Actions',
  approve: 'Approve',
  reject: 'Reject',
  allUsers: 'All Users',
  emailCol: 'Email',
  roleCol: 'Role',

  // Admin — slots
  slotManagement: 'Slot Management',
  newSlot: 'New slot',
  slotLabelPlaceholder: 'Label (e.g.: 12:00-12:20)',
  createSlot: 'Create slot',
  deleteAction: 'Delete',
  reservationsLabel: 'reservations',

  // Admin — groups
  groupsTitle: 'Groups',
  newGroup: 'New group',
  groupNameFieldPlaceholder: 'Name',
  groupDescFieldPlaceholder: 'Description (optional)',
  createGroup: 'Create group',
};
