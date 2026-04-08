// ========================================
// LMS API Helper + Demo Data
// ========================================

// --- DEMO DATA (used when DEMO_MODE is true) ---
const DEMO_DATA = {
  users: [
    { id: 1, username: 'admin', password: 'admin123', nama: 'Administrator', role: 'admin', avatar: '', kelas_id: '', created_at: '2026-01-01' },
    { id: 2, username: 'guru1', password: 'guru123', nama: 'Budi Santoso', role: 'guru', avatar: '', kelas_id: '', created_at: '2026-01-01' },
    { id: 3, username: 'guru2', password: 'guru123', nama: 'Siti Rahayu', role: 'guru', avatar: '', kelas_id: '', created_at: '2026-01-01' },
    { id: 4, username: 'siswa1', password: 'siswa123', nama: 'Ahmad Rizky', role: 'siswa', avatar: '', kelas_id: '', created_at: '2026-01-01' },
    { id: 5, username: 'siswa2', password: 'siswa123', nama: 'Dewi Putri', role: 'siswa', avatar: '', kelas_id: '', created_at: '2026-01-01' },
    { id: 6, username: 'siswa3', password: 'siswa123', nama: 'Fajar Nugroho', role: 'siswa', avatar: '', kelas_id: '', created_at: '2026-01-01' },
    { id: 7, username: 'siswa4', password: 'siswa123', nama: 'Rina Wati', role: 'siswa', avatar: '', kelas_id: '', created_at: '2026-01-01' },
    { id: 8, username: 'siswa5', password: 'siswa123', nama: 'Dimas Pratama', role: 'siswa', avatar: '', kelas_id: '', created_at: '2026-01-01' },
  ],
  kelas: [
    { id: 1, nama_kelas: 'Matematika Dasar', deskripsi: 'Mempelajari konsep dasar matematika meliputi bilangan, operasi, dan aljabar.', guru_id: 2, cover_image: '', created_at: '2026-01-01' },
    { id: 2, nama_kelas: 'Bahasa Indonesia', deskripsi: 'Penulisan, tata bahasa, dan sastra Indonesia untuk tingkat menengah.', guru_id: 3, cover_image: '', created_at: '2026-01-01' },
    { id: 3, nama_kelas: 'Pemrograman Web', deskripsi: 'Belajar HTML, CSS, dan JavaScript dari dasar hingga membuat website interaktif.', guru_id: 2, cover_image: '', created_at: '2026-01-01' },
    { id: 4, nama_kelas: 'Fisika Terapan', deskripsi: 'Konsep fisika dan penerapannya dalam kehidupan sehari-hari.', guru_id: 3, cover_image: '', created_at: '2026-01-01' },
  ],
  materi: [
    { id: 1, kelas_id: 1, judul: 'Pengenalan Bilangan', konten: 'Bilangan adalah konsep dasar dalam matematika. Ada beberapa jenis bilangan:\n\n1. **Bilangan Bulat**: ..., -2, -1, 0, 1, 2, ...\n2. **Bilangan Pecahan**: 1/2, 3/4, 2/3\n3. **Bilangan Desimal**: 0.5, 1.25, 3.14\n\nSetiap jenis bilangan memiliki sifat-sifat uniknya masing-masing.', tipe: 'text', url: '', urutan: 1 },
    { id: 2, kelas_id: 1, judul: 'Operasi Dasar', konten: 'Empat operasi dasar matematika:\n\n1. **Penjumlahan** (+)\n2. **Pengurangan** (-)\n3. **Perkalian** (×)\n4. **Pembagian** (÷)\n\nSifat komutatif: a + b = b + a\nSifat asosiatif: (a+b)+c = a+(b+c)', tipe: 'text', url: '', urutan: 2 },
    { id: 3, kelas_id: 1, judul: 'Aljabar Dasar', konten: 'Aljabar menggunakan huruf (variabel) untuk mewakili bilangan yang belum diketahui.\n\nContoh: 2x + 3 = 7\nSolusi: x = 2\n\nVariabel memungkinkan kita membuat persamaan umum.', tipe: 'text', url: '', urutan: 3 },
    { id: 4, kelas_id: 3, judul: 'Pengenalan HTML', konten: 'HTML (HyperText Markup Language) adalah bahasa markup untuk membuat halaman web.\n\nStruktur dasar:\n```html\n<!DOCTYPE html>\n<html>\n<head><title>Judul</title></head>\n<body>Konten</body>\n</html>\n```', tipe: 'text', url: '', urutan: 1 },
    { id: 5, kelas_id: 3, judul: 'CSS Styling', konten: 'CSS (Cascading Style Sheets) digunakan untuk mengatur tampilan halaman web.\n\nSelector:\n- Element: `p { color: red; }`\n- Class: `.judul { font-size: 24px; }`\n- ID: `#header { background: blue; }`', tipe: 'text', url: '', urutan: 2 },
    { id: 6, kelas_id: 3, judul: 'JavaScript Dasar', konten: 'JavaScript adalah bahasa pemrograman untuk membuat web interaktif.\n\nContoh:\n```js\nlet nama = "Budi";\nconsole.log("Halo, " + nama);\n```', tipe: 'text', url: '', urutan: 3 },
    { id: 7, kelas_id: 2, judul: 'Paragraf dan Kalimat', konten: 'Paragraf yang baik memiliki:\n1. Kalimat utama\n2. Kalimat penjelas\n3. Kalimat penutup\n\nSetiap paragraf membahas satu pokok pikiran.', tipe: 'text', url: '', urutan: 1 },
    { id: 8, kelas_id: 2, judul: 'Tata Bahasa', konten: 'Tata bahasa Indonesia meliputi:\n- Subjek (S)\n- Predikat (P)\n- Objek (O)\n- Keterangan (K)\n\nContoh: Ani (S) membaca (P) buku (O) di perpustakaan (K).', tipe: 'text', url: '', urutan: 2 },
  ],
  enrollments: [
    { id: 1, siswa_id: 4, kelas_id: 1, status: 'active', enrolled_at: '2026-01-15' },
    { id: 2, siswa_id: 4, kelas_id: 3, status: 'active', enrolled_at: '2026-01-15' },
    { id: 3, siswa_id: 5, kelas_id: 1, status: 'active', enrolled_at: '2026-01-16' },
    { id: 4, siswa_id: 5, kelas_id: 2, status: 'active', enrolled_at: '2026-01-16' },
    { id: 5, siswa_id: 6, kelas_id: 1, status: 'active', enrolled_at: '2026-01-17' },
    { id: 6, siswa_id: 6, kelas_id: 3, status: 'active', enrolled_at: '2026-01-17' },
    { id: 7, siswa_id: 7, kelas_id: 1, status: 'active', enrolled_at: '2026-01-18' },
    { id: 8, siswa_id: 7, kelas_id: 2, status: 'active', enrolled_at: '2026-01-18' },
    { id: 9, siswa_id: 8, kelas_id: 3, status: 'active', enrolled_at: '2026-01-19' },
    { id: 10, siswa_id: 8, kelas_id: 4, status: 'active', enrolled_at: '2026-01-19' },
  ],
  progress: [
    { id: 1, siswa_id: 4, kelas_id: 1, materi_id: 1, completed: 'true', score: 85, completed_at: '2026-02-01' },
    { id: 2, siswa_id: 4, kelas_id: 1, materi_id: 2, completed: 'true', score: 90, completed_at: '2026-02-05' },
    { id: 3, siswa_id: 4, kelas_id: 1, materi_id: 3, completed: 'true', score: 78, completed_at: '2026-02-10' },
    { id: 4, siswa_id: 4, kelas_id: 3, materi_id: 4, completed: 'true', score: 92, completed_at: '2026-02-03' },
    { id: 5, siswa_id: 4, kelas_id: 3, materi_id: 5, completed: 'true', score: 88, completed_at: '2026-02-08' },
    { id: 6, siswa_id: 5, kelas_id: 1, materi_id: 1, completed: 'true', score: 75, completed_at: '2026-02-02' },
    { id: 7, siswa_id: 5, kelas_id: 1, materi_id: 2, completed: 'true', score: 80, completed_at: '2026-02-07' },
    { id: 8, siswa_id: 6, kelas_id: 1, materi_id: 1, completed: 'true', score: 95, completed_at: '2026-02-01' },
    { id: 9, siswa_id: 6, kelas_id: 1, materi_id: 2, completed: 'true', score: 88, completed_at: '2026-02-04' },
    { id: 10, siswa_id: 6, kelas_id: 1, materi_id: 3, completed: 'true', score: 92, completed_at: '2026-02-09' },
    { id: 11, siswa_id: 6, kelas_id: 3, materi_id: 4, completed: 'true', score: 98, completed_at: '2026-02-03' },
    { id: 12, siswa_id: 7, kelas_id: 1, materi_id: 1, completed: 'true', score: 70, completed_at: '2026-02-05' },
    { id: 13, siswa_id: 8, kelas_id: 3, materi_id: 4, completed: 'true', score: 82, completed_at: '2026-02-06' },
    { id: 14, siswa_id: 8, kelas_id: 3, materi_id: 5, completed: 'true', score: 76, completed_at: '2026-02-10' },
  ],
  quizzes: [
    {
      id: 1, kelas_id: 1, materi_id: 1, judul: 'Quiz: Pengenalan Bilangan',
      pertanyaan: JSON.stringify([
        { question: 'Manakah yang termasuk bilangan bulat?', options: ['1/2', '0.5', '-3', '√2'], correct_answer: '-3' },
        { question: 'Berapakah 3/4 dalam desimal?', options: ['0.25', '0.5', '0.75', '1.0'], correct_answer: '0.75' },
        { question: 'Bilangan prima pertama adalah?', options: ['0', '1', '2', '3'], correct_answer: '2' },
      ])
    },
    {
      id: 2, kelas_id: 3, materi_id: 4, judul: 'Quiz: Pengenalan HTML',
      pertanyaan: JSON.stringify([
        { question: 'Tag HTML untuk heading terbesar?', options: ['<h6>', '<h1>', '<head>', '<header>'], correct_answer: '<h1>' },
        { question: 'Atribut untuk menambahkan link?', options: ['src', 'link', 'href', 'url'], correct_answer: 'href' },
        { question: 'Tag untuk paragraph?', options: ['<para>', '<p>', '<pg>', '<text>'], correct_answer: '<p>' },
      ])
    }
  ]
};

