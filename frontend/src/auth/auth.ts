import api from '../api/client';

type TokenResponse = {
    access: string;
    refresh: string;
};

export async function login(username: string, password: string): Promise<void> {
    const res = await api.post<TokenResponse>('auth/token/', { username, password });

    localStorage.setItem('accessToken', res.data.access);
    localStorage.setItem('refreshToken', res.data.refresh);
}

export function logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
}

export function isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
}
