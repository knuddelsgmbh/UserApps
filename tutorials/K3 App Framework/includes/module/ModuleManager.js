if (typeof ModuleManager === 'undefined') {
    var ModuleManager = Module.create('ModuleManager');
    ModuleManager.self = ModuleManager;
    ModuleManager._modules = [];
    ModuleManager._activeModules = [];
    ModuleManager._hooks = {};
    ModuleManager._commands = {};
    ModuleManager.register();
}

ModuleManager.stopHandle = false;

ModuleManager.isActivated = function () {
    return true;
};

ModuleManager.deactivate = function () {
    return false;
};

ModuleManager.isFrameworkManager = function (user) {
    if (!user) {
        return false;
    }

    if (user.isAppManager() || user.isAppDeveloper()) {
        return true;
    }

    if (typeof ChannelAdmin !== 'undefined' && typeof ChannelAdmin.canUseFrameworkManagerFeatures === 'function') {
        return ChannelAdmin.canUseFrameworkManagerFeatures(user);
    }

    return false;
};

ModuleManager.isFrameworkDeveloper = function (user) {
    return !!(user && user.isAppDeveloper());
};

ModuleManager.onAppEventReceived = function (appInstance, type) {
    var ownInstance = KnuddelsServer.getAppAccess().getOwnInstance();
    if (type === 'K3AF_refreshHooks' && appInstance.getAppInfo().getAppId() === ownInstance.getAppInfo().getAppId()) {
        this.refreshHooks(false);
    }
};

ModuleManager.findModule = function (name) {
    var module = this._modules.filter(function (currentModule) {
        return currentModule.toString().toLowerCase() === name.toLowerCase().trim();
    });
    if (module.length === 0) {
        return null;
    }
    return module[0];
};

ModuleManager.cmdK3AFModules = function (user, params) {
    if (!this.isFrameworkManager(user)) {
        return;
    }

    var firstInd = params.indexOf(':');
    var command = params.toLowerCase();
    if (firstInd !== -1) {
        command = params.substring(0, firstInd).toLowerCase();
        params = params.substring(firstInd + 1);
    }

    if (command === 'activate') {
        var activeModule = this.findModule(params);
        if (activeModule === null) {
            user.sendPrivateMessage('Modul wurde nicht gefunden.');
            this.sendAdminOverview(user);
            return;
        }
        activeModule.activate(user);
        return;
    }

    if (command === 'deactivate') {
        var inactiveModule = this.findModule(params);
        if (inactiveModule === null) {
            user.sendPrivateMessage('Modul wurde nicht gefunden.');
            this.sendAdminOverview(user);
            return;
        }
        inactiveModule.deactivate(user);
        return;
    }

    this.sendAdminOverview(user);
};

ModuleManager.refreshHooks = function (allChannel, sendOverview) {
    if (typeof sendOverview === 'undefined') {
        sendOverview = true;
    }
    if (typeof allChannel === 'undefined') {
        allChannel = true;
    }
    if (allChannel) {
        KnuddelsServer.getAppAccess().getOwnInstance().getAllInstances(true).forEach(function (appInstance) {
            appInstance.sendAppEvent('K3AF_refreshHooks', {
                appId: KnuddelsServer.getAppAccess().getOwnInstance().getAppInfo().getAppId()
            });
        }, this);
        return;
    }

    K3AF.debug('Starting refreshHooks');
    this._activeModules = [];

    this._modules.forEach(function (module) {
        if (module.isActivated()) {
            this._activeModules.push(module);
        }
    }, this);

    this._activeModules.sort(function (a, b) {
        return a.priority - b.priority;
    });

    var hooks = {};
    var commands = {};
    this._activeModules.forEach(function (module) {
        var properties = K3AF.Utils.getRecursivePropertyNames(module);
        var moduleHooks = properties.filter(function (property) {
            return property.indexOf('on') === 0 || property.indexOf('may') === 0;
        });
        moduleHooks.forEach(function (hookname) {
            if (typeof hooks[hookname] === 'undefined') {
                hooks[hookname] = [];
            }
            hooks[hookname].push(module);
        });

        var moduleCommands = properties.filter(function (property) {
            return property.indexOf('cmd') === 0;
        });
        moduleCommands.forEach(function (command) {
            var cmd = command.substring(3).toLowerCase();
            commands[cmd] = {
                m: module,
                cmd: command
            };
        });
    }, this);

    this._hooks = hooks;
    this._commands = commands;

    Object.keys(App).filter(function (property) {
        return property.indexOf('on') === 0 || property.indexOf('may') === 0;
    }).forEach(function (hookname) {
        delete App[hookname];
    });

    for (var hookname in this._hooks) {
        if ({}.hasOwnProperty.call(this._hooks, hookname)) {
            var affectedModules = this._hooks[hookname].map(function (module) {
                return module.toString();
            });
            K3AF.debug('Creating hook for ' + hookname + ' (Modules: ' + affectedModules.join(', ') + ')');
            App[hookname] = (function (currentHookname) {
                return function () {
                    return ModuleManager.self.manageHook(currentHookname, arguments);
                };
            })(hookname);
        }
    }

    App.chatCommands = {};
    for (var command in this._commands) {
        if ({}.hasOwnProperty.call(this._commands, command)) {
            var cmd = this._commands[command];
            K3AF.debug('Creating /' + command + ' for ' + cmd.m.toString());
            App.chatCommands[command] = this.handleFunction;
        }
    }

    K3AF.debug('Created Hooks: ' + Object.keys(this._hooks).join(', '));
    K3AF.debug('Created Commands: ' + Object.keys(App.chatCommands).join(', '));
    KnuddelsServer.refreshHooks();

    if (sendOverview) {
        ModuleManager.self.sendAdminOverview();
    }
};

