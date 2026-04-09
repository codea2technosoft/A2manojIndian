export const parse = (str = '') => {
    // str = str.replace(/\*([^*]+)\*/g, '<b>$1</b>');
    // str = str.replace(/((?<!\w)_|_(?!\w))(([^_]|(?<=\w)_(?=\w))+)((?<!\w)_|_(?!\w))/g, '<i>$2</i>');
    // str = str.replace(/(?<=^|\s)~([^~]+)~(?=$|\s)/g, '<s>$1</s>');
    // str = str.replace(/(?<=^|\s)```(([^`]|`{1,2}(?!`)|`{4})+)```(?=$|\s)/g, '<span style="font-family: monospace">$1</span>');
    // str = str.replace(/\n/g, '<br/>');
    // return str;

    str = whatsappStyles(str, '*', '<b>', '</b>');
    str = whatsappStyles(str, '_', '<i>', '</i>');
    str = whatsappStyles(str, '~', '<s>', '</s>');
    str = whatsappStyles(str, '```', '<code>', '</code>');
    str = str.replace(/\n/g, '<br/>');

    return str;
};

const is_aplhanumeric = (c) => {
    var x = c.charCodeAt();
    return ((x >= 65 && x <= 90) || (x >= 97 && x <= 122) || (x >= 48 && x <= 57)) ? true : false;
}

const whatsappStyles = (str, wildcard, opTag, clTag) => {
    var indices = [];
    for (var i = 0; i < str.length; i++) {
        if (str[i] === wildcard) {
            if (indices.length % 2) {
                if (str[i - 1] !== " ") {
                    if (typeof (str[i + 1]) == "undefined") {
                        indices.push(i);
                    } else {
                        if (!is_aplhanumeric(str[i + 1])) indices.push(i);
                    }
                }
            } else {
                if (typeof (str[i + 1]) !== "undefined") {
                    if (str[i + 1] !== " ") {
                        if (typeof (str[i - 1]) == "undefined") {
                            indices.push(i);
                        } else {
                            if (!is_aplhanumeric(str[i - 1])) indices.push(i);
                        }
                    }
                }
            }
        } else {
            if (str[i].charCodeAt() == 10 && indices.length % 2) indices.pop();
        }
    }
    if (indices.length % 2) indices.pop();
    var e = 0;
    indices.forEach(function (v, i) {
        var t = (i % 2) ? clTag : opTag;
        v += e;
        str = str.substr(0, v) + t + str.substr(v + 1);
        e += (t.length - 1);
    });
    return str;
}
