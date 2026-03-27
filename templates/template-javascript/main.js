var App = {

    // Wird aufgerufen, wenn die App gestartet wird.
    onAppStart: function() {
        // Initialisierung: Toplisten erstellen, Timer starten, etc.
    },

    // Wird aufgerufen, wenn die App beendet wird.
    onShutdown: function() {
        // Aufräumen: Timer stoppen, Daten speichern, etc.
    },

    // Wird aufgerufen, wenn ein Nutzer den Channel betritt.
    onUserJoined: function(user) {
        // z.B. Begrüßung senden oder UI öffnen
    },

    // Wird aufgerufen, wenn ein Nutzer den Channel verlässt.
    onUserLeft: function(user) {
        // z.B. Spieler aus laufendem Spiel entfernen
    },

    // Wird aufgerufen, wenn ein Nutzer eine öffentliche Nachricht schreibt.
    onPublicMessage: function(publicMessage) {
        // z.B. auf bestimmte Schlüsselwörter reagieren
    },

    // Wird aufgerufen, wenn ein Nutzer eine private Nachricht an den Bot schreibt.
    onPrivateMessage: function(privateMessage) {
        // z.B. Hilfe-Nachricht zurücksenden
    },

    // Wird aufgerufen, wenn der Client ein Event an den Server sendet.
    onEventReceived: function(user, type, data, appContentSession) {
        // z.B. auf Button-Klicks oder Formulare aus dem Frontend reagieren
    },

    // Wird aufgerufen, wenn ein Nutzer-Account gelöscht wird (DSGVO).
    onUserDeleted: function(userId, userPersistence) {
        // Nutzerbezogene Daten löschen
    },

    // Chat-Befehle, die Nutzer im Channel eingeben können.
    chatCommands: {
        // /start – Öffnet die App-Oberfläche
        start: function(user, params, command) {
            var htmlFile = new HTMLFile('index.html', {
                nickname: user.getNick()
            });
            var popup = AppContent.popupContent(htmlFile, 480, 720);
            popup.setResponsive(true);

            if (user.canShowAppViewMode(AppViewMode.Popup)) {
                user.sendAppContent(popup);
            } else {
                user.sendPrivateMessage('Dein Gerät unterstützt diese Ansicht leider nicht.');
            }
        }
    }
};
