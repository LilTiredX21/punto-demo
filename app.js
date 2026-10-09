/* ==========================================================================
   PUNTO — Lógica de la interfaz (prototipo)
   Mejoras frente al original:
   · Fuente de datos única (sin marcado duplicado en HTML)
   · Modal con trampa de foco, cierre con ESC y restauración del foco
   · Validación del buscador del hero
   · Búsqueda con debounce
   · Iniciales correctas para nombres de una sola palabra
   · Animaciones del grafo compatibles con "movimiento reducido"
   ========================================================================== */
(function () {
  'use strict';

  /* Marca el documento como "con JS" para habilitar animaciones de revelado */
  document.documentElement.classList.add('js');

  /* ========================================================================
     1. DATOS DEL PROTOTIPO (fuente única de verdad)
     ======================================================================== */
  const CATEGORIES = [
    { icon: '📰', name: 'Periodismo', desc: 'Reportería, fuentes, entrevistas y redacción especializada.', need: '“Necesito redactar notas de prensa o encontrar un periodista.”' },
    { icon: '📸', name: 'Fotografía', desc: 'Corporativa, producto, eventos, retratos y moda.', need: '“Necesito fotos profesionales para mi marca.”' },
    { icon: '🎥', name: 'Video Corporativo', desc: 'Cobertura, testimoniales, institucional y reels.', need: '“Necesito un video institucional para mi empresa.”' },
    { icon: '🎵', name: 'Videoclips', desc: 'Dirección, producción y postproducción musical.', need: '“Necesito producir un videoclip para mi banda.”' },
    { icon: '🎉', name: 'Eventos', desc: 'Registro audiovisual y transmisión en vivo.', need: '“Necesito cubrir un evento de 200 personas.”' },
    { icon: '📱', name: 'Contenido UGC', desc: 'Videos nativos para TikTok e Instagram Reels.', need: '“Necesito 5 videos UGC para lanzar un producto.”' },
    { icon: '🤝', name: 'Relaciones Públicas', desc: 'Gestión de prensa, voceros y reputación.', need: '“Necesito posicionar mi marca en medios.”' },
    { icon: '🏢', name: 'Com. Organizacional', desc: 'Comunicación interna y marca empleadora.', need: '“Necesito estructurar mi comunicación interna.”' },
    { icon: '🎨', name: 'Diseño & Brand', desc: 'Identidad visual, piezas gráficas y kits.', need: '“Necesito rediseñar la línea gráfica.”' },
    { icon: '📣', name: 'Estrategia Digital', desc: 'Planeación de contenidos y pauta.', need: '“Necesito una estrategia para redes sociales.”' },
    { icon: '👥', name: 'Equipos (Studios)', desc: 'Células de producción completas llave en mano.', need: '“Necesito un equipo completo para un rodaje.”' },
  ];

  const PROFILES_INDIVIDUAL = [
    { type: 'pro', name: 'María Gómez', role: 'Fotógrafa Profesional', city: 'Medellín', rating: '4.9', exp: '4 años', tags: ['Fotografía Corporativa', 'Eventos', 'Retrato'], cat: 'Fotografía', price: 'Desde $400.000' },
    { type: 'pro', name: 'Carlos Restrepo', role: 'Productor Audiovisual', city: 'Medellín', rating: '5.0', exp: '7 años', tags: ['Documental', 'Corporativo', 'Edición'], cat: 'Video Corporativo', price: 'Desde $800.000' },
    { type: 'pro', name: 'Laura Martínez', role: 'Creadora UGC', city: 'Medellín', rating: '4.8', exp: '2 años', tags: ['Lifestyle', 'Beauty', 'TikTok'], cat: 'Contenido UGC', price: 'Desde $250.000' },
    { type: 'pro', name: 'Andrés Peláez', role: 'Periodista Económico', city: 'Medellín', rating: '4.9', exp: '9 años', tags: ['Economía', 'Entrevistas', 'Prensa'], cat: 'Periodismo', price: 'Desde $600.000' },
    { type: 'pro', name: 'Isabel Cano', role: 'Consultora RRPP', city: 'Medellín', rating: '4.7', exp: '6 años', tags: ['Medios', 'Gestión de Crisis'], cat: 'Relaciones Públicas', price: 'Desde $1.200.000' },
  ];

  const PROFILES_STUDIOS = [
    { type: 'studio', name: 'Lumina Studio', role: 'Célula de Videoclips & Cine', city: 'Medellín', rating: '5.0', exp: '32 proyectos', tags: ['Director', 'DoP', 'Camarógrafo', 'Editor'], cat: 'Videoclips', price: 'Desde $2.500.000' },
    { type: 'studio', name: 'Ecosistema UGC Med', role: 'Colectivo de Creadores', city: 'Medellín', rating: '4.9', exp: '120 piezas', tags: ['3 Creadores', 'Estratega', 'Editor Express'], cat: 'Contenido UGC', price: 'Desde $1.500.000' },
    { type: 'studio', name: 'Pulse Events Media', role: 'Equipo de Cobertura en Vivo', city: 'Medellín', rating: '4.8', exp: '45 eventos', tags: ['Fotógrafo', '2 Cámaras', 'Streaming'], cat: 'Eventos', price: 'Desde $3.000.000' },
  ];

  const COURSES = [
    { fmt: 'VIRTUAL', name: 'UGC Profesional & Monetización' },
    { fmt: 'VIRTUAL', name: 'IA para Comunicadores y Redactores' },
    { fmt: 'PRESENCIAL', name: 'Producción y Dirección de Videoclips' },
    { fmt: 'VIRTUAL', name: 'Storytelling para Marcas' },
    { fmt: 'PRESENCIAL', name: 'Estrategias de Relaciones con Medios' },
    { fmt: 'VIRTUAL', name: 'Marca Personal para Freelancers' },
    { fmt: 'HÍBRIDO', name: 'Comunicación Organizacional Avanzada' },
    { fmt: 'VIRTUAL', name: 'Presupuestación y Tarifas Creativas' },
  ];

  /* ========================================================================
     2. UTILIDADES
     ======================================================================== */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  function debounce(fn, ms) {
    let t;
    return function () {
      const args = arguments;
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  function initials(name) {
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  /* ========================================================================
     3. RENDER DE CATEGORÍAS
     ======================================================================== */
  const catGrid = $('#catGrid');
  if (catGrid) {
    CATEGORIES.forEach(c => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'cat-card';
      el.innerHTML =
        '<div class="cat-icon" aria-hidden="true">' + c.icon + '</div>' +
        '<h3>' + escapeHtml(c.name) + '</h3>' +
        '<p>' + escapeHtml(c.desc) + '</p>' +
        '<div class="cat-need">' + escapeHtml(c.need) + '</div>';
      el.addEventListener('click', () => {
        const desc = $('#pDesc');
        if (desc) desc.value = 'Necesito asistencia con: ' + c.name + ' (' + c.need + ')';
        openTab('proyecto');
        scrollToForm();
      });
      catGrid.appendChild(el);
    });
  }

  /* ========================================================================
     4. RENDER DE ACADEMY
     ======================================================================== */
  const courseGrid = $('#courseGrid');
  if (courseGrid) {
    COURSES.forEach(course => {
      const el = document.createElement('div');
      el.className = 'course-card';
      el.innerHTML =
        '<div class="fmt">' + escapeHtml(course.fmt) + '</div>' +
        '<h3>' + escapeHtml(course.name) + '</h3>';
      courseGrid.appendChild(el);
    });
  }

  /* ========================================================================
     5. MARKETPLACE / STUDIOS
     ======================================================================== */
  const mpFilters = $('#mpFilters');
  const mpGrid = $('#mpGrid');
  const mpSearch = $('#mpSearch');
  const btnShowPros = $('#btnShowPros');
  const btnShowStudios = $('#btnShowStudios');

  const state = { view: 'pro', filter: 'Todos', search: '' };

  function activeList() {
    return state.view === 'pro' ? PROFILES_INDIVIDUAL : PROFILES_STUDIOS;
  }

  function renderFilters() {
    if (!mpFilters) return;
    mpFilters.innerHTML = '';
    const list = activeList();
    const cats = ['Todos'].concat(Array.from(new Set(list.map(i => i.cat))));
    cats.forEach(f => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'filter-chip' + (f === state.filter ? ' active' : '');
      chip.setAttribute('aria-pressed', String(f === state.filter));
      chip.textContent = f;
      chip.addEventListener('click', () => {
        state.filter = f;
        renderFilters();
        renderMarketplace();
      });
      mpFilters.appendChild(chip);
    });
  }

  function renderMarketplace() {
    if (!mpGrid) return;
    mpGrid.innerHTML = '';
    const list = activeList();
    const term = state.search.toLowerCase();

    const filtered = list.filter(p => {
      const matchCat = state.filter === 'Todos' || p.cat === state.filter;
      const haystack = (p.name + ' ' + p.role + ' ' + p.city + ' ' + p.tags.join(' ')).toLowerCase();
      return matchCat && (!term || haystack.includes(term));
    });

    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'mp-empty';
      empty.textContent = 'Ningún perfil o equipo coincide con la búsqueda.';
      mpGrid.appendChild(empty);
      return;
    }

    filtered.forEach(p => {
      const el = document.createElement('div');
      el.className = 'profile-card';
      el.innerHTML =
        '<div class="profile-top">' +
          '<div class="avatar' + (p.type === 'studio' ? ' is-studio' : '') + '">' + escapeHtml(initials(p.name)) + '</div>' +
          '<div><div class="profile-name">' + escapeHtml(p.name) + '</div>' +
          '<div class="profile-role">' + escapeHtml(p.role) + '</div></div>' +
        '</div>' +
        '<div class="profile-meta">' +
          '<span>📍 ' + escapeHtml(p.city) + '</span>' +
          '<span>⭐ ' + escapeHtml(p.rating) + '</span>' +
          '<span>💼 ' + escapeHtml(p.exp) + '</span>' +
        '</div>' +
        '<div class="profile-tags">' + p.tags.map(t => '<span class="tag">' + escapeHtml(t) + '</span>').join('') + '</div>' +
        '<div class="profile-foot">' +
          '<span class="avail">' + escapeHtml(p.price) + '</span>' +
          '<button class="btn btn-ghost btn-sm" type="button">Ver ficha</button>' +
        '</div>';
      el.querySelector('button').addEventListener('click', () => openModal(p));
      mpGrid.appendChild(el);
    });
  }

  function setView(view) {
    state.view = view;
    state.filter = 'Todos';
    if (btnShowPros) {
      btnShowPros.classList.toggle('active', view === 'pro');
      btnShowPros.setAttribute('aria-pressed', String(view === 'pro'));
    }
    if (btnShowStudios) {
      btnShowStudios.classList.toggle('active', view === 'studio');
      btnShowStudios.setAttribute('aria-pressed', String(view === 'studio'));
    }
    renderFilters();
    renderMarketplace();
  }

  if (btnShowPros) btnShowPros.addEventListener('click', () => setView('pro'));
  if (btnShowStudios) btnShowStudios.addEventListener('click', () => setView('studio'));
  if (mpSearch) {
    mpSearch.addEventListener('input', debounce(function () {
      state.search = mpSearch.value.trim();
      renderMarketplace();
    }, 200));
  }

  /* ========================================================================
     6. BUSCADOR DEL HERO
     ======================================================================== */
  const heroNeedInput = $('#heroNeedInput');
  const heroNeedBtn = $('#heroNeedBtn');

  function submitHeroNeed() {
    if (!heroNeedInput) return;
    const value = heroNeedInput.value.trim();

    if (!value) {
      heroNeedInput.setAttribute('aria-invalid', 'true');
      heroNeedInput.classList.remove('shake');
      // reinicia la animación
      void heroNeedInput.offsetWidth;
      heroNeedInput.classList.add('shake');
      heroNeedInput.focus();
      return;
    }
    heroNeedInput.removeAttribute('aria-invalid');

    const desc = $('#pDesc');
    if (desc) desc.value = value;
    openTab('proyecto');
    scrollToForm();
  }

  if (heroNeedBtn) heroNeedBtn.addEventListener('click', submitHeroNeed);
  if (heroNeedInput) {
    heroNeedInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); submitHeroNeed(); }
    });
    heroNeedInput.addEventListener('input', () => heroNeedInput.removeAttribute('aria-invalid'));
  }

  /* ========================================================================
     7. MODAL DE PERFIL (con trampa de foco)
     ======================================================================== */
  const modalOverlay = $('#modalOverlay');
  const modalCard = $('#modalCard');
  let lastFocused = null;
  let currentProfile = null;

  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function showModal(html) {
    if (!modalOverlay || !modalCard) return;
    lastFocused = document.activeElement;
    modalCard.innerHTML = html;
    modalOverlay.hidden = false;
    modalOverlay.classList.add('open');
    document.body.classList.add('no-scroll');
    const closeBtn = modalCard.querySelector('[data-modal="close"]');
    if (closeBtn) closeBtn.focus();
  }

  function openModal(p) {
    currentProfile = p;
    showModal(
      '<button class="modal-close" type="button" data-modal="close" aria-label="Cerrar">✕</button>' +
      '<div style="display:flex; gap:16px; align-items:center; margin-bottom:20px;">' +
        '<div class="avatar' + (p.type === 'studio' ? ' is-studio' : '') + '" style="width:60px; height:60px; font-size:20px;">' + escapeHtml(initials(p.name)) + '</div>' +
        '<div>' +
          '<h3 style="font-size:22px;">' + escapeHtml(p.name) + '</h3>' +
          '<p style="color:var(--text-dim); font-size:14px;">' + escapeHtml(p.role) + ' · 📍 ' + escapeHtml(p.city) + '</p>' +
        '</div>' +
      '</div>' +
      '<div style="margin-bottom:16px;">' +
        '<h4 class="modal-label">ESPECIALIDADES / COMPONENTES</h4>' +
        '<div class="profile-tags">' + p.tags.map(t => '<span class="tag">' + escapeHtml(t) + '</span>').join('') + '</div>' +
      '</div>' +
      '<div style="margin-bottom:16px;">' +
        '<h4 class="modal-label">RANGO DE REFERENCIA</h4>' +
        '<p style="font-size:15px; font-weight:600; color:var(--purple);">' + escapeHtml(p.price) + '</p>' +
      '</div>' +
      '<div class="modal-note">Ficha de demostración de prototipo. En la plataforma real podrás revisar portafolio completo, disponibilidad en calendario y contratar directamente con pago protegido.</div>' +
      '<button class="btn btn-primary" style="width:100%;" type="button" data-modal="solicitar">Solicitar cotización con ' + escapeHtml(p.name.split(' ')[0]) + '</button>'
    );
  }

  /* Vista de detalle de un servicio de la red (reutiliza overlay + trampa de foco) */
  function openServiceDetail(s) {
    currentProfile = null;
    showModal(
      '<button class="modal-close" type="button" data-modal="close" aria-label="Cerrar">✕</button>' +
      '<p class="modal-label">SERVICIO PUNTO</p>' +
      '<h3 style="font-size:22px; margin-bottom:10px;">' + escapeHtml(s.label) + '</h3>' +
      '<p style="color:var(--text-dim); font-size:14.5px; line-height:1.6;">' + escapeHtml(s.detail) + '</p>' +
      '<div class="modal-note" style="margin-top:18px;">Prototipo: la contratación y el pago se habilitarían en la plataforma real.</div>' +
      '<button class="btn btn-primary" style="width:100%;" type="button" data-modal="service" data-service="' + escapeHtml(s.label) + '">Cuéntanos tu proyecto</button>'
    );
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    modalOverlay.hidden = true;
    document.body.classList.remove('no-scroll');
    modalCard.innerHTML = '';
    currentProfile = null;
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    lastFocused = null;
  }

  if (modalOverlay) {
    // Delegación de eventos: no se acumulan listeners al abrir el modal
    modalOverlay.addEventListener('click', e => {
      if (e.target === modalOverlay) { closeModal(); return; }
      const action = e.target.getAttribute && e.target.getAttribute('data-modal');
      if (action === 'close') closeModal();
      if (action === 'solicitar' && currentProfile) {
        const desc = $('#pDesc');
        if (desc) desc.value = 'Cotización directa para: ' + currentProfile.name + ' (' + currentProfile.role + ')';
        closeModal();
        openTab('proyecto');
        scrollToForm();
      }
      if (action === 'service') {
        const svc = e.target.getAttribute('data-service') || '';
        const desc = $('#pDesc');
        if (desc) desc.value = 'Necesito asistencia con: ' + svc;
        closeModal();
        openTab('proyecto');
        scrollToForm();
      }
    });

    // Trampa de foco + cierre con ESC
    modalOverlay.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
      if (e.key !== 'Tab') return;

      const focusables = $$(FOCUSABLE, modalCard).filter(el => el.offsetParent !== null);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });
  }

  /* ========================================================================
     8. CHIPS DE SELECCIÓN
     ======================================================================== */
  $$('.chip-select').forEach(group => {
    const chips = $$('.chip-opt', group);
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => {
          c.classList.remove('sel');
          c.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add('sel');
        chip.setAttribute('aria-pressed', 'true');
      });
    });
  });

  /* ========================================================================
     9. PESTAÑAS DE FORMULARIO
     ======================================================================== */
  function openTab(name) {
    $$('.form-tab').forEach(t => {
      const active = t.dataset.tab === name;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', String(active));
    });
    $$('.form-panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + name));
  }

  function scrollToForm() {
    const target = $('#formularios');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  }

  $$('.form-tab').forEach(t => t.addEventListener('click', () => openTab(t.dataset.tab)));
  $$('[data-tab-open]').forEach(el => {
    el.addEventListener('click', () => openTab(el.dataset.tabOpen));
  });

  /* ========================================================================
     10. ENVÍO DE FORMULARIOS (simulación con validación nativa)
     ======================================================================== */
  function bindForm(formId, bannerId) {
    const form = document.getElementById(formId);
    const banner = document.getElementById(bannerId);
    if (!form || !banner) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      banner.classList.add('show');
      form.reset();
      // Reestablece la primera opción de cada grupo de chips
      $$('.chip-select', form).forEach(group => {
        $$('.chip-opt', group).forEach((c, i) => {
          c.classList.toggle('sel', i === 0);
          c.setAttribute('aria-pressed', String(i === 0));
        });
      });
    });
  }

  bindForm('formProyecto', 'pConfirm');
  bindForm('formPro', 'proConfirm');
  bindForm('formEmpresa', 'empConfirm');

  /* ========================================================================
     11. HEADER + MENÚ MÓVIL
     ======================================================================== */
  const header = $('#header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  const navToggle = $('#navToggle');
  const mobilePanel = $('#mobilePanel');

  function openMobile() {
    if (!mobilePanel || !navToggle) return;
    mobilePanel.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Cerrar menú');
    document.body.classList.add('no-scroll');
  }
  function closeMobile() {
    if (!mobilePanel || !navToggle) return;
    mobilePanel.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
    document.body.classList.remove('no-scroll');
  }

  if (navToggle && mobilePanel) {
    navToggle.addEventListener('click', () => {
      mobilePanel.classList.contains('open') ? closeMobile() : openMobile();
    });
    $$('a', mobilePanel).forEach(a => a.addEventListener('click', closeMobile));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobilePanel.classList.contains('open')) closeMobile();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 640) closeMobile();
    });
  }

  /* ========================================================================
     12. REVELADO AL SCROLL
     ======================================================================== */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1 });
    $$('.reveal').forEach(el => io.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('in'));
  }

  /* ========================================================================
     13. RED DE SERVICIOS INTERACTIVA (reemplaza el diagrama estático)
     ======================================================================== */
  (function serviceNetwork() {
    const mount = $('#netWork');
    if (!mount) return;

    const SERVICES = [
      { label: 'Periodismo', blurb: 'Reportería, entrevistas y redacción especializada.',
        detail: 'Conectamos con periodistas y redactores para notas de prensa, entrevistas, cubrimiento de temas y contenido editorial especializado.',
        icon: '<path d="M20.2 4.6l-1.6-1.6a1.2 1.2 0 00-1.7 0L4.5 15.4 4 20l4.6-.5L20.2 6.3a1.2 1.2 0 000-1.7z"/><path d="M14 6l4 4"/>' },
      { label: 'Fotografía', blurb: 'Corporativa, producto, eventos y retrato.',
        detail: 'Sesiones de fotografía corporativa, de producto y de eventos, con edición profesional lista para tus canales.',
        icon: '<path d="M4 8h3l1.6-2.5h6.8L17 8h3v11H4z"/><circle cx="12" cy="13.2" r="3.6"/>' },
      { label: 'Video Corp.', blurb: 'Institucional, testimoniales y reels.',
        detail: 'Producción de video institucional, piezas testimoniales y reels para comunicación de marca y campañas.',
        icon: '<rect x="3" y="6" width="12" height="12" rx="2"/><path d="M15 10.5l6-3v9l-6-3z"/>' },
      { label: 'Videoclips', blurb: 'Dirección, producción y postproducción musical.',
        detail: 'Dirección, rodaje y postproducción de videoclips musicales, de la idea a la entrega final.',
        icon: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M7.5 5l2 4M12 5l2 4M16.5 5l2 4"/>' },
      { label: 'UGC', blurb: 'Contenido nativo para TikTok e Instagram.',
        detail: 'Creadores de contenido UGC para Reels y TikTok: videos nativos pensados para rendir en cada plataforma.',
        icon: '<circle cx="10.5" cy="8" r="3.2"/><path d="M4 20a6.5 6.5 0 0113 0"/><path d="M19 3.5l1.4 3.1L23 8l-2.6 1.4L19 12.5l-1.4-3.1L15 8l2.6-1.4z"/>' },
      { label: 'RRPP', blurb: 'Gestión de prensa, voceros y reputación.',
        detail: 'Relaciones públicas y gestión con medios: posicionamiento de marca, voceros y acompañamiento reputacional.',
        icon: '<path d="M4 10.5v3h3l6 4v-11l-6 4H4z"/><path d="M16.5 8.5a5 5 0 010 7"/>' },
      { label: 'Com. Org.', blurb: 'Comunicación interna y marca empleadora.',
        detail: 'Estructuración de comunicación interna, mensajes corporativos y marca empleadora para tu organización.',
        icon: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c3.2 3 3.2 14 0 17M12 3.5c-3.2 3-3.2 14 0 17"/>' },
      { label: 'Punto Studios', blurb: 'Equipos completos, llave en mano.',
        detail: 'Células de producción completas (dirección, cámara, sonido, edición) para ejecutar proyectos de principio a fin.',
        icon: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0012 0M12 17v4M9 21h6"/>' },
    ];

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Geometría: 8 nodos en círculo, coordenadas en % dentro del panel cuadrado
    const R = 37;
    SERVICES.forEach((s, i) => {
      const a = (-90 + i * 45) * Math.PI / 180;
      s.x = 50 + R * Math.cos(a);
      s.y = 50 + R * Math.sin(a);
    });

    // Línea + partícula por nodo (la partícula viaja del nodo al núcleo)
    let lines = '';
    SERVICES.forEach((s, i) => {
      const d = 'M ' + s.x.toFixed(2) + ' ' + s.y.toFixed(2) + ' L 50 50';
      const spark = reduceMotion ? '' :
        '<circle class="net-spark" r="0.55">' +
          '<animateMotion dur="' + (2.6 + i * 0.15).toFixed(2) + 's" begin="' + (0.5 + i * 0.3).toFixed(2) + 's" repeatCount="indefinite">' +
            '<mpath href="#nline-' + i + '"/>' +
          '</animateMotion>' +
        '</circle>';
      lines += '<g class="net-link" data-i="' + i + '">' +
        '<path class="net-line" id="nline-' + i + '" d="' + d + '"/>' + spark +
      '</g>';
    });

    // Nodos orbitales (botones accesibles)
    let nodeHtml = '';
    SERVICES.forEach((s, i) => {
      nodeHtml += '<button class="net-node" type="button" data-i="' + i + '" ' +
        'style="left:' + s.x.toFixed(2) + '%;top:' + s.y.toFixed(2) + '%" ' +
        'aria-label="' + escapeHtml(s.label + ': ' + s.blurb) + '" aria-expanded="false">' +
        '<span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24">' + s.icon + '</svg></span>' +
        '<span class="lbl">' + escapeHtml(s.label) + '</span>' +
      '</button>';
    });

    // Acordeón para pantallas pequeñas (misma fuente de datos)
    let accHtml = '';
    SERVICES.forEach((s, i) => {
      accHtml += '<li class="acc-item">' +
        '<button class="acc-head" type="button" data-i="' + i + '" aria-expanded="false">' +
          '<span class="acc-ic" aria-hidden="true"><svg viewBox="0 0 24 24">' + s.icon + '</svg></span>' +
          '<span class="acc-title">' + escapeHtml(s.label) + '</span>' +
          '<span class="acc-chev" aria-hidden="true"></span>' +
        '</button>' +
        '<div class="acc-body"><div class="acc-inner">' +
          '<p>' + escapeHtml(s.blurb) + '</p>' +
          '<button class="btn btn-accent btn-sm acc-more" type="button" data-i="' + i + '">Saber más</button>' +
        '</div></div>' +
      '</li>';
    });

    mount.innerHTML =
      '<div class="net-stage">' +
        '<svg class="net-lines" viewBox="0 0 100 100" aria-hidden="true">' + lines + '</svg>' +
        nodeHtml +
        '<div class="net-core"><span>PUNTO</span><small>red de servicios</small></div>' +
        '<div class="net-card" id="netCard"></div>' +
      '</div>' +
      '<ul class="net-accordion" aria-label="Servicios PUNTO">' +
        '<li class="acc-core"><span>PUNTO</span> red de servicios</li>' + accHtml +
      '</ul>';

    const card = $('#netCard', mount);
    const stage = $('.net-stage', mount);
    const nodeEls = $$('.net-node', mount);
    const linkEls = $$('.net-link', mount);

    let hoverIndex = -1;
    let pinnedIndex = -1;
    let hideTimer = null;

    const current = () => (pinnedIndex >= 0 ? pinnedIndex : hoverIndex);

    // Coloca la tarjeta cerca del nodo, siempre dentro del panel
    function positionCard(i) {
      const s = SERVICES[i];
      const W = stage.clientWidth, H = stage.clientHeight;
      const w = card.offsetWidth, h = card.offsetHeight;
      let left = s.x / 100 * W - w / 2;
      let top = s.y < 50 ? s.y / 100 * H + 40 : s.y / 100 * H - h - 40;
      const pad = 12;
      left = Math.max(pad, Math.min(left, W - w - pad));
      top = Math.max(pad, Math.min(top, H - h - pad));
      card.style.left = left + 'px';
      card.style.top = top + 'px';
    }

    function renderCard(i) {
      const s = SERVICES[i];
      card.innerHTML =
        '<p class="net-card-k">' + escapeHtml(s.label) + '</p>' +
        '<p class="net-card-t">' + escapeHtml(s.blurb) + '</p>' +
        '<button class="btn btn-accent btn-sm net-card-btn" type="button">Saber más</button>';
      card.querySelector('.net-card-btn').addEventListener('click', () => openServiceDetail(s));
      positionCard(i);
    }

    function refresh() {
      const a = current();
      nodeEls.forEach((n, k) => {
        n.classList.toggle('is-active', k === a);
        n.setAttribute('aria-expanded', String(k === a));
      });
      linkEls.forEach((g, k) => g.classList.toggle('is-active', k === a));
      if (a >= 0) {
        if (card.dataset.i !== String(a)) { card.dataset.i = String(a); renderCard(a); }
        card.classList.add('show');
      } else {
        card.classList.remove('show');
        delete card.dataset.i;
      }
    }

    function scheduleHide() {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        if (pinnedIndex < 0) { hoverIndex = -1; refresh(); }
      }, 140); // margen para pasar del nodo a la tarjeta
    }

    nodeEls.forEach(n => {
      const i = Number(n.dataset.i);
      n.addEventListener('mouseenter', () => { clearTimeout(hideTimer); hoverIndex = i; refresh(); });
      n.addEventListener('mouseleave', scheduleHide);
      n.addEventListener('focus', () => { clearTimeout(hideTimer); hoverIndex = i; refresh(); });
      n.addEventListener('blur', scheduleHide);
      n.addEventListener('click', () => {
        pinnedIndex = (pinnedIndex === i) ? -1 : i; // alterna selección
        hoverIndex = i;
        refresh();
      });
    });

    card.addEventListener('mouseenter', () => clearTimeout(hideTimer));
    card.addEventListener('mouseleave', () => { if (pinnedIndex < 0) scheduleHide(); });

    document.addEventListener('click', e => {
      if (!mount.contains(e.target)) { pinnedIndex = -1; hoverIndex = -1; refresh(); }
    });
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      if (modalOverlay && !modalOverlay.hidden) return; // el modal gestiona su propio ESC
      pinnedIndex = -1; hoverIndex = -1; refresh();
    });
    window.addEventListener('resize', () => { if (current() >= 0) positionCard(current()); });

    // Acordeón móvil
    $$('.acc-head', mount).forEach(head => {
      head.addEventListener('click', () => {
        const item = head.closest('.acc-item');
        const open = item.classList.toggle('open');
        head.setAttribute('aria-expanded', String(open));
      });
    });
    $$('.acc-more', mount).forEach(btn => {
      btn.addEventListener('click', () => openServiceDetail(SERVICES[Number(btn.dataset.i)]));
    });
  })();

  /* ========================================================================
     14. INICIALIZACIÓN
     ======================================================================== */
  renderFilters();
  renderMarketplace();
})();
