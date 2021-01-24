import * as storage from '../storage/storage.js';
import createElement from '../createElement/createElement.js';
import language from '../langArr/language.js';
import Key from './btnKey.js';
import speech from './SpeechRecognition.js'


const container = createElement('main');


export default class Keyboard {
  constructor(rowsOrder) {
    this.rowsOrder = rowsOrder;
    this.keyPress = {};
    this.isCaps = false;
    this.isAudio = true;
  };



  init(langCode) {
    this.keyMain = language[langCode];
    this.soundBtnSpan = createElement('span', 'visually-hidden', null, this.soundBtn);
    this.soundBtn = createElement('button', 'soundBtn', this.soundBtnSpan, container);
    this.soundBtnSpan.innerHTML = "Звук";
    this.speakBtnSpan = createElement('span', 'visually-hidden', null, this.speakBtn);
    this.speakBtn = createElement('button', 'speakBtn', this.speakBtnSpan, container);
    this.speakBtnSpan.innerHTML = "Говорите";
    this.stopBtnSpan = createElement('span', 'visually-hidden', null, this.speakBtn);
    this.stopBtn = createElement('button', 'stopBtn', this.stopBtnSpan, container);
    this.stopBtnSpan.innerHTML = "Стоп";
    this.output = createElement('textarea', 'output', null, container, ['placeholder', 'Введите текст'],
      ['rows', 5],
      ['rows', 10]);

    this.closeBtnSpan = createElement('span', 'visually-hidden', null, this.closeBtn);
    this.closeBtn = createElement('button', 'closeBtn', this.closeBtnSpan, container);
    this.closeBtnSpan.innerHTML = "Закрыть";
    this.keyboardWrapper = createElement('div', 'keyboard', null, container, ['language', langCode]);
    document.body.prepend(container);
    createElement('audio', null, null, container, ['src', `assets/audio/fnKey.mp3`], ['fn', 'true'], );
    createElement('audio', null, null, container, ['src', `assets/audio/key.mp3`], ['fn', 'false']);
    return this;
  }

  

  generate() {
    this.keyButtons = [];
    this.rowsOrder.forEach((row, i) => {
      const rowElement = createElement('div', `keyboard__row`, null, this.keyboardWrapper, ['row', i + 1]);
      // rowElement.style.gridTemplateColumns = `repeat(${row.length}, 1fr)`;

      row.forEach((code) => {
        const keyObj = this.keyMain.find((key) => key.code === code);
        if (keyObj) {
          const keyButton = new Key(keyObj);
          this.keyButtons.push(keyButton);
          rowElement.appendChild(keyButton.div);
        }
      })
    });

    document.addEventListener('keydown', this.handleEvent);
    document.addEventListener('keyup', this.handleEvent);
    this.keyboardWrapper.addEventListener('mousedown', this.preHandleEvent);
    this.keyboardWrapper.addEventListener('mouseup', this.preHandleEvent);
    this.closeBtn.addEventListener('click', this.keyBoardShow)
    this.soundBtn.addEventListener('click', this.soundOnOff)
    speech(this.speakBtn, this.stopBtn, this.output, this.keyboardWrapper.dataset.language);
    
  }



  keyBoardShow = () => {
    this.keyboardWrapper.classList.toggle('showBoard')
    this.closeBtn.classList.toggle('closeBtnShow')
  }

  soundOnOff = () => {
    if(this.isAudio) {
      this.isAudio = false;
      this.soundBtn.classList.add('soundOff');
    } else {
      this.isAudio = true;
      this.soundBtn.classList.remove('soundOff');
    }
      
  }

  preHandleEvent = (e) => {

    e.stopPropagation();
    const keyDiv = e.target.closest('.keyboard__key');
    if (!keyDiv) {
      this.output.focus();
      return;
    }
    const { dataset: { code } } = keyDiv;
    keyDiv.addEventListener('mouseleave', this.resetButtonState);
    this.handleEvent({ code, type: e.type });
  };

  resetButtonState = ({target: {dataset: { code }}}) => {
    const keyObj = this.keyButtons.find((key) => key.code === code);
    keyObj.div.removeEventListener('mouseleave', this.resetButtonState);
  }

  handleEvent = (e) => {
    if (e.stopPropagation) {
      e.stopPropagation()
    }
    const {
      target,
      code,
      type
    } = e;
    const keyObj = this.keyButtons.find((key) => key.code === code);
    if (!keyObj) {
      return
    }
    this.output.focus();

    


    if (type.match(/keydown|mousedown/)) {
      if (type.match(/key/)) {
        e.preventDefault();
      }
      if (code.match(/Shift/)) {
        this.shiftKey = true;
      }

      if(keyObj.div.dataset.fn && this.isAudio) {
        const audio = document.querySelector(`audio[data-fn=${keyObj.div.dataset.fn}]`)
        audio.currentTime = 0;
        audio.play();
      }
      if (this.shiftKey) {
        this.changeUpperCase(true);
      }

      keyObj.div.classList.add('active');

      if (code.match(/Caps/) && !this.isCaps) {

        this.isCaps = true;
        this.changeUpperCase(true);
      } else if (code.match(/Caps/) && this.isCaps) {
        this.isCaps = false;
        this.changeUpperCase(false);
        keyObj.div.classList.remove('active');

      }

      if (code.match(/Control/)) {
        this.ctrlKey = true;
      }
      if (code.match(/Alt/)) {
        this.altKey = true;
      }

      if (code.match(/Control/) && this.altKey) {
        this.changeLanguage()
      }
      if (code.match(/Alt/) && this.ctrlKey) {
        this.changeLanguage()
      }
      // symbol
      if (!this.isCaps) {
        this.printToOutput(keyObj, this.shiftKey ? keyObj.shift : keyObj.small)
      } else if (this.isCaps) {
        if (this.shiftKey) {
          this.printToOutput(keyObj, keyObj.sub.innerHTML ? keyObj.shift : keyObj.small)
        } else {
          this.printToOutput(keyObj, keyObj.sub.innerHTML ? keyObj.small : keyObj.shift)
        }
      }

    } else if (type.match(/up/)) {

      if (code.match(/Control/)) {
        this.ctrlKey = false;
      }
      if (code.match(/Alt/)) {
        this.altKey = false;
      }

      if (code.match(/Shift/)) {
        this.shiftKey = false;
        this.changeUpperCase(false);
      }

      if (!code.match(/Caps/)) {
        keyObj.div.classList.remove('active');
      }
    }

  }


