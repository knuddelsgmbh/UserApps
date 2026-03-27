if (typeof TopicChanger === 'undefined') {
    var TopicChanger = Module.create('TopicChanger');
    TopicChanger.register();
}

TopicChanger.userCanChangeTopic = function (user) {
    if (!user) {
        return false;
    }

    if (user.isChannelOwner() || user.isAppDeveloper()) {
        return true;
    }

    if (typeof ChannelAdmin !== 'undefined' && typeof ChannelAdmin.canUseOwnerFeatures === 'function') {
        return ChannelAdmin.canUseOwnerFeatures(user);
    }

    return false;
};

TopicChanger.cmdSetTopic = function (user, params) {
    if (!this.userCanChangeTopic(user)) {
        return;
    }
    KnuddelsServer.getChannel().getChannelConfiguration().getChannelInformation().setTopic(String(params));
};

TopicChanger.cmdGetTopic = function (user) {
    if (!this.userCanChangeTopic(user)) {
        return;
    }
    user.sendPrivateMessage(K3AF.Utils.format('°BB°_Dieser Channel hat folgendes Thema:°°°#°$TOPIC', {
        TOPIC: KnuddelsServer.getChannel().getChannelConfiguration().getChannelInformation().getTopic().escapeKCode()
    }));
};
