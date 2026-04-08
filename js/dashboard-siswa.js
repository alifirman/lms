// ========================================
// Siswa Dashboard Module
// ========================================

const SiswaDashboard = {
  async render(viewId, container, params) {
    switch (viewId) {
      case 'dashboard': return this.renderDashboard(container);
      case 'kelas-saya': return this.renderKelasSaya(container);
      case 'browse-kelas': return this.renderBrowseKelas(container);
      case 'progress': return this.renderProgress(container);
      case 'leaderboard': return this.renderLeaderboard(container);
      case 'materi-detail': return this.renderMateriDetail(container, params);
      default: return this.renderDashboard(container);
    }
  },

  // --- DASHBOARD ---
  async renderDashboard(container) {
    const user = Auth.getUser();
    const enrollRes = await API.get('getEnrollmentsBySiswa', { siswa_id: user.id });
    const allEnroll = enrollRes.data || [];
    const enrollments = allEnroll.filter(e => e.status === 'active');
    const pendingEnrollments = allEnroll.filter(e => e.status === 'pending');
    
    const progressRes = await API.get('getProgressBySiswa', { siswa_id: user.id });
    const progress = progressRes.data || [];

    const totalMateriBelajar = progress.filter(p => p.completed === 'true' || p.completed === true).length;
    const avgScore = progress.length > 0 ? Math.round(progress.reduce((a, p) => a + (Number(p.score) || 0), 0) / progress.length) : 0;

    container.innerHTML = `
      <div class="space-y-6 animate-fadeIn">
        <!-- Welcome Card -->
        <div class="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-violet-600/10"></div>
          <div class="relative flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span class="text-white font-bold text-lg">${Auth.getInitials(user.nama)}</span>
            </div>
            <div>
              <h2 class="text-lg font-bold text-white">Halo, ${user.nama}! 🎓</h2>
              <p class="text-sm text-slate-400">Teruslah belajar dan raih prestasi terbaikmu!</p>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-3">
          <div class="glass-card rounded-2xl p-4 text-center group hover:scale-[1.03] transition-all">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-2 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all">
              <i class="fas fa-book text-white text-sm"></i>
            </div>
            <p class="text-2xl font-bold text-white">${enrollments.length}</p>
            <p class="text-[10px] text-slate-500">Kelas</p>
          </div>
          <div class="glass-card rounded-2xl p-4 text-center group hover:scale-[1.03] transition-all">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-2 group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-all">
              <i class="fas fa-check-circle text-white text-sm"></i>
            </div>
            <p class="text-2xl font-bold text-white">${totalMateriBelajar}</p>
            <p class="text-[10px] text-slate-500">Selesai</p>
          </div>
          <div class="glass-card rounded-2xl p-4 text-center group hover:scale-[1.03] transition-all">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-2 group-hover:shadow-lg group-hover:shadow-amber-500/20 transition-all">
              <i class="fas fa-star text-white text-sm"></i>
            </div>
            <p class="text-2xl font-bold text-white">${avgScore}</p>
            <p class="text-[10px] text-slate-500">Rata-rata</p>
          </div>
        </div>

        <!-- My Classes -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-white flex items-center gap-2">
              <i class="fas fa-graduation-cap text-blue-400"></i> Kelas yang Diikuti
            </h3>
            <button onclick="Router.navigate('browse-kelas')" class="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
              Cari kelas baru <i class="fas fa-arrow-right ml-1"></i>
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            ${enrollments.slice(0, 4).map(e => {
              // Calculate progress for this class
              const classProgress = progress.filter(p => p.kelas_id == e.kelas_id && (p.completed === 'true' || p.completed === true));
              return `
                <div class="glass-card rounded-xl p-4 cursor-pointer hover:bg-white/[0.03] transition-all group" onclick="SiswaDashboard.openKelas(${e.kelas_id})">
                  <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center flex-shrink-0 group-hover:from-blue-500/30 group-hover:to-indigo-500/30 transition-all">
                      <i class="fas fa-book-open text-blue-400 text-sm"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h4 class="text-sm font-medium text-white truncate">${e.nama_kelas || 'Kelas'}</h4>
                      <p class="text-[11px] text-slate-500">${e.guru_nama || '-'}</p>
                      <div class="flex items-center gap-2 mt-2">
                        <div class="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all" style="width:${classProgress.length > 0 ? Math.min(100, classProgress.length * 33) : 0}%"></div>
                        </div>
                        <span class="text-[10px] text-slate-500">${classProgress.length} selesai</span>
                      </div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          ${enrollments.length === 0 ? `
            <div class="flex flex-col items-center py-12 gap-3">
              <div class="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                <i class="fas fa-search text-2xl text-slate-600"></i>
              </div>
              <p class="text-sm text-slate-500">Belum ada kelas</p>
              <button onclick="Router.navigate('browse-kelas')" class="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-300 text-sm font-medium hover:bg-indigo-500/20">
                Cari Kelas
              </button>
            </div>
          ` : ''}
        </div>

        <!-- Pending Enrollments -->
        ${pendingEnrollments.length > 0 ? `
          <div>
            <h3 class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <i class="fas fa-clock text-amber-500"></i> Menunggu Persetujuan
            </h3>
            <div class="space-y-2">
              ${pendingEnrollments.map(e => `
                <div class="glass-card rounded-xl p-3 border-amber-500/10 flex items-center justify-between opacity-80">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <i class="fas fa-hourglass-half text-amber-400 text-xs"></i>
                    </div>
                    <span class="text-xs font-medium text-white">${e.nama_kelas}</span>
                  </div>
                  <span class="text-[9px] font-bold text-amber-500/80 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase">Pending</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  },

  // --- KELAS SAYA (detail) ---
  async renderKelasSaya(container) {
    const user = Auth.getUser();
    const enrollRes = await API.get('getEnrollmentsBySiswa', { siswa_id: user.id });
    const allEnroll = enrollRes.data || [];
    const enrollments = allEnroll.filter(e => e.status === 'active');
    const pendingEnrollments = allEnroll.filter(e => e.status === 'pending');
    const progressRes = await API.get('getProgressBySiswa', { siswa_id: user.id });
    const allProgress = progressRes.data || [];

    container.innerHTML = `
      <div class="space-y-4 animate-fadeIn">
        <h2 class="text-lg font-bold text-white">Kelas Saya</h2>
        <div class="space-y-4">
          ${enrollments.map(e => {
            const cp = allProgress.filter(p => p.kelas_id == e.kelas_id && (p.completed === 'true' || p.completed === true));
            return `
              <div class="glass-card rounded-2xl overflow-hidden">
                <div class="h-20 bg-gradient-to-r from-blue-600/50 to-indigo-600/50 flex items-end p-4">
                  <h3 class="text-white font-bold text-sm">${e.nama_kelas || 'Kelas'}</h3>
                </div>
                <div class="p-4 space-y-3">
                  <p class="text-xs text-slate-400">${e.deskripsi || ''}</p>
                  <div class="flex items-center gap-2 text-xs text-slate-500">
                    <i class="fas fa-user-tie"></i> ${e.guru_nama || '-'}
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style="width:${Math.min(100, cp.length * 33)}%"></div>
                    </div>
                    <span class="text-xs text-slate-400">${cp.length} materi selesai</span>
                  </div>
                  <button onclick="SiswaDashboard.openKelas(${e.kelas_id})" class="w-full px-4 py-2.5 rounded-xl bg-blue-500/10 text-blue-300 text-sm font-medium hover:bg-blue-500/20 transition-all">
                    <i class="fas fa-play-circle mr-2"></i>Lanjutkan Belajar
                  </button>
                </div>
              </div>
            `;
          }).join('')}
          ${pendingEnrollments.length > 0 ? `
            <div class="p-4 rounded-2xl border border-dashed border-white/5 bg-white/[0.01]">
              <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Menunggu Persetujuan (${pendingEnrollments.length})</p>
              <div class="space-y-2">
                ${pendingEnrollments.map(e => `
                  <div class="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                    <span class="text-xs text-slate-300">${e.nama_kelas}</span>
                    <span class="text-[10px] text-amber-500 font-medium italic">Menunggu Guru...</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
          ${allEnroll.length === 0 ? '<p class="text-center text-slate-500 py-8">Belum ada kelas yang diikuti</p>' : ''}
        </div>
      </div>
    `;
  },

  // Open kelas - show materi list
  async openKelas(kelasId) {
    const container = document.getElementById('main-content');
    const user = Auth.getUser();

    const kelasRes = await API.get('getKelasById', { id: kelasId });
    const kelas = kelasRes.data;
    const materiRes = await API.get('getMateriByKelas', { kelas_id: kelasId });
    const materiList = materiRes.data || [];
    const progressRes = await API.get('getProgressBySiswa', { siswa_id: user.id, kelas_id: kelasId });
    const progress = progressRes.data || [];
    const quizRes = await API.get('getQuizzesByKelas', { kelas_id: kelasId });
    const quizzes = quizRes.data || [];

    const completedIds = progress.filter(p => p.completed === 'true' || p.completed === true).map(p => p.materi_id);

    container.innerHTML = `
      <div class="space-y-4 animate-fadeIn">
        <button onclick="Router.navigate('kelas-saya')" class="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          <i class="fas fa-arrow-left text-xs"></i> Kembali
        </button>

        <div class="glass-card rounded-2xl p-6 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border-blue-500/10">
          <h2 class="text-lg font-bold text-white">${kelas.nama_kelas}</h2>
          <p class="text-sm text-slate-400 mt-1">${kelas.deskripsi || ''}</p>
          <div class="flex items-center gap-4 mt-3">
            <span class="text-xs text-slate-500"><i class="fas fa-user-tie mr-1"></i> ${kelas.guru_nama || '-'}</span>
            <span class="text-xs text-slate-500"><i class="fas fa-book mr-1"></i> ${materiList.length} materi</span>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="glass-card rounded-xl p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-slate-400">Progress Belajar</span>
            <span class="text-xs font-bold text-indigo-400">${materiList.length > 0 ? Math.round(completedIds.length / materiList.length * 100) : 0}%</span>
          </div>
          <div class="h-2 bg-white/5 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500" style="width:${materiList.length > 0 ? (completedIds.length / materiList.length * 100) : 0}%"></div>
          </div>
        </div>

        <!-- Materi List -->
        <div class="space-y-2">
          ${materiList.map((m, i) => {
            const done = completedIds.includes(m.id);
            return `
              <div class="glass-card rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-white/[0.03] transition-all" onclick="SiswaDashboard.viewMateri(${m.id}, ${kelasId})">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${done ? 'bg-emerald-500/20' : 'bg-white/5'}">
                  ${done ? '<i class="fas fa-check-circle text-emerald-400"></i>' : `<span class="text-sm font-bold text-slate-500">${m.urutan || i + 1}</span>`}
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium ${done ? 'text-emerald-300' : 'text-white'}">${m.judul}</h4>
                  <p class="text-[11px] text-slate-500 mt-0.5">${m.tipe === 'video' ? '🎬 Video' : m.tipe === 'link' ? '🔗 Link' : '📝 Teks'}</p>
                </div>
                ${done ? '<span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-medium">Selesai</span>' : '<i class="fas fa-chevron-right text-xs text-slate-600"></i>'}
              </div>
            `;
          }).join('')}
        </div>

        <!-- Quizzes -->
        ${quizzes.length > 0 ? `
          <div class="glass-card rounded-2xl p-6">
            <h3 class="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <i class="fas fa-question-circle text-violet-400"></i> Quiz
            </h3>
            <div class="space-y-2">
              ${quizzes.map(q => `
                <button onclick="SiswaDashboard.startQuiz(${q.id}, ${kelasId})" class="w-full flex items-center gap-3 p-3 rounded-xl bg-violet-500/5 hover:bg-violet-500/10 border border-violet-500/10 transition-all text-left">
                  <div class="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                    <i class="fas fa-play text-violet-400 text-xs"></i>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-white">${q.judul}</p>
                    <p class="text-[10px] text-slate-500">Kerjakan quiz ini</p>
                  </div>
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  },

  // View single materi
  async viewMateri(materiId, kelasId) {
    const container = document.getElementById('main-content');
    const user = Auth.getUser();
    const materiRes = await API.get('getMateri');
    const materi = (materiRes.data || []).find(m => m.id == materiId);
    if (!materi) { showToast('Materi tidak ditemukan', 'error'); return; }

    container.innerHTML = `
      <div class="space-y-4 animate-fadeIn">
        <button onclick="SiswaDashboard.openKelas(${kelasId})" class="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          <i class="fas fa-arrow-left text-xs"></i> Kembali ke Kelas
        </button>

        <div class="glass-card rounded-2xl p-6">
          <h2 class="text-lg font-bold text-white mb-1">${materi.judul}</h2>
          <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-300 mb-4">${materi.tipe}</span>
          
          <div class="prose prose-invert prose-sm max-w-none">
            <div class="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">${materi.konten || 'Tidak ada konten'}</div>
          </div>

          ${materi.url ? `
            <div class="mt-4 p-3 rounded-xl bg-white/5 border border-white/5">
              <a href="${materi.url}" target="_blank" class="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-2">
                <i class="fas fa-external-link-alt"></i> Buka Resource
              </a>
            </div>
          ` : ''}
        </div>

        <button onclick="SiswaDashboard.markComplete(${materi.id}, ${kelasId})" class="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium text-sm hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
          <i class="fas fa-check-circle"></i> Tandai Selesai
        </button>
      </div>
    `;
  },

  async markComplete(materiId, kelasId) {
    const user = Auth.getUser();
    const res = await API.post('updateProgress', {
      siswa_id: user.id,
      kelas_id: kelasId,
      materi_id: materiId,
      completed: true,
      score: Math.floor(Math.random() * 20) + 80 // Simulated score 80-100
    });
    if (res.success) {
      showToast('Materi ditandai selesai! 🎉', 'success');
      this.openKelas(kelasId);
    }
  },

  // --- BROWSE KELAS ---
  async renderBrowseKelas(container) {
    const user = Auth.getUser();
    const kelasRes = await API.get('getKelas');
    const allKelas = kelasRes.data || [];
    const enrollRes = await API.get('getEnrollmentsBySiswa', { siswa_id: user.id });
    const myEnrollments = enrollRes.data || [];
    const myKelasIds = myEnrollments.filter(e => e.status === 'active').map(e => e.kelas_id);
    const pendingKelasIds = myEnrollments.filter(e => e.status === 'pending').map(e => e.kelas_id);

    container.innerHTML = `
      <div class="space-y-4 animate-fadeIn">
        <div>
          <h2 class="text-lg font-bold text-white">Cari Kelas</h2>
          <p class="text-xs text-slate-500">Temukan kelas baru untuk dipelajari</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${allKelas.map(k => {
            const enrolled = myKelasIds.includes(k.id);
            const gradients = ['from-blue-600/80 to-indigo-700/80', 'from-emerald-600/80 to-teal-700/80', 'from-violet-600/80 to-purple-700/80', 'from-rose-600/80 to-pink-700/80', 'from-amber-600/80 to-orange-700/80'];
            const grad = gradients[k.id % gradients.length];
            return `
              <div class="glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300">
                <div class="h-24 bg-gradient-to-br ${grad} flex items-end p-4 relative overflow-hidden">
                  <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
                  <h3 class="text-white font-bold text-sm relative z-10">${k.nama_kelas}</h3>
                </div>
                <div class="p-4 space-y-3">
                  <p class="text-xs text-slate-400 line-clamp-2">${k.deskripsi || 'Tidak ada deskripsi'}</p>
                  <div class="flex items-center gap-2 text-xs text-slate-500">
                    <i class="fas fa-user-tie"></i> ${k.guru_nama || '-'}
                  </div>
                  ${enrolled 
                    ? '<button disabled class="w-full px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-300 text-xs font-medium cursor-default"><i class="fas fa-check mr-1"></i> Sudah Terdaftar</button>'
                    : pendingKelasIds.includes(k.id)
                      ? '<button disabled class="w-full px-4 py-2 rounded-xl bg-amber-500/10 text-amber-300 text-xs font-medium cursor-default"><i class="fas fa-clock mr-1"></i> Menunggu Persetujuan</button>'
                      : `<button onclick="SiswaDashboard.enrollKelas(${k.id})" class="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-medium transition-all"><i class="fas fa-plus mr-1"></i> Daftar Kelas</button>`
                  }
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  async enrollKelas(kelasId) {
    const user = Auth.getUser();
    const res = await API.post('enroll', { siswa_id: user.id, kelas_id: kelasId });
    if (res.success) {
      showToast('Berhasil mendaftar kelas! 🎉', 'success');
      Router.navigate('browse-kelas');
    } else {
      showToast(res.error || 'Gagal mendaftar', 'error');
    }
  },

  // --- PROGRESS ---
  async renderProgress(container) {
    const user = Auth.getUser();
    const enrollRes = await API.get('getEnrollmentsBySiswa', { siswa_id: user.id });
    const enrollments = enrollRes.data || [];
    const progressRes = await API.get('getProgressBySiswa', { siswa_id: user.id });
    const allProgress = progressRes.data || [];

    const totalCompleted = allProgress.filter(p => p.completed === 'true' || p.completed === true).length;
    const avgScore = allProgress.length > 0 ? Math.round(allProgress.reduce((a, p) => a + (Number(p.score) || 0), 0) / allProgress.length) : 0;

    container.innerHTML = `
      <div class="space-y-4 animate-fadeIn">
        <h2 class="text-lg font-bold text-white">Progress Belajar</h2>

        <!-- Overall Stats -->
        <div class="grid grid-cols-2 gap-3">
          <div class="glass-card rounded-2xl p-5 text-center">
            <div class="w-20 h-20 mx-auto relative mb-3">
              <svg viewBox="0 0 36 36" class="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.92" fill="none" stroke="rgba(99,102,241,0.1)" stroke-width="2.5"/>
                <circle cx="18" cy="18" r="15.92" fill="none" stroke="url(#prog-grad)" stroke-width="2.5" 
                  stroke-dasharray="${Math.min(100, totalCompleted * 10)} ${100 - Math.min(100, totalCompleted * 10)}" stroke-linecap="round"/>
                <defs><linearGradient id="prog-grad"><stop offset="0%" stop-color="#818cf8"/><stop offset="100%" stop-color="#a78bfa"/></linearGradient></defs>
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-xl font-bold text-white">${totalCompleted}</span>
                <span class="text-[9px] text-slate-500">Materi</span>
              </div>
            </div>
            <p class="text-xs text-slate-400">Materi Selesai</p>
          </div>
          <div class="glass-card rounded-2xl p-5 text-center">
            <div class="w-20 h-20 mx-auto relative mb-3">
              <svg viewBox="0 0 36 36" class="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.92" fill="none" stroke="rgba(16,185,129,0.1)" stroke-width="2.5"/>
                <circle cx="18" cy="18" r="15.92" fill="none" stroke="url(#score-grad)" stroke-width="2.5" 
                  stroke-dasharray="${avgScore} ${100 - avgScore}" stroke-linecap="round"/>
                <defs><linearGradient id="score-grad"><stop offset="0%" stop-color="#34d399"/><stop offset="100%" stop-color="#10b981"/></linearGradient></defs>
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-xl font-bold text-white">${avgScore}</span>
                <span class="text-[9px] text-slate-500">Skor</span>
              </div>
            </div>
            <p class="text-xs text-slate-400">Rata-rata Skor</p>
          </div>
        </div>

        <!-- Per Class Progress -->
        <div class="glass-card rounded-2xl p-6">
          <h3 class="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <i class="fas fa-chart-bar text-indigo-400"></i> Progress per Kelas
          </h3>
          <div class="space-y-4">
            ${enrollments.map(e => {
              const cp = allProgress.filter(p => p.kelas_id == e.kelas_id && (p.completed === 'true' || p.completed === true));
              const classAvg = cp.length > 0 ? Math.round(cp.reduce((a, p) => a + (Number(p.score) || 0), 0) / cp.length) : 0;
              return `
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-sm text-white font-medium">${e.nama_kelas}</span>
                    <span class="text-xs text-indigo-400 font-bold">${classAvg} pts</span>
                  </div>
                  <div class="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700" style="width:${classAvg}%"></div>
                  </div>
                  <p class="text-[10px] text-slate-500 mt-1">${cp.length} materi selesai</p>
                </div>
              `;
            }).join('')}
            ${enrollments.length === 0 ? '<p class="text-sm text-slate-500 text-center py-4">Belum ada kelas</p>' : ''}
          </div>
        </div>
      </div>
    `;
  },

  // --- LEADERBOARD ---
  async renderLeaderboard(container) {
    const user = Auth.getUser();
    const enrollRes = await API.get('getEnrollmentsBySiswa', { siswa_id: user.id });
    const enrollments = enrollRes.data || [];

    container.innerHTML = `
      <div class="space-y-4 animate-fadeIn">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <i class="fas fa-trophy text-amber-400"></i> Leaderboard
        </h2>
        <p class="text-xs text-slate-500">Peringkatmu di setiap kelas yang diikuti</p>

        <div class="flex gap-2 flex-wrap" id="lb-tabs"></div>
        <div id="lb-content">
          <div class="flex flex-col items-center py-12 gap-3">
            <i class="fas fa-trophy text-3xl text-slate-700"></i>
            <p class="text-sm text-slate-500">Pilih kelas untuk melihat leaderboard</p>
          </div>
        </div>
      </div>
    `;

    const tabsContainer = document.getElementById('lb-tabs');
    tabsContainer.innerHTML = enrollments.map(e => `
      <button onclick="SiswaDashboard.loadLeaderboard(${e.kelas_id}, '${e.nama_kelas}')" 
        class="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-slate-400 hover:bg-amber-500/10 hover:text-amber-300 transition-all border border-white/5 hover:border-amber-500/20">
        ${e.nama_kelas}
      </button>
    `).join('');

    if (enrollments.length > 0) {
      this.loadLeaderboard(enrollments[0].kelas_id, enrollments[0].nama_kelas);
    }
  },

  async loadLeaderboard(kelasId, kelasName) {
    const user = Auth.getUser();
    const lbContainer = document.getElementById('lb-content');
    lbContainer.innerHTML = '<div class="flex justify-center py-8"><div class="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div></div>';

    const res = await API.get('getLeaderboard', { kelas_id: kelasId });
    const lb = res.data || [];

    if (lb.length === 0) {
      lbContainer.innerHTML = '<p class="text-center text-slate-500 py-8">Belum ada data</p>';
      return;
    }

    // Find current user rank
    const myRank = lb.find(item => item.siswa_id == user.id);

    lbContainer.innerHTML = `
      ${myRank ? `
        <div class="glass-card rounded-xl p-4 mb-4 bg-gradient-to-r from-amber-500/5 to-orange-500/5 border-amber-500/10">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span class="text-white font-bold">#${myRank.rank}</span>
            </div>
            <div>
              <p class="text-sm font-bold text-white">Peringkat Kamu</p>
              <p class="text-xs text-slate-400">Skor rata-rata: <span class="text-amber-400 font-bold">${myRank.avg_score}</span></p>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Top 3 Podium -->
      ${lb.length >= 3 ? `
        <div class="flex items-end justify-center gap-3 mb-6 px-4">
          <!-- 2nd -->
          <div class="flex flex-col items-center">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white font-bold text-sm mb-2 shadow-lg">
              ${Auth.getInitials(lb[1].nama)}
            </div>
            <p class="text-xs text-white font-medium text-center truncate max-w-[80px]">${lb[1].nama}</p>
            <div class="w-20 h-16 bg-gradient-to-t from-slate-600/30 to-slate-500/10 rounded-t-xl mt-2 flex items-center justify-center">
              <span class="text-lg">🥈</span>
            </div>
          </div>
          <!-- 1st -->
          <div class="flex flex-col items-center">
            <div class="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-base mb-2 shadow-lg shadow-amber-500/30 ring-2 ring-amber-400/30">
              ${Auth.getInitials(lb[0].nama)}
            </div>
            <p class="text-xs text-white font-bold text-center truncate max-w-[80px]">${lb[0].nama}</p>
            <div class="w-20 h-24 bg-gradient-to-t from-amber-600/30 to-amber-500/10 rounded-t-xl mt-2 flex items-center justify-center">
              <span class="text-2xl">🥇</span>
            </div>
          </div>
          <!-- 3rd -->
          <div class="flex flex-col items-center">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-amber-700 to-amber-800 flex items-center justify-center text-white font-bold text-sm mb-2 shadow-lg">
              ${Auth.getInitials(lb[2].nama)}
            </div>
            <p class="text-xs text-white font-medium text-center truncate max-w-[80px]">${lb[2].nama}</p>
            <div class="w-20 h-12 bg-gradient-to-t from-amber-800/30 to-amber-700/10 rounded-t-xl mt-2 flex items-center justify-center">
              <span class="text-lg">🥉</span>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Full List -->
      <div class="glass-card rounded-2xl p-4">
        <h4 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">${kelasName}</h4>
        <div class="space-y-1">
          ${lb.map((item, i) => `
            <div class="flex items-center gap-3 p-3 rounded-xl ${item.siswa_id == user.id ? 'bg-amber-500/5 border border-amber-500/10' : 'hover:bg-white/[0.02]'} transition-all">
              <div class="w-6 text-center text-sm ${i < 3 ? 'font-bold' : 'text-slate-500'}">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '#' + item.rank}</div>
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-xs font-bold text-indigo-300">
                ${Auth.getInitials(item.nama)}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium ${item.siswa_id == user.id ? 'text-amber-300' : 'text-white'} truncate">
                  ${item.nama} ${item.siswa_id == user.id ? '(Kamu)' : ''}
                </p>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold ${i === 0 ? 'text-amber-400' : 'text-indigo-400'}">${item.avg_score}</p>
                <p class="text-[10px] text-slate-500">${item.completed} materi</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // --- QUIZ ---
  async startQuiz(quizId, kelasId) {
    const container = document.getElementById('main-content');
    const user = Auth.getUser();
    const quizRes = await API.get('getQuizzes');
    const quiz = (quizRes.data || []).find(q => q.id == quizId);
    if (!quiz) { showToast('Quiz tidak ditemukan', 'error'); return; }

    let questions = [];
    try { 
      questions = typeof quiz.pertanyaan === 'string' ? JSON.parse(quiz.pertanyaan) : quiz.pertanyaan; 
    } catch(e) { console.error(e); }

    // Initialize state for this quiz attempt
    this.quizState = {
      matching: {} // stores { qIndex: { sourceKey: targetValue } }
    };

    container.innerHTML = `
      <div class="space-y-4 animate-fadeIn pb-20">
        <button onclick="SiswaDashboard.openKelas(${kelasId})" class="flex items-center gap-2 text-sm text-slate-400 hover:text-white">
          <i class="fas fa-arrow-left text-xs"></i> Kembali
        </button>

        <div class="glass-card rounded-2xl p-6">
          <h2 class="text-lg font-bold text-white mb-1">${quiz.judul}</h2>
          <p class="text-xs text-slate-500">${questions.length} Pertanyaan</p>
        </div>

        <form onsubmit="SiswaDashboard.submitQuiz(event, ${quizId}, ${kelasId})" id="quiz-form" class="space-y-4">
          ${questions.map((q, i) => {
            const type = q.type || 'multiple_choice';
            return `
              <div class="glass-card rounded-xl p-5 overflow-visible relative">
                <p class="text-sm font-medium text-white mb-6">
                  <span class="text-indigo-400 font-bold mr-2">${i + 1}.</span> ${q.question}
                </p>
                <div class="relative">
                  ${this.renderSiswaQuestionUI(i, q)}
                </div>
              </div>
            `;
          }).join('')}
          <button type="submit" class="w-full px-4 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-sm hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg shadow-violet-500/20">
            <i class="fas fa-paper-plane mr-2"></i> Kirim Jawaban
          </button>
        </form>
      </div>
    `;

    // Initialize interactions for matching questions after rendering
    questions.forEach((q, i) => {
      if (q.type === 'matching') this.initMatchingInteraction(i, q);
    });
  },

  renderSiswaQuestionUI(index, q) {
    const type = q.type || 'multiple_choice';

    if (type === 'multiple_choice') {
      return q.options.map((opt, j) => `
        <label class="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 cursor-pointer transition-all border border-white/5 hover:border-indigo-500/20 mb-2 last:mb-0">
          <input type="radio" name="q${index}" value="${opt.replace(/"/g, '&quot;')}" required class="w-4 h-4 accent-indigo-500">
          <span class="text-sm text-slate-300">${opt}</span>
        </label>
      `).join('');
    }

    if (type === 'true_false') {
      return ['Benar', 'Salah'].map(opt => `
        <label class="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] hover:bg-white/5 cursor-pointer transition-all border border-white/5 hover:border-indigo-500/20 mb-2 last:mb-0">
          <input type="radio" name="q${index}" value="${opt}" required class="w-4 h-4 accent-indigo-500">
          <span class="text-sm text-slate-300 font-bold uppercase tracking-wider">${opt}</span>
        </label>
      `).join('');
    }

    if (type === 'matching') {
      const allValues = q.pairs.map(p => p.value);
      const shuffledValues = [...allValues].sort(() => Math.random() - 0.5);
      
      this.quizState.matching[index] = {};

      return `
        <div id="matching-q${index}" class="matching-container grid grid-cols-2 gap-16 relative">
          <!-- SVG Layer for lines -->
          <svg id="svg-q${index}" class="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"></svg>
          
          <!-- Left Column -->
          <div class="space-y-4">
            ${q.pairs.map((p, pIdx) => `
              <div id="q${index}-L${pIdx}" data-key="${p.key.replace(/"/g, '&quot;')}" class="matching-item p-3 bg-white/[0.03] border border-white/5 rounded-xl text-xs text-white flex items-center justify-between min-h-[50px]">
                <span>${p.key}</span>
                <div id="hook-q${index}-L${pIdx}" class="matching-hook hook-right" data-hook-type="source" data-q-index="${index}" data-pair-index="${pIdx}"></div>
              </div>
            `).join('')}
          </div>

          <!-- Right Column -->
          <div class="space-y-4">
            ${shuffledValues.map((v, vIdx) => `
              <div id="q${index}-R${vIdx}" data-value="${v.replace(/"/g, '&quot;')}" class="matching-item p-3 bg-white/[0.03] border border-white/5 rounded-xl text-xs text-white flex items-center min-h-[50px]">
                <div id="hook-q${index}-R${vIdx}" class="matching-hook hook-left" data-hook-type="target" data-q-index="${index}" data-val-index="${vIdx}"></div>
                <span class="ml-4">${v}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (type === 'short_answer') {
      return `
        <div class="mt-4">
          <input type="text" name="q${index}" required class="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50 shadow-inner" placeholder="Tulis jawaban Anda di sini...">
        </div>
      `;
    }
  },

  initMatchingInteraction(qIndex, qData) {
    const container = document.getElementById(`matching-q${qIndex}`);
    const svg = document.getElementById(`svg-q${qIndex}`);
    let activeHook = null;
    let tempLine = null;

    const hooks = container.querySelectorAll('.matching-hook');
    
    // Global event for line following
    const onPointerMove = (e) => {
      if (!activeHook || !tempLine) return;
      const rect = container.getBoundingClientRect();
      const x2 = e.clientX - rect.left;
      const y2 = e.clientY - rect.top;
      
      const x1 = parseFloat(tempLine.getAttribute('x1'));
      const y1 = parseFloat(tempLine.getAttribute('y1'));
      
      // Update line position
      const dx = x2 - x1;
      const dy = y2 - y1;
      const cp1x = x1 + dx * 0.5;
      const cp2x = x1 + dx * 0.5;
      
      tempLine.setAttribute('d', `M ${x1} ${y1} C ${cp1x} ${y1}, ${cp2x} ${y2}, ${x2} ${y2}`);
    };

    const onPointerUp = (e) => {
      if (!activeHook) return;
      
      // Check if released over a target hook
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const targetHook = target ? target.closest('.matching-hook') : null;
      
      if (targetHook && targetHook !== activeHook && targetHook.dataset.hookType !== activeHook.dataset.hookType) {
        // Successful connection!
        this.connectHooks(activeHook, targetHook, qIndex);
      }
      
      // Cleanup temp line
      if (tempLine) tempLine.remove();
      activeHook.classList.remove('active');
      activeHook = null;
      tempLine = null;
      
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    hooks.forEach(hook => {
      hook.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        activeHook = hook;
        hook.classList.add('active');
        
        const rect = container.getBoundingClientRect();
        const hookRect = hook.getBoundingClientRect();
        const x1 = (hookRect.left + hookRect.width / 2) - rect.left;
        const y1 = (hookRect.top + hookRect.height / 2) - rect.top;

        // Create temp SVG path
        tempLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
        tempLine.setAttribute('class', 'matching-line');
        tempLine.setAttribute('x1', x1);
        tempLine.setAttribute('y1', y1);
        svg.appendChild(tempLine);

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
      });
    });
  },

  connectHooks(h1, h2, qIndex) {
    const source = h1.dataset.hookType === 'source' ? h1 : h2;
    const target = h1.dataset.hookType === 'target' ? h1 : h2;
    
    const sourceParent = source.closest('.matching-item');
    const targetParent = target.closest('.matching-item');
    
    const key = sourceParent.dataset.key.trim();
    const value = targetParent.dataset.value.trim();

    // Check if source already has a connection, if so, remove old line
    const existingOldLine = document.querySelector(`.line-from-q${qIndex}-${source.id}`);
    if (existingOldLine) existingOldLine.remove();

    // Check if target already has a connection from another source
    const existingTargetLine = document.querySelector(`.line-to-q${qIndex}-${target.id}`);
    if (existingTargetLine) {
        // Remove from state
        const oldSourceHookId = existingTargetLine.dataset.sourceHookId;
        const oldSourceParent = document.getElementById(oldSourceHookId).closest('.matching-item');
        delete this.quizState.matching[qIndex][oldSourceParent.dataset.key.trim()];
        existingTargetLine.remove();
    }

    // Update state
    this.quizState.matching[qIndex][key] = value;

    // Create permanent line
    this.renderPermanentLine(qIndex, source, target);
    
    source.classList.add('connected');
    target.classList.add('connected');
  },

  renderPermanentLine(qIndex, source, target) {
    const container = document.getElementById(`matching-q${qIndex}`);
    const svg = document.getElementById(`svg-q${qIndex}`);
    const rect = container.getBoundingClientRect();
    
    const sRect = source.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();
    
    const x1 = (sRect.left + sRect.width / 2) - rect.left;
    const y1 = (sRect.top + sRect.height / 2) - rect.top;
    const x2 = (tRect.left + tRect.width / 2) - rect.left;
    const y2 = (tRect.top + tRect.height / 2) - rect.top;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute('class', 'matching-line permanent line-drawing');
    path.classList.add(`line-from-q${qIndex}-${source.id}`);
    path.classList.add(`line-to-q${qIndex}-${target.id}`);
    path.dataset.sourceHookId = source.id;
    
    const dx = x2 - x1;
    const cp1x = x1 + dx * 0.5;
    const cp2x = x1 + dx * 0.5;
    path.setAttribute('d', `M ${x1} ${y1} C ${cp1x} ${y1}, ${cp2x} ${y2}, ${x2} ${y2}`);
    
    svg.appendChild(path);
  },

  async submitQuiz(e, quizId, kelasId) {
    e.preventDefault();
    const user = Auth.getUser();
    const form = document.getElementById('quiz-form');
    const quizRes = await API.get('getQuizzes');
    const quiz = (quizRes.data || []).find(q => q.id == quizId);
    let questions = [];
    try { 
      questions = typeof quiz.pertanyaan === 'string' ? JSON.parse(quiz.pertanyaan) : quiz.pertanyaan; 
    } catch(e) { console.error(e); }

    const answers = questions.map((q, i) => {
      const type = q.type || 'multiple_choice';
      
      if (type === 'multiple_choice' || type === 'true_false') {
        const selected = form.querySelector(`input[name="q${i}"]:checked`);
        return { question_index: i, answer: selected ? selected.value : '' };
      } else if (type === 'matching') {
        // Validation: Must connect all items
        const studentMapping = this.quizState.matching[i] || {};
        if (Object.keys(studentMapping).length < q.pairs.length) {
          // This will be caught by "required" in a better way if needed, 
          // but for now we just send what we have.
        }
        return { question_index: i, answer: studentMapping };
      } else if (type === 'short_answer') {
        const input = form.querySelector(`input[name="q${i}"]`);
        return { question_index: i, answer: input ? input.value : '' };
      }
    });

    const res = await API.post('submitQuiz', {
      siswa_id: user.id,
      kelas_id: kelasId,
      quiz_id: quizId,
      answers: answers
    });

    if (res.success) {
      const d = res.data;
      const container = document.getElementById('main-content');
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center py-24 animate-fadeIn">
          <div class="relative mb-8">
            <div class="absolute inset-0 bg-gradient-to-r ${d.score >= 80 ? 'from-emerald-500 to-teal-600' : d.score >= 60 ? 'from-amber-500 to-orange-600' : 'from-red-500 to-rose-600'} rounded-full blur-2xl opacity-20 animate-pulse"></div>
            <div class="w-32 h-32 rounded-full border-4 ${d.score >= 80 ? 'border-emerald-500/30' : d.score >= 60 ? 'border-amber-500/30' : 'border-red-500/30'} flex items-center justify-center relative bg-slate-900 shadow-2xl">
              <span class="text-4xl font-bold bg-gradient-to-br ${d.score >= 80 ? 'from-emerald-400 to-teal-500' : d.score >= 60 ? 'from-amber-400 to-orange-500' : 'from-red-400 to-rose-500'} bg-clip-text text-transparent">${d.score}</span>
            </div>
          </div>
          
          <h2 class="text-3xl font-bold text-white mb-2 text-center">${d.score >= 80 ? 'Luar Biasa! 🏆' : d.score >= 60 ? 'Bagus Sekali! ✨' : 'Belajar Lagi Yuk! 💪'}</h2>
          <p class="text-slate-400 mb-10 text-center max-w-sm">Kamu telah menyelesaikan quiz dengan menjawab <strong>${d.correct} dari ${d.total}</strong> pertanyaan secara tepat.</p>
          
          <div class="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
            <button onclick="Router.navigate('leaderboard')" class="flex-1 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
              <i class="fas fa-trophy"></i> Lihat Peringkat
            </button>
            <button onclick="SiswaDashboard.openKelas(${kelasId})" class="flex-1 px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-2">
              <i class="fas fa-reply"></i> Ke Kelas
            </button>
          </div>
        </div>
      `;
    }
  },
};
