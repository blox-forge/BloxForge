'use strict';

(function exposeAuthProvider(global) {
  async function request(path, options = {}) {
    const response = await fetch(path, {
      ...options,
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
    });
    let payload;
    try { payload = await response.json(); } catch {
      throw new Error('Réponse invalide du serveur local.');
    }
    if (!response.ok) throw new Error(payload.error || 'La requête a échoué.');
    return payload;
  }

  global.BloxforgeAuth = Object.freeze({
    getSession: () => request('/api/session', { method: 'GET', headers: {} }),
    register: input => request('/api/auth/register', { method: 'POST', body: JSON.stringify(input) }),
    login: input => request('/api/auth/login', { method: 'POST', body: JSON.stringify(input) }),
    logout: () => request('/api/auth/logout', { method: 'POST', body: '{}' }),
    updateProfile: name => request('/api/profile', { method: 'POST', body: JSON.stringify({ name }) }),
    changePassword: (currentPassword, newPassword) => request('/api/auth/password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) }),
    completeOnboarding: input => request('/api/onboarding', { method: 'POST', body: JSON.stringify(input) }),
    becomeCreator: () => request('/api/profile/role', { method: 'POST', body: JSON.stringify({ role: 'creator' }) }),
    listCourses: () => request('/api/courses', { method: 'GET', headers: {} }),
    createCourse: input => request('/api/courses', { method: 'POST', body: JSON.stringify(input) }),
    updateCourse: (id, input) => request('/api/courses/' + encodeURIComponent(id), { method: 'PUT', body: JSON.stringify(input) }),
    deleteCourse: id => request('/api/courses/' + encodeURIComponent(id), { method: 'DELETE' })
  });
})(window);
