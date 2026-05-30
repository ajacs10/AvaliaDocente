document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('recoveryForm');
  const intro = document.getElementById('recoveryIntro');
  const requestFields = document.getElementById('recoveryRequestFields');
  const resetFields = document.getElementById('recoveryResetFields');
  const emailInput = document.getElementById('recoveryEmail');
  const passwordInput = document.getElementById('recoveryPassword');
  const confirmInput = document.getElementById('recoveryConfirm');
  const submitButton = document.getElementById('recoverySubmit');
  const message = document.getElementById('recoveryMessage');
  const token = new URLSearchParams(window.location.search).get('token') || '';

  if (!form || !emailInput || !passwordInput || !confirmInput || !message) return;

  const setMsg = (text, isError = true) => {
    message.textContent = text;
    message.classList.toggle('is-error', isError);
    message.classList.toggle('is-success', !isError);
  };

  const setResetMode = () => {
    if (requestFields) requestFields.hidden = true;
    if (resetFields) resetFields.hidden = false;
    emailInput.required = false;
    passwordInput.required = true;
    confirmInput.required = true;
    if (intro) intro.textContent = 'Defina a nova senha para concluir a recuperação do acesso.';
    if (submitButton) submitButton.textContent = 'Atualizar senha';
  };

  if (token) setResetMode();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {};
    if (token) {
      const novaSenha = passwordInput.value || '';
      const confirmarSenha = confirmInput.value || '';

      if (!novaSenha || !confirmarSenha) {
        setMsg('Preencha a nova senha e a confirmação.');
        return;
      }

      if (novaSenha.length < 4) {
        setMsg('A nova senha deve ter pelo menos 4 caracteres.');
        return;
      }

      if (novaSenha !== confirmarSenha) {
        setMsg('As senhas não coincidem.');
        return;
      }

      payload.token = token;
      payload.nova_senha = novaSenha;
      payload.confirmar_senha = confirmarSenha;
    } else {
      const email = (emailInput.value || '').trim();
      if (!email) {
        setMsg('Informe o email institucional.');
        return;
      }
      payload.email = email;
    }

    try {
      const response = await fetch('../../backend/php/routes/recuperar-acesso.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        setMsg(result.message || 'Não foi possível recuperar o acesso agora.');
        return;
      }

      if (token) {
        setMsg('Senha atualizada com sucesso. Redirecionando para o login...', false);
        form.reset();
        setTimeout(() => {
          window.location.href = './login.html';
        }, 900);
        return;
      }

      setMsg(result.message || 'Enviamos um link de recuperação para o seu email.', false);
      if (result.reset_link) {
        setMsg(`${result.message} Link de teste: ${result.reset_link}`, false);
      }
      form.reset();
    } catch (error) {
      setMsg('Não foi possível recuperar o acesso agora. Tente novamente.');
    }
  });
});
