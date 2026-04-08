// ========================================
// Admin Dashboard Module
// ========================================

const AdminDashboard = {
  async render(viewId, container, params) {
    switch (viewId) {
      case 'dashboard': return this.renderDashboard(container);
      case 'users': return this.renderUsers(container);
      case 'kelas': return this.renderKelas(container);
      case 'monitoring': return this.renderMonitoring(container);
      default: return this.renderDashboard(container);
    }
  },

  // --- DASHBOARD ---
  async renderDashboard(container) {
    const stats = await API.get('getStats');
    const s = stats.data;

    container.innerHTML = `
      <div class="space-y-6 animate-fadeIn">
        <!-- Stats Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          ${this.statCard('Total Siswa', s.total_siswa, 'fas fa-user-graduate', 'from-blue-500 to-indigo-600', '+12%')}
          ${this.statCard('Total Guru', s.total_guru, 'fas fa-chalkboard-teacher', 'from-emerald-500 to-teal-600', '+3%')}
          ${this.statCard('Total Kelas', s.total_kelas, 'fas fa-layer-group', 'from-violet-500 to-purple-600', '+5%')}
          ${this.statCard('Enrollment', s.total_enrollments, 'fas fa-user-plus', 'from-amber-500 to-orange-600', '+18%')}
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- User Distribution -->
          <div class="glass-card rounded-2xl p-6">
            <h3 class="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <i class="fas fa-chart-pie text-indigo-400"></i> Distribusi User
            </h3>
            <div class="flex items-center justify-center gap-8">
              <div class="relative w-36 h-36">
                <svg viewBox="0 0 36 36" class="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.92" fill="none" stroke="rgba(99,102,241,0.15)" stroke-width="3"/>
                  <circle cx="18" cy="18" r="15.92" fill="none" stroke="#818cf8" stroke-width="3" 
                    stroke-dasharray="${(s.total_siswa / s.total_users * 100).toFixed(0)} ${100 - (s.total_siswa / s.total_users * 100)}" stroke-linecap="round"/>
                  <circle cx="18" cy="18" r="15.92" fill="none" stroke="#34d399" stroke-width="3"
                    stroke-dasharray="${(s.total_guru / s.total_users * 100).toFixed(0)} ${100 - (s.total_guru / s.total_users * 100)}" 
                    stroke-dashoffset="-${(s.total_siswa / s.total_users * 100).toFixed(0)}" stroke-linecap="round"/>
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="text-2xl font-bold text-white">${s.total_users}</span>
                  <span class="text-[10px] text-slate-500">Total</span>
                </div>
              </div>
              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-indigo-400"></div>
                  <span class="text-xs text-slate-400">Siswa (${s.total_siswa})</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <span class="text-xs text-slate-400">Guru (${s.total_guru})</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-amber-400"></div>
                  <span class="text-xs text-slate-400">Admin (${s.total_admin})</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="glass-card rounded-2xl p-6">
            <h3 class="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <i class="fas fa-bolt text-amber-400"></i> Aksi Cepat
            </h3>
            <div class="grid grid-cols-2 gap-3">
              <button onclick="Router.navigate('users')" class="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/20 transition-all duration-200 group">
                <i class="fas fa-user-plus text-lg text-indigo-400 group-hover:scale-110 transition-transform"></i>
                <span class="text-xs text-slate-400 group-hover:text-white">Tambah User</span>
              </button>
              <button onclick="Router.navigate('kelas')" class="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/20 transition-all duration-200 group">
                <i class="fas fa-plus-circle text-lg text-emerald-400 group-hover:scale-110 transition-transform"></i>
                <span class="text-xs text-slate-400 group-hover:text-white">Tambah Kelas</span>
              </button>
              <button onclick="Router.navigate('monitoring')" class="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-violet-500/10 border border-white/5 hover:border-violet-500/20 transition-all duration-200 group">
                <i class="fas fa-chart-line text-lg text-violet-400 group-hover:scale-110 transition-transform"></i>
                <span class="text-xs text-slate-400 group-hover:text-white">Monitoring</span>
              </button>
              <button onclick="Router.navigate('monitoring')" class="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/20 transition-all duration-200 group">
                <i class="fas fa-trophy text-lg text-amber-400 group-hover:scale-110 transition-transform"></i>
                <span class="text-xs text-slate-400 group-hover:text-white">Leaderboard</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="glass-card rounded-2xl p-6">
          <h3 class="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <i class="fas fa-clock text-blue-400"></i> Ringkasan Kelas
          </h3>
          <div id="admin-kelas-summary" class="space-y-3"></div>
        </div>
      </div>
    `;

    // Load kelas summary
    const kelasRes = await API.get('getKelas');
    const kelasContainer = document.getElementById('admin-kelas-summary');
    if (kelasRes.success && kelasRes.data.length > 0) {
      const enrollRes = await API.get('getEnrollments');
      const enrollments = enrollRes.data || [];

      kelasContainer.innerHTML = kelasRes.data.map(k => {
        const count = enrollments.filter(e => e.kelas_id == k.id).length;
        return `
          <div class="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 transition-all">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                <i class="fas fa-book text-indigo-400 text-sm"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-white">${k.nama_kelas}</p>
                <p class="text-[11px] text-slate-500">Pengajar: ${k.guru_nama}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 text-xs font-medium">${count} siswa</span>
            </div>
          </div>
        `;
      }).join('');
    } else {
      kelasContainer.innerHTML = '<p class="text-sm text-slate-500 text-center py-4">Belum ada kelas</p>';
    }
  },

  // --- USERS MANAGEMENT ---
  async renderUsers(container) {
    const res = await API.get('getUsers');
    const users = res.data || [];

    container.innerHTML = `
      <div class="space-y-4 animate-fadeIn">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-lg font-bold text-white">Kelola Users</h2>
            <p class="text-xs text-slate-500">${users.length} user terdaftar</p>
          </div>
          <button onclick="AdminDashboard.showUserForm()" class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-medium transition-all shadow-lg shadow-indigo-500/20">
            <i class="fas fa-plus text-xs"></i> Tambah User
          </button>
        </div>

        <!-- Filter -->
        <div class="flex gap-2">
          <button onclick="AdminDashboard.filterUsers('all')" class="user-filter active px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 text-white" data-filter="all">Semua</button>
          <button onclick="AdminDashboard.filterUsers('admin')" class="user-filter px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-slate-400 hover:bg-white/10" data-filter="admin">Admin</button>
          <button onclick="AdminDashboard.filterUsers('guru')" class="user-filter px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-slate-400 hover:bg-white/10" data-filter="guru">Guru</button>
          <button onclick="AdminDashboard.filterUsers('siswa')" class="user-filter px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-slate-400 hover:bg-white/10" data-filter="siswa">Siswa</button>
        </div>

        <!-- Users Table -->
        <div class="glass-card rounded-2xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-white/5">
                  <th class="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">User</th>
                  <th class="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Username</th>
                  <th class="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                  <th class="text-right px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody id="users-table-body">
                ${users.map(u => this.userRow(u)).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- User Modal -->
      <div id="user-modal" class="fixed inset-0 z-50 hidden">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="AdminDashboard.closeUserForm()"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="glass-card rounded-2xl p-6 w-full max-w-md relative animate-fadeIn">
            <h3 id="user-modal-title" class="text-lg font-bold text-white mb-4">Tambah User</h3>
            <form onsubmit="AdminDashboard.saveUser(event)" class="space-y-4">
              <input type="hidden" id="user-id">
              <div>
                <label class="block text-xs font-medium text-slate-400 mb-1.5">Nama Lengkap</label>
                <input type="text" id="user-nama" required class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20" placeholder="Nama lengkap">
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-400 mb-1.5">Username</label>
                <input type="text" id="user-username" required class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20" placeholder="Username">
              </div>
              <div id="user-password-field">
                <label class="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
                <input type="password" id="user-password" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20" placeholder="Password">
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-400 mb-1.5">Role</label>
                <select id="user-role" required class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50">
                  <option value="siswa" class="bg-slate-900">Siswa</option>
                  <option value="guru" class="bg-slate-900">Guru</option>
                  <option value="admin" class="bg-slate-900">Admin</option>
                </select>
              </div>
              <div class="flex gap-3 pt-2">
                <button type="button" onclick="AdminDashboard.closeUserForm()" class="flex-1 px-4 py-2.5 rounded-xl bg-white/5 text-slate-400 text-sm font-medium hover:bg-white/10">Batal</button>
                <button type="submit" class="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium hover:from-indigo-500 hover:to-violet-500">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  userRow(u) {
    const roleColors = {
      admin: 'bg-red-500/10 text-red-300 border-red-500/20',
      guru: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      siswa: 'bg-blue-500/10 text-blue-300 border-blue-500/20'
    };
    const rc = roleColors[u.role] || roleColors.siswa;
    return `
      <tr class="border-b border-white/[0.03] hover:bg-white/[0.02] user-row" data-role="${u.role}">
        <td class="px-5 py-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-xs font-bold text-indigo-300">
              ${Auth.getInitials(u.nama)}
            </div>
            <span class="text-sm text-white font-medium">${u.nama}</span>
          </div>
        </td>
        <td class="px-5 py-3 text-sm text-slate-400">${u.username}</td>
        <td class="px-5 py-3">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${rc}">${u.role}</span>
        </td>
        <td class="px-5 py-3 text-right">
          <div class="flex items-center justify-end gap-1">
            <button onclick="AdminDashboard.editUser(${u.id})" class="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-indigo-400 transition-colors">
              <i class="fas fa-edit text-xs"></i>
            </button>
            <button onclick="AdminDashboard.deleteUser(${u.id}, '${u.nama}')" class="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-red-400 transition-colors">
              <i class="fas fa-trash text-xs"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  },

  filterUsers(role) {
    document.querySelectorAll('.user-filter').forEach(btn => {
      btn.classList.remove('active', 'bg-white/10', 'text-white');
      btn.classList.add('bg-white/5', 'text-slate-400');
    });
    event.target.classList.add('active', 'bg-white/10', 'text-white');
    event.target.classList.remove('bg-white/5', 'text-slate-400');

    document.querySelectorAll('.user-row').forEach(row => {
      if (role === 'all' || row.dataset.role === role) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  },

  showUserForm(user = null) {
    document.getElementById('user-modal').classList.remove('hidden');
    document.getElementById('user-modal-title').textContent = user ? 'Edit User' : 'Tambah User';
    document.getElementById('user-id').value = user ? user.id : '';
    document.getElementById('user-nama').value = user ? user.nama : '';
    document.getElementById('user-username').value = user ? user.username : '';
    document.getElementById('user-password').value = '';
    document.getElementById('user-role').value = user ? user.role : 'siswa';
    
    if (user) {
      document.getElementById('user-password').removeAttribute('required');
      document.getElementById('user-password').placeholder = 'Kosongkan jika tidak diubah';
    } else {
      document.getElementById('user-password').setAttribute('required', '');
      document.getElementById('user-password').placeholder = 'Password';
    }
  },

  closeUserForm() {
    document.getElementById('user-modal').classList.add('hidden');
  },

  async editUser(id) {
    const res = await API.get('getUser', { id });
    if (res.success) this.showUserForm(res.data);
  },

  async saveUser(e) {
    e.preventDefault();
    const id = document.getElementById('user-id').value;
    const body = {
      nama: document.getElementById('user-nama').value,
      username: document.getElementById('user-username').value,
      role: document.getElementById('user-role').value,
    };
    const pw = document.getElementById('user-password').value;
    if (pw) body.password = pw;

    let res;
    if (id) {
      body.id = parseInt(id);
      res = await API.post('updateUser', body);
    } else {
      if (!pw) { alert('Password wajib diisi'); return; }
      res = await API.post('createUser', body);
    }

    if (res.success) {
      this.closeUserForm();
      showToast(res.message || 'Berhasil!', 'success');
      Router.navigate('users');
    } else {
      showToast(res.error || 'Gagal', 'error');
    }
  },

  async deleteUser(id, nama) {
    if (!confirm(`Hapus user "${nama}"?`)) return;
    const res = await API.post('deleteUser', { id });
    if (res.success) {
      showToast('User berhasil dihapus', 'success');
      Router.navigate('users');
    }
  },

  // --- KELAS MANAGEMENT ---
  async renderKelas(container) {
    const res = await API.get('getKelas');
    const kelas = res.data || [];
    const guruRes = await API.get('getUsers', { role: 'guru' });
    const guruList = guruRes.data || [];

    container.innerHTML = `
      <div class="space-y-4 animate-fadeIn">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-lg font-bold text-white">Kelola Kelas</h2>
            <p class="text-xs text-slate-500">${kelas.length} kelas tersedia</p>
          </div>
          <button onclick="AdminDashboard.showKelasForm()" class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-medium transition-all shadow-lg shadow-indigo-500/20">
            <i class="fas fa-plus text-xs"></i> Tambah Kelas
          </button>
        </div>

        <!-- Kelas Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" id="kelas-grid">
          ${kelas.map(k => this.kelasCard(k)).join('')}
        </div>
        ${kelas.length === 0 ? '<p class="text-center text-slate-500 py-12">Belum ada kelas</p>' : ''}
      </div>

      <!-- Kelas Modal -->
      <div id="kelas-modal" class="fixed inset-0 z-50 hidden">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="AdminDashboard.closeKelasForm()"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="glass-card rounded-2xl p-6 w-full max-w-md relative animate-fadeIn">
            <h3 id="kelas-modal-title" class="text-lg font-bold text-white mb-4">Tambah Kelas</h3>
            <form onsubmit="AdminDashboard.saveKelas(event)" class="space-y-4">
              <input type="hidden" id="kelas-id">
              <div>
                <label class="block text-xs font-medium text-slate-400 mb-1.5">Nama Kelas</label>
                <input type="text" id="kelas-nama" required class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20">
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-400 mb-1.5">Deskripsi</label>
                <textarea id="kelas-deskripsi" rows="3" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 resize-none"></textarea>
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-400 mb-1.5">Guru Pengajar</label>
                <select id="kelas-guru" required class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50">
                  <option value="" class="bg-slate-900">Pilih Guru</option>
                  ${guruList.map(g => `<option value="${g.id}" class="bg-slate-900">${g.nama}</option>`).join('')}
                </select>
              </div>
              <div class="flex gap-3 pt-2">
                <button type="button" onclick="AdminDashboard.closeKelasForm()" class="flex-1 px-4 py-2.5 rounded-xl bg-white/5 text-slate-400 text-sm font-medium hover:bg-white/10">Batal</button>
                <button type="submit" class="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  kelasCard(k) {
    const gradients = [
      'from-indigo-600/80 to-violet-700/80',
      'from-emerald-600/80 to-teal-700/80',
      'from-amber-600/80 to-orange-700/80',
      'from-rose-600/80 to-pink-700/80',
      'from-cyan-600/80 to-blue-700/80',
    ];
    const grad = gradients[k.id % gradients.length];
    return `
      <div class="glass-card rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-300">
        <div class="h-28 bg-gradient-to-br ${grad} flex items-end p-4 relative overflow-hidden">
          <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
          <h3 class="text-white font-bold text-sm relative z-10">${k.nama_kelas}</h3>
        </div>
        <div class="p-4 space-y-3">
          <p class="text-xs text-slate-400 line-clamp-2">${k.deskripsi || 'Tidak ada deskripsi'}</p>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="fas fa-user-tie text-[10px] text-slate-500"></i>
              <span class="text-xs text-slate-500">${k.guru_nama || '-'}</span>
            </div>
            <div class="flex gap-1">
              <button onclick="AdminDashboard.editKelas(${k.id})" class="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-indigo-400 transition-colors">
                <i class="fas fa-edit text-xs"></i>
              </button>
              <button onclick="AdminDashboard.deleteKelas(${k.id}, '${k.nama_kelas}')" class="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-red-400 transition-colors">
                <i class="fas fa-trash text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  showKelasForm(kelas = null) {
    document.getElementById('kelas-modal').classList.remove('hidden');
    document.getElementById('kelas-modal-title').textContent = kelas ? 'Edit Kelas' : 'Tambah Kelas';
    document.getElementById('kelas-id').value = kelas ? kelas.id : '';
    document.getElementById('kelas-nama').value = kelas ? kelas.nama_kelas : '';
    document.getElementById('kelas-deskripsi').value = kelas ? kelas.deskripsi : '';
    document.getElementById('kelas-guru').value = kelas ? kelas.guru_id : '';
  },

  closeKelasForm() {
    document.getElementById('kelas-modal').classList.add('hidden');
  },

  async editKelas(id) {
    const res = await API.get('getKelasById', { id });
    if (res.success) this.showKelasForm(res.data);
  },

  async saveKelas(e) {
    e.preventDefault();
    const id = document.getElementById('kelas-id').value;
    const body = {
      nama_kelas: document.getElementById('kelas-nama').value,
      deskripsi: document.getElementById('kelas-deskripsi').value,
      guru_id: parseInt(document.getElementById('kelas-guru').value),
    };

    let res;
    if (id) {
      body.id = parseInt(id);
      res = await API.post('updateKelas', body);
    } else {
      res = await API.post('createKelas', body);
    }

    if (res.success) {
      this.closeKelasForm();
      showToast(res.message || 'Berhasil!', 'success');
      Router.navigate('kelas');
    } else {
      showToast(res.error || 'Gagal', 'error');
    }
  },

  async deleteKelas(id, nama) {
    if (!confirm(`Hapus kelas "${nama}"?`)) return;
    const res = await API.post('deleteKelas', { id });
    if (res.success) {
      showToast('Kelas berhasil dihapus', 'success');
      Router.navigate('kelas');
    }
  },

  // --- MONITORING ---
  async renderMonitoring(container) {
    const kelasRes = await API.get('getKelas');
    const kelas = kelasRes.data || [];

    container.innerHTML = `
      <div class="space-y-4 animate-fadeIn">
        <h2 class="text-lg font-bold text-white">Monitoring & Leaderboard</h2>
        
        <div class="flex gap-2 flex-wrap">
          ${kelas.map(k => `
            <button onclick="AdminDashboard.loadLeaderboard(${k.id}, '${k.nama_kelas}')" class="px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-indigo-500/10 hover:text-indigo-300 text-xs font-medium transition-all border border-white/5 hover:border-indigo-500/20">
              ${k.nama_kelas}
            </button>
          `).join('')}
        </div>

        <div id="monitoring-content">
          <div class="flex flex-col items-center justify-center py-16 gap-3">
            <i class="fas fa-trophy text-3xl text-slate-700"></i>
            <p class="text-sm text-slate-500">Pilih kelas untuk melihat leaderboard</p>
          </div>
        </div>
      </div>
    `;
  },

  async loadLeaderboard(kelasId, kelasName) {
    const lbContainer = document.getElementById('monitoring-content');
    lbContainer.innerHTML = '<div class="flex justify-center py-8"><div class="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div></div>';

    const res = await API.get('getLeaderboard', { kelas_id: kelasId });
    const lb = res.data || [];

    if (lb.length === 0) {
      lbContainer.innerHTML = '<p class="text-center text-slate-500 py-8">Belum ada data progress untuk kelas ini</p>';
      return;
    }

    lbContainer.innerHTML = `
      <div class="glass-card rounded-2xl p-6">
        <h3 class="text-sm font-semibold text-white mb-4"><i class="fas fa-trophy text-amber-400 mr-2"></i>Leaderboard — ${kelasName}</h3>
        <div class="space-y-2">
          ${lb.map((item, i) => {
            const medals = ['🥇', '🥈', '🥉'];
            const medal = i < 3 ? medals[i] : `<span class="text-xs text-slate-500">#${item.rank}</span>`;
            const barWidth = Math.max(10, item.avg_score);
            return `
              <div class="flex items-center gap-3 p-3 rounded-xl ${i === 0 ? 'bg-amber-500/5 border border-amber-500/10' : 'bg-white/[0.02]'}">
                <div class="w-8 text-center text-lg">${typeof medal === 'string' && medal.startsWith('<') ? medal : medal}</div>
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-xs font-bold text-indigo-300">
                  ${Auth.getInitials(item.nama)}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-white truncate">${item.nama}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <div class="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div class="h-full rounded-full ${i === 0 ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-indigo-500 to-violet-500'}" style="width:${barWidth}%"></div>
                    </div>
                    <span class="text-xs font-bold ${i === 0 ? 'text-amber-400' : 'text-indigo-400'}">${item.avg_score}</span>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-xs text-slate-500">${item.completed} selesai</p>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  // Helper: stat card
  statCard(title, value, icon, gradient, change) {
    return `
      <div class="glass-card rounded-2xl p-4 group hover:scale-[1.02] transition-all duration-300">
        <div class="flex items-start justify-between mb-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg">
            <i class="${icon} text-white text-sm"></i>
          </div>
          <span class="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">${change}</span>
        </div>
        <p class="text-2xl font-bold text-white">${value}</p>
        <p class="text-[11px] text-slate-500 mt-0.5">${title}</p>
      </div>
    `;
  }
};
