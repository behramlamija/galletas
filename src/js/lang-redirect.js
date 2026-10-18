// Root page: send the visitor to their saved language, their browser language, or the default.
(function () {
  const script = document.currentScript;
  const base = script.dataset.base || '';
  const langs = script.dataset.langs.split(',');
  let lang = script.dataset.default;
  try {
    const saved = localStorage.getItem('es-lang');
    if (saved && langs.includes(saved)) lang = saved;
    else {
      const browser = (navigator.languages || [navigator.language]).map((l) => l.slice(0, 2).toLowerCase());
      const match = browser.find((l) => langs.includes(l) || (l === 'hr' || l === 'sr' ? langs.includes('bs') : false));
      if (match) lang = langs.includes(match) ? match : 'bs';
    }
  } catch {
    /* storage blocked */
  }
  location.replace(`${base}/${lang}/${location.search}${location.hash}`);
})();
