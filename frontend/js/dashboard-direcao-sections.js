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

    exportPdfBtn?.addEventListener('click', async () => {
      try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 40;
        let y = 60;
        const exporterName = window.sessionStorage.getItem('sistema-avaliacao:studentName') || window.sessionStorage.getItem('sistema-avaliacao:userName') || document.getElementById('dashboardUserName')?.textContent || 'Direção';
        const timestamp = new Date().toLocaleString();

        // Try to load favicon.svg and draw as logo
        try {
          const svgResp = await fetch('../assets/favicon.svg');
          if (svgResp.ok) {
            const svgText = await svgResp.text();
            const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(svgBlob);
            const img = new Image();
            await new Promise((resolve, reject) => {
              img.onload = () => resolve();
              img.onerror = () => reject();
              img.src = url;
            });
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || 120;
            canvas.height = img.naturalHeight || 120;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/png');
            const imgWidth = 60;
            const imgHeight = (canvas.height / canvas.width) * imgWidth;
            doc.addImage(dataUrl, 'PNG', margin, y - 10, imgWidth, imgHeight);
            doc.setFontSize(16);
            doc.text(titleEl?.textContent || 'Relatório', margin + 70, y);
          } else {
            doc.setFontSize(16);
            doc.text(titleEl?.textContent || 'Relatório', margin, y);
          }
        } catch (err) {
          doc.setFontSize(16);
          doc.text(titleEl?.textContent || 'Relatório', margin, y);
        }

        y += 32;
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Exportado por: ${exporterName}`, margin, y);
        doc.text(`Data: ${timestamp}`, pageWidth - margin - 200, y);
        y += 24;

        // Use autoTable to render a neat table
        const body = items.map((it) => [it.label, it.value, it.details]);
        doc.autoTable({ startY: y, head: [[titleEl?.textContent || 'Item','Valor','Detalhes']], body, margin: { left: margin, right: margin } });
        y = doc.lastAutoTable.finalY + 20;

        doc.setFontSize(10);
        doc.setTextColor(75, 85, 99);
        doc.text(
          'Este relatório apresenta uma visão agregada das avaliações disponíveis para a Direção, destacando tendências por seção, cursos e professores. Os dados são apresentados de forma objetiva para apoiar a tomada de decisão institucional e permitir análise de desempenho académico.',
          margin,
          y,
          { maxWidth: pageWidth - margin * 2 }
        );
        y += 40;
        doc.setTextColor(0, 0, 0);

        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          const footerY = doc.internal.pageSize.getHeight() - 30;
          doc.setFontSize(9);
          doc.text(`Exportado por: ${exporterName} — ${timestamp}`, margin, footerY);
          doc.text(`Página ${i} de ${pageCount}`, pageWidth - margin - 80, footerY);
        }

        doc.save(`${(titleEl?.textContent || 'relatorio').replace(/\s+/g,'-').toLowerCase()}-${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.pdf`);
      } catch (err) {
        console.error(err);
        alert('Não foi possível gerar o PDF.');
      }
    });
  } catch (error) {
    renderError(error);
  }
});
