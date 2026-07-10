document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('disciplineGrid');
  const profNameEl = document.getElementById('profName');
  const exportBtn = document.getElementById('exportReportBtn');
  let reportRows = [];

  const getAuthValue = (key, fallback = '') => {
    return window.sessionStorage.getItem(key) || window.localStorage.getItem(key) || fallback;
  };

  const qs = new URLSearchParams(location.search);
  const professorId = qs.get('professor_id')
    || getAuthValue('sistema-avaliacao:professorId')
    || getAuthValue('sistema-avaliacao:studentId');

  if (!professorId) {
    grid.innerHTML = '<p class="helper-text">Não foi possível identificar o professor logado. Faça login novamente.</p>';
    return;
  }

  fetch(`../../backend/php/routes/relatorio-professor-disciplinas.php?professor_id=${encodeURIComponent(professorId)}`)
    .then(r => r.json())
    .then(payload => {
      if (!payload.success) throw new Error(payload.message || 'Erro');
      const data = payload.data || [];
      if (data.length === 0) {
        grid.innerHTML = '<p>Nenhuma disciplina encontrada para este professor.</p>';
        return;
      }

      if (profNameEl) profNameEl.textContent = data[0].professor_nome || '';
      reportRows = data;

      grid.innerHTML = '';
      data.forEach(item => {
        const card = document.createElement('article');
        card.className = 'page-card discipline-card';
        const title = item.disciplina_nome || 'Sem disciplina';

        const metrics = item.medias || {};
        const comments = Array.isArray(item.comentarios) ? item.comentarios : [];
        const metricItems = [
          ['Clareza', metrics.clareza],
          ['Dinamismo', metrics.dinamismo],
          ['Recursos', metrics.recursos],
          ['Critérios', metrics.criterios],
          ['Retorno', metrics.retorno],
          ['Disponibilidade', metrics.disponibilidade],
          ['Respeito', metrics.respeito],
          ['Pontualidade', metrics.pontualidade]
        ];
        const average = calculateAverage(metricItems.map(([, value]) => value));

        card.innerHTML = `
          <div class="discipline-card-header">
            <div>
              <span class="section-label">Disciplina</span>
              <h3 class="card-title">${escapeHtml(title)}</h3>
              <p class="card-text">${item.total_avaliacoes} avaliação${Number(item.total_avaliacoes) === 1 ? '' : 'es'} anónima${Number(item.total_avaliacoes) === 1 ? '' : 's'} registada${Number(item.total_avaliacoes) === 1 ? '' : 's'}.</p>
            </div>
            <div class="discipline-score">
              <span>Média</span>
              <strong>${formatMetric(average)}</strong>
            </div>
          </div>
          <div class="discipline-card-body">
            <div class="discipline-metrics">
              ${metricItems.map(([label, value]) => metricRow(label, value)).join('')}
            </div>

            <div class="discipline-comments">
              <div class="discipline-comments-header">
                <h4>Pontos específicos (anónimos)</h4>
                <p>Comentários sem identificação dos estudantes.</p>
              </div>
              ${comments.length ? comments.map((comment) => `
                <div class="discipline-comment-item">
                  <span class="discipline-comment-label">Comentário anónimo</span>
                  <p>${escapeHtml(comment.comentario)}</p>
                </div>
              `).join('') : '<p class="helper-text">Ainda não há comentários para esta disciplina.</p>'}
            </div>
          </div>
        `;

        grid.appendChild(card);
      });
    })
    .catch(err => {
      grid.innerHTML = `<p class="helper-text">Não foi possível carregar as avaliações deste professor: ${escapeHtml(err.message || String(err))}</p>`;
    });

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (!reportRows.length) {
        window.alert('Ainda não existem dados para exportar.');
        return;
      }

      const headers = ['Disciplina', 'Avaliações', 'Clareza', 'Dinamismo', 'Recursos', 'Critérios', 'Retorno', 'Disponibilidade', 'Respeito', 'Pontualidade'];
      const rows = reportRows.map((item) => {
        const metrics = item.medias || {};
        return [
          item.disciplina_nome || 'Sem disciplina',
          item.total_avaliacoes || 0,
          metrics.clareza ?? 0,
          metrics.dinamismo ?? 0,
          metrics.recursos ?? 0,
          metrics.criterios ?? 0,
          metrics.retorno ?? 0,
          metrics.disponibilidade ?? 0,
          metrics.respeito ?? 0,
          metrics.pontualidade ?? 0
        ];
      });

      const csvContent = [headers, ...rows]
        .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(';'))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-${(profNameEl?.textContent || 'professor').toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'professor'}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  function formatMetric(v) {
    if (v === null || v === undefined) return '0.0';
    return Number(v).toFixed(1);
  }

  function calculateAverage(values) {
    const numbers = values.map(Number).filter((value) => Number.isFinite(value) && value > 0);
    if (!numbers.length) return 0;
    return numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
  }

  function metricRow(label, value) {
    const score = Number(value) || 0;
    const width = Math.max(0, Math.min(100, score * 20));

    return `
      <div class="metric-row">
        <div class="metric-row-top">
          <span>${escapeHtml(label)}</span>
          <strong>${formatMetric(score)}</strong>
        </div>
        <div class="metric-track" aria-hidden="true">
          <div class="metric-fill" style="width:${width}%;"></div>
        </div>
      </div>
    `;
  }

  function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, function (m) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[m]; });
  }
});
