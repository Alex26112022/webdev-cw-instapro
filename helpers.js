export function saveUserToLocalStorage(user) {
  window.localStorage.setItem('user', JSON.stringify(user));
}

export function getUserFromLocalStorage(user) {
  try {
    const u = JSON.parse(window.localStorage.getItem('user'));
    if (u && !u.id && u._id) u.id = u._id;
    return u;
  } catch (error) {
    return null;
  }
}

export function removeUserFromLocalStorage(user) {
  window.localStorage.removeItem('user');
}

export function escapeHtml(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
