/// <reference path="types/knuddels-userapp-backend-api.d.ts" />

const App: App = {

    // Wird aufgerufen, wenn die App gestartet wird.
    onAppStart(): void {
        // Initialisierung: Toplisten erstellen, Timer starten, etc.
    },

    // Wird aufgerufen, wenn die App beendet wird.
    onShutdown(): void {
        // Aufräumen: Timer stoppen, Daten speichern, etc.
    },

    // Wird aufgerufen, wenn ein Nutzer den Channel betritt.
    onUserJoined(user: User): void {
        // z.B. Begrüßung senden oder UI öffnen
    },

    // Wird aufgerufen, wenn ein Nutzer den Channel verlässt.
    onUserLeft(user: User): void {
        // z.B. Spieler aus laufendem Spiel entfernen
    },

    // Wird aufgerufen, wenn ein Nutzer eine öffentliche Nachricht schreibt.
    onPublicMessage(publicMessage: PublicMessage): void {
        // z.B. auf bestimmte Schlüsselwörter reagieren
    },

    // Wird aufgerufen, wenn ein Nutzer eine private Nachricht an den Bot schreibt.
    onPrivateMessage(privateMessage: PrivateMessage): void {
        // z.B. Hilfe-Nachricht zurücksenden
    },

    // Wird aufgerufen, wenn der Client ein Event an den Server sendet.
    onEventReceived(user: User, type: string, data: any, appContentSession: AppContentSession): void {
        // z.B. auf Button-Klicks oder Formulare aus dem Frontend reagieren
    },

    // Wird aufgerufen, wenn ein Nutzer-Account gelöscht wird (DSGVO).
    onUserDeleted(userId: number, userPersistence: UserPersistence): void {
        // Nutzerbezogene Daten löschen
    },

    // Chat-Befehle, die Nutzer im Channel eingeben können.
    chatCommands: {
        // /start – Öffnet die App-Oberfläche
        start(user: User, params: string, command: string): void {
            const htmlFile = new HTMLFile('index.html', {
                nickname: user.getNick()
            });
            const popup = AppContent.popupContent(htmlFile, 480, 720);
            popup.setResponsive(true);

            if (user.canShowAppViewMode(AppViewMode.Popup)) {
                user.sendAppContent(popup);
            } else {
                user.sendPrivateMessage('Dein Gerät unterstützt diese Ansicht leider nicht.');
            }
        }
    }
};
