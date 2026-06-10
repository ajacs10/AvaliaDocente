document.addEventListener('DOMContentLoaded', () => {
  const DRAFT_KEY = 'sistema-avaliacao:evaluationDraft';
  const form = document.getElementById('evaluationForm');
  const professorSelect = document.getElementById('professor');
  const professorNomeInput = document.getElementById('professorNome');
  const disciplinaInput = document.getElementById('disciplina');
  const departamentoInput = document.getElementById('departamento');
  const clarezaInput = document.getElementById('clareza');
  const dinamismoInput = document.getElementById('dinamismo');
  const recursosInput = document.getElementById('recursos');
  const criteriosAvaliacaoInput = document.getElementById('criterios_avaliacao');
  const retornoInput = document.getElementById('retorno');
  const disponibilidadeInput = document.getElementById('disponibilidade');
  const respeitoInput = document.getElementById('respeito');
  const pontualidadeInput = document.getElementById('pontualidade');
  const metodologiaInput = document.getElementById('metodologia');
  const didaticaInput = document.getElementById('didatica');
  const assiduidadeInput = document.getElementById('assiduidade');
  const comentarioInput = document.getElementById('comentario');
  const submitButton = document.getElementById('submitEvaluation');
  const formCard = document.getElementById('evaluationFormCard');
  const catalogSection = document.getElementById('catalogSection');
  const message = document.getElementById('evaluationMessage');
  const backToCatalogBtn = document.getElementById('backToCatalog');
  let professors = [];
  let evaluatedProfessorIds = new Set();

  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  if (!form || !professorSelect) return;

  const getScoreFields = () => ([
    ['clareza', clarezaInput],
    ['dinamismo', dinamismoInput],
    ['recursos', recursosInput],
    ['criterios_avaliacao', criteriosAvaliacaoInput],
    ['retorno', retornoInput],
    ['disponibilidade', disponibilidadeInput],
    ['respeito', respeitoInput],
    ['pontualidade', pontualidadeInput],
    ['metodologia', metodologiaInput],
    ['didatica', didaticaInput],
    ['assiduidade', assiduidadeInput]
  ]);

  const readDraft = () => {
    try {
      return JSON.parse(window.sessionStorage.getItem(DRAFT_KEY) || '{}');
    } catch (error) {
      return {};
    }
  };

  const clearDraft = () => {
    window.sessionStorage.removeItem(DRAFT_KEY);
  };

  const saveDraft = () => {
    if (!professorSelect.value) {
      clearDraft();
      return;
    }

    const scores = {};
    getScoreFields().forEach(([key, element]) => {
      if (element && element.value) scores[key] = element.value;
    });

    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify({
      professorKey: professorSelect.value,
      scores,
      comentario: comentarioInput ? comentarioInput.value : ''
    }));
  };

  const setMessage = (text, isError = false) => {
    message.textContent = text;
    message.style.color = isError ? '#b91c1c' : '#047857';
  };

  const currentSemester = () => {
    const storedSemester = window.sessionStorage.getItem('sistema-avaliacao:studentSemester');
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const md = month * 100 + day;

    if (md >= 1007 || md <= 308) return '1.º Semestre';
    if (md >= 310 && md <= 804) return '2.º Semestre';

    return storedSemester || '2.º Semestre';
  };

  const courseAliases = (curso) => {
    const values = [curso, 'EISI', 'Engenharia de Inf. e Sist. de Informação'];
    return values.filter((value, index) => value && values.indexOf(value) === index);
  };

  const mergeUniqueProfessors = (lists) => {
    const seen = new Set();
    const merged = [];

    lists.flat().forEach((professor) => {
      const key = professorKey(professor);
      if (seen.has(key)) return;
      seen.add(key);
      merged.push(professor);
    });

    return merged;
  };

  const professorKey = (professor) => `${professor.id}:${professor.disciplina_id || ''}`;

  const setEvaluationEnabled = (enabled) => {
    [
      clarezaInput,
      dinamismoInput,
      recursosInput,
      criteriosAvaliacaoInput,
      retornoInput,
      disponibilidadeInput,
      respeitoInput,
      pontualidadeInput,
      metodologiaInput,
      didaticaInput,
      assiduidadeInput,
      comentarioInput,
      submitButton
    ].forEach((element) => {
      if (element) element.disabled = !enabled;
    });
  };

  const showCatalog = () => {
    if (catalogSection) catalogSection.hidden = false;
    if (formCard) formCard.hidden = true;

    const list = document.getElementById('professorCatalog');
    if (!list) return;

    list.classList.remove('has-selected-card');
    list.querySelectorAll('.professor-card').forEach((card) => {
      card.hidden = false;
    });
  };

  const hideCatalog = () => {
    if (catalogSection) catalogSection.hidden = true;
  };

  const renderProfessorCatalog = () => {
    const list = document.getElementById('professorCatalog');
    if (!list) return;

    if (!professors.length) {
      list.innerHTML = '<p class="helper-text">Nenhum professor disponível para avaliação.</p>';
      return;
    }

    list.innerHTML = professors.map((professor) => {
      const key = professorKey(professor);
      const evaluated = evaluatedProfessorIds.has(key);
      const photo = professor.foto_perfil
        ? `<img src="${escapeHtml(professor.foto_perfil)}" alt="">`
        : `<span>${escapeHtml((professor.nome || 'P').slice(0, 1).toUpperCase())}</span>`;
      
      // Mudança crucial: O card agora é uma div com propriedades de acessibilidade (Aria/Tabindex)
      return `
        <div class="professor-card${evaluated ? ' is-evaluated' : ''}" 
             role="button" 
             tabindex="${evaluated ? '-1' : '0'}" 
             data-key="${escapeHtml(key)}" 
             ${evaluated ? 'aria-disabled="true"' : ''}>
          <div class="professor-photo">
            ${photo}
            ${evaluated ? '<span class="professor-evaluated-badge">Avaliado</span>' : ''}
          </div>
          <div class="professor-card-info">
            <strong>${escapeHtml(professor.nome || 'Professor')}</strong>
            <span>${escapeHtml(professor.disciplina_nome || 'Cadeira não informada')}</span>
            <small>${escapeHtml(professor.ano_academico || 'Ano não informado')} | ${escapeHtml(professor.semestre || 'Semestre não informado')}</small>
          </div>
          <div class="professor-card-actions">
            <button class="professor-card-action" type="button" data-key="${escapeHtml(key)}" ${evaluated ? 'disabled' : ''}>
              ${evaluated ? 'Já avaliado' : 'Avaliar'}
            </button>
          </div>
        </div>
      `;
    }).join('');

    list.querySelectorAll('.professor-card').forEach((card) => {
      const actionBtn = card.querySelector('.professor-card-action');
      const selectedKey = card.dataset.key;

      // Centralização da lógica de seleção para evitar duplicação de código
      const handleSelection = () => {
        if (evaluatedProfessorIds.has(String(selectedKey))) {
          setMessage('Já avaliou este professor nesta disciplina.', true);
          return;
        }
        professorSelect.value = selectedKey;
        syncDepartment();
        saveDraft();
        hideCatalog();
        if (formCard) {
          formCard.hidden = false;
          formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (metodologiaInput) metodologiaInput.focus();
      };

      if (actionBtn) {
        actionBtn.addEventListener('click', (ev) => {
          ev.stopPropagation(); // Evita disparar o clique da div pai simultaneamente
          handleSelection();
        });
      }

      card.addEventListener('click', () => {
        handleSelection();
      });

      card.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          handleSelection();
        }
      });
    });

    if (backToCatalogBtn) {
      backToCatalogBtn.addEventListener('click', () => {
        professorSelect.value = '';
        clearDraft();
        document.querySelectorAll('.professor-card').forEach((c) => c.classList.remove('is-selected'));
        showCatalog();
        setMessage('');
      });
    }

    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') {
        if (formCard && !formCard.hidden) {
          professorSelect.value = '';
          clearDraft();
          document.querySelectorAll('.professor-card').forEach((c) => c.classList.remove('is-selected'));
          showCatalog();
          setMessage('');
        }
      }
    });

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  };

  const syncDepartment = () => {
    const selected = professors.find((professor) => professorKey(professor) === professorSelect.value);
    if (professorNomeInput) professorNomeInput.value = selected ? (selected.nome || 'Professor') : '';
    if (disciplinaInput) disciplinaInput.value = selected ? (selected.disciplina_nome || 'Cadeira não informada') : '';
    if (departamentoInput) departamentoInput.value = selected ? (selected.curso || 'Curso não informado') : '';
    setEvaluationEnabled(Boolean(selected));

    document.querySelectorAll('.professor-card').forEach((card) => {
      card.classList.toggle('is-selected', card.dataset.key === professorSelect.value);
    });
  };

  const restoreDraft = () => {
    const draft = readDraft();
    const selectedKey = draft.professorKey ? String(draft.professorKey) : '';
    if (!selectedKey || evaluatedProfessorIds.has(selectedKey)) {
      clearDraft();
      return;
    }

    const selected = professors.find((professor) => professorKey(professor) === selectedKey);
    if (!selected) {
      clearDraft();
      return;
    }

    professorSelect.value = selectedKey;
    syncDepartment();

    const scores = draft.scores || {};
    getScoreFields().forEach(([key, element]) => {
      if (element && scores[key]) element.value = scores[key];
    });
    if (comentarioInput && typeof draft.comentario === 'string') {
      comentarioInput.value = draft.comentario;
    }

    hideCatalog();
    if (formCard) formCard.hidden = false;
  };

  const loadProfessors = async () => {
    try {
      const curso = window.sessionStorage.getItem('sistema-avaliacao:studentCourse') || 'Engenharia de Inf. e Sist. de Informação';
      const ano = window.sessionStorage.getItem('sistema-avaliacao:studentYear') || '4.º Ano';
      const professorLists = [];

      for (const cursoOpcao of courseAliases(curso)) {
        const list = await ProfessorAPI.listar(cursoOpcao, { ano });
        if (list.length) professorLists.push(list);
      }

      professors = mergeUniqueProfessors(professorLists);

      if (!professors.length) {
        professorSelect.innerHTML = '<option value="">Nenhum professor disponível</option>';
        renderProfessorCatalog();
        setMessage('Nenhum professor do seu curso está disponível para avaliação.');
        return;
      }

      const alunoId = window.sessionStorage.getItem('sistema-avaliacao:studentId');
      if (alunoId && window.AvaliacaoAPI) {
        try {
          const evaluations = await AvaliacaoAPI.listar(alunoId);
          evaluatedProfessorIds = new Set(evaluations.map((item) => `${item.professor_id}:${item.disciplina_id || ''}`));
        } catch (error) {
          evaluatedProfessorIds = new Set();
        }
      }

      professorSelect.innerHTML = '<option value="">Selecione um professor</option>' + professors.map((professor) => (
        `<option value="${escapeHtml(professorKey(professor))}">${escapeHtml(professor.nome)} - ${escapeHtml(professor.disciplina_nome || 'Cadeira não informada')}</option>`
      )).join('');
      renderProfessorCatalog();
      syncDepartment();
      restoreDraft();
      setMessage('');
    } catch (error) {
      professorSelect.innerHTML = '<option value="">Não foi possível carregar</option>';
      setMessage('Não foi possível carregar os professores agora. Tente novamente mais tarde.', true);
    }
  };

  professorSelect.addEventListener('change', syncDepartment);
  professorSelect.addEventListener('change', saveDraft);

  getScoreFields().forEach(([, element]) => {
    if (element) element.addEventListener('change', saveDraft);
  });
  if (comentarioInput) comentarioInput.addEventListener('input', saveDraft);

  form.addEventListener('reset', (event) => {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    window.setTimeout(() => {
      [
        clarezaInput,
        dinamismoInput,
        recursosInput,
        criteriosAvaliacaoInput,
        retornoInput,
        disponibilidadeInput,
        respeitoInput,
        pontualidadeInput,
        metodologiaInput,
        didaticaInput,
        assiduidadeInput
      ].forEach((el) => { if (el) el.value = ''; });

      if (comentarioInput) comentarioInput.value = '';

      setEvaluationEnabled(Boolean(professorSelect.value));
      clearDraft();
      setMessage('');
    }, 0);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const alunoId = Number(window.sessionStorage.getItem('sistema-avaliacao:studentId'));
    const selectedProfessor = professors.find((professor) => professorKey(professor) === professorSelect.value);
    const professorId = Number(selectedProfessor ? selectedProfessor.id : 0);
    const disciplinaId = Number(selectedProfessor ? selectedProfessor.disciplina_id : 0);
    const clareza = Number(clarezaInput.value);
    const dinamismo = Number(dinamismoInput.value);
    const recursos = Number(recursosInput.value);
    const criteriosAvaliacao = Number(criteriosAvaliacaoInput.value);
    const retorno = Number(retornoInput.value);
    const disponibilidade = Number(disponibilidadeInput.value);
    const respeito = Number(respeitoInput.value);
    const pontualidade = Number(pontualidadeInput.value);
    const metodologia = Number(metodologiaInput.value);
    const didatica = Number(didaticaInput ? didaticaInput.value : 0);
    const assiduidade = Number(assiduidadeInput ? assiduidadeInput.value : 0);

    if (!alunoId) {
      setMessage('Inicie sessão para enviar a avaliação.', true);
      return;
    }

    const scores = [clareza, dinamismo, recursos, criteriosAvaliacao, retorno, disponibilidade, respeito, pontualidade];
    if (!professorId || !disciplinaId || scores.some((score) => score < 1 || score > 5) || metodologia < 1 || metodologia > 5 || didatica < 1 || didatica > 5 || assiduidade < 1 || assiduidade > 5) {
      setMessage('Escolha o professor e informe as notas de 1 a 5.', true);
      return;
    }

    try {
      await AvaliacaoAPI.criar({
        aluno_id: alunoId,
        professor_id: professorId,
        disciplina_id: disciplinaId,
        clareza,
        dinamismo,
        recursos,
        criterios_avaliacao: criteriosAvaliacao,
        retorno,
        disponibilidade,
        respeito,
        pontualidade,
        metodologia,
        didatica,
        assiduidade,
        comentario: comentarioInput.value.trim()
      });

      evaluatedProfessorIds.add(`${professorId}:${disciplinaId}`);
      clearDraft();
      form.reset();
      renderProfessorCatalog();
      showCatalog();
      if (formCard) formCard.hidden = true;
      setMessage('Avaliação enviada com sucesso.');
    } catch (error) {
      setMessage(error.message || 'Não foi possível enviar a avaliação agora. Tente novamente.', true);
    }
  });

  setEvaluationEnabled(false);
  loadProfessors();
});
