// Sidebar toggle for responsive behavior
function getAuthValue(key, fallback = '') {
  return window.sessionStorage.getItem(key) || window.localStorage.getItem(key) || fallback;
}

function hydrateSessionFromRememberedLogin() {
  const keys = [
    'sistema-avaliacao:authenticated',
    'sistema-avaliacao:studentId',
    'sistema-avaliacao:studentName',
    'sistema-avaliacao:studentEmail',
    'sistema-avaliacao:studentPhone',
    'sistema-avaliacao:studentPhoto',
    'sistema-avaliacao:studentCourse',
    'sistema-avaliacao:studentYear',
    'sistema-avaliacao:userType',
    'sistema-avaliacao:professorId'
  ];

  keys.forEach((key) => {
    const value = window.localStorage.getItem(key);
    if (value !== null && window.sessionStorage.getItem(key) === null) {
      window.sessionStorage.setItem(key, value);
    }
  });
}

function enforcePageAccess() {
  hydrateSessionFromRememberedLogin();
  const currentPage = location.pathname.split('/').pop() || 'dashboard-aluno.html';
  const isAuthenticated = getAuthValue('sistema-avaliacao:authenticated') === 'true';

  if (!isAuthenticated) {
    window.location.href = './login.html';
    return false;
  }

  const userType = getAuthValue('sistema-avaliacao:userType', 'aluno');
  const studentOnlyPages = new Set([
    'dashboard-aluno.html',
    'avaliar-professor.html',
    'minhas-avaliacoes.html'
  ]);
  const professorOnlyPages = new Set([
    'dashboard-professor.html',
    'relatorio-professor.html'
  ]);

  if (userType === 'professor' && studentOnlyPages.has(currentPage)) {
    window.location.href = './dashboard-professor.html';
    return false;
  }

  if (userType !== 'professor' && professorOnlyPages.has(currentPage)) {
    window.location.href = './dashboard-aluno.html';
    return false;
  }

  return true;
}

function setupLoggedUser() {
  const loggedUserName = document.getElementById('loggedUserName');
  const userType = getAuthValue('sistema-avaliacao:userType', 'aluno');
  const storedName = getAuthValue('sistema-avaliacao:studentName');
  const storedPhoto = getAuthValue('sistema-avaliacao:studentPhoto');
  const defaultName = userType === 'professor' ? 'Professor' : 'Estudante';
  const displayName = shortDisplayName(storedName || defaultName);

  if (loggedUserName) {
    loggedUserName.textContent = displayName;
  }

  const greeting = document.getElementById('dashboardGreeting');
  if (greeting) greeting.textContent = `Olá, ${displayName}`;

  const userName = document.getElementById('dashboardUserName');
  if (userName) userName.textContent = displayName;

  document.querySelectorAll('.user-role').forEach((element) => {
    element.textContent = userType === 'professor' ? 'Professor' : 'Estudante';
  });

  if (userType === 'professor') {
    document.querySelectorAll('.dash-header .header-security').forEach((element) => {
      element.remove();
    });

    const sidebarMenu = document.querySelector('.sidebar .menu');
    const dashboardLink = sidebarMenu?.querySelector('a[href="dashboard-professor.html"]');
    if (sidebarMenu && dashboardLink && !sidebarMenu.querySelector('a[href="relatorio-professor.html"]')) {
      const reportLink = document.createElement('a');
      reportLink.className = 'menu-item';
      reportLink.href = 'relatorio-professor.html';
      reportLink.innerHTML = '<i data-lucide="bar-chart-2"></i><span>Ver avaliações</span>';
      dashboardLink.insertAdjacentElement('afterend', reportLink);
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }
  } else {
    document.querySelectorAll('.sidebar .menu a[href="relatorio-professor.html"]').forEach((link) => {
      link.remove();
    });
  }

  document.querySelectorAll('.avatar').forEach((avatar) => {
    if (storedPhoto) {
      avatar.innerHTML = `<img src="${escapeHtml(storedPhoto)}" alt="">`;
    } else {
      avatar.textContent = initialsFromName(displayName);
    }
    avatar.setAttribute('aria-label', `Avatar de ${displayName}`);
  });
}

function shortDisplayName(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) return 'Estudante';
  if (parts.length === 1) return formatNamePart(parts[0]);
  return `${formatNamePart(parts[0])} ${formatNamePart(parts[parts.length - 1])}`;
}

