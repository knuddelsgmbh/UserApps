function ModulePersistence(module) {
    var persistence = {
        module: module,
        PERSISTENCE_KEYS: typeof module.PERSISTENCE_KEYS === 'undefined' ? [] : module.PERSISTENCE_KEYS,

        getPrefix: function () {
            return 'm' + this.module.toString() + '_';
        },

        getKey: function (str) {
            if (this.PERSISTENCE_KEYS.indexOf(str) >= 0) {
                return str;
            }
            return this.getPrefix() + str;
        },

        hasString: function (key) {
            return KnuddelsServer.getPersistence().hasString(this.getKey(key));
        },

        getString: function (key, defaultValue) {
            return KnuddelsServer.getPersistence().getString(this.getKey(key), defaultValue);
        },

        setString: function (key, value) {
            KnuddelsServer.getPersistence().setString(this.getKey(key), value);
        },

        deleteString: function (key) {
            KnuddelsServer.getPersistence().deleteString(this.getKey(key));
        },

        hasObject: function (key) {
            return KnuddelsServer.getPersistence().hasObject(this.getKey(key));
        },

        getObject: function (key, defaultValue) {
            return KnuddelsServer.getPersistence().getObject(this.getKey(key), defaultValue);
        },

        setObject: function (key, value) {
            KnuddelsServer.getPersistence().setObject(this.getKey(key), value);
        },

        deleteObject: function (key) {
            KnuddelsServer.getPersistence().deleteObject(this.getKey(key));
        },

        hasNumber: function (key) {
            return KnuddelsServer.getPersistence().hasNumber(this.getKey(key));
        },

        getNumber: function (key, defaultValue) {
            if (typeof defaultValue === 'undefined') {
                defaultValue = 0;
            }
            return KnuddelsServer.getPersistence().getNumber(this.getKey(key), defaultValue);
        },

        setNumber: function (key, value) {
            KnuddelsServer.getPersistence().setNumber(this.getKey(key), value);
        },

        addNumber: function (key, value) {
            return KnuddelsServer.getPersistence().addNumber(this.getKey(key), value);
        },

        deleteNumber: function (key) {
            KnuddelsServer.getPersistence().deleteNumber(this.getKey(key));
        },

        updateUserNumberKey: function (oldkey, newkey, forceDelete) {
            var oldShortKey = this.getKey(oldkey);
            var newShortKey = this.getKey(newkey);
            forceDelete = forceDelete || false;

            if (forceDelete) {
                UserPersistenceNumbers.deleteAll(newShortKey);
            }
            UserPersistenceNumbers.updateKey(oldShortKey, newShortKey);
        },

        getUserNumber: function (user, key, defaultValue) {
            if (typeof defaultValue === 'undefined') {
                defaultValue = 0;
            }
            return user.getPersistence().getNumber(this.getKey(key), defaultValue);
        },

        hasUserNumber: function (user, key) {
            return user.getPersistence().hasNumber(this.getKey(key));
        },

        setUserNumber: function (user, key, value) {
            user.getPersistence().setNumber(this.getKey(key), value);
        },

        addUserNumber: function (user, key, value) {
            return user.getPersistence().addNumber(this.getKey(key), value);
        },

        deleteUserNumber: function (user, key) {
            user.getPersistence().deleteNumber(this.getKey(key));
        },

        setUserObject: function (user, key, object) {
            user.getPersistence().setObject(this.getKey(key), object);
        },

        getUserObject: function (user, key, defaultValue) {
            if (typeof defaultValue === 'undefined') {
                return user.getPersistence().getObject(this.getKey(key));
            }
            return user.getPersistence().getObject(this.getKey(key), defaultValue);
        },

        hasUserObject: function (user, key) {
            return user.getPersistence().hasObject(this.getKey(key));
        },

        deleteUserObject: function (user, key) {
            user.getPersistence().deleteObject(this.getKey(key));
        },

        hasUserString: function (user, key) {
            return user.getPersistence().hasString(this.getKey(key));
        },

        getUserString: function (user, key, defaultValue) {
            if (typeof defaultValue === 'undefined') {
                defaultValue = '';
            }
            return user.getPersistence().getString(this.getKey(key), defaultValue);
        },

        setUserString: function (user, key, value) {
            return user.getPersistence().setString(this.getKey(key), value);
        },

        deleteUserString: function (user, key) {
            user.getPersistence().deleteString(this.getKey(key));
        }
    };

    return persistence;
}
