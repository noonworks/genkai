var CharMap = {
    '-': [String.fromCharCode(0x0304)],
    '.': [String.fromCharCode(0x0307)],
    '?': [String.fromCharCode(0x0307), String.fromCharCode(0x0309)],
    '~': [String.fromCharCode(0x0303)],
};
'aeioucdhmrtvx'.split('').map(function (v, i) {
    CharMap[v] = [String.fromCharCode(0x0363 + i)];
});
function addSpaces(yomigana, bunshou) {
    if (bunshou.length >= yomigana.length) {
        return bunshou;
    }
    var result = bunshou;
    var fusoku = yomigana.length - bunshou.length;
    var after = Math.floor(fusoku / 2);
    var pre = fusoku - after;
    for (var i = 0; i < after || i < pre; i++) {
        if (i < after) {
            result = result + ' ';
        }
        if (i < pre) {
            result = ' ' + result;
        }
    }
    return result;
}
function makeZalgo(yomigana, bunshou) {
    if (yomigana.length === 0) {
        return bunshou;
    }
    bunshou = addSpaces(yomigana, bunshou);
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