function formatNamePart(value) {
  const text = String(value || '').toLowerCase();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
}

function initialsFromName(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) return 'ES';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function currentSemester() {
  const storedSemester = window.sessionStorage.getItem('sistema-avaliacao:studentSemester');
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const md = month * 100 + day;

  if (md >= 1007 || md <= 308) return '1.º Semestre';
  if (md >= 310 && md <= 804) return '2.º Semestre';

  return storedSemester || '2.º Semestre';
}

function averageScore(evaluation) {
  const scores = [
    evaluation.clareza,
    evaluation.dinamismo,
    evaluation.recursos,
    evaluation.criterios_avaliacao,
    evaluation.retorno,
    evaluation.disponibilidade,
    evaluation.respeito,
    evaluation.pontualidade
  ]
    .map(Number)
    .filter((value) => !Number.isNaN(value) && value > 0);

  if (scores.length) {
    return scores.reduce((sum, value) => sum + value, 0) / scores.length;
  }

  const metodologia = Number(evaluation.metodologia);
  const didatica = Number(evaluation.didatica);
  const assiduidade = Number(evaluation.assiduidade);
  if (Number.isNaN(metodologia) || Number.isNaN(didatica)) return 0;
  if (Number.isNaN(assiduidade) || assiduidade <= 0) return (metodologia + didatica) / 2;
  return (metodologia + didatica + assiduidade) / 3;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatScore(value) {
  return Number(value).toFixed(1).replace('.', ',');
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value.replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('pt-PT');
}

function scoreLabel(value) {
  if (value >= 4.5) return 'Excelente';
  if (value >= 3.5) return 'Bom';
  if (value >= 2.5) return 'Regular';
  if (value > 0) return 'A melhorar';
  return 'Sem nota';
}

function setProgress(id, value) {
  const score = document.getElementById(`${id}Score`);
  const progress = document.getElementById(`${id}Progress`);
  const numeric = Number(value) || 0;
  if (score) score.textContent = numeric ? formatScore(numeric) : '--';
  if (progress) progress.style.width = `${Math.min(100, Math.max(0, numeric * 20))}%`;
}

const notificationState = [];

function renderNotifications() {
  const list = document.getElementById('notificationList');
  if (!list) return;

  if (!notificationState.length) {
    list.innerHTML = '<p class="notification-empty">Sem notificações.</p>';
    return;
  }

  list.innerHTML = notificationState.slice(0, 5).map((item) => `
    <div class="notification-item" data-id="${escapeHtml(item.id)}">
      <strong>${escapeHtml(item.title)}</strong>
      <p>${escapeHtml(item.text)}</p>
    </div>
  `).join('');
}

function addNotification(id, title, text) {
  if (!id || notificationState.some((item) => item.id === id)) return;
  notificationState.unshift({ id, title, text });
  renderNotifications();
}

function setupNotifications() {
  const headerActions = document.querySelector('.header-actions');
  const bell = document.querySelector('.notification-btn');
  if (!headerActions || !bell || document.getElementById('notificationMenu')) return;

  const wrap = document.createElement('div');
  wrap.className = 'notification-wrap';
  wrap.innerHTML = `
    <div class="notification-menu" id="notificationMenu" hidden>
      <div class="notification-menu-header">
        <strong>Notificações</strong>
      </div>
      <div class="notification-list" id="notificationList"></div>
    </div>
  `;

  bell.parentElement.style.position = 'relative';
  bell.parentElement.appendChild(wrap);

  const menu = document.getElementById('notificationMenu');
  bell.addEventListener('click', () => {
    if (!menu) return;
    menu.hidden = !menu.hidden;
    if (!menu.hidden) renderNotifications();
  });

  document.addEventListener('click', (event) => {
    if (!menu || menu.hidden) return;
    if (menu.contains(event.target) || bell.contains(event.target)) return;
    menu.hidden = true;
  });

  renderNotifications();
}

function renderHistory(evaluations) {
  const list = document.getElementById('evaluationHistory');
  if (!list) return;

  if (!evaluations.length) {
    list.innerHTML = '<p class="helper-text">Você ainda não enviou avaliações.</p>';
    return;
  }

  list.innerHTML = evaluations.slice(0, 5).map((evaluation) => {
    const score = averageScore(evaluation);
    return `
      <div class="history-item">
        <div class="history-item-left">
          <div class="history-icon"><i data-lucide="users"></i></div>
          <div>
            <strong>${escapeHtml(evaluation.professor_nome || 'Professor')}</strong>
            <span>${escapeHtml(evaluation.disciplina_nome || 'Disciplina nao informada')}</span>
          </div>
        </div>
        <div class="history-rating"><strong>${formatScore(score)}</strong><i data-lucide="star" class="star-filled"></i></div>
      </div>
    `;
  }).join('');
}

function renderLatestEvaluation(evaluations) {
  const latest = evaluations[0];
  const latestTeacherName = document.getElementById('latestTeacherName');
  const latestEvaluationMeta = document.getElementById('latestEvaluationMeta');
  const latestScore = document.getElementById('latestScore');
  const latestScoreLabel = document.getElementById('latestScoreLabel');

  if (!latest) {
    if (latestTeacherName) latestTeacherName.textContent = 'Nenhuma avaliação enviada';
    if (latestEvaluationMeta) latestEvaluationMeta.textContent = 'Quando você enviar uma avaliação, ela aparecerá aqui.';
    if (latestScore) latestScore.textContent = '--';
    if (latestScoreLabel) latestScoreLabel.textContent = 'Sem nota';
    setProgress('metodologia', 0);
    setProgress('didatica', 0);
    return;
  }

  const score = averageScore(latest);
  if (latestTeacherName) latestTeacherName.textContent = latest.professor_nome || 'Professor';
  if (latestEvaluationMeta) {
    latestEvaluationMeta.textContent = `${latest.disciplina_nome || 'Disciplina nao informada'} | Avaliado em ${formatDate(latest.created_at)}`;
  }
  if (latestScore) latestScore.textContent = formatScore(score);
  if (latestScoreLabel) latestScoreLabel.textContent = scoreLabel(score);
  setProgress('metodologia', latest.metodologia);
  setProgress('didatica', latest.didatica);
}

function renderNextProfessor(professors, evaluations) {
  const evaluated = new Set(evaluations.map((item) => String(item.professor_id)));
  const next = professors.find((professor) => !evaluated.has(String(professor.id))) || professors[0];
  const card = document.querySelector('.next-evaluation-card');
  const notice = document.getElementById('dashboardNotice');
  const status = document.getElementById('nextEvaluationStatus');
  const text = document.getElementById('nextEvaluationText');
  const name = document.getElementById('nextTeacherName');
  const department = document.getElementById('nextTeacherDepartment');

  if (!professors.length) {
    if (card) card.hidden = true;
    if (notice) notice.hidden = true;
    addNotification(
      'evaluations-unavailable',
      'Avaliações indisponíveis',
      'As avaliações ainda não estão disponíveis. Tente novamente mais tarde.'
    );
    return;
  }

  if (card) card.hidden = false;
  if (notice) notice.hidden = true;

  const alreadyEvaluated = evaluated.has(String(next.id));
  if (status) status.textContent = alreadyEvaluated ? 'Revisto' : 'Pendente';
  if (text) text.textContent = alreadyEvaluated ? 'Você já avaliou os professores disponíveis.' : 'Você ainda não avaliou este professor.';
  if (name) name.textContent = next.nome;
  if (department) department.textContent = next.departamento || 'Departamento nao informado';
}

async function loadDashboardData() {
  if (!document.getElementById('evaluationHistory') || !window.ProfessorAPI || !window.AvaliacaoAPI) return;

  const alunoId = window.sessionStorage.getItem('sistema-avaliacao:studentId');
  try {
    const curso = window.sessionStorage.getItem('sistema-avaliacao:studentCourse') || 'Engenharia de Inf. e Sist. de Informação';
    const ano = window.sessionStorage.getItem('sistema-avaliacao:studentYear') || '4.º Ano';
    const [professors, evaluations] = await Promise.all([
      ProfessorAPI.listar(curso, { ano }),
      AvaliacaoAPI.listar(alunoId)
    ]);
    renderNextProfessor(professors, evaluations);
    renderLatestEvaluation(evaluations);
    renderHistory(evaluations);
  } catch (error) {
    renderNextProfessor([], []);
    renderLatestEvaluation([]);
    renderHistory([]);
    const text = document.getElementById('nextEvaluationText');
    if (text) text.textContent = 'Não foi possível carregar as informações agora.';
    addNotification(
      'dashboard-load-error',
      'Não foi possível carregar',
      'Não foi possível carregar as informações agora.'
    );
  } finally {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
}

function setupMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const header = document.querySelector('.dash-header');
  if (!sidebar || !header || document.getElementById('mobileSidebarToggle')) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.id = 'mobileSidebarToggle';
  button.className = 'mobile-menu-btn';
  button.setAttribute('aria-label', 'Abrir menu');
  button.setAttribute('aria-expanded', 'false');
  button.innerHTML = '<i data-lucide="menu"></i>';
  header.prepend(button);

  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.hidden = true;
  document.body.appendChild(overlay);

  const closeSidebar = () => {
    sidebar.classList.remove('active-mobile');
    document.body.classList.remove('sidebar-open');
    button.setAttribute('aria-expanded', 'false');
    overlay.hidden = true;
  };

  const openSidebar = () => {
    sidebar.classList.add('active-mobile');
    document.body.classList.add('sidebar-open');
    button.setAttribute('aria-expanded', 'true');
    overlay.hidden = false;
  };

  button.addEventListener('click', () => {
    if (sidebar.classList.contains('active-mobile')) closeSidebar();
    else openSidebar();
  });

  overlay.addEventListener('click', closeSidebar);
  sidebar.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeSidebar));

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1100) closeSidebar();
  });

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

