const brws = typeof browser == 'undefined' ? chrome : browser;
document.documentElement.setAttribute(
  'dir',
  brws.i18n.getMessage('@@bidi_dir')
);
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.className = 'uk-light uk-background-secondary';
}
