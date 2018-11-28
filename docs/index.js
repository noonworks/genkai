var CharMap = {
    '-': [String.fromCharCode(0x0304)],
    '.': [String.fromCharCode(0x0307)],
    '?': [String.fromCharCode(0x0307), String.fromCharCode(0x0309)],
    '~': [String.fromCharCode(0x0303)],
};
'aeioucdhmrtvx'.split('').map(function (v, i) {
    CharMap[v] = [String.fromCharCode(0x0363 + i)];
});
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
function makeZalgo(yomigana, bunshou) {
    var r = alignLength(yomigana, bunshou);
    bunshou = r.bunshou;
    yomigana = r.yomigana;
    if (yomigana.length === 0) {
        return bunshou;
    }
    var result = '';
    for (var i = 0; i < yomigana.length; i++) {
        var yChar = yomigana.substring(i, i + 1);
        var bChar = bunshou.substring(i, i + 1);
        if (yChar in CharMap) {
            // valid yomigana
            if (bChar === ' ') {
                result += '  ';
            }
            else {
                result += bChar;
            }
            CharMap[yChar].forEach(function (c) { return result += c; });
        }
        else {
            // invalid yomigana
            result += bChar;
        }
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
    var charlist = document.querySelector('#charlist');
    if (charlist) {
        charlist.innerText = Object.getOwnPropertyNames(CharMap).join(' ');
    }
}
document.addEventListener('DOMContentLoaded', initialize);
