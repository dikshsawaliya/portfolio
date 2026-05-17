const dom = {
  get(id){ return document.getElementById(id); },
  qS(selector, root = document){ return root.querySelector(selector); },
  qSA(selector, root = document){ return Array.from(root.querySelectorAll(selector)); },
  create(tag, options = {}){
    const el = document.createElement(tag);
    Object.entries(options).forEach(([key, value])=>{
      if(key === 'className') el.className = value;
      else if(key === 'text') el.textContent = value;
      else if(key === 'html') el.innerHTML = value;
      else if(key === 'attrs') Object.entries(value).forEach(([attr, attrValue])=> el.setAttribute(attr, attrValue));
      else el[key] = value;
    });
    return el;
  }
};

class ThemeManager {
  constructor(storageKey = 'ds_theme'){
    this.storageKey = storageKey;
    this.root = document.documentElement;
  }

  init(){
    const stored = localStorage.getItem(this.storageKey) || 'light';
    this.root.setAttribute('data-theme', stored);
  }

  toggle(){
    const current = this.root.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    this.root.setAttribute('data-theme', next);
    localStorage.setItem(this.storageKey, next);
  }
}

class ScrollTracker {
  constructor(targetId){
    this.target = dom.get(targetId);
  }

  init(){
    if(!this.target) return;
    window.addEventListener('scroll', ()=>{
      this.target.classList.toggle('scrolled', window.scrollY > 40);
    });
  }
}

class RevealObserver {
  constructor(selector, options = { threshold: 0.08 }){
    this.selector = selector;
    this.observer = new IntersectionObserver(this.handleIntersect.bind(this), options);
    this.queue = [];
  }

  init(){
    this.queue = dom.qSA(this.selector);
    this.queue.forEach(el => this.observer.observe(el));
  }

  handleIntersect(entries){
    entries.forEach((entry, index)=>{
      if(entry.isIntersecting){
        setTimeout(()=> entry.target.classList.add('visible'), index * 65);
        this.observer.unobserve(entry.target);
      }
    });
  }

  observe(element){
    if(element) this.observer.observe(element);
  }
}

class Accordion {
  constructor(container = document, itemSelector = '.exp-item', bodySelector = '.exp-body', activeClass = 'open'){
    this.container = container;
    this.itemSelector = itemSelector;
    this.bodySelector = bodySelector;
    this.activeClass = activeClass;
  }

  toggle(header){
    const item = header.closest(this.itemSelector);
    if(!item) return;
    const isOpen = item.classList.contains(this.activeClass);

    this.closeAll();
    if(!isOpen){
      item.classList.add(this.activeClass);
      const body = dom.qS(this.bodySelector, item);
      if(body) body.classList.add(this.activeClass);
    }
  }

  closeAll(){
    dom.qSA(this.itemSelector, this.container).forEach(item=>{
      item.classList.remove(this.activeClass);
      const body = dom.qS(this.bodySelector, item);
      if(body) body.classList.remove(this.activeClass);
    });
  }
}

class Modal {
  constructor(id){
    this.container = dom.get(id);
    if(this.container) this.attachOverlayClose();
  }

  attachOverlayClose(){
    this.container.addEventListener('click', event => {
      if(event.target === this.container) this.close();
    });
  }

  open(){
    this.container?.classList.add('open');
  }

  close(){
    this.container?.classList.remove('open');
  }
}

class Toast {
  constructor(id){ this.toastEl = dom.get(id); }
  show(message){
    if(!this.toastEl) return;
    this.toastEl.textContent = message;
    this.toastEl.classList.add('show');
    clearTimeout(this.hideTimer);
    this.hideTimer = setTimeout(()=> this.toastEl.classList.remove('show'), 2600);
  }
}

class ProjectManager {
  constructor({ containerId, defaults, storageKey, toast, addModal, pinModal, revealObserver }){
    this.container = dom.get(containerId);
    this.defaults = defaults;
    this.storageKey = storageKey;
    this.toast = toast;
    this.addModal = addModal;
    this.pinModal = pinModal;
    this.revealObserver = revealObserver;
    this.admin = false;
    this.customProjects = [];
    this.load();
  }

