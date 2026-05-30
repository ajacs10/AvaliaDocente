(function () {
  const STORAGE_KEY = 'sistema-avaliacao:lang';
  let translations = {};
  let observer = null;
  let applying = false;

  const escapeSelector = (value) => String(value || '').replace(/[^a-z0-9_-]/gi, '');

  const shouldSkip = (element) => {
    return !element || element.closest('script, style, [data-no-translate]');
  };

  const translateTextNode = (node) => {
    const value = node.nodeValue.trim();
    if (!value || shouldSkip(node.parentElement)) return;

    const parent = node.parentElement;
    const key = `i18nText${Array.prototype.indexOf.call(parent.childNodes, node)}`;
    if (!parent.dataset[key]) parent.dataset[key] = value;

    const original = parent.dataset[key];
    if (translations[original]) {
      node.nodeValue = node.nodeValue.replace(value, translations[original]);
      return;
    }

    const greeting = original.match(/^Olá,\s*(.+)$/);
    if (greeting && translations['Olá, {name}']) {
      node.nodeValue = node.nodeValue.replace(value, translations['Olá, {name}'].replace('{name}', greeting[1]));
      return;
    }

    if (getCurrentLanguage() === 'pt' && value !== original) {
      node.nodeValue = node.nodeValue.replace(value, original);
    }
  };

  const runSetup = () => {
    setupInlineSwitcher();
    applyTranslations();
  };

  const applyTranslations = () => {
    if (applying) return;
    applying = true;

    document.querySelectorAll('body *').forEach((element) => {
      if (shouldSkip(element)) return;

      element.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
      });

      ['placeholder', 'aria-label', 'title'].forEach((attr) => {
        const value = element.getAttribute(attr);
        if (!value) return;

        const key = `i18nOriginal${attr.replace('-', '')}`;
        if (!element.dataset[key]) element.dataset[key] = value;

        const original = element.dataset[key];
        if (translations[original]) element.setAttribute(attr, translations[original]);
        else if (getCurrentLanguage() === 'pt' && value !== original) element.setAttribute(attr, original);
      });
    });

    document.querySelectorAll('[data-lang]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.lang === getCurrentLanguage());
    });

    applying = false;
  };

  const startObserver = () => {
    if (observer || !document.body) return;

    observer = new MutationObserver(() => {
      window.clearTimeout(startObserver.timer);
      startObserver.timer = window.setTimeout(runSetup, 40);
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['placeholder', 'aria-label', 'title'] });
  };

  const getCurrentLanguage = () => window.localStorage.getItem(STORAGE_KEY) || 'pt';

  const loadLanguage = async (lang) => {
    const safeLang = escapeSelector(lang) || 'pt';
    try {
      const response = await fetch(`../i18n/${safeLang}.json`, { headers: { Accept: 'application/json' } });
      const payload = await response.json();
      translations = payload.translations || {};
      window.localStorage.setItem(STORAGE_KEY, safeLang);
      document.documentElement.lang = payload.lang || safeLang;
      runSetup();
      startObserver();
    } catch (error) {
      translations = {};
    }
  };

  const setupInlineSwitcher = () => {
    document.querySelectorAll('[data-i18n-switcher]').forEach((switcher) => {
      if (switcher.dataset.i18nReady === '1') return;
      switcher.dataset.i18nReady = '1';
      switcher.querySelectorAll('[data-lang]').forEach((button) => {
        button.addEventListener('click', () => loadLanguage(button.dataset.lang));
      });
    });
  };

  window.AppI18n = {
    applyCurrent: applyTranslations,
    current: getCurrentLanguage,
    load: loadLanguage,
    setupInlineSwitcher
  };

  document.addEventListener('DOMContentLoaded', () => {
    startObserver();
    loadLanguage(getCurrentLanguage());
  });
})();
