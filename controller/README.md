# Controller voor verkeerssimulator

Dit is de controller onderdeel voor de verkeerssimulator opdracht voor het vak "Software Development", voor de Minor "Advanced Software Enginering", te NHL Stenden, jaargang 24/25.
Deze controller bestaat uit 4 mappen:

- `config/` bevat configuraties met daarin: 
    - `intersection_data.json` welke en hoe de 2 kruispunten(brug en autokruispunt) met elkaar interactie aangaan, het verteld ons indirect welke routes(oost naar noord, west naar oost) met elkaar kruisen. Zie voor meer informatie op de repo waarop dit project is gebaseerd: https://github.com/jorrit200/stoplicht-communicatie-spec/tree/main/intersectionData. Hier is de data ook 1 op 1 van gekopiëerd.
    - `green_set_<1...n>.json` bevat stoplich-ids die tegenlijk op groen kunnen staan. Deze word gebruikt om te bepalen welke stoplichten op groen gaat als de simulator geen duidelijke kans aangeeft met de sensoren informatie dat een bepaalde afwijkende setting optimaal is. Het bestand heeft dus als het ware standaard settings die kunnen worden gebruikt.
- `jest/` bevat unit testen(mbv. [Jest](https://jestjs.io/)), met als doel buiten pub/sub connecties functies te kunnen testen. Vooral moeilijkere functies die sensor informatie afwegen om afwijkend stoplichten op groen te zetten.
- `src/` bevat de broncode die met behulp van de data uit `config/` de 'productie' versie van de app moet vormen.
- `test_connection/` bevat `index.js` die ervoor zorgt dat eventuele ZeroMQ gerelanteerde aanpassingen in de broncode kunnen worden getest. Het dient als een soort mock voor de simulator.

## Gebruiken
### Installeren
Voor dit project moet je `npm`(v10.8.2) en `NodeJS`(v18.20.6) hebben geïnstalleerd.   
```bash
npm install
```
### Starten
```bash
npm run main
```

## Ontwikkelen
### Testen uitvoeren
```bash
npm run test
```
### Mock server starten
```bash
npm run simulator
```