// ========================================
// LMS Authentication
// ========================================

const Auth = {
  // Login
  async login(username, password) {
    const result = await API.get('login', { username, password });
    if (result.success) {
      localStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(result.data));
    }
    return result;
  },

  // Logout
  logout() {
    localStorage.removeItem(CONFIG.SESSION_KEY);
    window.location.href = 'index.html';
  },

  // Get current user
  getUser() {
    const data = localStorage.getItem(CONFIG.SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },

  // Check if logged in
  isLoggedIn() {
    return this.getUser() !== null;
  },

  // Get role
  getRole() {
    const user = this.getUser();
    return user ? user.role : null;
  },

  // Check role
  isAdmin() { return this.getRole() === CONFIG.ROLES.ADMIN; },
  isGuru() { return this.getRole() === CONFIG.ROLES.GURU; },
  isSiswa() { return this.getRole() === CONFIG.ROLES.SISWA; },

  // Require login (redirect if not)
  requireLogin() {
    if (!this.isLoggedIn()) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  },

  // Get initials for avatar
  getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);
  }
};
