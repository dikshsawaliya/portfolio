import { dom } from './dom.js';
import { ThemeManager } from './theme-manager.js';
import { ScrollTracker } from './scroll-tracker.js';
import { RevealObserver } from './reveal-observer.js';
import { Accordion } from './accordion.js';
import { Modal } from './modal.js';
import { Toast } from './toast.js';
import { ProjectManager } from './project-manager.js';
import { PinPad } from './pin-pad.js';
import { projectDefaults, ADMIN_PIN } from './data.js';

const themeManager = new ThemeManager();
const scrollTracker = new ScrollTracker('nav');
const revealObserver = new RevealObserver('.reveal');
const accordion = new Accordion();
const addModal = new Modal('addModal');
const pinModal = new Modal('pinModal');
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

function attachUiEvents(){
  dom.qS('.theme-btn')?.addEventListener('click', ()=> themeManager.toggle());
  dom.qSA('.exp-hd').forEach(header => header.addEventListener('click', ()=> accordion.toggle(header)));
  dom.get('contactSend')?.addEventListener('click', ()=> toast.show('Message sent! (demo mode)'));
  dom.get('addCancel')?.addEventListener('click', ()=> projectManager.closeAdd());
  dom.get('addSave')?.addEventListener('click', ()=> projectManager.saveProject());
  dom.get('pinCancel')?.addEventListener('click', ()=> pinPad.close());
  dom.get('pinUnlock')?.addEventListener('click', ()=> pinPad.checkPin());
  dom.on(dom.get('projGrid'), 'click', '.proj-del', (event, target) => {
    projectManager.deleteProject(target.dataset.id, event);
  });
}

function init(){
  themeManager.init();
  scrollTracker.init();
  revealObserver.init();
  pinPad.init();
  projectManager.render();
  attachUiEvents();
}

init();