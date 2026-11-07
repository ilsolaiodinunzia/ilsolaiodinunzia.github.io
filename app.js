/* ============================================================
   IL SOLAIO DI NUNZIA — Store & UI Controller (con sync cloud)
   ============================================================ */

// ⬇️ CREDENZIALI JSONBIN
const JSONBIN_ID  = '6aef2efaac6210605a755bd5';
const JSONBIN_KEY = '$2a$10$k4I2u1RY4QjfSRFgtD5I6uWIQHEZ940Z5jK/KH9pQ1d87n8ITx33y';
const STORAGE_KEY = 'anita_borse_catalogo_v1';
const CLOUD_ENABLED = Boolean(JSONBIN_ID && JSONBIN_KEY);

const DEFAULT_BORSE = [
  { id:"01", num:"01", nome:"Mimosa", cat:"tote", anno:"2024",
    materiali:"Lino grezzo, cotone giallo, filo 40", misure:"38 × 42 × 10 cm",
    ore:"7 ore circa", stato:"In uso quotidiano", statoColore:"--oliva",
    foto:"https://picsum.photos/seed/borsa-mimosa-lino/600/750",
    nota:"Cucita in un pomeriggio di marzo, mentre fuori pioveva. Oggi ci porto il pane e i libri della biblioteca." },
  { id:"02", num:"02", nome:"Salvia", cat:"spalla", anno:"2024",
    materiali:"Cotone cerato tinta salvia, manici in fettuccia", misure:"30 × 26 × 12 cm",
    ore:"6 ore", stato:"Regalata a zia Franca", statoColore:"--terra",
    foto:"https://picsum.photos/seed/borsa-spalla-salvia/600/750",
    nota:"Il tessuto l'ho tinto a mano con la salvia del balcone: il colore viene davvero da lei." },
  { id:"03", num:"03", nome:"Ciliegie", cat:"pochette", anno:"2023",
    materiali:"Cotone stampato a ciliegie, fodera a righe", misure:"22 × 15 cm",
    ore:"3 ore", stato:"Regalata a Sara", statoColore:"--terra",
    foto:"https://picsum.photos/seed/pochette-ciliegie/600/750",
    nota:"La cerniera l'ho montata storta la prima volta. La seconda volta, quasi perfetta." },
  { id:"04", num:"04", nome:"Meridiana", cat:"secchiello", anno:"2023",
    materiali:"Pelle recuperata, juta, coulisse in cotone", misure:"Ø 20 × 24 cm",
    ore:"9 ore", stato:"In viaggio a Lisbona", statoColore:"--senape",
    foto:"https://picsum.photos/seed/secchiello-meridiana/600/750",
    nota:"La pelle viene da tre vecchie cinture trovate al mercatino di Porta Palazzo. Seconda vita, tutta intera." },
  { id:"05", num:"05", nome:"Caffelatte", cat:"tracolla", anno:"2024",
    materiali:"Canvas riciclato color caffè, fibbia in ottone", misure:"26 × 20 × 8 cm",
    ore:"5 ore", stato:"In uso quotidiano", statoColore:"--oliva",
    foto:"https://picsum.photos/seed/tracolla-caffelatte/600/750",
    nota:"Nata da uno scampolo regalatomi da una tappezzeria che chiudeva. Un pezzo di bottega che continua a vivere." },
  { id:"06", num:"06", nome:"Notte di luglio", cat:"spalla", anno:"2022",
    materiali:"Lino tinto in indaco, cuciture a vista", misure:"34 × 30 cm",
    ore:"8 ore", stato:"Custodita nell'armadio", statoColore:"--oliva",
    foto:"https://picsum.photos/seed/borsa-indaco-notte/600/750",
    nota:"Tinta nell'indaco in terrazzo, in una notte d'estate. Sa ancora un po' di mare." },
  { id:"07", num:"07", nome:"Brina", cat:"pochette", anno:"2022",
    materiali:"Lana cotta grigia, bottone in legno", misure:"20 × 14 cm",
    ore:"2 ore e mezza", stato:"Regalata a Luisa", statoColore:"--terra",
    foto:"https://picsum.photos/seed/pochette-brina-lana/600/750",
    nota:"Cucita tutta a mano, davanti alla stufa. Punti lenti, pensieri calmi." },
  { id:"08", num:"08", nome:"Girasole", cat:"tote", anno:"2023",
    materiali:"Canvas senape, tascone frontale", misure:"40 × 45 cm",
    ore:"6 ore", stato:"Su misura per un'amica", statoColore:"--senape",
    foto:"https://picsum.photos/seed/tote-girasole-senape/600/750",
    nota:"Mi è stato chiesto: «una borsa dove ci stia un girasole». Detto, fatto." },
  { id:"09", num:"09", nome:"Piccola Pioggia", cat:"tracolla", anno:"2024",
    materiali:"Tessuto tecnico azzurro, cuciture sigillate", misure:"24 × 18 cm",
    ore:"4 ore", stato:"In attesa di destino", statoColore:"--senape",
    foto:"https://picsum.photos/seed/tracolla-pioggia-azzurra/600/750",
    nota:"Nata per le giornate grigie. Tiene all'asciutto anche i pensieri." },
  { id:"10", num:"10", nome:"Prima Vera", cat:"spalla", anno:"2019",
    materiali:"Cotone a quadri, manici in legno", misure:"28 × 25 cm",
    ore:"12 ore (e qualche lacrima)", stato:"La prima: non si tocca", statoColore:"--terra",
    foto:"https://picsum.photos/seed/borsa-prima-vera/600/750",
    nota:"La mia prima borsa. Storta, sbilenca, imperfetta. La tengo appesa dove la vedo, come promemoria." }
];