  get projects(){
    return [...this.defaults, ...this.customProjects];
  }

  load(){
    try{
      this.customProjects = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    } catch {
      this.customProjects = [];
    }
  }

  persist(){
    try{
      localStorage.setItem(this.storageKey, JSON.stringify(this.customProjects));
    } catch {}
  }

  render(){
    if(!this.container) return;
    this.container.innerHTML = '';

    this.projects.forEach((project, index)=>{
      const card = this.createProjectCard(project, index + 1);
      this.container.appendChild(card);
      this.revealObserver.observe(card);
    });

    const actionCard = this.createActionCard();
    this.container.appendChild(actionCard);
  }

  createProjectCard(project, index){
    const card = dom.create('div', { className: 'proj-card reveal' });
    card.innerHTML = `
      ${this.admin && !project.id.startsWith('d') ? `<button class="proj-del" onclick="delProj('${project.id}', event)">✕</button>` : ''}
      <div class="proj-num">0${index}</div>
      <div class="proj-title">${project.title}</div>
      <div class="proj-desc">${project.desc}</div>
      <div class="proj-tags">${(project.tags || []).map(tag => `<span class="proj-tag">${tag}</span>`).join('')}</div>
      <div class="proj-foot"><span class="dot">●</span>${project.year || ''}${project.domain ? ' · ' + project.domain : ''}</div>
    `;
    return card;
  }

  createActionCard(){
    const actionCard = dom.create('div');
    if(this.admin){
      actionCard.className = 'proj-card proj-add';
      actionCard.onclick = ()=> this.openAdd();
      actionCard.innerHTML = '<div class="add-icon-ring">+</div><div class="add-lbl">Add New Project</div>';
    } else {
      actionCard.className = 'proj-card admin-tile';
      actionCard.onclick = ()=> this.openPin();
      actionCard.title = 'Admin login';
      actionCard.innerHTML = '<div class="admin-tile-ico">🔒</div><div class="admin-tile-lbl">Admin</div>';
    }
    return actionCard;
  }

  openAdd(){
    this.addModal.open();
  }

  closeAdd(){
    this.addModal.close();
    this.clearAddForm();
  }

  clearAddForm(){
    ['pTitle','pDesc','pTags','pDomain','pYear'].forEach(id=>{
      const element = dom.get(id);
      if(element) element.value = '';
    });
  }

  saveProject(){
    const title = dom.get('pTitle')?.value.trim();
    const desc = dom.get('pDesc')?.value.trim();
    if(!title || !desc){
      this.toast.show('Title and description required');
      return;
    }

    const tags = dom.get('pTags')?.value.split(',').map(tag => tag.trim()).filter(Boolean) || [];
    const domain = dom.get('pDomain')?.value.trim() || '';
    const year = dom.get('pYear')?.value.trim() || new Date().getFullYear().toString();

    this.customProjects.unshift({
      id: 'p_' + Date.now(),
      title,
      desc,
      tags,
      domain,
      year
    });
    this.persist();
    this.render();
    this.closeAdd();
    this.toast.show('Project saved ✓');
  }

  deleteProject(id, event){
    event?.stopPropagation();
    this.customProjects = this.customProjects.filter(project => project.id !== id);
    this.persist();
    this.render();
    this.toast.show('Project removed');
  }

  openPin(){
    this.pinModal.open();
  }

  setAdmin(value){
    this.admin = value;
    this.render();
  }
}

class PinPad {
  constructor({ pin, toast, pinModal, onSuccess }){
    this.pin = pin;
    this.toast = toast;
    this.pinModal = pinModal;
    this.onSuccess = onSuccess;
    this.inputs = [];
    this.errorElement = dom.get('pinErr');
  }

  init(){
    this.inputs = [0,1,2,3].map(i => dom.get('p' + i)).filter(Boolean);
    this.inputs.forEach((input, index) => {
      input.addEventListener('input', () => this.handleInput(index));
      input.addEventListener('keydown', event => this.handleKeydown(event, index));
    });
  }

  handleInput(index){
    const current = this.inputs[index];
    if(current.value.length === 1){
      if(index < this.inputs.length - 1){
        this.inputs[index + 1].focus();
      } else {
        this.checkPin();
      }
    }
  }

