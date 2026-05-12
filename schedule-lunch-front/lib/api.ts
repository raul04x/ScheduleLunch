const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5133';

async function request<T>(path: string, options?: RequestInit, token?: string): Promise<T> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  const contentType = res.headers.get('content-type');
  if (res.status === 204 || !contentType?.includes('application/json')) return undefined as T;
  return res.json();
}

export const api = {
  auth: {
    login: (username: string, password: string) =>
      request<{ userId: string; username: string; token: string }>('/sch-lunch-api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
    register: (username: string, email: string, password: string, firstName: string, lastName: string) =>
      request<{ userId: string; username: string; token: string }>('/sch-lunch-api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password, firstName, lastName }),
      }),
    me: (token: string) =>
      request<import('./types').MeResponse>('/sch-lunch-api/auth/me', {}, token),
    updateProfile: (firstName: string, lastName: string, token: string) =>
      request<void>('/sch-lunch-api/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify({ firstName, lastName }),
      }, token),
  },
  schedule: {
    getWeek: (token: string, date?: string) =>
      request<import('./types').TimeSlotDto[]>(
        `/sch-lunch-api/schedule/week${date ? `?date=${date}` : ''}`, {}, token),
    reserve: (slotId: string, token: string) =>
      request<import('./types').TimeSlotDto>(`/sch-lunch-api/schedule/${slotId}/reserve`, { method: 'POST' }, token),
    cancel: (slotId: string, token: string) =>
      request<import('./types').TimeSlotDto>(`/sch-lunch-api/schedule/${slotId}/reserve`, { method: 'DELETE' }, token),
    createSlot: (dto: import('./types').CreateTimeSlotPayload, token: string) =>
      request<import('./types').TimeSlotDto>('/sch-lunch-api/schedule/slots', { method: 'POST', body: JSON.stringify(dto) }, token),
    deleteSlot: (slotId: string, token: string) =>
      request<void>(`/sch-lunch-api/schedule/slots/${slotId}`, { method: 'DELETE' }, token),
  },
  groups: {
    getAll: (token: string) =>
      request<import('./types').GroupDto[]>('/sch-lunch-api/admin/groups', {}, token),
    create: (name: string, description: string | null, token: string) =>
      request<import('./types').GroupDto>('/sch-lunch-api/admin/groups', { method: 'POST', body: JSON.stringify({ name, description }) }, token),
    delete: (id: string, token: string) =>
      request<void>(`/sch-lunch-api/admin/groups/${id}`, { method: 'DELETE' }, token),
    getMembers: (groupId: string, token: string) =>
      request<import('./types').MemberDto[]>(`/sch-lunch-api/groups/${groupId}/members`, {}, token),
    approveMember: (userId: string, token: string) =>
      request<void>(`/sch-lunch-api/groups/members/${userId}/approve`, { method: 'PATCH' }, token),
    removeMember: (userId: string, token: string) =>
      request<void>(`/sch-lunch-api/groups/members/${userId}`, { method: 'DELETE' }, token),
  },
  admin: {
    getUsers: (token: string) =>
      request<import('./types').UserAdminDto[]>('/sch-lunch-api/admin/users', {}, token),
    updateRole: (userId: string, role: import('./types').UserRole, token: string) =>
      request<void>(`/sch-lunch-api/admin/users/${userId}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }, token),
    assignGroup: (userId: string, groupId: string, token: string) =>
      request<void>(`/sch-lunch-api/admin/users/${userId}/group`, { method: 'PATCH', body: JSON.stringify({ groupId }) }, token),
  },
  setup: {
    status: (): Promise<{ setupRequired: boolean }> =>
      request<{ setupRequired: boolean }>('/sch-lunch-api/setup/status'),
    init: (data: {
      username: string;
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      groupName: string;
      groupDescription?: string;
    }): Promise<{ message: string }> =>
      request<{ message: string }>('/sch-lunch-api/setup/init', { method: 'POST', body: JSON.stringify(data) }),
  },
};
