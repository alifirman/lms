// ========================================
// LMS Client-Side Router
// ========================================

const Router = {
  currentView: 'dashboard',
  
  // Menu items per role
  menus: {
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-th-large' },
      { id: 'users', label: 'Kelola Users', icon: 'fas fa-users-cog' },
      { id: 'kelas', label: 'Kelola Kelas', icon: 'fas fa-chalkboard' },
      { id: 'monitoring', label: 'Monitoring', icon: 'fas fa-chart-bar' },
    ],
    guru: [
      { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-th-large' },
      { id: 'kelas-saya', label: 'Kelas Saya', icon: 'fas fa-chalkboard-teacher' },
      { id: 'materi', label: 'Kelola Materi', icon: 'fas fa-book-open' },
      { id: 'quiz', label: 'Kelola Quiz', icon: 'fas fa-question-circle' },
      { id: 'progress-siswa', label: 'Progress Siswa', icon: 'fas fa-chart-line' },
    ],
    siswa: [
      { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-th-large' },
      { id: 'kelas-saya', label: 'Kelas Saya', icon: 'fas fa-graduation-cap' },
      { id: 'browse-kelas', label: 'Cari Kelas', icon: 'fas fa-search' },
      { id: 'progress', label: 'Progress', icon: 'fas fa-tasks' },
      { id: 'leaderboard', label: 'Leaderboard', icon: 'fas fa-trophy' },
    ]
  },

  // Initialize router
  init() {
    const user = Auth.getUser();
    if (!user) return;
    
    this.renderSidebar(user);
    this.renderHeader(user);
    this.navigate('dashboard');
  },

  // Render sidebar
  renderSidebar(user) {
    const menuItems = this.menus[user.role] || [];
    const sidebar = document.getElementById('sidebar');
    const menuContainer = document.getElementById('sidebar-menu');
    
    if (!menuContainer) return;

    const roleColors = {
      admin: { bg: 'from-red-500/20 to-orange-500/20', border: 'border-red-500/30', text: 'text-red-400', badge: 'bg-red-500/20 text-red-300' },
      guru: { bg: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30', text: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300' },
      siswa: { bg: 'from-blue-500/20 to-indigo-500/20', border: 'border-blue-500/30', text: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-300' },
    };
    const rc = roleColors[user.role] || roleColors.siswa;

    // User profile section in sidebar
    document.getElementById('sidebar-profile').innerHTML = `
      <div class="p-5 border-b border-white/5">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-11 h-11 rounded-xl bg-gradient-to-br ${rc.bg} ${rc.border} border flex items-center justify-center font-bold ${rc.text} text-sm">
            ${Auth.getInitials(user.nama)}
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-white text-sm truncate">${user.nama}</p>
            <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${rc.badge}">${user.role}</span>
          </div>
        </div>
      </div>
    `;

    // Menu items
    menuContainer.innerHTML = menuItems.map(item => `
      <button onclick="Router.navigate('${item.id}')" 
        id="menu-${item.id}"
        class="menu-item group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200">
        <i class="${item.icon} w-5 text-center text-sm opacity-60 group-hover:opacity-100"></i>
        <span class="text-sm font-medium">${item.label}</span>
      </button>
    `).join('');
  },

  // Render header
  renderHeader(user) {
    const header = document.getElementById('header-content');
    if (!header) return;

    header.innerHTML = `
      <div class="flex items-center gap-3">
        <button onclick="Router.toggleSidebar()" class="lg:hidden p-2 rounded-lg hover:bg-white/5 text-slate-400">
          <i class="fas fa-bars text-lg"></i>
        </button>
        <div>
          <h1 id="page-title" class="text-lg font-bold text-white">Dashboard</h1>
          <p id="page-subtitle" class="text-xs text-slate-500">Selamat datang, ${user.nama}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span class="text-xs text-slate-400">${CONFIG.DEMO_MODE ? 'Demo Mode' : 'Online'}</span>
        </div>
        <button onclick="Auth.logout()" class="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-slate-400 hover:text-red-400 transition-all duration-200">
          <i class="fas fa-sign-out-alt text-sm"></i>
          <span class="hidden sm:inline text-xs font-medium">Keluar</span>
        </button>
      </div>
    `;
  },

  // Toggle sidebar on mobile
  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
  },

  // Navigate to view
  async navigate(viewId, params = {}) {
    this.currentView = viewId;
    const content = document.getElementById('main-content');
    const user = Auth.getUser();

    // Update active menu
    document.querySelectorAll('.menu-item').forEach(el => {
      el.classList.remove('bg-white/10', 'text-white', '!opacity-100');
      el.classList.add('text-slate-400');
    });
    const activeMenu = document.getElementById(`menu-${viewId}`);
    if (activeMenu) {
      activeMenu.classList.add('bg-white/10', 'text-white', '!opacity-100');
      activeMenu.classList.remove('text-slate-400');
    }

    // Close mobile sidebar
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar && window.innerWidth < 1024) {
      sidebar.classList.add('-translate-x-full');
      overlay.classList.add('hidden');
    }

    // Show loading
    content.innerHTML = `
      <div class="flex items-center justify-center h-64">
        <div class="flex flex-col items-center gap-3">
          <div class="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <span class="text-sm text-slate-500">Memuat...</span>
        </div>
      </div>
    `;

    // Small delay for smooth transition
    await new Promise(r => setTimeout(r, 150));

    // Route to view
    try {
      switch (user.role) {
        case 'admin':
          await AdminDashboard.render(viewId, content, params);
          break;
        case 'guru':
          await GuruDashboard.render(viewId, content, params);
          break;
        case 'siswa':
          await SiswaDashboard.render(viewId, content, params);
          break;
      }

      // Update page title
      const menuItems = this.menus[user.role] || [];
      const menuItem = menuItems.find(m => m.id === viewId);
      if (menuItem) {
        document.getElementById('page-title').textContent = menuItem.label;
      }
    } catch (err) {
      content.innerHTML = `
        <div class="flex flex-col items-center justify-center h-64 gap-4">
          <div class="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <i class="fas fa-exclamation-triangle text-2xl text-red-400"></i>
          </div>
          <p class="text-red-400 font-medium">Terjadi kesalahan</p>
          <p class="text-sm text-slate-500">${err.message}</p>
          <button onclick="Router.navigate('dashboard')" class="px-4 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 text-sm">
            Kembali ke Dashboard
          </button>
        </div>
      `;
    }
  }
};
