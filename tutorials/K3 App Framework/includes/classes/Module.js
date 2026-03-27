if (typeof K3AF === 'undefined') {
    var K3AF = function () {};
}

K3AF.Modules = K3AF.Modules || {};

K3AF.Modules.Base = K3AF.Modules.Base || {
    F_OnActivated: function () {},
    F_OnDeactivated: function () {},
    F_OnUpdate: function () {},

    getPersistence: function () {
        if (typeof this._persistence === 'undefined') {
            this._persistence = ModulePersistence(this);
        }
        return this._persistence;
    },

    isActivated: function () {
        return this.getPersistence().getNumber('activated', 0) === 1;
    },

    deactivate: function (user) {
        this.getPersistence().setNumber('activated', 0);
        this.F_OnDeactivated();
        ModuleManager.self.refreshHooks();
        return true;
    },

    activate: function (user) {
        var blocked = this._blockedModules;
        for (var i = 0; i < blocked.length; i++) {
            var mod = ModuleManager.self.findModule(blocked[i]);
            if (mod !== null && mod.isActivated()) {
                if (user && typeof user.sendPrivateMessage === 'function') {
                    user.sendPrivateMessage(K3AF.Utils.format('_$THISMOD_ konnte nicht aktiviert werden, da ein Konflikt mit _$OTHERMOD_ existiert.', {
                        THISMOD: this.toString().escapeKCode(),
                        OTHERMOD: mod.toString().escapeKCode()
                    }));
                }
                return false;
            }
        }

        this.getPersistence().setNumber('activated', 1);
        this.F_OnActivated();
        ModuleManager.self.refreshHooks();
        return true;
    },

    toString: function () {
        return this.__moduleName || 'Module';
    },

    isVisible: function () {
        if (typeof this.visible === 'undefined') {
            return true;
        }
        return this.visible;
    },

    stopHandle: function () {
        ModuleManager.stopHandle = true;
    },

    register: function () {
        if (!ModuleManager || !ModuleManager.self) {
            throw new Error('ModuleManager.self ist noch nicht initialisiert.');
        }

        var modules = ModuleManager.self._modules;
        for (var i = 0; i < modules.length; i++) {
            if (modules[i] === this) {
                return this;
            }
        }

        modules.push(this);
        return this;
    }
};

var Module = Module || {};

Module.Base = K3AF.Modules.Base;
Module.create = function createModule(moduleName, target) {
    target = target || {};

    if (typeof target.__moduleName === 'undefined') {
        target.__moduleName = moduleName || 'Module';
    }
    if (typeof target.visible === 'undefined') {
        target.visible = true;
    }
    if (typeof target._blockedModules === 'undefined') {
        target._blockedModules = [];
    }
    if (typeof target.priority === 'undefined') {
        target.priority = 0;
    }
    if (typeof target.isLoggingFunctions === 'undefined') {
        target.isLoggingFunctions = false;
    }
    if (typeof target.PERSISTENCE_KEYS === 'undefined') {
        target.PERSISTENCE_KEYS = [];
    }

    var baseKeys = [
        'F_OnActivated',
        'F_OnDeactivated',
        'F_OnUpdate',
        'getPersistence',
        'isActivated',
        'deactivate',
        'activate',
        'toString',
        'isVisible',
        'stopHandle',
        'register'
    ];

    for (var i = 0; i < baseKeys.length; i++) {
        var key = baseKeys[i];
        if (typeof target[key] === 'undefined') {
            target[key] = K3AF.Modules.Base[key];
        }
    }

    if (target.toString === Object.prototype.toString || typeof target.toString !== 'function') {
        target.toString = K3AF.Modules.Base.toString;
    }

    K3AF.debug('Creating instance for ' + target.toString());
    return target;
};
