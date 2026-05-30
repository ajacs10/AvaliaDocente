document.addEventListener('DOMContentLoaded', async () => {
  const userType = window.sessionStorage.getItem('sistema-avaliacao:userType');
  if (userType !== 'professor') {
    window.location.href = './dashboard-aluno.html';
    return;
  }

  const professorName = window.sessionStorage.getItem('sistema-avaliacao:studentName') || 'Professor';
  const greeting = document.getElementById('dashboardGreeting');
  const userName = document.getElementById('dashboardUserName');
  const oldSecurityText = document.querySelector('.dash-header .header-security');
  if (oldSecurityText) {
    oldSecurityText.remove();
  }
  if (greeting) greeting.textContent = `Olá, ${professorName}`;
  if (userName) userName.textContent = professorName;

  const total = document.getElementById('professorTotalAvaliacoes');
  const overall = document.getElementById('professorMediaGeral');
  const list = document.getElementById('professorRelatorioLista');
  const feedbackList = document.getElementById('professorFeedbackList');
  const status = document.getElementById('professorRelatorioStatus');
  const professorId = new URLSearchParams(window.location.search).get('professor_id')
    || window.sessionStorage.getItem('sistema-avaliacao:professorId')
    || window.sessionStorage.getItem('sistema-avaliacao:studentId')
    || '';

  const renderTeacherAwardBadge = async () => {
    if (!window.ProfessorAPI || !professorName) return;

    try {
      const allProfessors = await ProfessorAPI.listar();
      const rated = allProfessors.filter((professor) => Number(professor.total_avaliacoes || 0) > 0);
      if (!rated.length) return;

      const bestScore = Math.max(...rated.map((professor) => Number(professor.media_avaliacoes || 0)));
      const currentIsTop = rated.some((professor) => {
        const sameProfessor = String(professor.id) === String(professorId)
          || String(professor.nome || '').trim().toLowerCase() === String(professorName || '').trim().toLowerCase();
        return sameProfessor && Number(professor.media_avaliacoes || 0) === bestScore && bestScore > 0;
      });

      if (!currentIsTop) return;

      const profile = document.querySelector('.user-profile');
      const avatar = profile ? profile.querySelector('.avatar') : null;
      if (!profile || !avatar || profile.querySelector('.teacher-award-badge')) return;

      const badge = document.createElement('span');
      badge.className = 'teacher-award-badge';
      badge.setAttribute('aria-label', 'Professor com melhor avaliação');
      badge.setAttribute('title', 'Professor com melhor avaliação');
      badge.innerHTML = '<i data-lucide="award"></i>';
      avatar.insertAdjacentElement('afterend', badge);

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    } catch (error) {
      // Badge is optional; keep the dashboard usable if ranking cannot be loaded.
    }
  };
  renderTeacherAwardBadge();

  const formatScore = (value) => Number(value || 0).toFixed(1).replace('.', ',');
  const formatMetricScore = (value, hasData) => hasData ? formatScore(value) : '--';
  const DASHBOARD_METRICS = [
    'clareza',
    'dinamismo',
    'recursos',
    'criterios',
    'retorno',
    'disponibilidade',
    'respeito',
    'pontualidade'
  ];

  const METRIC_LABELS = {
    clareza: 'Clareza',
    dinamismo: 'Dinamismo',
    recursos: 'Recursos',
    criterios: 'Critérios',
    retorno: 'Retorno',
    disponibilidade: 'Disponibilidade',
    respeito: 'Respeito',
    pontualidade: 'Pontualidade'
  };

  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const renderFeedbackCarousel = (comentarios) => {
    if (!feedbackList) return;

    if (!comentarios.length) {
      feedbackList.innerHTML = '<p class="helper-text">Ainda não há comentários publicados para este professor.</p>';
      return;
    }

    feedbackList.dataset.currentIndex = '0';
    feedbackList.innerHTML = `
      <div class="feedback-carousel">
        <button class="feedback-nav" type="button" data-feedback-prev aria-label="Comentário anterior">
          <i data-lucide="chevron-left"></i>
        </button>
        <div class="feedback-slide" aria-live="polite"></div>
        <button class="feedback-nav" type="button" data-feedback-next aria-label="Próximo comentário">
          <i data-lucide="chevron-right"></i>
        </button>
      </div>
      <div class="feedback-count"></div>
    `;

    const slide = feedbackList.querySelector('.feedback-slide');
    const count = feedbackList.querySelector('.feedback-count');
    const prev = feedbackList.querySelector('[data-feedback-prev]');
    const next = feedbackList.querySelector('[data-feedback-next]');

    const update = (index) => {
      const safeIndex = (index + comentarios.length) % comentarios.length;
      feedbackList.dataset.currentIndex = String(safeIndex);
      const item = comentarios[safeIndex] || {};

      slide.innerHTML = `
        <div class="history-item feedback-slide-item">
          <div class="history-item-left">
            <div class="history-icon"><i data-lucide="message-square"></i></div>
            <div>
              <strong>Comentário anónimo</strong>
              <span>${escapeHtml(item.comentario)}</span>
            </div>
          </div>
        </div>
      `;
      count.textContent = `${safeIndex + 1} / ${comentarios.length}`;
      prev.disabled = comentarios.length < 2;
      next.disabled = comentarios.length < 2;

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    };

    prev.addEventListener('click', () => update(Number(feedbackList.dataset.currentIndex || 0) - 1));
    next.addEventListener('click', () => update(Number(feedbackList.dataset.currentIndex || 0) + 1));
    update(0);
  };

  try {
    if (!professorId) {
      if (status) status.textContent = 'Sem professor selecionado';
      if (list) list.innerHTML = '<p class="helper-text">Faça login novamente para ver as suas avaliações.</p>';
      if (feedbackList) feedbackList.innerHTML = '<p class="helper-text">Sem professor autenticado.</p>';
      return;
    }

    const report = await RelatorioProfessorAPI.carregar(professorId);
    const medias = report.medias || {};
    const hasEvaluations = Number(report.total_avaliacoes || 0) > 0;
    const values = DASHBOARD_METRICS.map((k) => Number(medias[k]) || 0).filter((v) => v > 0);
    const mediaGeral = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
    const comentarios = Array.isArray(report.comentarios) ? report.comentarios : [];

    if (total) total.textContent = String(report.total_avaliacoes || 0);
    if (overall) overall.textContent = hasEvaluations ? formatScore(mediaGeral) : '--';
    if (status) status.textContent = 'Relatório anónimo de todas as disciplinas';

    if (list) {
      list.innerHTML = DASHBOARD_METRICS.map((key) => {
        const label = METRIC_LABELS[key] || key;
        const score = hasEvaluations ? Number(medias[key]) || 0 : 0;
        return `
        <div class="criterion-item">
          <div class="criterion-info"><span>${label}</span><strong>${formatMetricScore(score, hasEvaluations)}</strong></div>
          <div class="progress-bar"><div class="progress-fill" style="width:${Math.max(0, Math.min(100, score * 20))}%;"></div></div>
        </div>
      `;
      }).join('');
    }

    renderFeedbackCarousel(comentarios);
  } catch (error) {
    if (status) status.textContent = 'Não foi possível carregar o relatório agora.';
    if (list) {
      list.innerHTML = '<p class="helper-text">Não foi possível carregar o relatório agora.</p>';
    }
    if (feedbackList) {
      feedbackList.innerHTML = '<p class="helper-text">Não foi possível carregar os comentários agora.</p>';
    }
  } finally {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
});
