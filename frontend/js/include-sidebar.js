// Fetch and inject the shared sidebar component into pages
document.addEventListener('DOMContentLoaded', function(){
  const placeholder = document.getElementById('sidebar-root');
  if (!placeholder) return;

  const getAuthValue = (key, fallback = '') => {
    return window.sessionStorage.getItem(key) || window.localStorage.getItem(key) || fallback;
  };

  const isAuthenticated = () => getAuthValue('sistema-avaliacao:authenticated', 'false') === 'true';

  const normalizeUserType = (value) => {
    const normalized = String(value || '').toLowerCase().trim();
    if (['admin', 'coordenador local', 'coordenador', 'direcao'].includes(normalized)) return 'admin';
    if (normalized === 'professor') return 'professor';
    return 'aluno';
  };

  // Ensure sessionStorage is hydrated from persistent login before reading values.
  const hydrateSessionFromRememberedLogin = () => {
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
  };

  hydrateSessionFromRememberedLogin();

  // path relative to pages in frontend/html/
  const componentPath = 'components/sidebar.html';

  fetch(componentPath, { cache: 'no-store' })
    .then(resp => {
      if (!resp.ok) throw new Error('Failed to load sidebar');
      return resp.text();
    })
    .then(html => {
      // parse the returned HTML and extract the <aside> element
      const template = document.createElement('template');
      template.innerHTML = html.trim();
      const aside = template.content.querySelector('aside.sidebar');
      if (aside) {
        // replace the placeholder div with the actual aside so CSS sibling selectors work
        placeholder.replaceWith(aside);

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons();
        }

        // mark active menu item based on current page
        try {
          const items = aside.querySelectorAll('.menu a.menu-item');
          const userType = isAuthenticated() ? normalizeUserType(getAuthValue('sistema-avaliacao:userType', 'aluno')) : 'aluno';
          const current = location.pathname.split('/').pop() || (userType === 'professor' ? 'dashboard-professor.html' : userType === 'admin' ? 'dashboard-direcao.html' : 'dashboard-aluno.html');

          const createMenuItem = (href, icon, label) => {
            const item = document.createElement('a');
            item.href = href;
            item.className = 'menu-item';
            item.innerHTML = `<i data-lucide="${icon}"></i><span>${label}</span>`;
            return item;
          };

          const menu = aside.querySelector('.menu');
          if (menu) {
            menu.innerHTML = '';

            if (userType === 'professor') {
              menu.appendChild(createMenuItem('dashboard-professor.html', 'home', 'Dashboard Professor'));
              menu.appendChild(createMenuItem('relatorio-professor.html', 'bar-chart-2', 'Ver avaliações'));
              menu.appendChild(createMenuItem('perfil.html', 'user', 'Perfil'));
              menu.appendChild(createMenuItem('como-funciona.html', 'info', 'Como Funciona'));
              menu.appendChild(createMenuItem('duvidas.html', 'help-circle', 'Dúvidas e critérios'));
            } else if (userType === 'admin') {
              menu.appendChild(createMenuItem('dashboard-direcao.html', 'line-chart', 'Painel Direção'));
              menu.appendChild(createMenuItem('perfil.html', 'user', 'Perfil'));
              menu.appendChild(createMenuItem('cursos-mais-avaliados.html', 'book-open', 'Cursos mais avaliados'));
              menu.appendChild(createMenuItem('top-professores.html', 'star', 'Top professores'));
              menu.appendChild(createMenuItem('distribuicao-por-semestre.html', 'layers', 'Distribuição por semestre'));
              menu.appendChild(createMenuItem('distribuicao-por-ano.html', 'bar-chart-2', 'Distribuição por ano'));
            } else {
              menu.appendChild(createMenuItem('dashboard-aluno.html', 'home', 'Dashboard'));
              menu.appendChild(createMenuItem('avaliar-professor.html', 'clipboard-check', 'Avaliar professor'));
              menu.appendChild(createMenuItem('minhas-avaliacoes.html', 'list-checks', 'Minhas avaliações'));
              menu.appendChild(createMenuItem('perfil.html', 'user', 'Perfil'));
              menu.appendChild(createMenuItem('como-funciona.html', 'info', 'Como Funciona'));
              menu.appendChild(createMenuItem('duvidas.html', 'help-circle', 'Dúvidas e critérios'));
            }

            if (window.lucide && typeof window.lucide.createIcons === 'function') {
              window.lucide.createIcons();
            }
          }

          aside.querySelectorAll('.menu a.menu-item').forEach(a => {
            const href = a.getAttribute('href').split('/').pop();
            if (href === current) a.classList.add('active'); else a.classList.remove('active');
          });
          // ensure logout is visible (remove accidental hidden spans if any)
          const logout = aside.querySelector('.logout-link');
          if (logout) {
            logout.style.display = 'flex';
            logout.addEventListener('click', (event) => {
              event.preventDefault();
              window.sessionStorage.removeItem('sistema-avaliacao:authenticated');
              window.sessionStorage.removeItem('sistema-avaliacao:studentId');
              window.sessionStorage.removeItem('sistema-avaliacao:studentName');
              window.sessionStorage.removeItem('sistema-avaliacao:studentEmail');
              window.sessionStorage.removeItem('sistema-avaliacao:studentPhone');
              window.sessionStorage.removeItem('sistema-avaliacao:studentPhoto');
              window.sessionStorage.removeItem('sistema-avaliacao:userType');
              window.sessionStorage.removeItem('sistema-avaliacao:professorId');
              window.localStorage.removeItem('sistema-avaliacao:authenticated');
              window.localStorage.removeItem('sistema-avaliacao:studentId');
              window.localStorage.removeItem('sistema-avaliacao:studentName');
              window.localStorage.removeItem('sistema-avaliacao:studentEmail');
              window.localStorage.removeItem('sistema-avaliacao:studentPhone');
              window.localStorage.removeItem('sistema-avaliacao:studentPhoto');
              window.localStorage.removeItem('sistema-avaliacao:userType');
              window.localStorage.removeItem('sistema-avaliacao:professorId');
              window.location.href = 'login.html';
            });
          }
        } catch (e) {
          // ignore
        }

        // notify other scripts that sidebar is ready
        window.dispatchEvent(new Event('sidebarLoaded'));
      } else {
        placeholder.innerHTML = html; // fallback
        window.dispatchEvent(new Event('sidebarLoaded'));
      }
    })
    .catch(err => {
      console.error('Error loading sidebar:', err);
    });
});