  handleKeydown(event, index){
    if(event.key === 'Backspace' && !this.inputs[index].value && index > 0){
      this.inputs[index - 1].focus();
    }
    if(event.key === 'Enter'){
      event.preventDefault();
      this.checkPin();
    }
  }

  open(){
    this.clear();
    this.pinModal.open();
    setTimeout(()=> this.inputs[0]?.focus(), 80);
  }

  close(){
    this.pinModal.close();
  }

  clear(){
    this.inputs.forEach(input => input.value = '');
    if(this.errorElement) this.errorElement.textContent = '';
  }

  checkPin(){
    const entered = this.inputs.map(input => input.value).join('');
    if(entered === this.pin){
      this.onSuccess();
      return;
    }
    if(this.errorElement) this.errorElement.textContent = 'Incorrect PIN — try again';
    this.clear();
    this.inputs[0]?.focus();
  }
}

const themeManager = new ThemeManager();
const scrollTracker = new ScrollTracker('nav');
const revealObserver = new RevealObserver('.reveal');
const accordion = new Accordion(document, '.exp-item', '.exp-body', 'open');
const addModal = new Modal('addModal');
const pinModal = new Modal('pinModal');
const toast = new Toast('toast');

const projectManager = new ProjectManager({
  containerId: 'projGrid',
  defaults: [
    {id:'d1',title:'AI Voice Recognition SDK',desc:'Architected and shipped a cross-platform voice recognition SDK with a React Native wrapper that cut integration time by ~40% for partner teams across 3 product domains.',tags:['Kotlin','React Native','Voice SDK','AI/ML'],domain:'SDK · Cross-Platform',year:'2024'},
    {id:'d2',title:'Yatra.com Android — Stability',desc:'Drove crash-free sessions to 99.4%+ on a travel app serving millions. Implemented Firebase Crashlytics alerting, fixed ANRs, and resolved memory leaks using LeakCanary.',tags:['Kotlin','Firebase','LeakCanary','Crashlytics'],domain:'Travel · Android',year:'2023'},
    {id:'d3',title:'Barcode Scanner SDK — Denso',desc:'Led SDK integration for Denso retail hardware achieving <200ms scan-to-result latency with full compatibility across 5+ hardware SKUs.',tags:['Kotlin','SDK','Hardware Integration','Retail'],domain:'Retail · Android',year:'2024'},
    {id:'d4',title:'GettingRipped — Fitness App',desc:'Developed and published an end-to-end fitness application on Huawei AppGallery using Huawei HMS Core during an Android internship.',tags:['Kotlin','HMS Core','Huawei AppGallery'],domain:'Health · Android',year:'2021'},
    {id:'d5',title:'AR Zombie Survival — Jio Glasses',desc:'Built a zombie survival AR game for Jio smart glasses using Unity + Jio SDK, optimised for constrained XR hardware.',tags:['Unity','C#','Jio SDK','AR/XR'],domain:'Gaming · AR',year:'2022'}
  ],
  storageKey: 'ds_projs',
  toast,
  addModal,
  pinModal,
  revealObserver
});

const pinPad = new PinPad({
  pin: '2580',
  toast,
  pinModal,
  onSuccess(){
    projectManager.setAdmin(true);
    pinModal.close();
    toast.show('Admin mode on ✓');
  }
});

function init(){
  themeManager.init();
  dom.qS('.theme-btn')?.addEventListener('click', () => themeManager.toggle());
  scrollTracker.init();
  revealObserver.init();
  pinPad.init();
  projectManager.render();
}

init();

function toggleTheme(){ themeManager.toggle(); }
function toggleExp(header){ accordion.toggle(header); }
function openPin(){ pinPad.open(); }
function closePin(){ pinPad.close(); }
function checkPin(){ pinPad.checkPin(); }
function openAdd(){ projectManager.openAdd(); }
function closeAdd(){ projectManager.closeAdd(); }
function saveProject(){ projectManager.saveProject(); }
function delProj(id, event){ projectManager.deleteProject(id, event); }
function toastMessage(msg){ toast.show(msg); }
function handleContact(){ toast.show('Message sent! (demo mode)'); }
