# Test Backend Developer OneTag

Questo README contiene tutte le istruzioni per sviluppare e consegnare il test tecnico di candidatura alla posizione di Backend Developer per il team ```main-tag``` di OneTag.

### Requisiti tecnici

Affinché il progetto possa essere avviato correttamente, è necessario che sulla macchina del candidato siano installati:

- [Docker](https://www.docker.com/)

Ai fini di sviluppo, si consiglia di installare anche:

- [NodeJS](https://nodejs.org/en/)

### Cosa fare

1) Leggere attentamente questo README.
2) Clonare questo repository.
3) Estenderne i contenuti modificando il file ```index.js``` e/o aggiungendo tutti i file e/o le sottocartelle che il candidato ritiene necessari/e, con il fine di realizzare un'applicazione che rispetti la [specifica](#specifica).
4) Creare l'archivio .zip di consegna tramite il comando ```npm run build```.
5) Compilare il [form di consegna](https://docs.google.com/forms/d/e/1FAIpQLSe3D_gW8YQ4hO0WueD-kDVUsDDDeVSAdAUrZzeDYNLExiYRWA/viewform) caricando l'archivio prodotto al passo precedente. 

### Specifica

Dopo aver clonato questo repository, lo si estenda con il fine di realizzare una piccola applicazione in Node.js facendo uso del framework Express (già installato). L'applicazione da sviluppare consiste di un webserver (in ascolto all'URL http://localhost:8080) che deve esporre un'API con le seguenti rotte:

-
    <table>
    <thead>
    <tr>
    <th>Path</th>
    <th>Metodo</th>
    <th>Esempio di body di risposta</th>
    </tr>
    </thead>
    <tbody>
    <tr>
    <td>
  
    ```/```
  
    </td>
    <td>GET</td>
    <td>
    
    ```HTML
    <!DOCTYPE html>
    <html>
        <head></head>
        <body>Hello World!</body>
    </html>
    ```
    
    </td>
    </tr>
    </tbody>
    </table>
    
    Risponde con una pagina HTML contenente il messaggio "Hello World!"

-
    <table>
    <thead>
    <tr>
    <th>Path</th>
    <th>Metodo</th>
    <th>Esempio di body in richiesta</th>
    <th>Esempio di body in risposta</th>
    </tr>
    </thead>
    <tbody>
    <tr>
    <td>
  
    ```/books```
  
    </td>
    <td>POST</td>
    <td>
  
    ```json
    {
      "name": "Treasure Island",
      "author": "Robert Louis Stevensonr",
      "publisher": "Cassell and Company",
      "edition": 1,
      "pages": 292,
      "releaseDate": "1983-11-14"
    }
    ```
  
    </td>
  <td>

    ```json
    {
      "id": "a9f694c5-2099-404c"
    }
    ```

    </td>
    </tr>
    </tbody>
    </table>

    Inserisce all'interno della collection ```books``` di MongoDB un nuovo document con i dati presenti nel body della chiamata. Se l'oggetto passato nel body non rispetta il modello ([vedi sotto](#database)) la rotta deve rispondere con un opportuno codice di errore. La rotta deve rispondere con un oggetto JSON contenente l'id del documento appena aggiunto.

-
    <table>
    <thead>
    <tr>
    <th>Path</th>
    <th>Metodo</th>
    <th>Esempio di body in risposta</th>
    </tr>
    </thead>
    <tbody>
    <tr>
    <td>
  
    ```/books/[id]```
  
    </td>
    <td>GET</td>
    <td>
    
    ```json
    {
      "name": "Treasure Island",
      "author": "Robert Louis Stevensonr",
      "publisher": "Cassell and Company",
      "edition": 1,
      "pages": 292,
      "releaseDate": "1983-11-14"
    }
    ```
    
    </td>
    </tr>
    </tbody>
    </table>

  Preleva dalla collection ```books``` di MongoDB il documento con ```_id``` uguale al parametro ```[id]``` specificato nel path e lo restituisce in formato JSON. Se tale documento non è presente nella collection la rotta risponde con un opportuno codice di errore.

-
    <table>
    <thead>
    <tr>
    <th>Path</th>
    <th>Metodo</th>
    <th>Esempio di body in risposta</th>
    </tr>
    </thead>
    <tbody>
    <tr>
    <td>
  
    ```/songs```
  
    </td>
    <td>GET</td>
    <td>
    
    ```
    [
      {
        "genre": "Jazz",
        "songs": [
            ...
        ]
      },
      {
        "genre": "Pop",
        "songs": [
            ...
        ]
      },
      ...
    ]
    ```
    
    </td>
    </tr>
    </tbody>
    </table>

  Recupera una lista di pezzi musicali chiamando il servizio esterno Songs ([vedi sotto](#songs)), ne aggrega i dati ottenuti e restituisce la lista JSON di **tutti** i generi musicali, ciascuno contenente l'array dei pezzi musicali che ne fanno parte.

### Database

Un'istanza locale di [MongoDB 5](https://www.mongodb.com/docs/v5.0/tutorial/getting-started/) è automaticamente avviata dal comando ```npm start```, in ascolto su ```localhost``` alla sua porta di default.

Il database usato dall'applicazione **deve** chiamarsi ```test-nodejs```.

La collection ```books``` deve contenere documenti che soddisfano il seguente schema:

```
{
  "name": string,
  "author": string,
  "publisher": string,
  "edition": number,
  "pages": number,
  "releaseDate": string // (data in formato YYYY-MM-DD)
}
```

La chiave della collection ```books``` è costituita dai campi ```name```, ```author```, ```publisher```, ```edition``` e non devono di conseguenza esistere due documenti nella collection che presentano identici i valori di tutti questi campi. L'_id di un nuovo document può essere autogenerato da MongoDB.

### Servizi esterni

I servizi esterni rappresentano una simulazione in locale di API di terze parti a cui il candidato deve appoggiarsi per implementare l'applicazione da consegnare.

#### Songs

Il servizio esterno Songs viene avviato automaticamente dal comando ```npm start``` ed è in ascolto all'URL http://localhost:9009. Tale servizio esterno è un'API che espone le rotte:

-
    <table>
    <thead>
    <tr>
    <th>Path</th>
    <th>Metodo</th>
    <th>Esempio di body in risposta</th>
    </tr>
    </thead>
    <tbody>
    <tr>
    <td>
  
    ```/count```
  
    </td>
    <td>GET</td>
    <td>
    
    ```json
    {
      "count": 1800
    }
    ```
    
    </td>
    </tr>
    </tbody>
    </table>

    Restituisce il numero totale di pezzi musicali.

-
  <table>
  <thead>
  <tr>
  <th>Path</th>
  <th>Metodo</th>
  <th>Esempio di body in risposta</th>
  </tr>
  </thead>
  <tbody>
  <tr>
  <td>
  
  ```/```
  
  </td>
  <td>GET</td>
  <td>

  ```
  [
    {
      "id": "e941a0a2-818f",
      "name": "La vie en rose",
      "author": "Édith Piaf",
      "genre": "Chanson",
      "description":  "..."
    },
    ...
  ]
  ```

  </td>
  </tr>
  </tbody>
  </table>

  Restituisce una lista JSON di pezzi musicali. Questa rotta **è paginata** e richiede pertanto due parametri nel query string:

  <table>
  <thead>
  <tr>
  <th>Chiave</th>
  <th>Valore</th>
  </tr>
  </thead>
  <tbody>
  <tr>
  <td>

  ```offset```

  </td>
  <td>Rappresenta il numero di risultati
  da skippare (o, detta in altri termini, il primo risultato da restituire)</td>
  </tr>
  <tr>
  <td>

  ```limit```

  </td>
  <td>Rappresenta il numero massimo di risultati da restituire (valore massimo 500)</td>
  </tr>
  </tbody>
  </table>

I pezzi musicali restituiti dal servizio esterno rispettano tutti il seguente schema:
```
{
    "id": string,
    "name": string,
    "author": string,
    "genre": string,
    "description": string,
}
```

> **Nota:**
> Questo servizio esterno è autenticato e necessita di un token da inserire nell' header HTTP 'TOKEN-V1' di tutte le chiamate. Il token può essere recuperato richiamando il servizio esterno Auth (vedi sotto)

#### Auth

Il servizio esterno Auth viene avviato automaticamente dal comando ```npm start``` ed è in ascolto all'URL http://localhost:9010. Tale servizio esterno è un'API che espone la rotta:

<table>
<thead>
<tr>
<th>Path</th>
<th>Metodo</th>
<th>Azione</th>
<th>Esempio di body in risposta</th>
</tr>
</thead>
<tbody>
<tr>
<td>

```/access-token```

</td>
<td>GET</td>
<td>

Restituisce un token per l'autenticazione del servizio esterno [Songs](#songs). Il token **è valido per un'ora** in seguito alla sua creazione.

</td>
<td>

```json
{
  "TOKEN-V1": "02a43f29ac6f4d"
}
```

</td>
</tr>
</tbody>
</table>

### Tests

Il comando ```npm run test``` verifica che l'implementazione del candidato soddisfi le richieste della specifica. Il test runner si aspetta che l'API sviluppata dal candidato sia attiva ed in ascolto alla sua porta. È quindi necessario, prima di invocare ```npm run test```, che l'applicazione sia stata avviata con ```npm start```.

### Tutti i comandi

- ```npm start``` (o ```npm run start```) avvia tutti i processi dell'applicazione in dei container Docker:
  - Un'istanza di [MongoDB 5](https://www.mongodb.com/docs/v5.0/tutorial/getting-started/) in ascolto su ```localhost``` alla sua porta di default. 
  - L'API sviluppata dal candidato, con ```index.js``` come entry point ed in ascolto all'URL http://localhost:8080. Per favorire lo sviluppo, questo processo è avviato tramite [nodemon](https://nodemon.io/), configurato per riavviare automaticamente il processo in seguito a qualsiasi modifica dei suoi sorgenti (```index.js``` e tutti i moduli da esso eventualmente importati).
  - Il servizio esterno [Songs](#songs), in ascolto all'URL http://localhost:9009.
  - Il servizio esterno [Auth](#auth), in ascolto all'URL http://localhost:9010.
- ```npm run test```: testa l'implementazione proposta dal candidato attualmente avviata tramite il comando ```npm start```.
- ```npm run build```: comprime la cartella del progetto (```node_modules``` esclusi) in un archivio al percorso ```./dist/consegna.zip```. Questo archivio deve essere consegnato tramite il [form di consegna](https://docs.google.com/forms/d/e/1FAIpQLSe3D_gW8YQ4hO0WueD-kDVUsDDDeVSAdAUrZzeDYNLExiYRWA/viewform).

### FAQ

- **È possibile modificare qualsiasi file di questa cartella?**<br>
  Il candidato può modificare e/o aggiungere qualsiasi file/cartella al progetto, con le seguenti eccezioni:
  - I contenuti della cartella ```__SEALED__``` non devono essere modificati. I moduli ```js``` contenuti in questa cartella **non possono** essere importati dal codice scritto dal candidato.
  - Il file ```index.js``` nella root del progetto **non deve essere spostato né rinominato**, poiché viene assunto essere l'entry point dell'applicazione sviluppata dal candidato.
  - Il file ```package.json``` **non deve essere modificato**, ad eccezione di eventuali dipendenze aggiunte ad esso dall'istallazione di nuovi packages (con ```npm install```) ed eventuali script npm **aggiuntivi** previsti dal candidato.

<hr>

- **È ammesso installare nuovi packages tramite npm?**<br>
  Si, è ammesso installare qualsivoglia nuovo package.
  > **Nota**: Dopo aver installato un nuovo package è necessario riavviare il comando ```npm start```.

<hr>

- **È necessario adottare qualche stile di scrittura di codice JavaScript in particolare?**<br>
  È preferibile la scrittura di codice JavaScript ES6 e l'uso dei costrutti ```Promise/async/await``` per la gestione di task asincroni, ove possibile.

<hr>

- **È possibile consegnare un'implementazione parziale della specifica?**<br>
  È possibile consegnare un'implementazione parziale, che sarà valutata con un punteggio inferiore.

<hr>

- **È possibile consegnare un'implementazione che non passa i test?**<br>
  È possibile consegnare un'implementazione che non passa i test, che sarà valutata con un punteggio inferiore.




