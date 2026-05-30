document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('faqList');
  if (!list) return;

  const userType = window.sessionStorage.getItem('sistema-avaliacao:userType') || 'aluno';

  const professorFaq = [
    {
      title: 'Categoria 1: Privacidade e Protecao dos Dados',
      body: [
        'As respostas dos estudantes chegam identificadas ao professor?',
        'Nao. O professor ve apenas medias agregadas e comentarios anonimos, sem nome, email ou numero de estudante.',
        'Existe risco de descobrir quem avaliou?',
        'Nao. O painel de professor nao exibe identificadores individuais. O foco e sempre a tendencia da turma.'
      ]
    },
    {
      title: 'Categoria 2: Leitura do Relatorio',
      body: [
        'O que significam os pontos por criterio?',
        'Cada criterio mostra a media da turma numa escala de 1 a 5 para apoiar melhoria continua.',
        'Porque vejo comentarios sem autoria?',
        'Os comentarios sao exibidos de forma anonima para preservar o estudante e incentivar feedback honesto.'
      ]
    },
    {
      title: 'Categoria 3: Uso Pedagogico',
      body: [
        'Como usar uma avaliacao baixa?',
        'Como sinal de ajuste: metodologia, comunicacao, ritmo da aula e retorno das atividades.',
        'As avaliacoes positivas tambem importam?',
        'Sim. Elas mostram praticas eficazes que devem ser mantidas e replicadas.'
      ]
    },
    {
      title: 'Categoria 4: Suporte Tecnico',
      body: [
        'Nao aparecem dados no painel. O que fazer?',
        'Confirme se entrou com conta de professor e se o periodo de avaliacao ja possui respostas.',
        'Vejo algo incoerente no relatorio. Como reportar?',
        'Comunique a coordenacao ou equipa tecnica para validacao dos dados agregados.'
      ]
    }
  ];

  const alunoFaq = [
    {
      title: 'Categoria 1: Privacidade e Anonimato',
      body: [
        'O professor vai saber o que eu respondi sobre ele?',
        'Nao. O sistema e anonimo e o professor recebe apenas medias gerais.',
        'Se tenho de fazer login, como o voto continua anonimo?',
        'O login serve apenas para validar o aluno e impedir votos duplicados.'
      ]
    },
    {
      title: 'Categoria 2: Impacto e Utilidade',
      body: [
        'Vale mesmo a pena responder?',
        'Sim. Os relatorios ajudam a melhorar metodologia, ritmo e materiais das aulas.'
      ]
    }
  ];

  const items = userType === 'professor' ? professorFaq : alunoFaq;

  list.innerHTML = items.map((item, index) => {
    const paragraphs = item.body
      .map((text) => `<p>${text}</p>`)
      .join('');

    return `
      <details ${index === 0 ? 'open' : ''}>
        <summary>${item.title}</summary>
        ${paragraphs}
      </details>
    `;
  }).join('');
});
