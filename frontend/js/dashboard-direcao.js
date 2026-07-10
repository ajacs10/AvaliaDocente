document.addEventListener('DOMContentLoaded', async () => {
  const totalAvaliacoesEl = document.getElementById('totalAvaliacoes');
  const totalEstudantesEl = document.getElementById('totalEstudantes');
  const mediaGeralEl = document.getElementById('mediaGeral');
  const cursoListEl = document.getElementById('cursoList');
  const rankingListEl = document.getElementById('rankingList');
  const anoListEl = document.getElementById('anoList');
  const semestreListEl = document.getElementById('semestreList');
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  const exportPdfBtn = document.getElementById('exportPdfBtn');
  let reportData = null;

  const formatScore = (value) => Number(value || 0).toFixed(2).replace('.', ',');

  const renderList = (target, items, formatter) => {
    if (!target) return;
    target.innerHTML = '';
    if (!items?.length) {
      target.innerHTML = '<p class="helper-text">Sem dados para apresentar.</p>';
      return;
    }

    const fragment = document.createDocumentFragment();
    items.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'mini-item';
      row.innerHTML = formatter(item);
      fragment.appendChild(row);
    });
    target.appendChild(fragment);
  };

  const loadReport = async () => {
    const response = await fetch('../../backend/php/routes/direcao.php', { headers: { Accept: 'application/json' } });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message || 'Não foi possível carregar o relatório.');
    reportData = result.data || {};
    totalAvaliacoesEl.textContent = reportData.total_avaliacoes || 0;
    totalEstudantesEl.textContent = reportData.total_estudantes || 0;
    mediaGeralEl.textContent = formatScore(reportData.media_geral || 0);

    const cursos = Object.entries(reportData.por_curso || {}).sort((a, b) => b[1] - a[1]);
    renderList(cursoListEl, cursos, ([curso, valor]) => `<strong>${curso}</strong><span>${valor} avaliação(ões)</span>`);

    const ranking = reportData.ranking_professores || [];
    renderList(rankingListEl, ranking, (item) => `<strong>${item.professor_nome}</strong><span>${formatScore(item.media_geral)} média</span>`);

    const anos = Object.entries(reportData.por_ano || {}).sort((a, b) => b[1] - a[1]);
    renderList(anoListEl, anos, ([ano, valor]) => `<strong>${ano}</strong><span>${valor} avaliação(ões)</span>`);

    const semestres = Object.entries(reportData.por_semestre || {}).sort((a, b) => b[1] - a[1]);
    renderList(semestreListEl, semestres, ([semestre, valor]) => `<strong>${semestre}</strong><span>${valor} avaliação(ões)</span>`);
  };

  exportCsvBtn?.addEventListener('click', () => {
    if (!reportData) return;
    const rows = [
      ['Métrica', 'Valor'],
      ['Avaliações', reportData.total_avaliacoes || 0],
      ['Estudantes', reportData.total_estudantes || 0],
      ['Média geral', reportData.media_geral || 0],
      ['', ''],
      ['Curso', 'Quantidade'],
      ...Object.entries(reportData.por_curso || {}).sort((a, b) => b[1] - a[1])
    ];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'relatorio-direcao.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });

  exportPdfBtn?.addEventListener('click', () => {
    if (!reportData) return;
    const content = [
      'Relatório de Direção',
      `Avaliações: ${reportData.total_avaliacoes || 0}`,
      `Estudantes: ${reportData.total_estudantes || 0}`,
      `Média geral: ${formatScore(reportData.media_geral || 0)}`,
      'Top professores:',
      ...(reportData.ranking_professores || []).slice(0, 5).map((item) => `- ${item.professor_nome}: ${formatScore(item.media_geral)}`)
    ].join('\n');
    const printWindow = window.open('', '', 'width=800,height=700');
    if (!printWindow) return;
    printWindow.document.write(`<pre>${content.replace(/</g, '&lt;')}</pre>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  });

  try {
    await loadReport();
  } catch (error) {
    const messageHtml = `<p class="helper-text">${error.message}</p>`;
    if (totalAvaliacoesEl) totalAvaliacoesEl.textContent = '—';
    if (totalEstudantesEl) totalEstudantesEl.textContent = '—';
    if (mediaGeralEl) mediaGeralEl.textContent = '—';
    if (cursoListEl) cursoListEl.innerHTML = messageHtml;
    if (rankingListEl) rankingListEl.innerHTML = messageHtml;
    if (anoListEl) anoListEl.innerHTML = messageHtml;
    if (semestreListEl) semestreListEl.innerHTML = messageHtml;
  }
});
