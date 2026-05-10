export type UserRole = 'User' | 'GroupAdmin' | 'SuperAdmin';
export type MembershipStatus = 'Pending' | 'Approved' | 'None';

export interface AuthResponse {
  userId: string;
  username: string;
  token: string;
}

export interface MeResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  groupId: string | null;
  membershipStatus: MembershipStatus;
}

export interface AttendeeDto {
  userId: string;
  username: string;
  fullName: string;
}

export interface TimeSlotDto {
  id: string;
  groupId: string;
  date: string;
  label: string;
  startTime: string;
  endTime: string;
  capacity: number;
  attendeeCount: number;
  isReservedByCurrentUser: boolean;
  attendees: AttendeeDto[];
}

export interface GroupDto {
  id: string;
  name: string;
  description: string | null;
}

export interface MemberDto {
  userId: string;
  username: string;
  fullName: string;
  status: 'Pending' | 'Approved';
  role: 'Member' | 'Admin';
}

export interface UserAdminDto {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface ActivityEvent {
  userName: string;
  slotLabel: string;
  date: string;
  attendeeCount: number;
  capacity: number;
  type: 'UserReserved' | 'UserCancelled' | 'SlotCreated' | 'SlotDeleted';
}

export interface CreateTimeSlotPayload {
  date: string;
  label: string;
  startTime: string;
  endTime: string;
  capacity: number;
}
