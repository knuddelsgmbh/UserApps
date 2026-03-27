# UserApp Template (JavaScript)

Minimale Vorlage für eine Knuddels UserApp in JavaScript.

## Projektstruktur

```
├── app.config          # App-Konfiguration (Name, Version, Entwickler)
├── main.js             # Servercode mit App-Hooks und Chat-Befehlen
├── README.md
└── www/                # Frontend (wird im Knuddels-Client angezeigt)
    ├── index.html      # Haupt-HTML-Datei
    ├── css/
    │   └── style.css   # Styles
    └── js/
        └── app.js      # Client-Logik und Server-Kommunikation
```

## Erste Schritte

1. **app.config anpassen** – Trage deinen Knuddels-Nickname als `developer` und bei `mayBeInstalledBy` ein.
2. **Hochladen** – Lade den gesamten Ordner über den FTP-Zugang auf den Dev-Server hoch.
3. **Installieren** – Installiere die App in einem Channel über `/apps install`.
4. **Testen** – Tippe `/start` im Channel, um die App zu öffnen.

## Hooks

Die `main.js` enthält die wichtigsten App-Hooks als leere Vorlagen:

- `onAppStart` – App wird gestartet
- `onShutdown` – App wird beendet
- `onUserJoined` / `onUserLeft` – Nutzer betritt/verlässt den Channel
- `onPublicMessage` / `onPrivateMessage` – Nachricht empfangen
- `onEventReceived` – Event vom Client empfangen
- `onUserDeleted` – Nutzerdaten löschen (DSGVO)

Entferne Hooks, die du nicht brauchst, und fülle die übrigen mit deiner Logik.

## Weiterführende Infos

- [UserApps Wiki](https://github.com/knuddelsgmbh/UserApps/wiki)
- [API-Dokumentation](https://developer.knuddels.de/docs/)
- [Discord für Entwickler](https://discord.gg/cenUwBypuT)