ModuleManager.handleFunction = function () {
    K3AF.debug('manage function: ' + JSON.stringify(arguments));
    var manager = ModuleManager.self;
    var user = arguments[0];
    var commandName = String(arguments[2] || '').toLowerCase();
    var mapping = manager._commands[commandName];

    if (!mapping) {
        return;
    }

    var cmd = mapping.cmd;
    var module = mapping.m;

    if (module.isLoggingFunctions && !manager.isFrameworkDeveloper(user)) {
        KnuddelsServer.getDefaultLogger().warn(user + ' nutzt /' + arguments[2] + ' ' + arguments[1]);
    }

    module[cmd].apply(module, arguments);
};

ModuleManager.onUserJoined = function (user) {
    return this.sendAdminOverview(user);
};

ModuleManager.sendAdminOverview = function (user) {
    if (typeof user === 'undefined') {
        KnuddelsServer.getChannel().getOnlineUsers(UserType.Human).forEach(function (onlineUser) {
            this.sendAdminOverview(onlineUser);
        }, this);
        return this;
    }

    if (!this.isFrameworkManager(user)) {
        return this;
    }

    var activated = [];
    var regged = [];
    for (var i = 0; i < this._modules.length; i++) {
        var module = this._modules[i];
        var moduleName = module.toString().escapeKCode();
        if (!module.isVisible()) {
            if (!this.isFrameworkDeveloper(user)) {
                continue;
            }
            moduleName += '*';
        }

        if (module.isActivated()) {
            activated.push(K3AF.Utils.format('_°BB°°>_h$MODULE|/tf-overridesb  /k3afmodules deactivate:"<°°r°§', {
                MODULE: moduleName
            }));
        } else {
            regged.push(K3AF.Utils.format('°RR°°>_h$MODULE|/tf-overridesb /k3afmodules activate:"<°°r°§', {
                MODULE: moduleName
            }));
        }
    }

    var ownInstance = KnuddelsServer.getAppAccess().getOwnInstance();
    var appInfo = ownInstance.getAppInfo();
    var msg = '°#r°' +
        '°BB°_' + appInfo.getAppName() + '_°r° läuft in der Version _' + appInfo.getAppVersion() + '_' +
        '°#r°_K3AF Version:_ ' + K3AF.VERSION + ' _Chatserver Version:_ ' + KnuddelsServer.getChatServerInfo().getVersion() + '     _Appserver Version:_ ' + KnuddelsServer.getAppServerInfo().getVersion() +
        '°#r°_Unaktivierte Module:_ ' + regged.join(', ') +
        '°#r°_Aktivierte Module:_ ' + activated.join(', ') +
        '°#r°_°>Channelranking|/usersatisfaction<° - °>Feedback|/channelfeedback<°_';

    user.sendPrivateMessage(msg);
};

ModuleManager.manageHook = function (hookname, args) {
    args = [].slice.call(args);
    ModuleManager.stopHandle = false;

    K3AF.debug('manage Hook: ' + JSON.stringify([hookname, args]));

    if (hookname === 'onBeforeKnuddelReceived') {
        var transfer = args[0];
        if (typeof this._hooks[hookname] !== 'undefined') {
            for (var i = 0; i < this._hooks[hookname].length; i++) {
                var beforeModule = this._hooks[hookname][i];
                beforeModule[hookname].apply(beforeModule, args);
                if (transfer.isProcessed()) {
                    return;
                }
                if (ModuleManager.stopHandle) {
                    break;
                }
            }
        }
        transfer.accept();
        return;
    }

    if (hookname === 'mayShowPublicMessage' || hookname === 'mayShowPublicActionMessage') {
        var allowed = true;
        if (typeof this._hooks[hookname] !== 'undefined') {
            for (var j = 0; j < this._hooks[hookname].length; j++) {
                var mayModule = this._hooks[hookname][j];
                allowed = !!(allowed && mayModule[hookname].apply(mayModule, args));
                if (ModuleManager.stopHandle) {
                    break;
                }
            }
        }
        return allowed;
    }

    if (hookname === 'mayJoinChannel') {
        if (typeof this._hooks[hookname] !== 'undefined') {
            for (var k = 0; k < this._hooks[hookname].length; k++) {
                var joinModule = this._hooks[hookname][k];
                var ret = joinModule[hookname].apply(joinModule, args);
                if (typeof ret !== 'undefined') {
                    return ret;
                }
                if (ModuleManager.stopHandle) {
                    break;
                }
            }
        }
        return ChannelJoinPermission.accepted();
    }

    if (hookname.indexOf('on') === 0) {
        if (typeof this._hooks[hookname] !== 'undefined') {
            for (var m = 0; m < this._hooks[hookname].length; m++) {
                var onModule = this._hooks[hookname][m];
                onModule[hookname].apply(onModule, args);
                if (ModuleManager.stopHandle) {
                    break;
                }
            }
        }
    }
};

ModuleManager.onAppStart = function () {
    this._activeModules.forEach(function (module) {
        module.F_OnActivated();
    });
    this.refreshHooks(false, true);
};
