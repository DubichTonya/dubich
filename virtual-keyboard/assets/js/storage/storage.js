export function setStorage(name, value){
  window.localStorage.setItem(name, JSON.stringify(value));
}

export function getStorage(name, subst = null){
  return JSON.parse(window.localStorage.getItem(name || subst))
}

export function removeStorage(name){
  window.localStorage.removeItem(name);
}