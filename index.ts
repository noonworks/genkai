const DiacriticalMarkMap = {
  '-': [String.fromCharCode(0x0304)],
  '.': [String.fromCharCode(0x0307)],
  '?': [String.fromCharCode(0x0307), String.fromCharCode(0x0309)],
  '~': [String.fromCharCode(0x0303)],
};
'aeioucdhmrtvx'.split('').map((v, i) => {
  DiacriticalMarkMap[v] = [String.fromCharCode(0x0363 + i)];
});
const ModifierLetterMap = {
  '!': String.fromCharCode(0xA71D),
  'n': String.fromCharCode(0x207F),
};
'h jr   wy'.split('').map((c, i) => {
  if (c !== ' ') { ModifierLetterMap[c] = String.fromCharCode(0x02B0 + i); }
});
'sx'.split('').map((c, i) => {
  if (c !== ' ') { ModifierLetterMap[c] = String.fromCharCode(0x02E2 + i); }
});
'A B DE GHIJKLMN O PRTUW'.split('').map((c, i) => {
  if (c !== ' ') { ModifierLetterMap[c] = String.fromCharCode(0x1D2C + i); }
});
'a   bde   g km o   ptu  v'.split('').map((c, i) => {
  if (c !== ' ') { ModifierLetterMap[c] = String.fromCharCode(0x1D43 + i); }
});
'c   f g   I         N       U  z'.split('').map((c, i) => {
  if (c !== ' ') { ModifierLetterMap[c] = String.fromCharCode(0x1D9C + i); }
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

enum CharType {
  EMPTY,
  DIACRITICAL,
  MODIFIER,
  INVALID,
}

function makeZalgo(yomigana: string, bunshou: string): string {
  const r = alignLength(yomigana, bunshou);
  bunshou = r.bunshou;
  yomigana = r.yomigana;
  if (yomigana.length === 0) {
    return bunshou;
  }
  let result = '';
  let prev = CharType.EMPTY;
  for (let i = 0; i < yomigana.length; i++) {
    const yChar = yomigana.substring(i, i + 1);
    const bChar = bunshou.substring(i, i + 1);
    if (yChar in DiacriticalMarkMap) {
      // diacritical marks
      if (bChar === ' ' && (prev === CharType.INVALID || prev === CharType.DIACRITICAL)) {
        result += '  ';
      } else {
        result += bChar;
      }
      (DiacriticalMarkMap[yChar] as string[]).forEach((c) => result += c);
      prev = CharType.DIACRITICAL;
    } else if (yChar in ModifierLetterMap) {
      // modifier letters
      if (bChar !== ' ') {
        result += bChar;
      }
      result += ModifierLetterMap[yChar];
      prev = CharType.MODIFIER;
    } else {
      // invalid yomigana
      result += bChar;
      prev = CharType.INVALID;
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
  const charlist2: HTMLSpanElement | null = document.querySelector('#charlist2');
  if (charlist) {
    charlist.innerText = Object.getOwnPropertyNames(DiacriticalMarkMap).sort().join(' ');
  }
  if (charlist2) {
    charlist2.innerText = Object.getOwnPropertyNames(ModifierLetterMap).sort().join(' ');
  }
}

document.addEventListener('DOMContentLoaded', initialize);
