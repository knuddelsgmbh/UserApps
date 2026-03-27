// pageData enthält die Daten, die der Server beim Öffnen mitgibt
var pageData = {};
if (typeof Client !== 'undefined') {
    pageData = Client.pageData;
}

// Begrüßung anzeigen
document.getElementById('greeting').textContent = 'Hallo, ' + (pageData.nickname || 'Gast') + '!';

// Events vom Server empfangen
if (typeof Client !== 'undefined') {
    Client.addEventListener('exampleEvent', function(event) {
        // event.data enthält die vom Server gesendeten Daten
    });
}

// Event an den Server senden
function sendToServer(type, data) {
    if (typeof Client !== 'undefined' && Client.sendEvent) {
        Client.sendEvent(type, data);
    }
}
