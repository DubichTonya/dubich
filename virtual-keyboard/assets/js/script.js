import {getStorage} from './storage/storage.js';
import Keyboard from './component/keyBoard.js';

const rowsOrder = [
  ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal'],
  ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash'],
  ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
  ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period','ArrowLeft', 'ArrowRight', 'ArrowUp',  'ArrowDown'],
  ['Tab', 'ControlLeft', 'AltLeft', 'ShiftLeft', 'Backspace', 'Slash', 'Del'],
  ['CapsLock','Space', 'Lang']
];

const lang = getStorage('lang', '"ru"');

new Keyboard(rowsOrder).init("ru").generate();

