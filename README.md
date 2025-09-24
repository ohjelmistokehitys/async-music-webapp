# Asynkroninen ohjelmointi ja REST-rajapinnat

Tämä harjoitus keskittyy REST API:iden käyttöön React-sovelluksessa, asynkronisten operaatioiden käsittelyyn ja lataustilojen oikeanlaiseen hallintaan.

Vaikka harjoitus on toteutettu selainympäristössä Reactilla ja Vite:llä, samat periaatteet pätevät muihinkin JavaScript-ympäristöihin ja kirjastoihin. Harjoituksessa sinun ei tarvitse perehtyä tai muokata juuri Reactiin liittyviä asioita, vaan keskitymme asynkroniseen ohjelmointiin, tilanhallintaan ja REST API:en käyttöön.

Esimerkkiprojekti ei ole täysin toimiva eikä edusta parhaita käytäntöjä REST-rajapintojen käytöstä tai toteutuksesta. Tehtävässä ideana on löytää sekä korjata selvät virheet, mutta sovelluksen arkkitehtuurin osalta ei tehdä parannuksia.

Harjoituksen tekemiseksi tarvitset Node.js-ympäristön ja perustiedot Reactista, TypeScriptista sekä REST API:ista.


## Asennus ja käynnistys

1. **Asenna riippuvuudet:**
   ```bash
   npm install
   ```

2. **Käynnistä kehityspalvelin:**
   ```bash
   npm run dev
   ```

3. **Avaa selain:**
   Siirry osoitteeseen `http://localhost:5173` (tai terminaalissa näkyvään porttiin)


## Projektin asetusten selvitys

Tämä projekti käyttää:
- **React** - JavaScript-kirjasto käyttöliittymien rakentamiseen
- **Vite** - Nopea rakennustyökalu ja kehityspalvelin ([Vite-dokumentaatio](https://vite.dev/))
- **TypeScript** - Tyyppiturvallisempaa ja parempaa kehityskokemusta varten

### Proxy-konfiguraatio

Projektissa on proxy-palvelinkonfiguraatio tiedostossa [`vite.config.ts`](./vite.config.ts):

```typescript
server: {
  proxy: {
    "/json-demo": "https://ohjelmistokehitys.github.io/"
  }
}
```

**Miksi proxy on tarpeen?**

Tämä proxy-konfiguraatio on välttämätön **CORS (Cross-Origin Resource Sharing) -rajoitusten** vuoksi. Kun React-sovelluksesi toimii osoitteessa `http://localhost:5173` ja yrittää hakea dataa suoraan osoitteesta `https://ohjelmistokehitys.github.io/`, selaimet estävät nämä pyynnöt turvallisuussyistä.

Proxy käskee Viten kehityspalvelinta:

1. Sieppaamaan pyynnöt osoitteeseen `/json-demo/*`
2. Välittämään ne osoitteeseen `https://ohjelmistokehitys.github.io/json-demo/*`
3. Palauttamaan vastauksen ikään kuin se tulisi paikalliselta palvelimelta

Näin sovelluksesi pääsee käsiksi ulkoiseen API:iin ilman CORS-ongelmia kehityksen aikana.

Lisätietoja Viten proxy-konfiguraatiosta löydät [Vite server options -dokumentaatiosta](https://vite.dev/config/server-options.html#server-proxy).


## Harjoituksen tavoitteet

Tehtäväsi on tunnistaa ja korjata ongelmat [`src/App.tsx`-tiedostossa](./src/App.tsx). Sovellus lataa listan artisteista ja heidän albumeistaan REST API:sta, mutta siinä on ongelmia, jotka täytyy ratkaista.


## Tunnetut bugi (korjattavat ongelmat)

### 1. Lataustilaongelma

Painaessasi "Load artists" -painiketta, edistymispalkki katoaa ennen kuin kaikki artistit on ladattu. Selvitä miksi näin tapahtuu ja korjaa ongelma niin, että edistymispalkki pysyy näkyvissä, kunnes kaikki artistit on ladattu.


### 2. Datan järjestysongelma

Artistit ilmestyvät ruudulle yksi kerrallaan, mutta ne eivät ole välttämättä samassa järjestyksessä, kuin missä API palauttaa ne. Perehdy ongelmaan ja muokkaa koodia niin, että artistit näytetään aina nousevassa järjestyksessä ID:n mukaan (1, 2, 3, ...).


## Testaaminen

Ratkaisusi on oikein kun:

1. ✅ Progress bar pysyy näkyvissä koko latauksen ajan
2. ✅ Kaikki 275 artistia latautuvat onnistuneesti
3. ✅ Artistit näytetään nousevassa järjestyksessä ID:n mukaan (1, 2, 3, ...)
4. ✅ Jokainen artisti sisältää albumitietonsa
5. ✅ "Check my solution!" -painike avaa dialogin, joka vahvistaa ratkaisusi oikeellisuuden


## API-päätepisteet

Sovellus käyttää näitä päätepisteitä:
- `GET /json-demo/api/artists.json` - Palauttaa listan kaikista artisteista perustietoineen
- `GET /json-demo/api/artists/{id}.json` - Palauttaa yksityiskohtaiset tiedot tietystä artistista, albumit mukaan lukien


## Debuggausvinkkejä

1. **Käytä selaimen kehittäjätyökaluja:**
   - Avaa Network-välilehti nähdäksesi pyyntöjen ja vastausten järjestyksen
   - Käytä Konsolia välitulosten lokittamiseen

2. **Lisää lokitusta:**
   - Lokita milloin pyynnöt alkavat ja valmistuvat
   - Lokita järjestys, jossa data saapuu

3. **Tutki asynkronista käyttäytymistä:**
   - Pohdi, miten useat samanaikaiset fetch-pyynnöt käyttäytyvät
   - Mieti milloin ja miten päivität komponentin tilaa

4. **Harkitse erilaisia lähestymistapoja:**
   - Peräkkäinen vs. rinnakkainen pyyntöjen käsittely
   - Erilaiset tavat hallita latustiloja
   - Eri menetelmät oikean järjestyksen varmistamiseksi


## Lisenssit

## Chinook-tietokanta

Tehtävän datan lähteenä on käytetty Chinook-tietokantaa, jonka on luonut [Luis Rocha](https://github.com/lerocha). Chinook on lisensoitu [MIT-lisenssillä](https://github.com/lerocha/chinook-database/blob/master/LICENSE.md).


## Tämä tehtävä

Tämän tehtävän on kehittänyt Teemu Havulinna ja se on lisensoitu [Creative Commons BY-NC-SA -lisenssillä](https://creativecommons.org/licenses/by-nc-sa/4.0/). Tehtävänannon, lähdekoodien ja testien toteutuksessa on hyödynnetty ChatGPT-kielimallia sekä GitHub copilot -tekoälyavustinta.