  changeLanguage = () => {
    const langAbbr = Object.keys(language);
    let langIndex = langAbbr.indexOf(this.keyboardWrapper.dataset.language);
    this.keyMain = langIndex + 1 < langAbbr.length ? language[langAbbr[langIndex += 1]] :
      language[langAbbr[langIndex -= 1]];

    this.keyboardWrapper.dataset.language = langAbbr[langIndex];
    storage.setStorage('lang', langAbbr[langIndex]);

    this.keyButtons.forEach((btn) => {
      const keyObj = this.keyMain.find((key) => key.code === btn.code);
      if (!keyObj) {
        return
      }
      btn.shift = keyObj.shift;
      btn.small = keyObj.small;
      if (keyObj.shift && keyObj.shift.match(/[^a-zA-Zа-яА-ЯёЁ0-9]/g)) {
        btn.sub.innerHTML = keyObj.shift;
      } else {
        btn.sub.innerHTML = ''
      }
      btn.letter.innerHTML = keyObj.small;
    })

    if (this.isCaps) {
      this.changeUpperCase(true)
    }
  }

  changeUpperCase(isTrue) {
    if (isTrue) {
      this.keyButtons.forEach((btn) => {
        if (btn.sub) {
          if (this.shiftKey) {
            btn.sub.classList.add('sub-active');
            btn.letter.classList.add('sub-inactive');
          }
        }
        if (!btn.isFnKey && this.isCaps && !this.shiftKey && !btn.sub.innerHTML) {
          btn.letter.innerHTML = btn.shift;
        } else if (!btn.isFnKey && this.isCaps && this.shiftKey) {
          btn.letter.innerHTML = btn.small;
        } else if (!btn.isFnKey && !btn.sub.innerHTML) {
          btn.letter.innerHTML = btn.shift;
        }
      });
    } else {
      this.keyButtons.forEach((btn) => {
        if (btn.sub.innerHTML && !btn.isFnKey) {
          btn.sub.classList.remove('sub-active');
          btn.letter.classList.remove('sub-inactive');
          if (!this.isCaps) {
            btn.letter.innerHTML = btn.small;
          } else if (!this.isCaps) {
            btn.letter.innerHTML = btn.shift;
          }
        } else if (!btn.isFnKey) {
          if (this.isCaps) {
            btn.letter.innerHTML = btn.shift;
          } else {
            btn.letter.innerHTML = btn.small;
          }
        }
      });
    }
  }


  printToOutput(keyObj, symbol) {
    let cursorPosition = this.output.selectionStart;
    let left = this.output.value.slice(0, cursorPosition);
    let right = this.output.value.slice(cursorPosition);

    const fnBtnHandler = {
      Tab: () => {
        this.output.value = `${left}\t${right}`;
        cursorPosition += 1;
      },
      ArrowLeft: () => {
        cursorPosition = cursorPosition - 1 >= 0 ? cursorPosition - 1 : 0;
      },
      ArrowRight: () => {
        cursorPosition += 1;
      },
      ArrowDown: () => {
        const positionFromLeft = this.output.value.slice(0, cursorPosition).match(/^.*(\n).*(?!\1)/) || [
          [1]
        ];
        cursorPosition += positionFromLeft[0].length
      },
      ArrowUp: () => {
        const positionFromLeft = this.output.value.slice(0, cursorPosition).match(/(\n).*$(?!\1)/g) || [
          [1]
        ];
        cursorPosition -= positionFromLeft[0].length;
      },
      Enter: () => {
        this.output.value = `${left}\n${right}`;
        cursorPosition += 1;
      },
      Space: () => {
        this.output.value = `${left} ${right}`;
        cursorPosition += 1;
      },
      Del: () => {
        this.output.value = `${left}${right.slice(1)}`;
      },
      Backspace: () => {
        this.output.value = `${left.slice(0, -1)}${right}`;
        cursorPosition -= 1;
      },
      Lang: () => {
        this.changeLanguage()
      }
    }

    if (fnBtnHandler[keyObj.code]) {
      fnBtnHandler[keyObj.code]();
    } else if (!keyObj.isFnKey) {
      cursorPosition += 1;
      this.output.value = `${left}${symbol || ''}${right}`
    }

    this.output.setSelectionRange(cursorPosition, cursorPosition)


  }

}