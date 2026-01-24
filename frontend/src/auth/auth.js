import api from '../api/client';

export async function login(username, password) {
    const res = await api.post('auth/token/', { username, password });

    localStorage.setItem('accessToken', res.data.access);
    localStorage.setItem('refreshToken', res.data.refresh);
}

export function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
}

export function isAuthenticated() {
    return !!localStorage.getItem('accessToken');
}
