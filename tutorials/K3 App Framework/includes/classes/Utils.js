if (typeof K3AF === 'undefined') {
    var K3AF = function () {};
}

K3AF.Utils = K3AF.Utils || {};

K3AF.Utils.format = function format(str, obj) {
    str = String(str);
    obj = obj || {};

    var array = [];
    for (var key in obj) {
        if ({}.hasOwnProperty.call(obj, key)) {
            array.push({ key: key, value: obj[key] });
        }
    }

    array.sort(function (a, b) {
        return b.key.length - a.key.length;
    });

    for (var i = 0; i < array.length; i++) {
        var currentKey = array[i].key;
        var value = array[i].value;
        var ind = -1;
        var find = '$' + currentKey;

        while ((ind = str.indexOf(find)) >= 0) {
            var newValue = value;
            if (typeof value === 'function') {
                newValue = value(find, ind, str);
            }
            str = str.substring(0, ind) + newValue + str.substr(ind + find.length);
        }
    }

    return str;
};

K3AF.Utils.getRecursivePropertyNames = function getRecursivePropertyNames(obj) {
    var keys = [];
    var seen = {};
    var current = obj;

    while (current !== null && typeof current !== 'undefined') {
        var ownKeys = Object.getOwnPropertyNames ? Object.getOwnPropertyNames(current) : Object.keys(current);
        for (var i = 0; i < ownKeys.length; i++) {
            var key = ownKeys[i];
            if (!seen[key]) {
                seen[key] = true;
                keys.push(key);
            }
        }

        if (current.__baseObject) {
            current = current.__baseObject;
        } else if (Object.getPrototypeOf) {
            current = Object.getPrototypeOf(current);
        } else {
            current = null;
        }
    }

    return keys;
};

K3AF.Utils.getUserByNickname = function getUserByNickname(nickname) {
    if (typeof nickname === 'undefined' || nickname === null) {
        return null;
    }

    var userAccess = KnuddelsServer.getUserAccess();
    if (!userAccess.exists(nickname)) {
        return null;
    }

    var userId = userAccess.getUserId(nickname);
    if (!userAccess.mayAccess(userId)) {
        return null;
    }

    return userAccess.getUserById(userId);
};

K3AF.Utils.removeComments = function removeComments(str) {
    var SLASH = '/';
    var BACK_SLASH = '\\';
    var STAR = '*';
    var DOUBLE_QUOTE = '"';
    var SINGLE_QUOTE = "'";
    var NEW_LINE = '\n';
    var CARRIAGE_RETURN = '\r';

    var string = String(str);
    var length = string.length;
    var position = 0;
    var output = [];

    function getCurrentCharacter() {
        return string.charAt(position);
    }

    function getPreviousCharacter() {
        return string.charAt(position - 1);
    }

    function getNextCharacter() {
        return string.charAt(position + 1);
    }

    function add() {
        output.push(getCurrentCharacter());
    }

    function next() {
        position++;
    }

    function atEnd() {
        return position >= length;
    }

    function isEscaping() {
        if (getPreviousCharacter() === BACK_SLASH) {
            var caret = position - 1;
            var escaped = true;
            while (caret-- > 0) {
                if (string.charAt(caret) !== BACK_SLASH) {
                    return escaped;
                }
                escaped = !escaped;
            }
            return escaped;
        }
        return false;
    }

    function processSingleQuotedString() {
        if (getCurrentCharacter() === SINGLE_QUOTE) {
            add();
            next();
            while (!atEnd()) {
                if (getCurrentCharacter() === SINGLE_QUOTE && !isEscaping()) {
                    return;
                }
                add();
                next();
            }
        }
    }

    function processDoubleQuotedString() {
        if (getCurrentCharacter() === DOUBLE_QUOTE) {
            add();
            next();
            while (!atEnd()) {
                if (getCurrentCharacter() === DOUBLE_QUOTE && !isEscaping()) {
                    return;
                }
                add();
                next();
            }
        }
    }

    function processSingleLineComment() {
        if (getCurrentCharacter() === SLASH && getNextCharacter() === SLASH) {
            next();
            while (!atEnd()) {
                next();
                if (getCurrentCharacter() === NEW_LINE || getCurrentCharacter() === CARRIAGE_RETURN) {
                    return;
                }
            }
        }
    }

    function processMultiLineComment() {
        if (getCurrentCharacter() === SLASH && getNextCharacter() === STAR) {
            next();
            next();
            while (!atEnd()) {
                next();
                if (getCurrentCharacter() === STAR && getNextCharacter() === SLASH) {
                    next();
                    next();
                    return;
                }
            }
        }
    }

    function processRegularExpression() {
        if (getCurrentCharacter() === SLASH) {
            add();
            next();
            while (!atEnd()) {
                if (getCurrentCharacter() === SLASH && !isEscaping()) {
                    return;
                }
                add();
                next();
            }
        }
    }

    while (!atEnd()) {
        processDoubleQuotedString();
        processSingleQuotedString();
        processSingleLineComment();
        processMultiLineComment();
        processRegularExpression();
        if (!atEnd()) {
            add();
            next();
        }
    }

    return output.join('');
};
