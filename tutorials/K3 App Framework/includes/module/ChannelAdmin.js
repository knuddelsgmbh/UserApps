if (typeof ChannelAdmin === 'undefined') {
    var ChannelAdmin = Module.create('ChannelAdmin');
    ChannelAdmin.register();
}

ChannelAdmin.isChannelAdmin = function (user) {
    if (!this.isActivated()) {
        return false;
    }
    return this.getPersistence().getUserNumber(user, 'Owner', 0) > 0;
};

ChannelAdmin.canUseOwnerFeatures = function (user) {
    if (!user) {
        return false;
    }
    return user.isChannelOwner() || user.isAppDeveloper() || this.isChannelAdmin(user);
};

ChannelAdmin.canUseModeratorFeatures = function (user) {
    if (!user) {
        return false;
    }
    return user.isChannelModerator() || this.canUseOwnerFeatures(user);
};

ChannelAdmin.canUseFrameworkManagerFeatures = function (user) {
    if (!user) {
        return false;
    }
    return user.isAppManager() || user.isAppDeveloper() || this.isChannelAdmin(user);
};

ChannelAdmin.activate = function (user) {
    user = user || null;
    if (user === null || user.isChannelOwner() || user.isAppDeveloper()) {
        return Module.Base.activate.call(this, user);
    }
    user.sendPrivateMessage('Du darfst dieses Modul nicht aktivieren.');
    return false;
};

ChannelAdmin.deactivate = function (user) {
    user = user || null;
    if (user === null || user.isChannelOwner() || user.isAppDeveloper()) {
        return Module.Base.deactivate.call(this, user);
    }
    user.sendPrivateMessage('Du darfst dieses Modul nicht deaktivieren.');
    return false;
};

ChannelAdmin.cmdChannelAdmin = function (user, params) {
    if (!user.isChannelOwner() && !user.isAppDeveloper()) {
        return;
    }

    var ind = params.indexOf(':');
    var action = '';
    if (ind === -1) {
        action = params.toLowerCase();
        params = '';
    } else {
        action = params.substr(0, ind).trim().toLowerCase();
        params = params.substr(ind + 1).trim();
    }

    if (action === 'add') {
        var tUser = K3AF.Utils.getUserByNickname(params);
        if (tUser == null) {
            user.sendPrivateMessage('Dieser Nutzer ist mir nicht bekannt.');
            return;
        }
        this.getPersistence().setUserNumber(tUser, 'Owner', 1);
        user.sendPrivateMessage(K3AF.Utils.format('Ich habe $USER als ChannelAdmin eingetragen.', {
            USER: tUser.getProfileLink()
        }));
    } else if (action === 'remove') {
        var removeUser = K3AF.Utils.getUserByNickname(params);
        if (removeUser == null) {
            user.sendPrivateMessage('Dieser Nutzer ist mir unbekannt.');
            return;
        }
        this.getPersistence().deleteUserNumber(removeUser, 'Owner');
        user.sendPrivateMessage(K3AF.Utils.format('Ich habe $USER als ChannelAdmin entfernt.', {
            USER: removeUser.getProfileLink()
        }));
    } else {
        var users = UserPersistenceNumbers.getSortedEntries(this.getPersistence().getKey('Owner'), { count: 100 });
        var arr = [];
        users.forEach(function (entry) {
            var currentUser = entry.getUser();
            arr.push(K3AF.Utils.format('_°BB°$USER°r°_', {
                USER: currentUser.getProfileLink()
            }));
        });
        user.sendPrivateMessage('Folgende Nutzer sind als ChannelAdmins eingetragen:°#r°' + arr.join(', '));
    }
};
