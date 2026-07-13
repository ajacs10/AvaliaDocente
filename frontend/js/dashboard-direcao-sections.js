document.addEventListener('DOMContentLoaded', async () => {
  const section = document.body.dataset.reportSection || 'curso';
  const titleEl = document.getElementById('dashboardGreeting');
  const reportListEl = document.getElementById('reportList');
  const reportTotalEl = document.getElementById('reportTotal');
  const reportItemsTotalEl = document.getElementById('reportItemsTotal');
  const exportPdfBtn = document.getElementById('exportPdfBtn');

  const formatScore = (value) => Number(value || 0).toFixed(2).replace('.', ',');
  const formatNumber = (value) => Number(value || 0).toLocaleString('pt-PT');

  const buildSectionData = (reportData) => {
    switch (section) {
      case 'professor':
        return (reportData.ranking_professores || []).map((item) => ({
          label: item.professor_nome || 'Professor',
          value: formatScore(item.media_geral || 0),
          details: `${formatNumber(item.total_avaliacoes || 0)} avaliação(ões)`,
          rawValue: Number(item.media_geral || 0)
        }));

      case 'ano':
        return Object.entries(reportData.por_ano || {}).map(([label, value]) => ({
          label,
          value: formatNumber(value),
          details: 'Avaliações',
          rawValue: Number(value || 0)
        }));

      case 'semestre':
        return Object.entries(reportData.por_semestre || {}).map(([label, value]) => ({
          label,
          value: formatNumber(value),
          details: 'Avaliações',
          rawValue: Number(value || 0)
        }));

      default:
        return Object.entries(reportData.por_curso || {}).map(([label, value]) => ({
          label,
          value: formatNumber(value),
          details: 'Avaliações',
          rawValue: Number(value || 0)
        }));
    }
  };

  const renderReport = (items) => {
    if (!reportListEl) return;
    reportListEl.innerHTML = '';
    if (!items.length) {
      reportListEl.innerHTML = '<p class="helper-text">Sem dados para apresentar.</p>';
      return;
    }

    const fragment = document.createDocumentFragment();
    const largestValue = Math.max(...items.map((item) => Number(item.rawValue || 0)), 1);
    items.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'mini-item';
      const label = document.createElement('strong');
      label.textContent = item.label;
      const value = document.createElement('span');
      value.textContent = `${item.value} ${item.details}`;
      const bar = document.createElement('div');
      bar.className = 'report-progress-bar';
      const fill = document.createElement('div');
      fill.className = 'report-progress-fill';
      fill.style.width = `${Math.max(6, (Number(item.rawValue || 0) / largestValue) * 100)}%`;
      bar.appendChild(fill);
      row.append(label, value, bar);
      fragment.appendChild(row);
    });
    reportListEl.appendChild(fragment);
  };

  const loadReportData = async () => {
    const response = await fetch('../../backend/php/routes/direcao.php', { headers: { Accept: 'application/json' } });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Não foi possível carregar o dashboard de direção.');
    }
    return result.data || {};
  };

  const renderError = (error) => {
    if (!reportListEl) return;
    reportListEl.innerHTML = `<p class="helper-text">${error.message}</p>`;
  };

  const createExportPdf = (items) => {
    const lines = [titleEl?.textContent || 'Relatório', ''];
    items.forEach((item) => lines.push(`${item.label}: ${item.value} (${item.details})`));
    return lines.join('\n');
  };

  try {
    const reportData = await loadReportData();
    const items = buildSectionData(reportData);
    if (reportTotalEl) reportTotalEl.textContent = formatNumber(reportData.total_avaliacoes || 0);
    if (reportItemsTotalEl) reportItemsTotalEl.textContent = formatNumber(items.length);
    renderReport(items);

    exportPdfBtn?.addEventListener('click', () => {
      const content = createExportPdf(items);
      const printWindow = window.open('', '', 'width=800,height=700');
      if (!printWindow) return;
      printWindow.document.write(`<pre>${content.replace(/</g, '&lt;')}</pre>`);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    });
  } catch (error) {
    renderError(error);
  }
});
