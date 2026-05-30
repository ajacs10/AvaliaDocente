document.addEventListener('DOMContentLoaded', () => {
  const profileForm = document.getElementById('profileForm');
  const passwordForm = document.getElementById('passwordForm');
  const profileName = document.getElementById('profileName');
  const profileStudentId = document.getElementById('profileStudentId');
  const profileIdentifierLabel = document.getElementById('profileIdentifierLabel');
  const profileUserType = document.getElementById('profileUserType');
  const profileYearLabel = document.getElementById('profileYearLabel');
  const profileCourse = document.getElementById('profileCourse');
  const profileYear = document.getElementById('profileYear');
  const profileEmail = document.getElementById('profileEmail');
  const profilePhone = document.getElementById('profilePhone');
  const profileEmailView = document.getElementById('profileEmailView');
  const profilePhoneView = document.getElementById('profilePhoneView');
  const profilePhoto = document.getElementById('profilePhoto');
  const profilePhotoButton = document.getElementById('profilePhotoButton');
  const profilePhotoInput = document.getElementById('profilePhotoInput');
  const profileMessage = document.getElementById('profileMessage');
  const passwordMessage = document.getElementById('passwordMessage');
  const id = window.sessionStorage.getItem('sistema-avaliacao:studentId');

  document.querySelectorAll('[data-toggle-password]').forEach((button) => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.togglePassword);
      if (!input) return;

      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      button.setAttribute('aria-pressed', String(show));
      button.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
      button.innerHTML = `<i data-lucide="${show ? 'eye-off' : 'eye'}"></i>`;

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    });
  });

  document.querySelectorAll('[data-edit-target]').forEach((button) => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.editTarget);
      if (!input) return;

      input.readOnly = false;
      input.focus();
      input.select();
    });
  });

  const shortName = (name) => {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'Estudante';
    const format = (value) => {
      const text = String(value || '').toLowerCase();
      return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
    };
    if (parts.length === 1) return format(parts[0]);
    return `${format(parts[0])} ${format(parts[parts.length - 1])}`;
  };

  const initials = (name) => {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'ES';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  const setMessage = (element, text, isError = false) => {
    element.textContent = text;
    element.style.color = isError ? '#b91c1c' : '#047857';
  };

  const renderPhoto = (name, photo) => {
    if (!profilePhoto) return;
    if (photo) {
      profilePhoto.innerHTML = `<img src="${photo}" alt="">`;
    } else {
      profilePhoto.textContent = initials(shortName(name));
    }
  };

  const storeUser = (user) => {
    window.sessionStorage.setItem('sistema-avaliacao:studentName', user.nome || '');
    window.sessionStorage.setItem('sistema-avaliacao:studentEmail', user.email || '');
    window.sessionStorage.setItem('sistema-avaliacao:studentPhone', user.telefone || '');
    window.sessionStorage.setItem('sistema-avaliacao:studentPhoto', user.foto_perfil || '');
    window.sessionStorage.setItem('sistema-avaliacao:studentCourse', user.curso || '');
    window.sessionStorage.setItem('sistema-avaliacao:studentYear', user.ano_academico || '');
    if (user.tipo) {
      window.sessionStorage.setItem('sistema-avaliacao:userType', user.tipo);
    }
  };

  const renderUser = (user) => {
    const statCards = document.querySelectorAll('.profile-id-stats .stat-card');
    const identifierLabelEl = profileIdentifierLabel || statCards[0]?.querySelector('.muted') || null;
    const studentIdEl = profileStudentId || statCards[0]?.querySelector('strong') || null;
    const yearLabelEl = profileYearLabel || statCards[1]?.querySelector('.muted') || null;
    const yearValueEl = profileYear || statCards[1]?.querySelector('strong') || null;
    const userTypeEl = profileUserType || statCards[2]?.querySelector('strong') || null;

    const explicitType = String(user.tipo || window.sessionStorage.getItem('sistema-avaliacao:userType') || '').toLowerCase();
    const nameHint = String(user.nome || window.sessionStorage.getItem('sistema-avaliacao:studentName') || '').toLowerCase();
    const roleHint = /professor|docente/.test(explicitType) || /professor|docente/.test(nameHint);
    const userType = roleHint ? 'professor' : 'aluno';
    const isProfessor = userType === 'professor';

    if (isProfessor) {
      window.sessionStorage.setItem('sistema-avaliacao:userType', 'professor');
    }
    const rawYear = String(user.ano_academico || '').trim();
    const matchedYear = rawYear.match(/\b(19|20)\d{2}\b/);
    const createdAtYear = user.created_at ? new Date(String(user.created_at).replace(' ', 'T')).getFullYear() : NaN;
    const entryYear = matchedYear ? matchedYear[0] : (Number.isNaN(createdAtYear) ? '' : String(createdAtYear));

    const name = user.nome || window.sessionStorage.getItem('sistema-avaliacao:studentName') || 'Estudante';
    if (profileName) profileName.textContent = shortName(name);
    if (studentIdEl) studentIdEl.textContent = id || '--';
    if (identifierLabelEl) identifierLabelEl.textContent = isProfessor ? 'N.º do Docente' : 'N.º de Estudante';
    if (userTypeEl) userTypeEl.textContent = isProfessor ? 'Docente' : 'Aluno';
    if (yearLabelEl) yearLabelEl.textContent = isProfessor ? 'Ano de ingresso' : 'Ano';
    if (profileCourse) profileCourse.textContent = isProfessor ? 'Leciona várias disciplinas' : (user.curso || 'Curso não informado');
    if (yearValueEl) yearValueEl.textContent = isProfessor ? (entryYear || '--') : (user.ano_academico || '--');
    if (profileEmail) profileEmail.value = user.email || '';
    if (profilePhone) profilePhone.value = user.telefone || '';
    if (profileEmailView) profileEmailView.textContent = user.email || '--';
    if (profilePhoneView) profilePhoneView.textContent = user.telefone || '--';
    renderPhoto(name, user.foto_perfil);
  };

  const loadProfile = async () => {
    if (!id) {
      setMessage(profileMessage, 'Inicie sessão para editar o perfil.', true);
      return;
    }

    renderUser({
      nome: window.sessionStorage.getItem('sistema-avaliacao:studentName'),
      email: window.sessionStorage.getItem('sistema-avaliacao:studentEmail'),
      telefone: window.sessionStorage.getItem('sistema-avaliacao:studentPhone'),
      foto_perfil: window.sessionStorage.getItem('sistema-avaliacao:studentPhoto'),
      curso: window.sessionStorage.getItem('sistema-avaliacao:studentCourse'),
      ano_academico: window.sessionStorage.getItem('sistema-avaliacao:studentYear')
    });

    try {
      const response = await fetch(`../../backend/php/routes/perfil.php?id=${encodeURIComponent(id)}`);
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message);
      storeUser(result.data);
      renderUser(result.data);
      if (typeof setupLoggedUser === 'function') setupLoggedUser();
    } catch (error) {
      setMessage(profileMessage, 'Não foi possível carregar os dados do perfil agora.', true);
    }
  };

  if (profilePhotoInput) {
    if (profilePhotoButton) {
      profilePhotoButton.addEventListener('click', () => profilePhotoInput.click());
    }

    profilePhotoInput.addEventListener('change', () => {
      const file = profilePhotoInput.files && profilePhotoInput.files[0];
      if (!file) return;
      const preview = URL.createObjectURL(file);
      renderPhoto('', preview);
    });
  }

  if (profileForm) {
    profileForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!id) {
        setMessage(profileMessage, 'Inicie sessão para guardar alterações.', true);
        return;
      }

      const formData = new FormData(profileForm);
      formData.append('action', 'profile');
      formData.append('id', id);

      try {
        const response = await fetch('../../backend/php/routes/perfil.php', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message);
        storeUser(result.data);
        renderUser(result.data);
        if (profileEmail) profileEmail.readOnly = true;
        if (profilePhone) profilePhone.readOnly = true;
        if (typeof setupLoggedUser === 'function') setupLoggedUser();
        setMessage(profileMessage, 'Perfil atualizado com sucesso.');
        profilePhotoInput.value = '';
      } catch (error) {
        setMessage(profileMessage, error.message || 'Não foi possível guardar alterações.', true);
      }
    });
  }

  if (passwordForm) {
    passwordForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const password = document.getElementById('newPassword').value;
      const confirm = document.getElementById('confirmPassword').value;

      if (password.length < 4) {
        setMessage(passwordMessage, 'A nova senha deve ter pelo menos 4 caracteres.', true);
        return;
      }

      if (password !== confirm) {
        setMessage(passwordMessage, 'As senhas não coincidem.', true);
        return;
      }

      const formData = new FormData();
      formData.append('action', 'password');
      formData.append('id', id);
      formData.append('password', password);
      formData.append('confirm_password', confirm);

      try {
        const response = await fetch('../../backend/php/routes/perfil.php', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message);
        passwordForm.reset();
        setMessage(passwordMessage, 'Senha atualizada com sucesso.');
      } catch (error) {
        setMessage(passwordMessage, error.message || 'Não foi possível atualizar a senha.', true);
      }
    });
  }

  loadProfile();
});
