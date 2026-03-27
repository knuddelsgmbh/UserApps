if (typeof K3AF === 'undefined') {
    var K3AF = function () {
    };
}
K3AF.VERSION = '1.1.0.0';

K3AF.isTestSystem = function () {
    return KnuddelsServer.getChatServerInfo().isTestSystem();
};

K3AF.debug = function (msg) {
    if (!K3AF.isTestSystem()) {
        return;
    }
    KnuddelsServer.getDefaultLogger().debug('K3AF: ' + msg);
};

K3AF.error = function (msg) {
    KnuddelsServer.getDefaultLogger().error('K3AF: ' + msg);
};

K3AF.BASEPATH = 'includes/';
K3AF.debug('BASEPATH: ' + K3AF.BASEPATH);

require('includes/classes/FileSystem.js');
K3AF.FileSystem.execute('includes/classes/Utils.js');
K3AF.FileSystem.execute('includes/classes/ModulePersistence.js');
K3AF.FileSystem.execute('includes/classes/Module.js');
K3AF.FileSystem.execute('includes/module/ModuleManager.js');
K3AF.FileSystem.executeDir('includes/module/', false, [
    function (file) {
        return file !== 'includes/module/ModuleManager.js';
    }
]);

ModuleManager.self.refreshHooks(false, false);
