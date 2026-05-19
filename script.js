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

    const sorted = [...this.projects].sort((a, b) => parseInt(b.year) - parseInt(a.year));
    sorted.forEach((project, index)=>{
      const card = this.createProjectCard(project, index + 1);
      this.container.appendChild(card);
      this.revealObserver.observe(card);
    });

    const actionCard = this.createActionCard();
    this.container.appendChild(actionCard);
  }

  createProjectCard(project, index){
    const card = dom.create('div', { className: 'proj-card reveal' });
    const githubLink = project.gitHub ? `<a href="${project.gitHub}" target="_blank" rel="noopener noreferrer" class="proj-github" title="View on GitHub">→ GitHub</a>` : '';
    card.innerHTML = `
      ${this.admin && !project.id.startsWith('d') ? `<button class="proj-del" onclick="delProj('${project.id}', event)">✕</button>` : ''}
      <div class="proj-num">0${index}</div>
      <div class="proj-title">${project.title}</div>
      <div class="proj-desc">${project.desc}</div>
      <div class="proj-tags">${(project.tags || []).map(tag => `<span class="proj-tag">${tag}</span>`).join('')}</div>
      <div class="proj-foot"><span class="dot">●</span>${project.year || ''}${project.domain ? ' · ' + project.domain : ''}${githubLink ? ' ' + githubLink : ''}</div>
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
    ['pTitle','pDesc','pTags','pDomain','pYear','pGitHub'].forEach(id=>{
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
    const gitHub = dom.get('pGitHub')?.value.trim() || '';

    this.customProjects.unshift({
      id: 'p_' + Date.now(),
      title,
      desc,
      tags,
      domain,
      year,
      gitHub
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

function renderNav(){
  const logo = dom.get('navLogo');
  const links = dom.get('navLinks');
  const socials = dom.get('socialLinks');
  if(logo){
    logo.textContent = navData.logo;
    logo.href = navData.logoHref;
  }
  if(links){
    links.innerHTML = navData.links.map(link => `<li><a href="${link.href}">${link.label}</a></li>`).join('');
  }
  if(socials){
    socials.innerHTML = navData.socials.map(link => `<a href="${link.href}" class="social-link" target="_blank" rel="noopener noreferrer">${link.label}</a>`).join('');
  }
}

function renderHero(){
  const container = dom.get('heroContent');
  if(!container) return;
  container.innerHTML = `
    <div class="hero-pill">${heroData.pill}</div>
    <h1 class="hero-name">${heroData.nameHtml}</h1>
    <p class="hero-sub">${heroData.subtitle}</p>
    <div class="hero-btns">${heroData.buttons.map(button => `<a href="${button.href}" class="btn ${button.primary ? 'btn-primary' : 'btn-outline'}">${button.text}</a>`).join('')}</div>
    <div class="hero-stats">${heroData.stats.map(stat => `<div><div class="stat-n">${stat.value}</div><div class="stat-l">${stat.label}</div></div>`).join('')}</div>
  `;
}

function renderSkills(){
  const section = dom.get('skillsContent');
  if(!section) return;
  section.innerHTML = `
    <div class="reveal"><p class="sec-lbl">${skillsData.label}</p><h2 class="sec-title">${skillsData.title}</h2></div>
    <div class="skills-grid reveal">${skillsData.groups.map(group => `<div class="skill-card"><div class="skill-cat">${group.category}</div><div class="skill-tags">${group.tags.map(tag => `<span class="skill-tag">${tag}</span>`).join('')}</div></div>`).join('')}</div>
  `;
}

function renderJourney(){
  const section = dom.get('journeyContent');
  if(!section) return;
  section.innerHTML = `
    <div class="reveal"><p class="sec-lbl">${journeyData.label}</p><h2 class="sec-title">${journeyData.title}</h2></div>
    <p class="journey-intro reveal">${journeyData.intro}</p>
    <div class="journey-track reveal">${journeyData.eras.map(era => `
      <div class="j-era ${era.className}">
        <div class="j-dot-col"><div class="j-dot"></div></div>
        <div class="j-content">
          <div class="j-meta"><span class="j-year">${era.year}</span><span class="j-badge">${era.badge}</span></div>
          <h3 class="j-title">${era.title}</h3>
          <p class="j-body">${era.body}</p>
          <div class="j-tech">${era.tags.map(tag => `<span class="j-tag">${tag}</span>`).join('')}</div>
        </div>
      </div>
    `).join('')}</div>
  `;
}

function renderExperience(){
  const section = dom.get('experienceContent');
  if(!section) return;
  section.innerHTML = `
    <div class="reveal"><p class="sec-lbl">${experienceData.label}</p><h2 class="sec-title">${experienceData.title}</h2></div>
    <div class="exp-list reveal">${experienceData.items.map(item => `
      <div class="exp-item${item.open ? ' open' : ''}">
        <div class="exp-hd">
          <div class="exp-left"><div class="exp-co">${item.company}</div><div class="exp-role">${item.role}</div></div>
          <div class="exp-right"><div class="exp-period">${item.period}</div>${item.loc ? `<div class="exp-loc">${item.loc}</div>` : ''}</div>
          <div class="exp-tog">+</div>
        </div>
        <div class="exp-body${item.open ? ' open' : ''}"><div class="exp-div"></div>
          <ul class="exp-bul">${item.bullets.map(bullet => `<li>${bullet}</li>`).join('')}</ul>
        </div>
      </div>
    `).join('')}</div>
  `;
}

function renderContact(){
  const section = dom.get('contactContent');
  if(!section) return;
  section.innerHTML = `
    <div class="reveal"><p class="sec-lbl">${contactData.label}</p><h2 class="sec-title">${contactData.title}</h2></div>
    <div class="contact-wrap reveal">
      <div class="contact-panel">
        <p class="contact-lead">${contactData.lead}</p>
        <div class="contact-links">${contactData.details.map(detail => `<a href="${detail.href}" class="c-link"><span>${detail.icon}</span> ${detail.text}</a>`).join('')}</div>
        <p class="contact-note">${contactData.note}</p>
      </div>
      <form id="contactForm" class="contact-form">
        <div class="fld"><label for="contactName">${contactData.form.name}</label><input id="contactName" type="text" placeholder="${contactData.form.placeholders.name}" required /></div>
        <div class="fld"><label for="contactEmail">${contactData.form.email}</label><input id="contactEmail" type="email" placeholder="${contactData.form.placeholders.email}" required /></div>
        <div class="fld"><label for="contactMessage">${contactData.form.message}</label><textarea id="contactMessage" rows="6" placeholder="${contactData.form.placeholders.message}" required></textarea></div>
        <button type="submit" class="btn btn-primary">${contactData.form.submit}</button>
      </form>
    </div>
  `;
}

function renderProjectsSection(){
  const section = dom.get('projectsContent');
  if(!section) return;
  section.innerHTML = `
    <div class="reveal"><p class="sec-lbl">${projectsData.label}</p><h2 class="sec-title">${projectsData.title}</h2></div>
  `;
}

function renderFooter(){
  const footer = dom.get('siteFooter');
  if(!footer) return;
  footer.innerHTML = `
    <p>${footerData.copyright}</p>
    <div style="display:flex;gap:12px;align-items:center;margin-top:6px">
      <div class="status-pill"><div class="sdot"></div> ${footerData.status}</div>
      <a href="#cv" class="btn btn-outline">${footerData.cvLabel || 'CV'}</a>
    </div>
  `;
}


function renderSite(){
  renderNav();
  renderHero();
  renderSkills();
  renderJourney();
  renderExperience();
  renderProjectsSection();
  renderContact();
  renderFooter();
}

const themeManager = new ThemeManager();
const scrollTracker = new ScrollTracker('nav');
const revealObserver = new RevealObserver('.reveal');
const accordion = new Accordion(document, '.exp-item', '.exp-body', 'open');
const addModal = new Modal('addModal');
const pinModal = new Modal('pinModal');
const cvModal = new Modal('cvModal');
const toast = new Toast('toast');

const projectManager = new ProjectManager({
  containerId: 'projGrid',
  defaults: projectDefaults,
  storageKey: 'ds_projs',
  toast,
  addModal,
  pinModal,
  revealObserver
});

const pinPad = new PinPad({
  pin: ADMIN_PIN,
  toast,
  pinModal,
  onSuccess(){
    projectManager.setAdmin(true);
    pinModal.close();
    toast.show('Admin mode on ✓');
  }
});

function init(){
  renderSite();
  themeManager.init();
  dom.qS('.theme-btn')?.addEventListener('click', () => themeManager.toggle());
  dom.qSA('.exp-hd').forEach(header => header.addEventListener('click', () => accordion.toggle(header)));
  dom.get('contactForm')?.addEventListener('submit', handleContact);
  scrollTracker.init();
  revealObserver.init();
  pinPad.init();
  projectManager.render();

  // Attach handlers for CV open/close (nav + footer links)
  dom.qSA('a[href="#cv"]').forEach(el => {
    el.addEventListener('click', (ev) => {
      ev.preventDefault();
      const src = footerData.cvHref || 'Diksh_Sawaliya_Resume.pdf';
      const iframe = dom.get('cvIframe');
      const dl = dom.get('cvDownload');
      if(iframe) iframe.src = src;
      if(dl) dl.href = src;
      cvModal.open();
    });
  });
  dom.get('cvClose')?.addEventListener('click', () => cvModal.close());
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
function handleContact(event){
  event.preventDefault();
  const name = dom.get('contactName')?.value.trim();
  const email = dom.get('contactEmail')?.value.trim();
  const message = dom.get('contactMessage')?.value.trim();

  if(!name || !email || !message){
    toast.show('Please complete all fields before sending.');
    return;
  }

  const emailAddress = 'diksh101sawaliya@gmail.com';
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
  toast.show('Launching mail app...');
}
