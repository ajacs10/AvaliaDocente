document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const studentInput = form.querySelector('input[type=text]');
  const passwordInput = document.getElementById('passwordField');
  const rememberInput = form.querySelector('.remember input[type=checkbox]');
  const message = document.getElementById('authMessage');
  const AUTH_KEYS = [
    'sistema-avaliacao:authenticated',
    'sistema-avaliacao:studentId',
    'sistema-avaliacao:studentName',
    'sistema-avaliacao:studentEmail',
    'sistema-avaliacao:studentPhone',
    'sistema-avaliacao:studentPhoto',
    'sistema-avaliacao:studentCourse',
    'sistema-avaliacao:studentYear',
    'sistema-avaliacao:userType',
    'sistema-avaliacao:professorId'
  ];

  const setMsg = (txt, isError = true) => {
    message.textContent = txt;
    message.classList.toggle('is-error', isError);
    message.classList.toggle('is-success', !isError);
  };

  const setAuthValue = (key, value, persist) => {
    sessionStorage.setItem(key, value);
    if (persist) window.localStorage.setItem(key, value);
    else window.localStorage.removeItem(key);
  };

  const clearPersistentAuth = () => {
    AUTH_KEYS.forEach((key) => window.localStorage.removeItem(key));
  };

  const savedStudentId = window.localStorage.getItem('sistema-avaliacao:studentId');
  if (savedStudentId && window.localStorage.getItem('sistema-avaliacao:authenticated') === 'true') {
    studentInput.value = savedStudentId;
    if (rememberInput) rememberInput.checked = true;
  }
  // helper to load translation for login flow
  const loadTranslations = async () => {
    try {
      const lang = window.localStorage.getItem('sistema-avaliacao:lang') || 'pt';
      const resp = await fetch(`../i18n/${lang}.json`, { headers: { Accept: 'application/json' } });
      const payload = await resp.json();
      return payload.translations || {};
    } catch (e) {
      return {};
    }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const student = (studentInput.value || '').trim();
    const pass = passwordInput.value || '';
    const submitBtn = form.querySelector('button[type=submit]');

    const translations = await loadTranslations();
    const t = (key) => translations[key] || key;

    if (!student || !pass) {
      setMsg(t('Informe o numero de estudante e a senha.'));
      return;
    }

    // disable inputs and show processing state
    studentInput.disabled = true;
    passwordInput.disabled = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.orig = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span class="btn-spinner" aria-hidden="true"></span> ${t('A processar...')}`;
    }

    try {
      const authUrl = `${window.location.origin}/backend/php/routes/auth.php`;
      const response = await fetch(authUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          student_id: student,
          password: pass
        })
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        // restore inputs
        studentInput.disabled = false;
        passwordInput.disabled = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = submitBtn.dataset.orig || submitBtn.innerHTML;
        }
        setMsg(result.message || t('Credenciais invalidas. Verifique numero de estudante e senha.'));
        return;
      }

      const user = result.data;
      const remember = Boolean(rememberInput && rememberInput.checked);
      if (!remember) clearPersistentAuth();

      setAuthValue('sistema-avaliacao:authenticated', 'true', remember);
      setAuthValue('sistema-avaliacao:studentId', String(user.id), remember);
      setAuthValue('sistema-avaliacao:studentName', user.nome || '', remember);
      setAuthValue('sistema-avaliacao:studentEmail', user.email || '', remember);
      setAuthValue('sistema-avaliacao:studentPhone', user.telefone || '', remember);
      setAuthValue('sistema-avaliacao:studentPhoto', user.foto_perfil || '', remember);
      setAuthValue('sistema-avaliacao:studentCourse', user.curso || '', remember);
      setAuthValue('sistema-avaliacao:studentYear', user.ano_academico || '', remember);
      const userType = String(user.tipo || 'aluno').toLowerCase();
      setAuthValue('sistema-avaliacao:userType', userType, remember);
      if (user.professor_id) setAuthValue('sistema-avaliacao:professorId', String(user.professor_id), remember);
      else {
        window.sessionStorage.removeItem('sistema-avaliacao:professorId');
        window.localStorage.removeItem('sistema-avaliacao:professorId');
      }

      // keep showing spinner briefly and then redirect (without extra message)
      setTimeout(() => {
        if (userType === 'professor') {
          const query = user.professor_id ? `?professor_id=${encodeURIComponent(user.professor_id)}` : '';
          window.location.href = `./dashboard-professor.html${query}`;
          return;
        }
        if (userType === 'admin') {
          window.location.href = './dashboard-direcao.html';
          return;
        }
        window.location.href = './dashboard-aluno.html';
      }, 300);
    } catch (error) {
      studentInput.disabled = false;
      passwordInput.disabled = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = submitBtn.dataset.orig || submitBtn.innerHTML;
      }
      setMsg(`${t('Nao foi possivel autenticar agora. Tente novamente.')}
      (${error.message})`);
    }
  });
});
