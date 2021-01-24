import createElement from '../createElement/createElement.js';

export default class Key {
  constructor ({ small, shift, code}){
    this.small = small;
    this.shift = shift;
    this.code = code;
    this.isFnKey = Boolean(small.match(/Caps|Enter|Back|Ctrl|Shift|Del|Alt|arr|Tab|ru|en/))

    
    if(shift && shift.match(/[^a-zA-Zа-яА-ЯёЁ0-9]/)){
      this.sub = createElement('div', 'sub', this.shift);
    } else {
      this.sub = createElement('div', 'sub', '')
    }

    this.letter = createElement('div', 'letter', this.small)
    this.div = createElement('div', 'keyboard__key', [this.sub, this.letter], null, ['code', this.code], this.isFnKey?['fn', 'true']:['fn', 'false'])
  }


}