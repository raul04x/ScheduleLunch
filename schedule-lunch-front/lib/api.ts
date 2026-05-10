const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5133';

async function request<T>(path: string, options?: RequestInit, token?: string): Promise<T> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  auth: {
    login: (username: string, password: string) =>
      request<{ userId: string; username: string; token: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
    register: (username: string, email: string, password: string) =>
      request<{ userId: string; username: string; token: string }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      }),
    me: (token: string) =>
      request<import('./types').MeResponse>('/api/auth/me', {}, token),
  },
  schedule: {
    getWeek: (token: string) =>
      request<import('./types').TimeSlotDto[]>('/api/schedule/week', {}, token),
    reserve: (slotId: string, token: string) =>
      request<import('./types').TimeSlotDto>(`/api/schedule/${slotId}/reserve`, { method: 'POST' }, token),
    cancel: (slotId: string, token: string) =>
      request<import('./types').TimeSlotDto>(`/api/schedule/${slotId}/reserve`, { method: 'DELETE' }, token),
    createSlot: (dto: import('./types').CreateTimeSlotPayload, token: string) =>
      request<import('./types').TimeSlotDto>('/api/schedule/slots', { method: 'POST', body: JSON.stringify(dto) }, token),
    deleteSlot: (slotId: string, token: string) =>
      request<void>(`/api/schedule/slots/${slotId}`, { method: 'DELETE' }, token),
  },
  groups: {
    getAll: (token: string) =>
      request<import('./types').GroupDto[]>('/api/admin/groups', {}, token),
    create: (name: string, description: string | null, token: string) =>
      request<import('./types').GroupDto>('/api/admin/groups', { method: 'POST', body: JSON.stringify({ name, description }) }, token),
    delete: (id: string, token: string) =>
      request<void>(`/api/admin/groups/${id}`, { method: 'DELETE' }, token),
    getMembers: (groupId: string, token: string) =>
      request<import('./types').MemberDto[]>(`/api/groups/${groupId}/members`, {}, token),
    approveMember: (userId: string, token: string) =>
      request<void>(`/api/groups/members/${userId}/approve`, { method: 'PATCH' }, token),
    removeMember: (userId: string, token: string) =>
      request<void>(`/api/groups/members/${userId}`, { method: 'DELETE' }, token),
  },
  admin: {
    getUsers: (token: string) =>
      request<import('./types').UserAdminDto[]>('/api/admin/users', {}, token),
    updateRole: (userId: string, role: import('./types').UserRole, token: string) =>
      request<void>(`/api/admin/users/${userId}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }, token),
  },
};
