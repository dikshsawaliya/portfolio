import { dom } from './dom.js';

export class ProjectManager {
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

    this.container.appendChild(this.createActionCard());
  }

  createProjectCard(project, index){
    const card = dom.create('div', { className: 'proj-card reveal' });
    const githubLink = project.gitHub ? `<a href="${project.gitHub}" target="_blank" rel="noopener noreferrer" class="proj-github" title="View on GitHub">→ GitHub</a>` : '';
    card.innerHTML = `
      ${this.admin && !project.id.startsWith('d') ? `<button class="proj-del" data-id="${project.id}">✕</button>` : ''}
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
      actionCard.addEventListener('click', ()=> this.openAdd());
      actionCard.innerHTML = '<div class="add-icon-ring">+</div><div class="add-lbl">Add New Project</div>';
    } else {
      actionCard.className = 'proj-card admin-tile';
      actionCard.addEventListener('click', ()=> this.openPin());
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
    ['pTitle','pDesc','pTags','pDomain','pYear','pGitHub'].forEach(id => {
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