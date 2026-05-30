document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('howItWorksGrid');
  if (!grid) return;

  const userType = window.sessionStorage.getItem('sistema-avaliacao:userType') || 'aluno';
  const greeting = document.getElementById('dashboardGreeting');

  const alunoCards = [
    {
      label: 'Etapa 1',
      title: 'Escolha a disciplina',
      text: 'Selecione o professor e a disciplina que deseja avaliar no semestre atual.'
    },
    {
      label: 'Etapa 2',
      title: 'Atribua as notas',
      text: 'Preencha os critérios com base na sua experiência nas aulas e no acompanhamento docente.'
    },
    {
      label: 'Etapa 3',
      title: 'Confirme o envio',
      text: 'Revise os dados, submeta a avaliação e acompanhe o seu histórico pessoal.'
    },
    {
      label: 'Importante',
      title: 'Privacidade garantida',
      text: 'O sistema publica resultados agregados e protege a identidade de cada estudante.'
    }
  ];

  const professorCards = [
    {
      label: 'Etapa 1',
      title: 'Acesse o painel docente',
      text: 'Faça login com conta de professor para abrir o painel com relatório anónimo da turma.'
    },
    {
      label: 'Etapa 2',
      title: 'Analise os critérios',
      text: 'Veja médias por dimensão pedagógica para identificar pontos fortes e oportunidades de melhoria.'
    },
    {
      label: 'Etapa 3',
      title: 'Leia os comentários anónimos',
      text: 'Consulte feedback textual sem identificação individual para ajustar estratégias de ensino.'
    },
    {
      label: 'Importante',
      title: 'Sem identificação de estudantes',
      text: 'O painel docente não exibe nome, número, email ou outro dado pessoal dos avaliadores.'
    }
  ];

  const cards = userType === 'professor' ? professorCards : alunoCards;

  if (greeting && userType === 'professor') {
    greeting.textContent = 'Como funciona para docentes';
  }

  grid.innerHTML = cards.map((item) => `
    <div class="page-card">
      <span class="section-label">${item.label}</span>
      <h2 class="card-title">${item.title}</h2>
      <p class="card-text">${item.text}</p>
    </div>
  `).join('');
});