class CatalogStore {
  constructor() {
    this.borse = [];
    this.ready = this.init();
  }

  async init() {
    // 1. Provo a caricare dal cloud
    if (CLOUD_ENABLED) {
      try {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`, {
          headers: { 'X-Access-Key': JSONBIN_KEY }
        });
        if (res.ok) {
          const json = await res.json();
          const data = json.record;
          if (Array.isArray(data) && data.length > 0) {
            this.borse = data;
            this.saveToLocal();
            window.dispatchEvent(new CustomEvent('anita:catalog-updated', { detail: this.borse }));
            console.log('✅ Catalogo caricato dal cloud:', this.borse.length, 'borse');
            return;
          }
        }
      } catch (e) {
        console.warn('⚠️ Cloud non raggiungibile, uso cache locale:', e);
      }
    }

    // 2. Fallback: localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.borse = JSON.parse(stored);
      } else {
        this.borse = [...DEFAULT_BORSE];
        await this.saveAll();
      }
    } catch (e) {
      this.borse = [...DEFAULT_BORSE];
    }
  }

  saveToLocal() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.borse));
      window.dispatchEvent(new CustomEvent('anita:catalog-updated', { detail: this.borse }));
    } catch (e) {
      console.error('Errore salvataggio locale:', e);
    }
  }

  async saveAll() {
    this.saveToLocal();
    if (!CLOUD_ENABLED) return;
    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Key': JSONBIN_KEY
        },
        body: JSON.stringify(this.borse)
      });
      if (res.ok) {
        console.log('✅ Salvato sul cloud');
      } else {
        console.warn('⚠️ Errore salvataggio cloud:', res.status);
      }
    } catch (e) {
      console.warn('⚠️ Salvataggio cloud fallito:', e);
    }
  }

  getAll() { return [...this.borse]; }
  getById(id) { return this.borse.find(b => b.id === String(id)); }

  getNextNum() {
    const nums = this.borse.map(b => parseInt(b.num, 10)).filter(n => !isNaN(n));
    const max = nums.length ? Math.max(...nums) : 0;
    return String(max + 1).padStart(2, '0');
  }

  async saveItem(data) {
    const isEdit = Boolean(data.id);
    if (isEdit) {
      const idx = this.borse.findIndex(b => b.id === String(data.id));
      if (idx === -1) throw new Error('Borsa non trovata');
      this.borse[idx] = { ...this.borse[idx], ...data };
    } else {
      const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
      const num = data.num || this.getNextNum();
      this.borse.unshift({
        id, num,
        nome: data.nome || 'Borsa senza nome',
        cat: data.cat || 'tote',
        anno: data.anno || new Date().getFullYear().toString(),
        materiali: data.materiali || '',
        misure: data.misure || '',
        ore: data.ore || '',
        stato: data.stato || 'Disponibile',
        statoColore: data.statoColore || '--oliva',
        foto: data.foto || `https://picsum.photos/seed/borsa-${id}/600/750`,
        nota: data.nota || ''
      });
    }
    await this.saveAll();
  }

  async deleteItem(id) {
    this.borse = this.borse.filter(b => b.id !== String(id));
    await this.saveAll();
  }

  async resetToDefault() {
    this.borse = [...DEFAULT_BORSE];
    await this.saveAll();
  }

  exportJSON() { return JSON.stringify(this.borse, null, 2); }

  async importJSON(jsonStr) {
    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) throw new Error('Il file JSON deve contenere una lista');
    this.borse = parsed;
    await this.saveAll();
  }

  static compressImage(file, maxWidth = 1000, quality = 0.75) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        return reject(new Error('File immagine non valido'));
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width, h = img.height;
          if (w > maxWidth) {
            h = Math.round((h * maxWidth) / w);
            w = maxWidth;
          }
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, w, h);
          let dataUrl = canvas.toDataURL('image/webp', quality);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('Errore caricamento immagine'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Errore lettura file'));
      reader.readAsDataURL(file);
    });
  }
}

