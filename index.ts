const CharMap = {
  '-': [String.fromCharCode(0x0304)],
  '.': [String.fromCharCode(0x0307)],
  '?': [String.fromCharCode(0x0307), String.fromCharCode(0x0309)],
  '~': [String.fromCharCode(0x0303)],
};
'aeioucdhmrtvx'.split('').map((v, i) => {
  CharMap[v] = [String.fromCharCode(0x0363 + i)];
});

function addSpaces(yomigana: string, bunshou: string): string {
  if (bunshou.length >= yomigana.length) {
    return bunshou;
  }
  let result = bunshou;
  const fusoku = yomigana.length - bunshou.length;
  const after = Math.floor(fusoku / 2);
  const pre = fusoku - after;
  for (let i = 0; i < after || i < pre; i++) {
    if (i < after) { result = result + ' '; }
    if (i < pre) { result = ' ' + result; }
  }
  return result;
}

function makeZalgo(yomigana: string, bunshou: string): string {
  if (yomigana.length === 0) {
    return bunshou;
  }
  bunshou = addSpaces(yomigana, bunshou);
  let result = '';
  for (let i = 0; i < yomigana.length; i++) {
    const yChar = yomigana.substring(i, i + 1);
    const bChar = bunshou.substring(i, i + 1);
    if (yChar in CharMap) {
      // valid yomigana
      if (bChar === ' ') {
        result += '  ';
      } else {
        result += bChar;
      }
      (CharMap[yChar] as string[]).forEach((c) => result += c);
    } else {
      // invalid yomigana
      result += bChar;
    }
  }
  return result;
}

const debounceOnChange = (() => {
  const INTERVAL = 500;
  let timer = -1;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(doOnChange, INTERVAL);
  };
})();

function doOnChange() {
  if (yomiganaInput === null || bunshouInput === null || resultInput === null) { return; }
  resultInput.value = makeZalgo(yomiganaInput.value, bunshouInput.value);
}

let yomiganaInput: HTMLInputElement | null;
let bunshouInput: HTMLInputElement | null;
let resultInput: HTMLInputElement | null;

function initialize() {
  yomiganaInput = document.querySelector('#yomigana');
  bunshouInput = document.querySelector('#bunshou');
  resultInput = document.querySelector('#result');
  if (yomiganaInput) {
    yomiganaInput.addEventListener('keyup', debounceOnChange);
    yomiganaInput.addEventListener('blur', debounceOnChange);
  }
  if (bunshouInput) {
    bunshouInput.addEventListener('keyup', debounceOnChange);
    bunshouInput.addEventListener('blur', debounceOnChange);
  }
  const charlist: HTMLSpanElement | null = document.querySelector('#charlist');
  if (charlist) {
    charlist.innerText = Object.getOwnPropertyNames(CharMap).join(' ');
  }
}

document.addEventListener('DOMContentLoaded', initialize);
