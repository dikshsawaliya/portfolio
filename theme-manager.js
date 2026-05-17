export class ThemeManager {
  constructor(storageKey = 'ds_theme'){
    this.storageKey = storageKey;
    this.root = document.documentElement;
  }

  init(){
    const current = localStorage.getItem(this.storageKey) || 'light';
    this.root.setAttribute('data-theme', current);
  }

  toggle(){
    const current = this.root.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    this.root.setAttribute('data-theme', next);
    localStorage.setItem(this.storageKey, next);
  }
}