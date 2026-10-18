// Applies the saved light/dark preference before first paint (loaded as a classic script in <head>).
try {
  const theme = localStorage.getItem('es-theme');
  if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
} catch {
  /* storage blocked: follow the system preference */
}
// Lets CSS know scripts run (scroll-reveal elements start hidden only then).
document.documentElement.classList.add('js');
