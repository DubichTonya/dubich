const clearBtns = document.querySelectorAll('.clear-btn');
const numberBtns = document.querySelectorAll('.number');
const operatorBtns = document.querySelectorAll('.operator');
const decimalPoint = document.getElementById('decimal');
const display = document.getElementById('display');
const radic = document.getElementById('radic');
const square = document.getElementById('square')
let memoryCurrent = 0;
let newNumber = false;
let memoryPendingOperation = ''



const isClear = (btn) => {
  if (btn === "ce") {
    display.value = '0';
    newNumber = true;
  } else if (btn === "c") {
    display.value = '0';
    newNumber = true;
    let memoryCurrent = 0;
    let memoryPendingOperation = ''
  }
}

const pressNumber = (number) => {
  if (newNumber) {
    display.value = number;
    newNumber = false;
  } else {
    if (display.value === '0') {
      display.value = number;
    } else {
      display.value += number;
      if (display.value.length > 18) {
        let arr = display.value.split('');
        arr = arr.slice(0, arr.length - 1);
        display.value = arr.join('');
      }
    }
  }
}


const decimal = () => {
  var localDecimalMemory = display.value;

  if (newNumber) {
    localDecimalMemory = "0.";
    newNumber = false;
  } else {
    if (localDecimalMemory.indexOf(".") === -1) {
      localDecimalMemory += "."
    }
  };
  display.value = localDecimalMemory;
};



const isOperation = (operator) => {
  let localOperationMemory = display.value;
 
  if (newNumber && memoryPendingOperation !== "=") {
    display.value = memoryCurrent;
  } else {
    newNumber = true;
    if (memoryPendingOperation === "+") {
      memoryCurrent += +localOperationMemory;
      isDecimalNumber(memoryCurrent);
    } else if (memoryPendingOperation === "-") {
      memoryCurrent -= +localOperationMemory;
      isDecimalNumber(memoryCurrent);
    } else if (memoryPendingOperation === "*") {
      memoryCurrent *= +localOperationMemory;
      isDecimalNumber(memoryCurrent);
    } else if (memoryPendingOperation === "/") {
      memoryCurrent /= +localOperationMemory;
      isDecimalNumber(memoryCurrent);
    }
    else {
      memoryCurrent = +localOperationMemory;
    }
    display.value = memoryCurrent;
    memoryPendingOperation = operator;
  };
}



for (let i = 0; i < clearBtns.length; i++) {
  let clearBtn = clearBtns[i];
  clearBtn.addEventListener('click', (e) => {
    isClear(e.target.textContent)
  })
}

for (let i = 0; i < numberBtns.length; i++) {
  let numberBtn = numberBtns[i];
  numberBtn.addEventListener('click', (e) => {
    pressNumber(e.target.textContent)
  })
}


for (let i = 0; i < operatorBtns.length; i++) {
  let operatorBtn = operatorBtns[i];
  operatorBtn.addEventListener('click', (e) => {
    isOperation(e.target.textContent)
  })
}

decimalPoint.addEventListener('click', decimal)

square.addEventListener('click', () => {
  if(display.value !== 0) {
    display.value = display.value ** 2;
    memoryCurrent = display.value;
    newNumber = false;
  }
})


radic.addEventListener('click', () => {
  if(display.value !== 0) {
    display.value = Math.sqrt(display.value)
    memoryCurrent = display.value;
    newNumber = false;
  }
})

function isDecimalNumber(num){
  if(num.toString().indexOf('.')){
    memoryCurrent = +num.toFixed(14);
  }
}

