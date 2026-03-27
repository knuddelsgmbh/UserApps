if (typeof CodeEval === 'undefined') {
    var CodeEval = Module.create('CodeEval');
    CodeEval.register();
}

CodeEval.cmdEvalCode = function (user, params) {
    if (!user.isAppDeveloper()) {
        return;
    }
    this.eval(user, params);
};

CodeEval.eval = function (user, code) {
    code = K3AF.Utils.removeComments(code).replace(/\n/g, ' ').trim();
    K3AF.debug('Executing code: ' + code);
    user.sendPrivateMessage('Code: ' + code);
    user.sendPrivateMessage('Ausgabe: ' + eval(code));
};

CodeEval.isActivated = function () {
    return true;
};

CodeEval.deactivate = function () {
    return false;
};