function initSidebarControls() {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const toggleIcon = document.getElementById('toggleIcon');
  if (!toggle || !sidebar) return;

  const syncToggleState = () => {
    const collapsed = sidebar.classList.contains('collapsed');
    toggle.setAttribute('aria-expanded', String(!collapsed));

    if (toggleIcon) {
      toggleIcon.setAttribute('data-lucide', collapsed ? 'panel-right' : 'panel-left');
    }

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  };

  // Restore persisted state (keeps sidebar collapsed/expanded across pages)
  try {
    const persisted = window.localStorage.getItem('sistema-avaliacao:sidebarCollapsed');
    if (persisted === '1') sidebar.classList.add('collapsed');
    if (persisted === '0') sidebar.classList.remove('collapsed');
  } catch (e) {
    // ignore storage errors
  }

  syncToggleState();

  toggle.addEventListener('click', function(){
    sidebar.classList.toggle('collapsed');
    // persist new state
    try {
      const collapsed = sidebar.classList.contains('collapsed');
      window.localStorage.setItem('sistema-avaliacao:sidebarCollapsed', collapsed ? '1' : '0');
    } catch (e) {
      // ignore storage errors
    }
    syncToggleState();
  });
}

function setupLanguageSwitcher() {
  const headerActions = document.querySelector('.header-actions');
  if (!headerActions || document.getElementById('languageSwitcher')) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'language-switcher';
  wrapper.id = 'languageSwitcher';
  wrapper.innerHTML = `
    <button class="language-btn" type="button" aria-label="Traduzir página" aria-expanded="false">
      <i data-lucide="languages"></i>
    </button>
    <div class="language-menu" hidden>
      <button type="button" data-lang="pt">PT</button>
      <button type="button" data-lang="en">EN</button>
      <button type="button" data-lang="fr">FR</button>
    </div>
  `;

  headerActions.insertBefore(wrapper, headerActions.firstChild);

  const button = wrapper.querySelector('.language-btn');
  const menu = wrapper.querySelector('.language-menu');
  const applyTranslations = (translations) => {
    const translateText = (node) => {
      const value = node.nodeValue.trim();
      if (!value) return;

      if (!node.parentElement.dataset.i18nOriginalText) {
        node.parentElement.dataset.i18nOriginalText = value;
      }

      const original = node.parentElement.dataset.i18nOriginalText;
      if (translations[original]) {
        node.nodeValue = node.nodeValue.replace(value, translations[original]);
      }
    };

    document.querySelectorAll('body *').forEach((element) => {
      element.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) translateText(node);
      });

      ['placeholder', 'aria-label', 'title'].forEach((attr) => {
        const value = element.getAttribute(attr);
        if (!value) return;

        const key = `i18nOriginal${attr.replace('-', '')}`;
        if (!element.dataset[key]) element.dataset[key] = value;

        const original = element.dataset[key];
        if (translations[original]) element.setAttribute(attr, translations[original]);
      });
    });
  };

  const loadLanguage = async (lang) => {
    if (window.AppI18n && typeof window.AppI18n.load === 'function') {
      await window.AppI18n.load(lang);
      return;
    }

    try {
      const response = await fetch(`../i18n/${lang}.json`, { headers: { Accept: 'application/json' } });
      const payload = await response.json();
      window.localStorage.setItem('sistema-avaliacao:lang', lang);
      document.documentElement.lang = payload.lang || lang;
      applyTranslations(payload.translations || {});
    } catch (error) {
      // Keep the current language if the translation file is unavailable.
    }
  };

  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    menu.hidden = expanded;
  });

  menu.querySelectorAll('[data-lang]').forEach((item) => {
    item.addEventListener('click', () => {
      menu.hidden = true;
      button.setAttribute('aria-expanded', 'false');
      loadLanguage(item.dataset.lang);
    });
  });

  loadLanguage(window.localStorage.getItem('sistema-avaliacao:lang') || 'pt');

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

