import { dom } from './dom.js';

export class PinPad {
  constructor({ pin, toast, pinModal, onSuccess }){
    this.pin = pin;
    this.toast = toast;
    this.pinModal = pinModal;
    this.onSuccess = onSuccess;
    this.inputs = [];
    this.errorElement = dom.get('pinErr');
  }

  init(){
    this.inputs = [0,1,2,3].map(index => dom.get(`p${index}`)).filter(Boolean);
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