import { dom } from './dom.js';

export class RevealObserver {
  constructor(selector = '.reveal', options = { threshold: 0.08 }){
    this.selector = selector;
    this.observer = new IntersectionObserver(this.handleIntersect.bind(this), options);
  }

  init(){
    dom.qSA(this.selector).forEach(el => this.observer.observe(el));
  }

  handleIntersect(entries){
    entries.forEach((entry, index)=>{
      if(entry.isIntersecting){
        setTimeout(()=>{
          entry.target.classList.add('visible');
          this.observer.unobserve(entry.target);
        }, index * 65);
      }
    });
  }

  observe(element){
    if(element) this.observer.observe(element);
  }
}