document.addEventListener('DOMContentLoaded', async () => {
  const totalAvaliacoesEl = document.getElementById('totalAvaliacoes');
  const totalEstudantesEl = document.getElementById('totalEstudantes');
  const mediaGeralEl = document.getElementById('mediaGeral');
  const cursoListEl = document.getElementById('cursoList');
  const rankingListEl = document.getElementById('rankingList');
  const anoListEl = document.getElementById('anoList');
  const semestreListEl = document.getElementById('semestreList');
  const exportPdfBtn = document.getElementById('exportPdfBtn');
  let reportData = null;

  if (!totalAvaliacoesEl && !totalEstudantesEl && !mediaGeralEl && !cursoListEl && !rankingListEl && !anoListEl && !semestreListEl) {
    return;
  }

  const formatScore = (value) => Number(value || 0).toFixed(2).replace('.', ',');

  const renderList = (target, items, formatter) => {
    if (!target) return;
    const card = target.closest('section.page-card');
    target.innerHTML = '';
    if (!items?.length) {
      if (card) card.hidden = true;
      return;
    }

    if (card) card.hidden = false;
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
    if (totalAvaliacoesEl) totalAvaliacoesEl.textContent = reportData.total_avaliacoes || 0;
    if (totalEstudantesEl) totalEstudantesEl.textContent = reportData.total_estudantes || 0;
    if (mediaGeralEl) mediaGeralEl.textContent = formatScore(reportData.media_geral || 0);

    const cursos = Object.entries(reportData.por_curso || {}).sort((a, b) => b[1] - a[1]);
    renderList(cursoListEl, cursos, ([curso, valor]) => `<strong>${curso}</strong><span>${valor} avaliação(ões)</span>`);

    const ranking = reportData.ranking_professores || [];
    renderList(rankingListEl, ranking, (item) => `<strong>${item.professor_nome}</strong><span>${formatScore(item.media_geral)} média</span>`);

    const anos = Object.entries(reportData.por_ano || {}).sort((a, b) => b[1] - a[1]);
    renderList(anoListEl, anos, ([ano, valor]) => `<strong>${ano}</strong><span>${valor} avaliação(ões)</span>`);

    const semestres = Object.entries(reportData.por_semestre || {}).sort((a, b) => b[1] - a[1]);
    renderList(semestreListEl, semestres, ([semestre, valor]) => `<strong>${semestre}</strong><span>${valor} avaliação(ões)</span>`);
  };

  exportPdfBtn?.addEventListener('click', async () => {
    if (!reportData) return;
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 40;
      let y = 60;

      const exporterName = window.sessionStorage.getItem('sistema-avaliacao:studentName') || window.sessionStorage.getItem('sistema-avaliacao:userName') || document.getElementById('dashboardUserName')?.textContent || 'Direção';
      const timestamp = new Date().toLocaleString();

      // Try to load favicon.svg as logo and draw it
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
        }
      } catch (err) {
        // ignore logo errors
      }

      doc.setFontSize(16);
      doc.text('Relatório de Direção', margin + 70, y);
      y += 32;
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Exportado por: ${exporterName}`, margin, y);
      doc.text(`Data: ${timestamp}`, pageWidth - margin - 200, y);
      y += 24;

      const addLine = (label, value) => {
        doc.setFontSize(11);
        doc.text(`${label}: ${value}`, margin, y);
        y += 16;
        if (y > doc.internal.pageSize.getHeight() - 80) { doc.addPage(); y = 60; }
      };

      addLine('Total de avaliações', reportData.total_avaliacoes || 0);
      addLine('Total de estudantes', reportData.total_estudantes || 0);
      addLine('Média geral', formatScore(reportData.media_geral || 0));
      y += 6;

      // Cursos mais avaliados (table)
      const cursos = Object.entries(reportData.por_curso || {}).sort((a,b)=>b[1]-a[1]).map(([nome,valor])=>[nome, String(valor)]);
      if (cursos.length) {
        doc.autoTable({ startY: y, head: [['Curso','Avaliações']], body: cursos, margin: { left: margin, right: margin } });
        y = doc.lastAutoTable.finalY + 10;
      }

      // Top professores (table)
      const top = (reportData.ranking_professores || []).map((item, idx) => [String(idx+1), item.professor_nome || '-', formatScore(item.media_geral || 0)]);
      if (top.length) {
        doc.autoTable({ startY: y, head: [['#','Professor','Média']], body: top, margin: { left: margin, right: margin } });
        y = doc.lastAutoTable.finalY + 20;
      }

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

      // Distribuições por ano e semestre
      doc.setFontSize(12);
      doc.text('Distribuição por ano', margin, y);
      y += 14;
      (Object.entries(reportData.por_ano || {}).sort((a,b)=>b[1]-a[1])).forEach(([ano, valor]) => addLine(`  ${ano}`, `${valor} avaliação(ões)`));
      y += 8;
      doc.setFontSize(12);
      doc.text('Distribuição por semestre', margin, y);
      y += 14;
      (Object.entries(reportData.por_semestre || {}).sort((a,b)=>b[1]-a[1])).forEach(([sem, valor]) => addLine(`  ${sem}`, `${valor} avaliação(ões)`));

      // Footer on each page with exporter
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const footerY = doc.internal.pageSize.getHeight() - 30;
        doc.setFontSize(9);
        doc.text(`Exportado por: ${exporterName} — ${timestamp}`, margin, footerY);
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - margin - 80, footerY);
      }

      doc.save(`relatorio-direcao-${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Não foi possível gerar o PDF.');
    }
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
