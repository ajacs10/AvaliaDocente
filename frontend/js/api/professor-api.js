const ProfessorAPI = {
  async listar(curso, filtros = {}) {
    const params = new URLSearchParams();

    if (curso) params.set('curso', curso);
    if (filtros.ano) params.set('ano', filtros.ano);
    if (filtros.semestre) params.set('semestre', filtros.semestre);
    if (filtros.disciplina) params.set('disciplina', filtros.disciplina);
    if (filtros.disciplina_id) params.set('disciplina_id', filtros.disciplina_id);

    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`../../backend/php/routes/professores.php${query}`, {
      headers: { Accept: 'application/json' }
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Nao foi possivel carregar professores.');
    }
    return result.data || [];
  }
};

window.ProfessorAPI = ProfessorAPI;
