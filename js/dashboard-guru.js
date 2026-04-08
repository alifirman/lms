// ========================================
// Guru Dashboard Module
// ========================================

const GuruDashboard = {
  selectedKelasId: null,

  async render(viewId, container, params) {
    switch (viewId) {
      case 'dashboard': return this.renderDashboard(container);
      case 'kelas-saya': return this.renderKelasSaya(container);
      case 'materi': return this.renderMateri(container);
      case 'quiz': return this.renderQuiz(container);
      case 'progress-siswa': return this.renderProgressSiswa(container);
      default: return this.renderDashboard(container);
    }
  },

  // --- DASHBOARD ---
  async renderDashboard(container) {
    const user = Auth.getUser();
    const kelasRes = await API.get('getKelasByGuru', { guru_id: user.id });
    const kelasList = kelasRes.data || [];

    // Get enrollment counts
    const enrollRes = await API.get('getEnrollments');
    const allEnroll = enrollRes.data || [];
    let totalSiswa = 0;
    kelasList.forEach(k => {
      k.siswa_count = allEnroll.filter(e => e.kelas_id == k.id).length;
      totalSiswa += k.siswa_count;
    });

    // Get materi count
    const materiRes = await API.get('getMateri');
    const allMateri = materiRes.data || [];
    const myMateri = allMateri.filter(m => kelasList.some(k => k.id == m.kelas_id));

    container.innerHTML = `
      <div class="space-y-6 animate-fadeIn">
        <!-- Welcome -->
        <div class="glass-card rounded-2xl p-6 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border-emerald-500/10">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <i class="fas fa-chalkboard-teacher text-white text-xl"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-white">Halo, ${user.nama}! 👋</h2>
              <p class="text-sm text-slate-400">Berikut ringkasan kelas yang Anda ajar</p>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4">
          <div class="glass-card rounded-2xl p-4 text-center">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-2">
              <i class="fas fa-chalkboard text-white text-sm"></i>
            </div>
            <p class="text-2xl font-bold text-white">${kelasList.length}</p>
            <p class="text-[11px] text-slate-500">Kelas</p>
          </div>
          <div class="glass-card rounded-2xl p-4 text-center">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-2">
              <i class="fas fa-users text-white text-sm"></i>
            </div>
            <p class="text-2xl font-bold text-white">${totalSiswa}</p>
            <p class="text-[11px] text-slate-500">Siswa</p>
          </div>
          <div class="glass-card rounded-2xl p-4 text-center">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-2">
              <i class="fas fa-book text-white text-sm"></i>
            </div>
            <p class="text-2xl font-bold text-white">${myMateri.length}</p>
            <p class="text-[11px] text-slate-500">Materi</p>
          </div>
        </div>

        <!-- My Classes -->
        <div class="glass-card rounded-2xl p-6">
          <h3 class="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <i class="fas fa-layer-group text-emerald-400"></i> Kelas Saya
          </h3>
          <div class="space-y-3">
            ${kelasList.length === 0 ? '<p class="text-sm text-slate-500 text-center py-4">Belum ada kelas yang diassign</p>' : ''}
            ${kelasList.map(k => `
              <div class="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 transition-all cursor-pointer" onclick="Router.navigate('materi')">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                    <i class="fas fa-book-open text-emerald-400 text-sm"></i>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-white">${k.nama_kelas}</p>
                    <p class="text-[11px] text-slate-500">${k.siswa_count} siswa terdaftar</p>
                  </div>
                </div>
                <i class="fas fa-chevron-right text-xs text-slate-600"></i>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  // --- KELAS SAYA ---
  async renderKelasSaya(container) {
    const user = Auth.getUser();
    const kelasRes = await API.get('getKelasByGuru', { guru_id: user.id });
    const kelasList = kelasRes.data || [];

    const enrollRes = await API.get('getEnrollments');
    const allEnroll = enrollRes.data || [];

    container.innerHTML = `
      <div class="space-y-4 animate-fadeIn">
        <h2 class="text-lg font-bold text-white">Kelas Saya</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${kelasList.map(k => {
            const count = allEnroll.filter(e => e.kelas_id == k.id).length;
            const gradients = ['from-emerald-600/80 to-teal-700/80', 'from-cyan-600/80 to-blue-700/80', 'from-violet-600/80 to-purple-700/80', 'from-rose-600/80 to-pink-700/80'];
            const grad = gradients[k.id % gradients.length];
            return `
              <div class="glass-card rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                <div class="h-24 bg-gradient-to-br ${grad} flex items-end p-4 relative">
                  <div class="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-medium backdrop-blur-sm">${count} siswa</div>
                  <h3 class="text-white font-bold text-sm">${k.nama_kelas}</h3>
                </div>
                <div class="p-4 space-y-3">
                  <p class="text-xs text-slate-400 line-clamp-2">${k.deskripsi || 'Tidak ada deskripsi'}</p>
                  <div class="flex gap-2">
                    <button onclick="GuruDashboard.selectedKelasId=${k.id}; Router.navigate('materi')" class="flex-1 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-300 text-xs font-medium hover:bg-emerald-500/20 transition-all">
                      <i class="fas fa-book-open mr-1"></i> Materi
                    </button>
                    <button onclick="GuruDashboard.selectedKelasId=${k.id}; Router.navigate('progress-siswa')" class="flex-1 px-3 py-2 rounded-lg bg-indigo-500/10 text-indigo-300 text-xs font-medium hover:bg-indigo-500/20 transition-all">
                      <i class="fas fa-chart-line mr-1"></i> Progress
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
        ${kelasList.length === 0 ? '<div class="flex flex-col items-center justify-center py-16"><i class="fas fa-chalkboard text-4xl text-slate-700 mb-3"></i><p class="text-sm text-slate-500">Belum ada kelas yang diassign</p></div>' : ''}
      </div>
    `;
  },

  // --- MATERI MANAGEMENT ---
  async renderMateri(container) {
    const user = Auth.getUser();
    const kelasRes = await API.get('getKelasByGuru', { guru_id: user.id });
    const kelasList = kelasRes.data || [];
    
    if (!this.selectedKelasId && kelasList.length > 0) {
      this.selectedKelasId = kelasList[0].id;
    }

    const materiRes = this.selectedKelasId ? await API.get('getMateriByKelas', { kelas_id: this.selectedKelasId }) : { data: [] };
    const materiList = materiRes.data || [];
    const selectedKelas = kelasList.find(k => k.id == this.selectedKelasId);

    container.innerHTML = `
      <div class="space-y-4 animate-fadeIn">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-lg font-bold text-white">Kelola Materi</h2>
            <p class="text-xs text-slate-500">${selectedKelas ? selectedKelas.nama_kelas : 'Pilih kelas'}</p>
          </div>
          <button onclick="GuruDashboard.showMateriForm()" class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-medium transition-all">
            <i class="fas fa-plus text-xs"></i> Tambah Materi
          </button>
        </div>

        <!-- Class Tabs -->
        <div class="flex gap-2 flex-wrap">
          ${kelasList.map(k => `
            <button onclick="GuruDashboard.selectedKelasId=${k.id}; Router.navigate('materi')" 
              class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
              ${k.id == this.selectedKelasId ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'}">
              ${k.nama_kelas}
            </button>
          `).join('')}
        </div>

        <!-- Materi List -->
        <div class="space-y-3">
          ${materiList.map((m, i) => `
            <div class="glass-card rounded-xl p-4 flex items-start gap-4 group hover:bg-white/[0.03] transition-all">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center flex-shrink-0">
                <span class="text-sm font-bold text-emerald-400">${m.urutan || i + 1}</span>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-medium text-white">${m.judul}</h4>
                <p class="text-xs text-slate-500 mt-1 line-clamp-2">${(m.konten || '').substring(0, 100)}...</p>
                <div class="flex items-center gap-3 mt-2">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-medium ${m.tipe === 'video' ? 'bg-red-500/10 text-red-300' : m.tipe === 'link' ? 'bg-blue-500/10 text-blue-300' : 'bg-emerald-500/10 text-emerald-300'}">
                    <i class="fas ${m.tipe === 'video' ? 'fa-play-circle' : m.tipe === 'link' ? 'fa-link' : 'fa-file-alt'} mr-1"></i>${m.tipe}
                  </span>
                </div>
              </div>
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onclick="GuruDashboard.editMateri(${m.id})" class="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-emerald-400">
                  <i class="fas fa-edit text-xs"></i>
                </button>
                <button onclick="GuruDashboard.deleteMateri(${m.id}, '${m.judul}')" class="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-red-400">
                  <i class="fas fa-trash text-xs"></i>
                </button>
              </div>
            </div>
          `).join('')}
          ${materiList.length === 0 ? '<div class="flex flex-col items-center py-12"><i class="fas fa-book-open text-3xl text-slate-700 mb-3"></i><p class="text-sm text-slate-500">Belum ada materi</p></div>' : ''}
        </div>
      </div>

      <!-- Materi Modal -->
      <div id="materi-modal" class="fixed inset-0 z-50 hidden">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="GuruDashboard.closeMateriForm()"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="glass-card rounded-2xl p-6 w-full max-w-lg relative animate-fadeIn max-h-[90vh] overflow-y-auto">
            <h3 id="materi-modal-title" class="text-lg font-bold text-white mb-4">Tambah Materi</h3>
            <form onsubmit="GuruDashboard.saveMateri(event)" class="space-y-4">
              <input type="hidden" id="materi-id">
              <div>
                <label class="block text-xs font-medium text-slate-400 mb-1.5">Judul Materi</label>
                <input type="text" id="materi-judul" required class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50">
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-400 mb-1.5">Tipe</label>
                <select id="materi-tipe" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50">
                  <option value="text" class="bg-slate-900">Teks</option>
                  <option value="video" class="bg-slate-900">Video</option>
                  <option value="link" class="bg-slate-900">Link</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-400 mb-1.5">Konten</label>
                <textarea id="materi-konten" rows="6" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 resize-none font-mono"></textarea>
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-400 mb-1.5">URL (untuk video/link)</label>
                <input type="text" id="materi-url" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50">
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-400 mb-1.5">Urutan</label>
                <input type="number" id="materi-urutan" value="1" min="1" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50">
              </div>
              <div class="flex gap-3 pt-2">
                <button type="button" onclick="GuruDashboard.closeMateriForm()" class="flex-1 px-4 py-2.5 rounded-xl bg-white/5 text-slate-400 text-sm font-medium hover:bg-white/10">Batal</button>
                <button type="submit" class="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  showMateriForm(materi = null) {
    document.getElementById('materi-modal').classList.remove('hidden');
    document.getElementById('materi-modal-title').textContent = materi ? 'Edit Materi' : 'Tambah Materi';
    document.getElementById('materi-id').value = materi ? materi.id : '';
    document.getElementById('materi-judul').value = materi ? materi.judul : '';
    document.getElementById('materi-tipe').value = materi ? materi.tipe : 'text';
    document.getElementById('materi-konten').value = materi ? materi.konten : '';
    document.getElementById('materi-url').value = materi ? materi.url || '' : '';
    document.getElementById('materi-urutan').value = materi ? materi.urutan : 1;
  },

  closeMateriForm() { document.getElementById('materi-modal').classList.add('hidden'); },

  async editMateri(id) {
    const res = await API.get('getMateri');
    const materi = (res.data || []).find(m => m.id == id);
    if (materi) this.showMateriForm(materi);
  },

  async saveMateri(e) {
    e.preventDefault();
    const id = document.getElementById('materi-id').value;
    const body = {
      kelas_id: this.selectedKelasId,
      judul: document.getElementById('materi-judul').value,
      tipe: document.getElementById('materi-tipe').value,
      konten: document.getElementById('materi-konten').value,
      url: document.getElementById('materi-url').value,
      urutan: parseInt(document.getElementById('materi-urutan').value),
    };
    let res;
    if (id) { body.id = parseInt(id); res = await API.post('updateMateri', body); }
    else { res = await API.post('createMateri', body); }
    if (res.success) { this.closeMateriForm(); showToast(res.message || 'Berhasil!', 'success'); Router.navigate('materi'); }
    else { showToast(res.error || 'Gagal', 'error'); }
  },

  async deleteMateri(id, judul) {
    if (!confirm(`Hapus materi "${judul}"?`)) return;
    const res = await API.post('deleteMateri', { id });
    if (res.success) { showToast('Materi berhasil dihapus', 'success'); Router.navigate('materi'); }
  },

  // --- QUIZ ---
  async renderQuiz(container) {
    const user = Auth.getUser();
    const kelasRes = await API.get('getKelasByGuru', { guru_id: user.id });
    const kelasList = kelasRes.data || [];

    if (!this.selectedKelasId && kelasList.length > 0) this.selectedKelasId = kelasList[0].id;

    const quizRes = this.selectedKelasId ? await API.get('getQuizzesByKelas', { kelas_id: this.selectedKelasId }) : { data: [] };
    const quizList = quizRes.data || [];

    container.innerHTML = `
      <div class="space-y-4 animate-fadeIn">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 class="text-lg font-bold text-white">Kelola Quiz</h2>
          <button onclick="GuruDashboard.showQuizBuilder()" class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-medium">
            <i class="fas fa-plus text-xs"></i> Buat Quiz
          </button>
        </div>

        <div class="flex gap-2 flex-wrap">
          ${kelasList.map(k => `
            <button onclick="GuruDashboard.selectedKelasId=${k.id}; Router.navigate('quiz')"
              class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
              ${k.id == this.selectedKelasId ? 'bg-violet-500/10 text-violet-300 border-violet-500/20' : 'bg-white/5 text-slate-400 border-white/5'}">
              ${k.nama_kelas}
            </button>
          `).join('')}
        </div>

        <div class="space-y-3">
          ${quizList.map(q => {
            let questions = [];
            try { questions = typeof q.pertanyaan === 'string' ? JSON.parse(q.pertanyaan) : q.pertanyaan; } catch(e) {}
            return `
              <div class="glass-card rounded-xl p-4 flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                  <i class="fas fa-question-circle text-violet-400"></i>
                </div>
                <div class="flex-1">
                  <h4 class="text-sm font-medium text-white">${q.judul}</h4>
                  <p class="text-xs text-slate-500">${questions.length} pertanyaan</p>
                </div>
                <div class="flex gap-1">
                  <button onclick='GuruDashboard.showQuizBuilder(${JSON.stringify(q)})' class="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-indigo-400">
                    <i class="fas fa-edit text-xs"></i>
                  </button>
                  <button onclick="GuruDashboard.deleteQuiz(${q.id})" class="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-red-400">
                    <i class="fas fa-trash text-xs"></i>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
          ${quizList.length === 0 ? '<div class="text-center py-12"><i class="fas fa-question-circle text-3xl text-slate-700 mb-3 block"></i><p class="text-sm text-slate-500">Belum ada quiz</p></div>' : ''}
        </div>
      </div>
    `;
  },

  showQuizBuilder(quiz = null) {
    const container = document.getElementById('main-content');
    const user = Auth.getUser();

    // Reset temporary state for questions
    this.currentQuestions = [];
    if (quiz && quiz.pertanyaan) {
      try {
        this.currentQuestions = typeof quiz.pertanyaan === 'string' ? JSON.parse(quiz.pertanyaan) : quiz.pertanyaan;
      } catch (e) { console.error(e); }
    } else {
      // Add one empty question by default
      this.currentQuestions.push({ question: '', options: ['', '', '', ''], correct_answer: '' });
    }

    this.renderQuizBuilder(container, quiz);
  },

  async renderQuizBuilder(container, quiz = null) {
    const user = Auth.getUser();
    const materiRes = await API.get('getMateriByKelas', { kelas_id: this.selectedKelasId });
    const materiList = materiRes.data || [];

    container.innerHTML = `
      <div class="space-y-4 animate-fadeIn">
        <div class="flex items-center justify-between mb-2">
          <button onclick="Router.navigate('quiz')" class="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            <i class="fas fa-arrow-left text-xs"></i> Kembali ke Daftar Quiz
          </button>
          <div class="flex gap-2">
            <button onclick="GuruDashboard.saveQuiz()" class="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold shadow-lg shadow-emerald-500/20">
              <i class="fas fa-save mr-2"></i> Simpan Quiz
            </button>
          </div>
        </div>

        <div class="glass-card rounded-2xl p-6">
          <h3 class="text-lg font-bold text-white mb-4">${quiz ? 'Edit Quiz' : 'Buat Quiz Baru'}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input type="hidden" id="quiz-id" value="${quiz ? quiz.id : ''}">
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1.5">Judul Quiz</label>
              <input type="text" id="quiz-judul" value="${quiz ? quiz.judul : ''}" required class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50" placeholder="Contoh: Quiz Evaluasi Bab 1">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1.5">Hubungkan ke Materi (Opsional)</label>
              <select id="quiz-materi-id" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50">
                <option value="" class="bg-slate-900">Pilih Materi</option>
                ${materiList.map(m => `<option value="${m.id}" ${quiz && quiz.materi_id == m.id ? 'selected' : ''} class="bg-slate-900">${m.judul}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="space-y-6">
            <div class="flex items-center justify-between border-b border-white/5 pb-2">
              <h4 class="text-sm font-semibold text-indigo-400">Daftar Pertanyaan</h4>
              <button onclick="GuruDashboard.addQuestionRow()" class="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 text-xs font-bold hover:bg-indigo-500/20 transition-all">
                <i class="fas fa-plus mr-1"></i> Tambah Pertanyaan
              </button>
            </div>

            <div id="questions-container" class="space-y-6">
              <!-- Questions will be injected here -->
            </div>
          </div>
        </div>
      </div>
    `;

    this.renderQuestions();
  },

  renderQuestions() {
    const container = document.getElementById('questions-container');
    if (!container) return;

    container.innerHTML = this.currentQuestions.map((q, i) => {
      const type = q.type || 'multiple_choice';
      
      return `
        <div class="p-5 rounded-2xl bg-white/[0.02] border border-white/5 relative group animate-fadeIn">
          <button onclick="GuruDashboard.removeQuestionRow(${i})" class="absolute top-4 right-4 text-slate-600 hover:text-red-400 transition-colors">
            <i class="fas fa-trash-alt"></i>
          </button>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="md:col-span-2">
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pertanyaan ${i + 1}</label>
              <textarea onchange="GuruDashboard.updateQuestionData(${i}, 'question', this.value)" rows="2" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50 resize-none" placeholder="Tulis pertanyaan di sini...">${q.question}</textarea>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Jenis Soal</label>
              <select onchange="GuruDashboard.changeQuestionType(${i}, this.value)" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50">
                <option value="multiple_choice" ${type === 'multiple_choice' ? 'selected' : ''}>Pilihan Ganda</option>
                <option value="true_false" ${type === 'true_false' ? 'selected' : ''}>Benar / Salah</option>
                <option value="matching" ${type === 'matching' ? 'selected' : ''}>Menjodohkan</option>
              </select>
            </div>
          </div>

          <!-- Type Specific UI -->
          <div class="mt-4">
            ${this.renderQuestionTypeUI(i, q)}
          </div>
        </div>
      `;
    }).join('');
  },

  renderQuestionTypeUI(index, q) {
    const type = q.type || 'multiple_choice';

    if (type === 'multiple_choice') {
      return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${(q.options || ['', '', '', '']).map((opt, j) => `
            <div class="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 focus-within:border-indigo-500/30 transition-all">
              <input type="radio" name="correct_${index}" ${q.correct_answer === opt && opt !== '' ? 'checked' : ''} onchange="GuruDashboard.updateQuestionData(${index}, 'correct_answer', document.getElementById('q${index}_opt${j}').value)" class="w-4 h-4 accent-emerald-500 cursor-pointer">
              <input type="text" id="q${index}_opt${j}" value="${opt}" onchange="GuruDashboard.updateOptionData(${index}, ${j}, this.value)" class="flex-1 bg-transparent border-none text-sm text-white focus:outline-none" placeholder="Opsi ${String.fromCharCode(65 + j)}">
            </div>
          `).join('')}
        </div>
        <p class="text-[10px] text-slate-500 mt-2 italic"><i class="fas fa-info-circle mr-1"></i> Pilih jawaban benar melalui radio button.</p>
      `;
    }

    if (type === 'true_false') {
      return `
        <div class="flex gap-4">
          <label class="flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${q.correct_answer === 'Benar' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}">
            <input type="radio" name="tf_${index}" value="Benar" ${q.correct_answer === 'Benar' ? 'checked' : ''} onchange="GuruDashboard.updateQuestionData(${index}, 'correct_answer', 'Benar'); GuruDashboard.renderQuestions()" class="hidden">
            <i class="fas fa-check-circle"></i> <span class="text-sm font-bold">BENAR</span>
          </label>
          <label class="flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${q.correct_answer === 'Salah' ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}">
            <input type="radio" name="tf_${index}" value="Salah" ${q.correct_answer === 'Salah' ? 'checked' : ''} onchange="GuruDashboard.updateQuestionData(${index}, 'correct_answer', 'Salah'); GuruDashboard.renderQuestions()" class="hidden">
            <i class="fas fa-times-circle"></i> <span class="text-sm font-bold">SALAH</span>
          </label>
        </div>
      `;
    }

    if (type === 'matching') {
      const pairs = q.pairs || [{key: '', value: ''}];
      return `
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <p class="text-[10px] font-bold text-slate-500 uppercase">Pasangan (Kiri & Kanan)</p>
            <button onclick="GuruDashboard.addMatchingPair(${index})" class="text-[10px] text-indigo-400 hover:text-indigo-300">+ Tambah Pasangan</button>
          </div>
          <div class="space-y-2">
            ${pairs.map((p, pIdx) => `
              <div class="flex items-center gap-2">
                <input type="text" value="${p.key}" onchange="GuruDashboard.updateMatchingPair(${index}, ${pIdx}, 'key', this.value)" class="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs" placeholder="Item Kiri">
                <i class="fas fa-long-arrow-alt-right text-slate-700"></i>
                <input type="text" value="${p.value}" onchange="GuruDashboard.updateMatchingPair(${index}, ${pIdx}, 'value', this.value)" class="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs" placeholder="Item Kanan">
                <button onclick="GuruDashboard.removeMatchingPair(${index}, ${pIdx})" class="text-slate-600 hover:text-red-400 p-2"><i class="fas fa-times text-xs"></i></button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  },

  changeQuestionType(index, type) {
    const q = this.currentQuestions[index];
    q.type = type;
    q.correct_answer = '';
    
    // Default values for types
    if (type === 'multiple_choice') {
      q.options = q.options || ['', '', '', ''];
    } else if (type === 'matching') {
      q.pairs = q.pairs || [{key: '', value: ''}];
    }
    
    this.renderQuestions();
  },

  addMatchingPair(qIndex) {
    if (!this.currentQuestions[qIndex].pairs) this.currentQuestions[qIndex].pairs = [];
    this.currentQuestions[qIndex].pairs.push({key: '', value: ''});
    this.renderQuestions();
  },

  updateMatchingPair(qIndex, pIndex, field, value) {
    this.currentQuestions[qIndex].pairs[pIndex][field] = value;
  },

  removeMatchingPair(qIndex, pIndex) {
    this.currentQuestions[qIndex].pairs.splice(pIndex, 1);
    this.renderQuestions();
  },

  addQuestionRow() {
    this.currentQuestions.push({ type: 'multiple_choice', question: '', options: ['', '', '', ''], correct_answer: '' });
    this.renderQuestions();
  },

  removeQuestionRow(index) {
    if (this.currentQuestions.length <= 1) {
      showToast('Harus ada minimal satu pertanyaan', 'warning');
      return;
    }
    this.currentQuestions.splice(index, 1);
    this.renderQuestions();
  },

  updateQuestionData(index, field, value) {
    this.currentQuestions[index][field] = value;
  },

  updateOptionData(index, optIndex, value) {
    this.currentQuestions[index].options[optIndex] = value;
  },

  async saveQuiz() {
    const id = document.getElementById('quiz-id').value;
    const judul = document.getElementById('quiz-judul').value;
    const materiId = document.getElementById('quiz-materi-id').value;

    if (!judul) {
      showToast('Judul quiz wajib diisi', 'error');
      return;
    }

    // Validation
    for (let i = 0; i < this.currentQuestions.length; i++) {
      const q = this.currentQuestions[i];
      const type = q.type || 'multiple_choice';

      if (!q.question.trim()) {
        showToast(`Pertanyaan ke-${i + 1} masih kosong`, 'error');
        return;
      }

      if (type === 'multiple_choice') {
        if (q.options.some(opt => !opt.trim())) {
          showToast(`Opsi jawaban di pertanyaan ke-${i + 1} belum lengkap`, 'error');
          return;
        }
        if (!q.correct_answer) {
          showToast(`Pilih jawaban benar untuk pertanyaan ke-${i + 1}`, 'error');
          return;
        }
      } else if (type === 'true_false') {
        if (!q.correct_answer) {
          showToast(`Pilih jawaban benar untuk Benar-Salah ke-${i + 1}`, 'error');
          return;
        }
      } else if (type === 'matching') {
        if (!q.pairs || q.pairs.length === 0 || q.pairs.some(p => !p.key.trim() || !p.value.trim())) {
          showToast(`Pasangan menjodohkan ke-${i + 1} belum lengkap`, 'error');
          return;
        }
      }
    }

    const body = {
      kelas_id: this.selectedKelasId,
      materi_id: materiId || '',
      judul: judul,
      pertanyaan: this.currentQuestions
    };

    let res;
    if (id) {
      body.id = parseInt(id);
      res = await API.post('updateQuiz', body);
    } else {
      res = await API.post('createQuiz', body);
    }

    if (res.success) {
      showToast(res.message || 'Quiz berhasil disimpan!', 'success');
      Router.navigate('quiz');
    } else {
      showToast(res.error || 'Gagal menyimpan quiz', 'error');
    }
  },

  async deleteQuiz(id) {
    if (!confirm('Hapus quiz ini?')) return;
    await API.post('deleteQuiz', { id });
    showToast('Quiz dihapus', 'success');
    Router.navigate('quiz');
  },

  // --- PROGRESS SISWA ---
  async renderProgressSiswa(container) {
    const user = Auth.getUser();
    const kelasRes = await API.get('getKelasByGuru', { guru_id: user.id });
    const kelasList = kelasRes.data || [];

    if (!this.selectedKelasId && kelasList.length > 0) this.selectedKelasId = kelasList[0].id;
    const selectedKelas = kelasList.find(k => k.id == this.selectedKelasId);

    // Get leaderboard for selected class
    const lbRes = this.selectedKelasId ? await API.get('getLeaderboard', { kelas_id: this.selectedKelasId }) : { data: [] };
    const lb = lbRes.data || [];

    // Get enrolled students
    const enrollRes = this.selectedKelasId ? await API.get('getEnrollmentsByKelas', { kelas_id: this.selectedKelasId }) : { data: [] };
    const enrollments = enrollRes.data || [];

    // Get materi count
    const materiRes = this.selectedKelasId ? await API.get('getMateriByKelas', { kelas_id: this.selectedKelasId }) : { data: [] };
    const materiCount = (materiRes.data || []).length;

    container.innerHTML = `
      <div class="space-y-4 animate-fadeIn">
        <h2 class="text-lg font-bold text-white">Progress Siswa</h2>

        <div class="flex gap-2 flex-wrap">
          ${kelasList.map(k => `
            <button onclick="GuruDashboard.selectedKelasId=${k.id}; Router.navigate('progress-siswa')"
              class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
              ${k.id == this.selectedKelasId ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' : 'bg-white/5 text-slate-400 border-white/5'}">
              ${k.nama_kelas}
            </button>
          `).join('')}
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-3">
          <div class="glass-card rounded-xl p-4 text-center">
            <p class="text-xl font-bold text-white">${enrollments.length}</p>
            <p class="text-[10px] text-slate-500">Siswa</p>
          </div>
          <div class="glass-card rounded-xl p-4 text-center">
            <p class="text-xl font-bold text-white">${materiCount}</p>
            <p class="text-[10px] text-slate-500">Materi</p>
          </div>
          <div class="glass-card rounded-xl p-4 text-center">
            <p class="text-xl font-bold text-white">${lb.length > 0 ? Math.round(lb.reduce((a, b) => a + b.avg_score, 0) / lb.length) : 0}</p>
            <p class="text-[10px] text-slate-500">Rata-rata</p>
          </div>
        </div>

        <!-- Leaderboard -->
        <div class="glass-card rounded-2xl p-6">
          <h3 class="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <i class="fas fa-trophy text-amber-400"></i> Leaderboard — ${selectedKelas ? selectedKelas.nama_kelas : ''}
          </h3>
          ${lb.length === 0 ? '<p class="text-sm text-slate-500 text-center py-4">Belum ada data progress</p>' : ''}
          <div class="space-y-2">
            ${lb.map((item, i) => {
              const medals = ['🥇', '🥈', '🥉'];
              const medal = i < 3 ? medals[i] : `#${item.rank}`;
              return `
                <div class="flex items-center gap-3 p-3 rounded-xl ${i === 0 ? 'bg-amber-500/5 border border-amber-500/10' : 'bg-white/[0.02]'}">
                  <div class="w-8 text-center ${i >= 3 ? 'text-xs text-slate-500' : 'text-lg'}">${medal}</div>
                  <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-xs font-bold text-indigo-300">
                    ${Auth.getInitials(item.nama)}
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-white">${item.nama}</p>
                    <div class="flex items-center gap-2 mt-1">
                      <div class="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div class="h-full rounded-full bg-gradient-to-r ${i === 0 ? 'from-amber-400 to-orange-500' : 'from-indigo-500 to-violet-500'}" style="width:${Math.max(10, item.avg_score)}%"></div>
                      </div>
                      <span class="text-xs font-bold ${i === 0 ? 'text-amber-400' : 'text-indigo-400'}">${item.avg_score}</span>
                    </div>
                  </div>
                  <span class="text-xs text-slate-500">${item.completed} selesai</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }
};
