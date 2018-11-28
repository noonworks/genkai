const DiacriticalMarkMap = {
  '-': [String.fromCharCode(0x0304)],
  '.': [String.fromCharCode(0x0307)],
  '?': [String.fromCharCode(0x0307), String.fromCharCode(0x0309)],
  '~': [String.fromCharCode(0x0303)],
};
'aeioucdhmrtvx'.split('').map((v, i) => {
  DiacriticalMarkMap[v] = [String.fromCharCode(0x0363 + i)];
});

function alignLength(yomigana: string, bunshou: string): {
  yomigana: string,
  bunshou: string,
} {
  if (yomigana.length === 0 || yomigana.length === bunshou.length) {
    return { bunshou, yomigana };
  }
  const diff = yomigana.length - bunshou.length;
  const padS = Math.floor(Math.abs(diff) / 2);
  const spaceS = ' '.repeat(padS);
  const spaceL = ' '.repeat(Math.abs(diff) - padS);
  if (diff > 0) {
    bunshou = spaceS + bunshou + spaceL;
  } else {
    yomigana = spaceS + yomigana + spaceL;
  }
  return { bunshou, yomigana };
}

function makeZalgo(yomigana: string, bunshou: string): string {
  const r = alignLength(yomigana, bunshou);
  bunshou = r.bunshou;
  yomigana = r.yomigana;
  if (yomigana.length === 0) {
    return bunshou;
  }
  let result = '';
  for (let i = 0; i < yomigana.length; i++) {
    const yChar = yomigana.substring(i, i + 1);
    const bChar = bunshou.substring(i, i + 1);
    if (yChar in DiacriticalMarkMap) {
      // diacritical marks
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
    charlist.innerText = Object.getOwnPropertyNames(DiacriticalMarkMap).join(' ');
  }
}

document.addEventListener('DOMContentLoaded', initialize);
