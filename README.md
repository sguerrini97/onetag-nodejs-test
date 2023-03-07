# Test Backend Developer

### Consegna

Si estenda questo package npm con il fine di realizzare una piccola applicazione in Node.js facendo uso del framework Express. L'applicazione sviluppata consiste di una semplice API che deve includere le seguenti rotte:

<table>
<thead>
<tr>
<th>Path</th>
<th>Metodo</th>
<th>Azione</th>
<th>Esempio di body di risposta</th>
</tr>
</thead>
<tbody>
<tr>
<td>/</td>
<td>GET</td>
<td>
    Risponde con una pagina HTML contenente il messaggio "Hello World!"
</td>
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
<tr>
<td>/books</td>
<td>POST</td>
<td>

Inserisce all'interno della collection ```books``` di MongoDB un nuovo document con i dati presenti nel body della chiamata. Se l'oggetto passato nel body non rispetta il modello (vedi sotto) la rotta deve rispondere con un opportuno codice di errore.

</td>
<td> - </td>
</tr>
<tr>
<td>/books/[id]</td>
<td>GET</td>
<td>
    Preleva dalla collection 'books' di MongoDB il documento con _id uguale al parametro [id] specificato nel path e lo restituisce in formato JSON. Se tale documento non è presente nella collection la rotta risponde con 404.
</td>
<td>

```json
    {
      "name": "Treasure Island",
      "author": "Robert Louis Stevensonr",
      "publisher": "Cassell and Company",
      "edition": 1,
      "pages": 292,
      "releaseDate": "1983-11-14" // (data in formato YYYY-MM-DD)
    }
```

</td>
</tr>
<tr>
<td>/songs</td>
<td>GET</td>
<td>

Recupera una lista di pezzi musicali chiamando il servizio esterno Songs ([vedi sotto](#songs)), ne aggrega i dati ottenuti e restituisce la lista JSON di tutti i generi musicali, ciascuno con il numero di pezzi musicali che ne fanno parte.

</td>
<td>

```json
  {
      "genre": "Jazz",
      "songsCount": 330
  }
```

</td>
</tr>
</tbody>
</table>

### Modello del Database

La collection di MongoDB ```books``` deve contenere documenti che soddisfano il seguente schema:

```json
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

### Servizi Esterni

I servizi esterni rappresentano simbolicamente API di terze parti a cui il candidato deve appoggiarsi per implementare l'API da consegnare.

#### Songs

Il servizio esterno Songs viene avviato automaticamente dal comando ```npm start``` ed è in ascolto all'URL http://localhost:9009. Tale servizio esterno è un'API che espone le rotte:

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
<td>/</td>
<td>GET</td>
<td>

Restituisce una lista JSON di pezzi musicali. Questa rotta **è paginata** (vedi sotto)

</td>
<td>

```json
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
<tr>
<td>/count</td>
<td>GET</td>
<td>
Restituisce il numero totale di pezzi musicali.
</td>
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

I pezzi musicali restituiti dal servizio esterno rispettano tutti il seguente schema:
```json
{
    "id": string,
    "name": string,
    "author": string,
    "genre": string,
    "description": string,
}
```

La rotta principale esposta dal servizio (```/```) è paginata e **richiede** pertanto due parametri nel query string:

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
<td>/access-token</td>
<td>GET</td>
<td>

Restituisce un token per l'autenticazione del servizio esterno Songs ([vedi sopra](#songs)).

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

### Database

Un'istanza locale di MongoDB 5 è automaticamente avviata dal comando ```npm start```, in ascolto sulla sua porta di default.

### FAQ

- **È necessario adottare qualche stile di scrittura di codice JavaScript in particolare?**<br>
  E' preferibile la scrittura di codice JavaScript ES6 e l'uso dei costrutti ```Promise/async/await``` per la gestione di task asincroni.

<hr>

- **È possibile modificare qualsiasi file di questa cartella?**<br>
  Il candidato può modificare qualsiasi file ```.js``` ad eccezione dei contenuti della cartella ```__SEALED__```. E' ammesso aggiungere nuovi file ```.js``` e creare cartelle e sottocartelle per i file ```.js``` aggiunti.