function setupProfileModal() {
  const existing = document.getElementById('profileMenu');
  const userProfile = document.querySelector('.user-profile');
  if (!userProfile || existing) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'profile-menu';
  wrapper.id = 'profileMenu';
  wrapper.innerHTML = `
    <div class="profile-actions" hidden>
      <button type="button" id="openProfileBtn">
        <i data-lucide="user"></i>
        <span>Perfil</span>
      </button>
      <button type="button" id="logoutBtn">
        <i data-lucide="log-out"></i>
        <span>Sair</span>
      </button>
    </div>
  `;

  userProfile.parentNode.insertBefore(wrapper, userProfile);
  wrapper.prepend(userProfile);

  const menu = wrapper.querySelector('.profile-actions');
  const openBtn = wrapper.querySelector('#openProfileBtn');
  const logoutBtn = wrapper.querySelector('#logoutBtn');

  userProfile.setAttribute('role', 'button');
  userProfile.setAttribute('tabindex', '0');
  userProfile.setAttribute('aria-haspopup', 'menu');
  userProfile.setAttribute('aria-expanded', 'false');

  const show = () => { userProfile.setAttribute('aria-expanded', 'true'); menu.hidden = false; };
  const hide = () => { userProfile.setAttribute('aria-expanded', 'false'); menu.hidden = true; };

  const clickHandler = (e) => { e.stopPropagation(); const expanded = userProfile.getAttribute('aria-expanded') === 'true'; if (expanded) hide(); else show(); };

  userProfile.style.cursor = 'pointer';
  userProfile.addEventListener('click', clickHandler);
  userProfile.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    clickHandler(event);
  });

  if (openBtn) openBtn.addEventListener('click', () => { window.location.href = './perfil.html'; hide(); });
  if (logoutBtn) logoutBtn.addEventListener('click', () => {
    window.sessionStorage.clear();
    window.localStorage.removeItem('sistema-avaliacao:authenticated');
    window.localStorage.removeItem('sistema-avaliacao:studentId');
    window.localStorage.removeItem('sistema-avaliacao:studentName');
    window.localStorage.removeItem('sistema-avaliacao:studentEmail');
    window.localStorage.removeItem('sistema-avaliacao:studentPhone');
    window.localStorage.removeItem('sistema-avaliacao:studentPhoto');
    window.localStorage.removeItem('sistema-avaliacao:userType');
    window.localStorage.removeItem('sistema-avaliacao:professorId');
    window.sessionStorage.removeItem('sistema-avaliacao:professorId');
    window.location.href = './login.html';
  });

  document.addEventListener('click', () => { if (!menu.hidden) hide(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) hide(); });
}

document.addEventListener('DOMContentLoaded', function(){
  if (!enforcePageAccess()) return;

  setupNotifications();
  setupLanguageSwitcher();
  setupLoggedUser();
  setupProfileModal();
  loadDashboardData();
  // If sidebar already present, initialize controls immediately
  if (document.getElementById('sidebar')) {
    initSidebarControls();
    setupMobileSidebar();
  }
});

// If sidebar is injected later, listen for the event and initialize
window.addEventListener('sidebarLoaded', function(){
  setupNotifications();
  setupLanguageSwitcher();
  setupLoggedUser();
  setupProfileModal();
  initSidebarControls();
  setupMobileSidebar();
});
