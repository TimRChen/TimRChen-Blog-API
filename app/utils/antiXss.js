/**
* 防xss注入
* @param str - 编码html
*/
exports.enCodeHtml = function(str) {
    str = (str || '').toString();
    const character = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        '\'': '&#039;'
    };
    return function() {
        return str.replace(/[<>&"']/g, function(c) {
            return character[c];
        });
    }();
};