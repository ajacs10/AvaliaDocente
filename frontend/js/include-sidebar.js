// Fetch and inject the shared sidebar component into pages
document.addEventListener('DOMContentLoaded', function(){
  const placeholder = document.getElementById('sidebar-root');
  if (!placeholder) return;

  const getAuthValue = (key, fallback = '') => {
    return window.sessionStorage.getItem(key) || window.localStorage.getItem(key) || fallback;
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
          const userType = getAuthValue('sistema-avaliacao:userType', 'aluno');
          const current = location.pathname.split('/').pop() || (userType === 'professor' ? 'dashboard-professor.html' : 'dashboard-aluno.html');

          if (userType === 'professor') {
            const dashboardLink = aside.querySelector('.menu a[href="dashboard-aluno.html"]');
            if (dashboardLink) {
              dashboardLink.setAttribute('href', 'dashboard-professor.html');
              const textNode = dashboardLink.querySelector('span');
              if (textNode) textNode.textContent = 'Dashboard Professor';

              if (!aside.querySelector('.menu a[href="relatorio-professor.html"]')) {
                const reportLink = document.createElement('a');
                reportLink.href = 'relatorio-professor.html';
                reportLink.className = 'menu-item';
                reportLink.innerHTML = '<i data-lucide="bar-chart-2"></i><span>Ver avaliações</span>';
                dashboardLink.insertAdjacentElement('afterend', reportLink);
              }
            }

            ['avaliar-professor.html', 'minhas-avaliacoes.html'].forEach((href) => {
              const link = aside.querySelector(`.menu a[href="${href}"]`);
              if (link) link.remove();
            });
          } else {
            ['relatorio-professor.html', 'criterios.html'].forEach((href) => {
              const link = aside.querySelector(`.menu a[href="${href}"]`);
              if (link) link.remove();
            });
            const helpLinkText = aside.querySelector('.menu a[href="duvidas.html"] span');
            if (helpLinkText) helpLinkText.textContent = 'Dúvidas e critérios';
          }

          items.forEach(a => {
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
