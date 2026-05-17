export const dom = {
  get(id){ return document.getElementById(id); },
  qS(selector, root = document){ return root.querySelector(selector); },
  qSA(selector, root = document){ return Array.from(root.querySelectorAll(selector)); },
  on(root, event, selector, handler){
    if(!root) return;
    root.addEventListener(event, (e)=>{
      const target = e.target.closest(selector);
      if(target) handler(e, target);
    });
  },
  create(tag, options = {}){
    const element = document.createElement(tag);
    Object.entries(options).forEach(([key, value])=>{
      if(key === 'className') element.className = value;
      else if(key === 'text') element.textContent = value;
      else if(key === 'html') element.innerHTML = value;
      else if(key === 'attrs') Object.entries(value).forEach(([attr, attrValue]) => element.setAttribute(attr, attrValue));
      else element[key] = value;
    });
    return element;
  }
};