window.catalogStore = new CatalogStore();

/* ============================================================
   AVVIO UI — aspetta che il catalogo sia pronto
   ============================================================ */
document.addEventListener('DOMContentLoaded', async () => {
  await window.catalogStore.ready;
  if (document.querySelector('.griglia')) initPublicUI();
  if (document.querySelector('.auth-wrapper')) initAdminUI();
});

/* ---------- INDEX (catalogo pubblico) ---------- */
function initPublicUI() {
  const griglia = document.querySelector('.griglia');
  const contaPezzi = document.querySelector('.conta-pezzi');
  const sipario = document.querySelector('.sipario');

  function render(borse) {
    griglia.innerHTML = '';
    if (contaPezzi) contaPezzi.textContent = `${borse.length} pezzi censiti… ma altri dormono nei cassetti`;

    borse.forEach((b, i) => {
      const li = document.createElement('li');
      li.className = 'carta reveal';
      li.style.setProperty('--r', i);
      li.innerHTML = `
        <div class="carta-foto">
          <img src="${b.foto}" alt="${b.nome}" loading="lazy">
          <span class="pezzo">Pz. n° ${b.num}</span>
          <span class="ingrandisci">🔍 Guarda</span>
        </div>
        <div class="carta-corpo">
          <div class="carta-testa"><h3>${b.nome}</h3><span class="anno">${b.anno}</span></div>
          <p class="materiali-riga">${b.materiali}</p>
        </div>`;
      li.addEventListener('click', () => apriSipario(b.id));
      griglia.appendChild(li);
    });

    setTimeout(() => {
      document.querySelectorAll('.griglia .reveal').forEach(el => el.classList.add('in'));
    }, 60);
  }

  function apriSipario(id) {
    const b = window.catalogStore.getById(id);
    if (!b || !sipario) return;
    const scheda = sipario.querySelector('.scheda');
    scheda.innerHTML = `
      <button class="chiudi" aria-label="Chiudi">✕</button>
      <div class="scheda-foto"><img src="${b.foto}" alt="${b.nome}"></div>
      <div class="scheda-corpo">
        <div class="capitolo">Pezzo n. ${b.num} — ${b.cat}</div>
        <h3>${b.nome}</h3>
        <dl class="scheda-dettagli">
          <div><dt>Anno</dt><dd>${b.anno}</dd></div>
          <div><dt>Materiali</dt><dd>${b.materiali}</dd></div>
          <div><dt>Misure</dt><dd>${b.misure}</dd></div>
          <div><dt>Ore di cucito</dt><dd>${b.ore}</dd></div>
          <div><dt>Adesso</dt><dd>${b.stato}</dd></div>
        </dl>
        ${b.nota ? `<p class="scheda-nota">✎ ${b.nota}</p>` : ''}
      </div>`;
    sipario.classList.add('aperto');
    scheda.querySelector('.chiudi').addEventListener('click', () => sipario.classList.remove('aperto'));
  }

  sipario.addEventListener('click', e => { if (e.target === sipario) sipario.classList.remove('aperto'); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') sipario.classList.remove('aperto');
  });

  window.addEventListener('anita:catalog-updated', e => render(e.detail));
  render(window.catalogStore.getAll());
}

