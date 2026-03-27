# UserApp Template (TypeScript)

Minimale Vorlage für eine Knuddels UserApp in TypeScript mit vollständigen Type-Definitionen.

## Projektstruktur

```
├── app.config          # App-Konfiguration (Name, Version, Entwickler)
├── main.ts             # Servercode mit App-Hooks und Chat-Befehlen
├── package.json        # Node.js-Projektdatei mit Build-Scripts
├── tsconfig.json       # TypeScript-Konfiguration
├── types/              # Knuddels API Type-Definitionen
│   ├── knuddels-userapp-backend-api.d.ts
│   └── knuddels-webapp-frontend-api.d.ts
├── README.md
└── www/                # Frontend (wird im Knuddels-Client angezeigt)
    ├── index.html      # Haupt-HTML-Datei
    ├── css/
    │   └── style.css   # Styles
    └── js/
        └── app.js      # Client-Logik und Server-Kommunikation
```

## Voraussetzungen

- [Node.js](https://nodejs.org/) (Version 18 oder höher)

## Kompilieren

TypeScript-Code muss vor dem Hochladen nach JavaScript kompiliert werden. Der Knuddels-Server kann kein TypeScript direkt ausführen.

**Einmalig einrichten:**

```bash
npm install
```

Dies installiert den TypeScript-Compiler als lokale Abhängigkeit.

**Kompilieren:**

```bash
npm run build
```

Die kompilierte `main.js` wird im Ordner `build/` erzeugt. Diese Datei wird auf den Knuddels-Server hochgeladen.

**Während der Entwicklung** kannst du den Watch-Modus nutzen, der bei jeder Änderung automatisch neu kompiliert:

```bash
npm run watch
```

## Erste Schritte

1. **Voraussetzungen installieren** – `npm install` ausführen (siehe oben).
2. **app.config anpassen** – Trage deinen Knuddels-Nickname als `developer` und bei `mayBeInstalledBy` ein.
3. **Kompilieren** – `npm run build` ausführen.
4. **Hochladen** – Lade die kompilierte `build/main.js`, die `app.config` und den `www/`-Ordner auf den Dev-Server hoch.
5. **Installieren** – Installiere die App in einem Channel über `/apps install`.
6. **Testen** – Tippe `/start` im Channel, um die App zu öffnen.

## TypeScript-Setup

Das Template enthält die offiziellen Type-Definitionen im `types/`-Ordner. Die `main.ts` referenziert sie über einen Triple-Slash-Directive:

```typescript
/// <reference path="types/knuddels-userapp-backend-api.d.ts" />
```

Dadurch erhältst du in deiner IDE Autocomplete und Typ-Prüfung für die gesamte Knuddels-API.

> **Hinweis:** Auf den Knuddels-Server wird nur die kompilierte `.js`-Datei hochgeladen. Die `*.ts`-Dateien, `types/`, `node_modules/` und `package.json` werden **nicht** hochgeladen.

## Hooks

Die `main.ts` enthält die wichtigsten App-Hooks als leere Vorlagen:

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
