document.addEventListener('DOMContentLoaded', async () => {
  const total = document.getElementById('totalAvaliacoes');
  const media = document.getElementById('mediaAvaliacoes');
  const ultima = document.getElementById('ultimaAtualizacao');
  const list = document.getElementById('minhasAvaliacoesLista');

  if (!list || !window.AvaliacaoAPI) return;

  const formatScore = (value) => Number(value).toFixed(1).replace('.', ',');
  const formatDate = (value) => {
    if (!value) return '--';
    const date = new Date(value.replace(' ', 'T'));
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('pt-PT');
  };
  const scoreOf = (item) => {
    const detailed = [
      item.clareza,
      item.dinamismo,
      item.recursos,
      item.criterios_avaliacao,
      item.retorno,
      item.disponibilidade,
      item.respeito,
      item.pontualidade
    ]
      .map(Number)
      .filter((value) => !Number.isNaN(value) && value > 0);

    if (detailed.length) {
      return detailed.reduce((sum, value) => sum + value, 0) / detailed.length;
    }

    const metodologia = Number(item.metodologia);
    const didatica = Number(item.didatica);
    const assiduidade = Number(item.assiduidade);
    if (Number.isNaN(assiduidade) || assiduidade <= 0) return (metodologia + didatica) / 2;
    return (metodologia + didatica + assiduidade) / 3;
  };
  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  try {
    const alunoId = window.sessionStorage.getItem('sistema-avaliacao:studentId');
    const evaluations = await AvaliacaoAPI.listar(alunoId);

    if (total) total.textContent = String(evaluations.length);
    if (media) {
      const avg = evaluations.length
        ? evaluations.reduce((sum, item) => sum + scoreOf(item), 0) / evaluations.length
        : 0;
      media.textContent = evaluations.length ? formatScore(avg) : '--';
    }
    if (ultima) ultima.textContent = evaluations.length ? formatDate(evaluations[0].created_at) : '--';

    if (!evaluations.length) {
      list.innerHTML = '<p class="helper-text">Você ainda não enviou avaliações.</p>';
      return;
    }

    list.innerHTML = evaluations.map((item) => {
      const score = scoreOf(item);
      const discipline = item.disciplina_nome || 'Disciplina nao informada';
      const meta = [item.ano_academico, item.semestre].filter(Boolean).join(' | ');

      return `
        <article class="my-evaluation-item">
          <div class="my-evaluation-main">
            <div class="my-evaluation-icon"><i data-lucide="clipboard-check"></i></div>
            <div>
              <strong>${escapeHtml(item.professor_nome || 'Professor')}</strong>
              <span>${escapeHtml(discipline)}</span>
              <small>${escapeHtml(meta || formatDate(item.created_at))}</small>
            </div>
          </div>
          <div class="my-evaluation-score">
            <strong>${formatScore(score)}</strong>
            <span>${formatDate(item.created_at)}</span>
          </div>
        </article>
      `;
    }).join('');

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  } catch (error) {
    if (total) total.textContent = '--';
    if (media) media.textContent = '--';
    if (ultima) ultima.textContent = '--';
    list.innerHTML = '<p class="helper-text">Não foi possível carregar as suas avaliações agora.</p>';
  }
});
