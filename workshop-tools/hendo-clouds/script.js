(() => {
  const root = document.documentElement;

  function applyFromInput(input) {
    const name = input.dataset.var;
    const val = input.value;
    if (name && val) root.style.setProperty(name, val);
  }

  function onChange(e) {
    const t = e.target;
    if (!(t instanceof HTMLInputElement)) return;
    if (!t.classList.contains('picker')) return;
    applyFromInput(t);
  }

  function init() {
    document.querySelectorAll('.picker').forEach(applyFromInput);
    document.addEventListener('input', onChange);
    document.addEventListener('change', onChange);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
