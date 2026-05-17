export class ScrollTracker {
  constructor(navId){
    this.nav = document.getElementById(navId);
  }

  init(){
    if(!this.nav) return;
    window.addEventListener('scroll', ()=>{
      this.nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }
}