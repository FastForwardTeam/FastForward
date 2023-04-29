const brws = typeof browser == 'undefined' ? chrome : browser;
document.documentElement.setAttribute(
  'dir',
  brws.i18n.getMessage('@@bidi_dir')
);
