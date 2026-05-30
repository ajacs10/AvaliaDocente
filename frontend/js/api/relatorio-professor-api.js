const RelatorioProfessorAPI = {
  async carregar(professorId) {
    const query = professorId ? `?professor_id=${encodeURIComponent(professorId)}` : '';
    const response = await fetch(`../../backend/php/routes/relatorio-professor.php${query}`, {
      headers: { Accept: 'application/json' }
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Nao foi possivel carregar o relatorio.');
    }
    return result.data || {};
  }
};

window.RelatorioProfessorAPI = RelatorioProfessorAPI;
