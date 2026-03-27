if (typeof AutoUpdate === 'undefined') {
    var AutoUpdate = Module.create('AutoUpdate');
    AutoUpdate.timer = null;
    AutoUpdate.register();
}

AutoUpdate.updateFiles = function () {
    var ownInstance = KnuddelsServer.getAppAccess().getOwnInstance();
    if (!ownInstance.isRootInstance()) {
        return;
    }

    var files = ownInstance.getRootInstance().updateAppFiles();
    files = files.filter(function (file) {
        return file.endsWith('.js');
    });
    files = files.filter(K3AF.FileSystem.EXCLUDE_WWW);

    files.forEach(function (file) {
        K3AF.FileSystem.execute(file);
    });

    if (files.length > 0) {
        K3AF.debug('UPDATE: ' + JSON.stringify(files));
        ModuleManager.self.refreshHooks();
    }
};

AutoUpdate.F_OnActivated = function () {
    if (this.timer !== null) {
        clearInterval(this.timer);
        this.timer = null;
    }

    if (!K3AF.isTestSystem()) {
        K3AF.debug('AutoUpdate bleibt deaktiviert, da dies kein Testsystem ist.');
        return;
    }

    var ownInstance = KnuddelsServer.getAppAccess().getOwnInstance();
    if (!ownInstance.isRootInstance()) {
        return;
    }

    this.timer = setInterval(this.updateFiles.bind(this), 30000);
};

AutoUpdate.F_OnDeactivated = function () {
    if (this.timer !== null) {
        clearInterval(this.timer);
        this.timer = null;
    }
};
