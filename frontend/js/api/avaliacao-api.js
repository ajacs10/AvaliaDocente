const AvaliacaoAPI = {
  async listar(alunoId) {
    const query = alunoId ? `?aluno_id=${encodeURIComponent(alunoId)}` : '';
    const response = await fetch(`../../backend/php/routes/avaliacao.php${query}`, {
      headers: { Accept: 'application/json' }
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Nao foi possivel carregar avaliacoes.');
    }
    return result.data || [];
  },

  async criar(payload) {
    const response = await fetch('../../backend/php/routes/avaliacao.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Nao foi possivel registar avaliacao.');
    }
    return result;
  }
};

window.AvaliacaoAPI = AvaliacaoAPI;
