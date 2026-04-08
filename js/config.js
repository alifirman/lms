// ========================================
// LMS Configuration
// ========================================

const CONFIG = {
  // Ganti URL ini dengan URL Web App Google Apps Script Anda
  API_URL: 'https://script.google.com/macros/s/AKfycbzqSgisKF1mO_VskOB1FYNeCpKI2UjuMo_qulko_MC1uHCOKEVr5SCvTOoXKRH014uM/exec',
  
  // App Info
  APP_NAME: 'EduFlow LMS',
  APP_VERSION: '1.0.0',
  APP_TAGLINE: 'Platform Pembelajaran Modern',

  // Demo mode - gunakan data lokal jika API belum dikonfigurasi
  DEMO_MODE: false,

  // Session key
  SESSION_KEY: 'eduflow_user',
  
  // Roles
  ROLES: {
    ADMIN: 'admin',
    GURU: 'guru', 
    SISWA: 'siswa'
  }
};
