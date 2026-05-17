import { dom } from './dom.js';

export class Accordion {
  constructor(itemSelector = '.exp-item', bodySelector = '.exp-body', activeClass = 'open'){
    this.itemSelector = itemSelector;
    this.bodySelector = bodySelector;
    this.activeClass = activeClass;
    this.container = document;
  }

  toggle(header){
    const item = header.closest(this.itemSelector);
    if(!item) return;
    const itemBody = dom.qS(this.bodySelector, item);
    const isOpen = item.classList.contains(this.activeClass);

    this.closeAll();
    if(!isOpen){
      item.classList.add(this.activeClass);
      itemBody?.classList.add(this.activeClass);
    }
  }

  closeAll(){
    dom.qSA(this.itemSelector, this.container).forEach(item=>{
      item.classList.remove(this.activeClass);
      dom.qS(this.bodySelector, item)?.classList.remove(this.activeClass);
    });
  }
}