/* ---------- ADMIN ---------- */
function initAdminUI() {
  const ADMIN_PWD = "nunzia2024";

  const authWrapper = document.querySelector('.auth-wrapper');
  const adminHeader = document.querySelector('.admin-header');
  const adminMain   = document.querySelector('.admin-main');
  const formLogin   = document.getElementById('form-login');
  const errLogin    = document.querySelector('.messaggio-errore');
  const btnLogout   = document.getElementById('btn-logout');
  const btnAdd      = document.getElementById('btn-add');
  const adminGrid   = document.querySelector('.admin-grid');
  const statNum     = document.getElementById('stat-num');
  const cercaInput  = document.getElementById('cerca');

  const modal       = document.querySelector('.modal-overlay');
  const modalChiudiBtns = document.querySelectorAll('.modal-chiudi, .modal-chiudi-alt');
  const formBorsa   = document.getElementById('form-borsa');
  const fotoUpload  = document.querySelector('.foto-upload-box');
  const fotoFile    = document.getElementById('foto-file');
  const fotoUrl     = document.getElementById('foto-url');
  const fotoPreview = document.querySelector('.foto-preview');

  const btnDownload = document.getElementById('btn-backup-download');
  const btnUpload   = document.getElementById('btn-backup-upload');
  const backupFile  = document.getElementById('backup-file');
  const btnReset    = document.getElementById('btn-backup-reset');

  let currentEditId = null;
  let currentFoto   = '';

  function showAuth() {
    authWrapper.style.display = 'flex';
    adminHeader.style.display = 'none';
    adminMain.style.display = 'none';
  }
  function showAdmin() {
    authWrapper.style.display = 'none';
    adminHeader.style.display = 'block';
    adminMain.style.display = 'block';
    renderGrid();
  }

  formLogin.addEventListener('submit', e => {
    e.preventDefault();
    const pwd = document.getElementById('password').value;
    if (pwd === ADMIN_PWD) {
      sessionStorage.setItem('admin_logged', '1');
      errLogin.style.display = 'none';
      showAdmin();
    } else {
      errLogin.style.display = 'block';
    }
  });

  btnLogout.addEventListener('click', () => {
    sessionStorage.removeItem('admin_logged');
    showAuth();
  });

  function renderGrid(filtra = '') {
    const borse = window.catalogStore.getAll();
    statNum.textContent = borse.length;
    adminGrid.innerHTML = '';
    const q = filtra.trim().toLowerCase();
    const lista = q
      ? borse.filter(b =>
          b.nome.toLowerCase().includes(q) ||
          (b.materiali || '').toLowerCase().includes(q) ||
          (b.stato || '').toLowerCase().includes(q))
      : borse;

    lista.forEach(b => {
      const card = document.createElement('div');
      card.className = 'admin-card';
      card.innerHTML = `
        <div class="admin-card-thumb"><img src="${b.foto}" alt="${b.nome}"></div>
        <div class="admin-card-info">
          <div class="admin-card-head">
            <span class="admin-card-num">Pz. ${b.num}</span>
            <span class="admin-card-title">${b.nome}</span>
          </div>
          <div class="admin-card-cat">${b.cat} · ${b.anno}</div>
          <div class="admin-card-stato" style="--puntino:var(${b.statoColore})">${b.stato}</div>
          <div class="admin-card-actions">
            <button class="btn-sm btn-edit" data-id="${b.id}">✏️ Modifica</button>
            <button class="btn-sm btn-del" data-id="${b.id}">🗑️ Elimina</button>
          </div>
        </div>`;
      adminGrid.appendChild(card);
    });

    adminGrid.querySelectorAll('.btn-edit').forEach(btn =>
      btn.addEventListener('click', () => apriModale(btn.dataset.id)));
    adminGrid.querySelectorAll('.btn-del').forEach(btn =>
      btn.addEventListener('click', () => {
        if (confirm('Sei sicura di voler eliminare questa borsa?')) {
          window.catalogStore.deleteItem(btn.dataset.id);
          renderGrid(cercaInput.value);
          showToast('Borsa eliminata.');
        }
      }));
  }

  cercaInput.addEventListener('input', e => renderGrid(e.target.value));

  function apriModale(id = null) {
    currentEditId = id;
    currentFoto = '';
    formBorsa.reset();
    fotoPreview.style.display = 'none';
    fotoPreview.src = '';
    fotoUrl.value = '';

    const titolo = document.querySelector('.modal-titolo');
    if (id) {
      const b = window.catalogStore.getById(id);
      if (b) {
        titolo.textContent = 'Modifica Borsa';
        formBorsa.nome.value = b.nome || '';
        formBorsa.num.value = b.num || '';
        formBorsa.cat.value = b.cat || 'tote';
        formBorsa.anno.value = b.anno || '';
        formBorsa.materiali.value = b.materiali || '';
        formBorsa.misure.value = b.misure || '';
        formBorsa.ore.value = b.ore || '';
        formBorsa.stato.value = b.stato || '';
        formBorsa.nota.value = b.nota || '';
        const radio = formBorsa.querySelector(`input[name="statoColore"][value="${b.statoColore}"]`);
        if (radio) radio.checked = true;
        currentFoto = b.foto;
        fotoPreview.src = b.foto;
        fotoPreview.style.display = 'block';
      }
    } else {
      titolo.textContent = 'Nuova Borsa';
      formBorsa.num.value = window.catalogStore.getNextNum();
      formBorsa.anno.value = new Date().getFullYear();
    }
    modal.classList.add('attiva');
  }

  function chiudiModale() {
    modal.classList.remove('attiva');
  }

  btnAdd.addEventListener('click', () => apriModale());
  modalChiudiBtns.forEach(b => b.addEventListener('click', chiudiModale));
  modal.addEventListener('click', e => { if (e.target === modal) chiudiModale(); });

  fotoUpload.addEventListener('click', () => fotoFile.click());

  fotoFile.addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const dataUrl = await CatalogStore.compressImage(file);
      currentFoto = dataUrl;
      fotoPreview.src = dataUrl;
      fotoPreview.style.display = 'block';
      showToast('Foto compressa e pronta!');
    } catch (err) {
      alert('Errore: ' + err.message);
    }
  });

  fotoUrl.addEventListener('input', e => {
    if (e.target.value) {
      currentFoto = e.target.value;
      fotoPreview.src = e.target.value;
      fotoPreview.style.display = 'block';
    }
  });

  formBorsa.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(formBorsa);
    const data = Object.fromEntries(fd.entries());

    if (currentFoto) {
      data.foto = currentFoto;
    } else if (data.foto_url) {
      data.foto = data.foto_url;
    } else {
      data.foto = `https://picsum.photos/seed/borsa-${Date.now()}/600/750`;
    }
    delete data.foto_url;
    data.statoColore = fd.get('statoColore') || '--oliva';
    if (currentEditId) data.id = currentEditId;

    try {
      window.catalogStore.saveItem(data);
      chiudiModale();
      renderGrid(cercaInput.value);
      showToast(currentEditId ? 'Borsa aggiornata! ✨' : 'Nuova borsa aggiunta! ✨');
    } catch (err) {
      alert('Errore salvataggio: ' + err.message);
    }
  });

  btnDownload.addEventListener('click', () => {
    const dataStr = window.catalogStore.exportJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `catalogo-nunzia-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup scaricato 📥');
  });

  btnUpload.addEventListener('click', () => backupFile.click());
  backupFile.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        window.catalogStore.importJSON(ev.target.result);
        renderGrid();
        showToast('Catalogo ripristinato dal backup! 📤');
      } catch (err) {
        alert('Errore nel file: ' + err.message);
      }
    };
    reader.readAsText(file);
    backupFile.value = '';
  });

  btnReset.addEventListener('click', () => {
    if (confirm('Sei sicura di voler ripristinare le 10 borse iniziali? Tutte le modifiche andranno perse.')) {
      window.catalogStore.resetToDefault();
      renderGrid();
      showToast('Catalogo ripristinato alle 10 borse iniziali 🔄');
    }
  });

  if (sessionStorage.getItem('admin_logged') === '1') {
    showAdmin();
  } else {
    showAuth();
  }
}

/* ---------- Toast ---------- */
function showToast(msg) {
  let t = document.querySelector('.toast-notifica');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast-notifica';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('visibile');
  clearTimeout(t._tm);
  t._tm = setTimeout(() => t.classList.remove('visibile'), 2800);
}