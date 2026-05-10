const TOKEN_KEY = 'sl_token';

export function saveToken(token: string) {
  if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
}

export function decodeToken(token: string): {
  sub: string; name: string; role: string; groupId?: string
} | null {
  try {
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));
    return {
      sub: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
      name: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
      groupId: payload['groupId'],
    };
  } catch {
    return null;
  }
}
