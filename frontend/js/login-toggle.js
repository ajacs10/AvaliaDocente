document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.toggle-password');
  const input = document.getElementById('passwordField');
  if (!toggle || !input) return;

  const setState = (visible) => {
    input.type = visible ? 'text' : 'password';
    toggle.setAttribute('aria-pressed', visible ? 'true' : 'false');
    toggle.setAttribute('aria-label', visible ? 'Esconder senha' : 'Mostrar senha');
  };

  toggle.addEventListener('click', () => {
    const isVisible = toggle.getAttribute('aria-pressed') === 'true';
    setState(!isVisible);
  });

  // ensure proper initial state
  setState(false);
});

// make sure icons reflect initial state even if DOM loaded after script
document.addEventListener('DOMContentLoaded', () => {
  const t = document.querySelector('.toggle-password');
  if (t) {
    const isVisible = t.getAttribute('aria-pressed') === 'true';
    t.setAttribute('aria-pressed', isVisible ? 'true' : 'false');
  }
});
