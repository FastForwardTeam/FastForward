export const beforeNavigateRules = [
  {
    id: 1,
    priority: 2,
    action: {
      type: 'redirect',
      redirect: {
        regexSubstitution:
          chrome.runtime.getURL('/html/crowd-bypassed.html') + '\\1',
      },
    },
    condition: {
      regexFilter:
        '^https?://fastforward.team/bypassed(\\?(.*&)?type=crowd(&.*)?$)',
      resourceTypes: ['main_frame'],
    },
  },
  {
    id: 2,
    priority: 2,
    action: {
      type: 'redirect',
      redirect: {
        regexSubstitution:
          chrome.runtime.getURL('/html/tracker-bypass.html') + '\\1',
      },
    },
    condition: {
      regexFilter:
        '^https?://fastforward.team/bypassed(\\?(.*&)?type=tracker(&.*)?$)',
      resourceTypes: ['main_frame'],
    },
  },
  {
    id: 3,
    priority: 1,
    action: {
      type: 'redirect',
      redirect: {
        regexSubstitution:
          chrome.runtime.getURL('/html/before-navigate.html') + '\\1',
      },
    },
    condition: {
      regexFilter: '^https?://fastforward\\.team/bypassed(\\?.*)',
      resourceTypes: ['main_frame'],
    },
  },
];