// Persist demo data changes in memory
let demoStore = JSON.parse(JSON.stringify(DEMO_DATA));

// --- API FUNCTIONS ---
const API = {
  // Generic GET
  async get(action, params = {}) {
    if (CONFIG.DEMO_MODE) {
      return this.demoGet(action, params);
    }
    const url = new URL(CONFIG.API_URL);
    url.searchParams.set('action', action);
    for (let key in params) {
      url.searchParams.set(key, params[key]);
    }
    const res = await fetch(url.toString());
    return await res.json();
  },

  // Generic POST
  async post(action, body = {}) {
    if (CONFIG.DEMO_MODE) {
      return this.demoPost(action, body);
    }
    const res = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action, ...body })
    });
    return await res.json();
  },

  // ========== DEMO MODE HANDLERS ==========
  demoGet(action, params) {
    switch (action) {
      case 'login': {
        const user = demoStore.users.find(u => u.username === params.username && u.password === params.password);
        if (user) {
          const u = { ...user };
          delete u.password;
          return { success: true, data: u, message: 'Login berhasil' };
        }
        return { success: false, error: 'Username atau password salah' };
      }
      case 'getUsers': {
        let users = demoStore.users.map(u => { const copy = { ...u }; delete copy.password; return copy; });
        if (params.role) users = users.filter(u => u.role === params.role);
        return { success: true, data: users };
      }
      case 'getUser': {
        const user = demoStore.users.find(u => u.id == params.id);
        if (!user) return { success: false, error: 'Not found' };
        const copy = { ...user }; delete copy.password;
        return { success: true, data: copy };
      }
      case 'getKelas': {
        const kelas = demoStore.kelas.map(k => {
          const guru = demoStore.users.find(u => u.id == k.guru_id);
          return { ...k, guru_nama: guru ? guru.nama : '-' };
        });
        return { success: true, data: kelas };
      }
      case 'getKelasById': {
        const k = demoStore.kelas.find(kl => kl.id == params.id);
        if (!k) return { success: false, error: 'Not found' };
        const guru = demoStore.users.find(u => u.id == k.guru_id);
        return { success: true, data: { ...k, guru_nama: guru ? guru.nama : '-' } };
      }
      case 'getKelasByGuru': {
        const filtered = demoStore.kelas.filter(k => k.guru_id == params.guru_id);
        return { success: true, data: filtered };
      }
      case 'getMateri': {
        return { success: true, data: demoStore.materi };
      }
      case 'getMateriByKelas': {
        const filtered = demoStore.materi.filter(m => m.kelas_id == params.kelas_id).sort((a, b) => a.urutan - b.urutan);
        return { success: true, data: filtered };
      }
      case 'getEnrollments': {
        return { success: true, data: demoStore.enrollments };
      }
      case 'getEnrollmentsBySiswa': {
        let filtered = demoStore.enrollments.filter(e => e.siswa_id == params.siswa_id);
        filtered = filtered.map(e => {
          const k = demoStore.kelas.find(kl => kl.id == e.kelas_id);
          const guru = k ? demoStore.users.find(u => u.id == k.guru_id) : null;
          return {
            ...e,
            nama_kelas: k ? k.nama_kelas : '-',
            deskripsi: k ? k.deskripsi : '',
            cover_image: k ? k.cover_image : '',
            guru_nama: guru ? guru.nama : '-'
          };
        });
        return { success: true, data: filtered };
      }
      case 'getEnrollmentsByKelas': {
        let filtered = demoStore.enrollments.filter(e => e.kelas_id == params.kelas_id);
        filtered = filtered.map(e => {
          const siswa = demoStore.users.find(u => u.id == e.siswa_id);
          return { ...e, nama_siswa: siswa ? siswa.nama : '-', username: siswa ? siswa.username : '-' };
        });
        return { success: true, data: filtered };
      }
      case 'getProgress': {
        return { success: true, data: demoStore.progress };
      }
      case 'getProgressBySiswa': {
        let filtered = demoStore.progress.filter(p => p.siswa_id == params.siswa_id);
        if (params.kelas_id) filtered = filtered.filter(p => p.kelas_id == params.kelas_id);
        return { success: true, data: filtered };
      }
      case 'getProgressByKelas': {
        const filtered = demoStore.progress.filter(p => p.kelas_id == params.kelas_id);
        return { success: true, data: filtered };
      }
      case 'getQuizzes': {
        return { success: true, data: demoStore.quizzes };
      }
      case 'getQuizzesByKelas': {
        const filtered = demoStore.quizzes.filter(q => q.kelas_id == params.kelas_id);
        return { success: true, data: filtered };
      }
      case 'getLeaderboard': {
        const kelasId = params.kelas_id;
        const filtered = demoStore.progress.filter(p => p.kelas_id == kelasId);
        const scoreMap = {};
        filtered.forEach(p => {
          if (!scoreMap[p.siswa_id]) scoreMap[p.siswa_id] = { total_score: 0, completed: 0, count: 0 };
          scoreMap[p.siswa_id].total_score += Number(p.score) || 0;
          scoreMap[p.siswa_id].count++;
          if (p.completed === 'true' || p.completed === true) scoreMap[p.siswa_id].completed++;
        });
        let leaderboard = [];
        for (let sid in scoreMap) {
          const user = demoStore.users.find(u => u.id == sid);
          leaderboard.push({
            siswa_id: sid,
            nama: user ? user.nama : 'Unknown',
            avatar: user ? user.avatar : '',
            avg_score: Math.round(scoreMap[sid].total_score / scoreMap[sid].count),
            total_score: scoreMap[sid].total_score,
            completed: scoreMap[sid].completed
          });
        }
        leaderboard.sort((a, b) => b.avg_score - a.avg_score);
        leaderboard.forEach((item, i) => item.rank = i + 1);
        return { success: true, data: leaderboard };
      }
      case 'getStats': {
        return {
          success: true, data: {
            total_users: demoStore.users.length,
            total_admin: demoStore.users.filter(u => u.role === 'admin').length,
            total_guru: demoStore.users.filter(u => u.role === 'guru').length,
            total_siswa: demoStore.users.filter(u => u.role === 'siswa').length,
            total_kelas: demoStore.kelas.length,
            total_enrollments: demoStore.enrollments.length,
            total_materi: demoStore.materi.length
          }
        };
      }
      default:
        return { success: false, error: 'Unknown action' };
    }
  },

  demoPost(action, body) {
    switch (action) {
      case 'createUser': {
        const exists = demoStore.users.find(u => u.username === body.username);
        if (exists) return { success: false, error: 'Username sudah digunakan' };
        const id = Math.max(...demoStore.users.map(u => u.id)) + 1;
        const newUser = { id, ...body, created_at: new Date().toISOString() };
        demoStore.users.push(newUser);
        return { success: true, data: { id }, message: 'User berhasil dibuat' };
      }
      case 'updateUser': {
        const idx = demoStore.users.findIndex(u => u.id == body.id);
        if (idx === -1) return { success: false, error: 'Not found' };
        Object.assign(demoStore.users[idx], body);
        return { success: true, message: 'User berhasil diupdate' };
      }
      case 'deleteUser': {
        demoStore.users = demoStore.users.filter(u => u.id != body.id);
        return { success: true, message: 'User berhasil dihapus' };
      }
      case 'createKelas': {
        const id = demoStore.kelas.length > 0 ? Math.max(...demoStore.kelas.map(k => k.id)) + 1 : 1;
        demoStore.kelas.push({ id, ...body, created_at: new Date().toISOString() });
        return { success: true, data: { id }, message: 'Kelas berhasil dibuat' };
      }
      case 'updateKelas': {
        const idx = demoStore.kelas.findIndex(k => k.id == body.id);
        if (idx === -1) return { success: false, error: 'Not found' };
        Object.assign(demoStore.kelas[idx], body);
        return { success: true, message: 'Kelas berhasil diupdate' };
      }
      case 'deleteKelas': {
        demoStore.kelas = demoStore.kelas.filter(k => k.id != body.id);
        return { success: true, message: 'Kelas berhasil dihapus' };
      }
      case 'createMateri': {
        const id = demoStore.materi.length > 0 ? Math.max(...demoStore.materi.map(m => m.id)) + 1 : 1;
        demoStore.materi.push({ id, ...body, created_at: new Date().toISOString() });
        return { success: true, data: { id }, message: 'Materi berhasil dibuat' };
      }
      case 'updateMateri': {
        const idx = demoStore.materi.findIndex(m => m.id == body.id);
        if (idx === -1) return { success: false, error: 'Not found' };
        Object.assign(demoStore.materi[idx], body);
        return { success: true, message: 'Materi berhasil diupdate' };
      }
      case 'deleteMateri': {
        demoStore.materi = demoStore.materi.filter(m => m.id != body.id);
        return { success: true, message: 'Materi berhasil dihapus' };
      }
      case 'enroll': {
        const exists = demoStore.enrollments.find(e => e.siswa_id == body.siswa_id && e.kelas_id == body.kelas_id);
        if (exists) return { success: false, error: 'Sudah terdaftar' };
        const id = demoStore.enrollments.length > 0 ? Math.max(...demoStore.enrollments.map(e => e.id)) + 1 : 1;
        demoStore.enrollments.push({ id, siswa_id: body.siswa_id, kelas_id: body.kelas_id, status: 'active', enrolled_at: new Date().toISOString() });
        return { success: true, data: { id }, message: 'Berhasil mendaftar kelas' };
      }
      case 'unenroll': {
        demoStore.enrollments = demoStore.enrollments.filter(e => e.id != body.id);
        return { success: true, message: 'Berhasil keluar dari kelas' };
      }
      case 'updateProgress': {
        const idx = demoStore.progress.findIndex(p => p.siswa_id == body.siswa_id && p.materi_id == body.materi_id);
        if (idx !== -1) {
          if (body.completed !== undefined) demoStore.progress[idx].completed = body.completed ? 'true' : 'false';
          if (body.score !== undefined) demoStore.progress[idx].score = body.score;
          return { success: true, message: 'Progress diupdate' };
        }
        const id = demoStore.progress.length > 0 ? Math.max(...demoStore.progress.map(p => p.id)) + 1 : 1;
        demoStore.progress.push({ id, ...body, completed: body.completed ? 'true' : 'false', completed_at: new Date().toISOString() });
        return { success: true, data: { id }, message: 'Progress dicatat' };
      }
      case 'createQuiz': {
        const id = demoStore.quizzes.length > 0 ? Math.max(...demoStore.quizzes.map(q => q.id)) + 1 : 1;
        demoStore.quizzes.push({ id, ...body, pertanyaan: JSON.stringify(body.pertanyaan), created_at: new Date().toISOString() });
        return { success: true, data: { id }, message: 'Quiz berhasil dibuat' };
      }
      case 'submitQuiz': {
        const quiz = demoStore.quizzes.find(q => q.id == body.quiz_id);
        if (!quiz) return { success: false, error: 'Quiz tidak ditemukan' };
        const questions = typeof quiz.pertanyaan === 'string' ? JSON.parse(quiz.pertanyaan) : quiz.pertanyaan;
        let correct = 0;
        body.answers.forEach(ans => {
          const q = questions[ans.question_index];
          if (q && q.correct_answer === ans.answer) correct++;
        });
        const score = Math.round((correct / questions.length) * 100);
        // Save progress
        this.demoPost('updateProgress', { siswa_id: body.siswa_id, kelas_id: body.kelas_id, materi_id: body.materi_id || quiz.materi_id, completed: true, score });
        return { success: true, data: { score, correct, total: questions.length }, message: `Quiz selesai! Skor: ${score}` };
      }
      default:
        return { success: false, error: 'Unknown action' };
    }
  }
};
