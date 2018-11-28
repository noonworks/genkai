var DiacriticalMarkMap = {
    '-': [String.fromCharCode(0x0304)],
    '.': [String.fromCharCode(0x0307)],
    '?': [String.fromCharCode(0x0307), String.fromCharCode(0x0309)],
    '~': [String.fromCharCode(0x0303)],
};
'aeioucdhmrtvx'.split('').map(function (v, i) {
    DiacriticalMarkMap[v] = [String.fromCharCode(0x0363 + i)];
});
var ModifierLetterMap = {
    '!': String.fromCharCode(0xA71D),
    '0': String.fromCharCode(0x2070),
    '1': String.fromCharCode(0x00B9),
    '2': String.fromCharCode(0x00B2),
    '3': String.fromCharCode(0x00B3),
    'V': String.fromCharCode(0x2C7D),
    'i': String.fromCharCode(0x2071),
    'n': String.fromCharCode(0x207F),
};
'h jr   wy'.split('').map(function (c, i) {
    if (c !== ' ') {
        ModifierLetterMap[c] = String.fromCharCode(0x02B0 + i);
    }
});
'lsx'.split('').map(function (c, i) {
    if (c !== ' ') {
        ModifierLetterMap[c] = String.fromCharCode(0x02E1 + i);
    }
});
'A B DE GHIJKLMN O PRTUW'.split('').map(function (c, i) {
    if (c !== ' ') {
        ModifierLetterMap[c] = String.fromCharCode(0x1D2C + i);
    }
});
'a   bde   g km o   ptu  v'.split('').map(function (c, i) {
    if (c !== ' ') {
        ModifierLetterMap[c] = String.fromCharCode(0x1D43 + i);
    }
});
'c   f g   I         N       U  z'.split('').map(function (c, i) {
    if (c !== ' ') {
        ModifierLetterMap[c] = String.fromCharCode(0x1D9C + i);
    }
});
for (var i = 4; i <= 9; i++) {
    ModifierLetterMap['' + i] = String.fromCharCode(0x2070 + i);
}
function alignLength(yomigana, bunshou) {
    if (yomigana.length === 0 || yomigana.length === bunshou.length) {
        return { bunshou: bunshou, yomigana: yomigana };
    }
    var diff = yomigana.length - bunshou.length;
    var padS = Math.floor(Math.abs(diff) / 2);
    var spaceS = ' '.repeat(padS);
    var spaceL = ' '.repeat(Math.abs(diff) - padS);
    if (diff > 0) {
        bunshou = spaceS + bunshou + spaceL;
    }
    else {
        yomigana = spaceS + yomigana + spaceL;
    }
    return { bunshou: bunshou, yomigana: yomigana };
}
var CharType;
(function (CharType) {
    CharType[CharType["EMPTY"] = 0] = "EMPTY";
    CharType[CharType["DIACRITICAL"] = 1] = "DIACRITICAL";
    CharType[CharType["MODIFIER"] = 2] = "MODIFIER";
    CharType[CharType["INVALID"] = 3] = "INVALID";
})(CharType || (CharType = {}));
function makeZalgo(yomigana, bunshou) {
    var r = alignLength(yomigana, bunshou);
    bunshou = r.bunshou;
    yomigana = r.yomigana;
    if (yomigana.length === 0) {
        return bunshou;
    }
    var useDiacritical = chkRubyChar ? chkRubyChar.checked : true;
    var useModifier = chkOtherChar ? chkOtherChar.checked : true;
    var result = '';
    var prev = CharType.EMPTY;
    for (var i = 0; i < yomigana.length; i++) {
        var yChar = yomigana.substring(i, i + 1);
        var bChar = bunshou.substring(i, i + 1);
        if (useDiacritical && (yChar in DiacriticalMarkMap)) {
            // diacritical marks
            if (bChar === ' ' && (prev === CharType.INVALID || prev === CharType.DIACRITICAL)) {
                result += '  ';
            }
            else {
                result += bChar;
            }
            DiacriticalMarkMap[yChar].forEach(function (c) { return result += c; });
            prev = CharType.DIACRITICAL;
            continue;
        }
        if (useModifier && (yChar in ModifierLetterMap)) {
            // modifier letters
            if (bChar !== ' ' || prev === CharType.DIACRITICAL) {
                result += bChar;
            }
            result += ModifierLetterMap[yChar];
            prev = CharType.MODIFIER;
            continue;
        }
        // invalid yomigana
        result += bChar;
        prev = CharType.INVALID;
    }
    return result;
}
var debounceOnChange = (function () {
    var INTERVAL = 500;
    var timer = -1;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(doOnChange, INTERVAL);
    };
})();
function doOnChange() {
    if (yomiganaInput === null || bunshouInput === null || resultInput === null) {
        return;
    }
    resultInput.value = makeZalgo(yomiganaInput.value, bunshouInput.value);
}
var yomiganaInput;
var bunshouInput;
var resultInput;
var chkRubyChar;
var chkOtherChar;
function initialize() {
    yomiganaInput = document.querySelector('#yomigana');
    bunshouInput = document.querySelector('#bunshou');
    resultInput = document.querySelector('#result');
    chkRubyChar = document.querySelector('#rubychar');
    chkOtherChar = document.querySelector('#otherchar');
    if (yomiganaInput) {
        yomiganaInput.addEventListener('keyup', debounceOnChange);
        yomiganaInput.addEventListener('blur', debounceOnChange);
    }
    if (bunshouInput) {
        bunshouInput.addEventListener('keyup', debounceOnChange);
        bunshouInput.addEventListener('blur', debounceOnChange);
    }
    if (chkRubyChar) {
        chkRubyChar.addEventListener('change', debounceOnChange);
    }
    if (chkOtherChar) {
        chkOtherChar.addEventListener('change', debounceOnChange);
    }
    var charlist = document.querySelector('#charlist');
    var charlist2 = document.querySelector('#charlist2');
    if (charlist) {
        charlist.innerText = Object.getOwnPropertyNames(DiacriticalMarkMap).sort().join(' ');
    }
    if (charlist2) {
        charlist2.innerText = Object.getOwnPropertyNames(ModifierLetterMap).sort().join(' ');
    }
}
document.addEventListener('DOMContentLoaded', initialize);
