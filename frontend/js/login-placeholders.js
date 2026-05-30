// Remove placeholder on focus and restore on blur if input empty
(function(){
  const selector = '.login-box input[type=text], .login-box input[type=password]';
  const inputs = document.querySelectorAll(selector);
  if (!inputs.length) return;

  inputs.forEach((input) => {
    // store original placeholder
    const ph = input.getAttribute('placeholder') || '';
    input.dataset.originalPlaceholder = ph;

    input.addEventListener('focus', () => {
      input.setAttribute('placeholder', '');
    });

    input.addEventListener('blur', () => {
      if (!input.value) {
        input.setAttribute('placeholder', input.dataset.originalPlaceholder || '');
      }
    });
  });
})();
