if (typeof MCMTracker === 'undefined') {
    var MCMTracker = Module.create('MCMTracker');
    MCMTracker.channels = [];
    MCMTracker.register();
}

MCMTracker.userCanSeeTracker = function (user) {
    if (!user) {
        return false;
    }

    if (user.isChannelModerator() || user.isAppManager()) {
        return true;
    }

    if (typeof ChannelAdmin !== 'undefined' && typeof ChannelAdmin.canUseModeratorFeatures === 'function') {
        return ChannelAdmin.canUseModeratorFeatures(user) || ChannelAdmin.canUseFrameworkManagerFeatures(user);
    }

    return false;
};

MCMTracker.cmdMCMTracker = function (user) {
    this.onUserJoined(user);
};

MCMTracker.buildMCM = function () {
    var currentChannel = KnuddelsServer.getChannel();
    var onlineCMs = [];

    currentChannel.getOnlineUsers(UserType.Human).forEach(function (user) {
        if (user.isChannelModerator() || (typeof ChannelAdmin !== 'undefined' && typeof ChannelAdmin.canUseModeratorFeatures === 'function' && ChannelAdmin.canUseModeratorFeatures(user))) {
            onlineCMs.push(user);
        }
    });

    this.channels = [{
        name: currentChannel.getChannelName(),
        users: currentChannel.getOnlineUsers(UserType.Human).length,
        onlineCMs: onlineCMs
    }];
};

MCMTracker.onUserJoined = function (user) {
    if (this.userCanSeeTracker(user)) {
        this.buildMCM();

        var msg = '°#°';
        var onlineMCM = [];
        this.channels.forEach(function (c) {
            msg += K3AF.Utils.format('°#r°_°BB>$CHANNEL|/go "|/go +"<° ($CNT User)°r°_: ', {
                CNT: c.users,
                CHANNEL: c.name.escapeKCode()
            });

            var cmlinks = [];
            c.onlineCMs.forEach(function (cm) {
                onlineMCM.push(cm);
                cmlinks.push('_' + cm.getProfileLink() + '_°°');
            });

            msg += cmlinks.join(', ');
        });

        var allCMs = KnuddelsServer.getChannel().getChannelConfiguration().getChannelRights().getChannelModerators();
        var allLinks = [];
        allCMs.forEach(function (cm) {
            var online = false;
            if (!cm.isOnline()) {
                return;
            }
            onlineMCM.forEach(function (ocm) {
                if (cm.equals(ocm)) {
                    online = true;
                }
            });

            allLinks.push((online ? '°BB°' : '°RR°') + '_' + cm.getProfileLink() + '°°_ (' + cm.getClientType() + ')');
        });

        msg += '°##r°_Online:_ ';
        msg += allLinks.join(', ');
        msg += '°#BB°_In diesem Channel      °RR°Derzeit nicht in diesem Channel_';

        user.sendPrivateMessage(msg);
    }
};
