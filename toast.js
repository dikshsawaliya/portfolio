export class Toast {
  constructor(id){
    this.toastEl = document.getElementById(id);
    this.hideTimer = null;
  }

  show(message){
    if(!this.toastEl) return;
    this.toastEl.textContent = message;
    this.toastEl.classList.add('show');
    clearTimeout(this.hideTimer);
    this.hideTimer = setTimeout(()=>{
      this.toastEl.classList.remove('show');
    }, 2600);
  }
}