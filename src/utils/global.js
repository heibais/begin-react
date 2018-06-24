
export function getLoginUser() {
  const userPrincipalStr = localStorage.getItem('begin-user');
  if (userPrincipalStr) {
    return JSON.parse(userPrincipalStr);
  }
  return null;
}

export function setLoginUser(user) {
  localStorage.setItem('begin-user', user);
}

export function getUserId() {
  return getLoginUser() ? getLoginUser().id : 0;
}
