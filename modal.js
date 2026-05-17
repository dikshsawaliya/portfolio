export class Modal {
  constructor(id){
    this.container = document.getElementById(id);
    this.attachOverlayClose();
  }

  attachOverlayClose(){
    if(!this.container) return;
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