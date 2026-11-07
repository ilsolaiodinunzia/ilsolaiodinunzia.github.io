# 🧵 Guida al Sistema di Gestione Catalogo — Il solaio di Nunzia

Questo sistema permette a Nunzia di aggiungere, modificare ed eliminare le sue borse direttamente dallo smartphone o dal computer, aggiornando automaticamente il catalogo pubblico.

---

## 📱 1. Come accedere al Pannello Admin dal cellulare

1. Apri il browser dello smartphone (Safari su iPhone, Chrome su Android).
2. Vai all'indirizzo del sito e aggiungi `/admin.html` oppure clicca sul link **⚙ Admin** in alto a destra o in fondo al catalogo.
3. Inserisci la password di accesso:
   * **Password predefinita:** `anita2026`
4. Clicca su **Entra nel Pannello**.

---

## 📸 2. Caricare una Nuova Borsa dallo Smartphone

1. Nel pannello Admin, tocca il pulsante rosa **➕ Nuova Borsa**.
2. Tocca **📷 Scatta / Scegli Foto**:
   * Su smartphone si aprirà direttamente la **fotocamera** per scattare una foto al momento, oppure la **galleria** per sceglierne una già scattata.
   * *Nota:* L'immagine viene automaticamente compressa e ridimensionata in formato leggero Web/JPEG in modo da caricarsi istantaneamente anche con connessione mobile 4G/5G.
3. Compila i campi desiderati:
   * **Nome borsa** *(es. Sole d'Agosto)*
   * **Numero pezzo** *(viene calcolato in automatico, es. Pz. 11, ma puoi modificarlo)*
   * **Categoria** *(Tote, A spalla, Secchiello, Pochette, Tracolla)*
   * **Anno di realizzazione** *(es. 2026)*
   * **Materiali e tessuti** *(es. Lino grezzo, cotone giallo)*
   * **Misure** *(es. 38 × 42 cm)*
   * **Ore di cucito** *(es. 6 ore)*
   * **Stato attuale** *(es. In uso quotidiano, Regalata a..., Disponibile)*
   * **Colore contrassegno** *(Malva, Lampone, Confetto)*
   * **Storia / Aneddoto** *(es. Cucita in una sera d'estate...)*
4. Tocca **💾 Salva Borsa**.
5. Torna al catalogo pubblico toccando **👁️ Catalogo Pubblico** per vedere subito la nuova borsa pubblicata!

---

## ✏️ 3. Modificare o Eliminare una Borsa

* Per **modificare** una borsa esistente: tocca il tasto **✏️ Modifica** sulla scheda della borsa nel pannello Admin, cambia i dati o la foto e tocca **Salva Borsa**.
* Per **eliminare** una borsa: tocca il tasto **🗑️ Elimina** e conferma.

---

## 💾 4. Backup e Salvataggio Dati

Nella sezione **Sincronizzazione & Backup** in fondo al pannello Admin:
* **Scarica Backup (JSON):** scarica un file con tutte le tue borse salvate sul cellulare/PC.
* **Carica Backup (JSON):** ripristina le borse da un backup precedentemente scaricato.
* **Ripristina 10 borse iniziali:** azzera le modifiche e ricarica i 10 pezzi d'archivio iniziali.

---

## 🌐 5. Come Pubblicare il Sito Online

Hai diverse opzioni facilissime per mettere il sito online:

### Opzione A: Hosting PHP standard (Aruba, Altervista, SiteGround, cPanel) — **Consigliato**
Se possiedi uno spazio web con supporto PHP (come il 99% dei siti web):
1. Carica via FTP tutti i file della cartella (`index.html`, `admin.html`, `style.css`, `admin.css`, `api.php`, `logo.png`, la cartella `js/`).
2. Il file `api.php` provvederà automaticamente a salvare le foto caricate dal cellulare nella cartella `uploads/` sul tuo server e le informazioni nel file `data_borse.json`.
3. In questo modo chiunque visiti il sito da qualsiasi parte del mondo vedrà le borse aggiornate!

### Opzione B: Hosting Statico Gratuito (Netlify, GitHub Pages, Vercel)
* I dati vengono salvati localmente nel browser del dispositivo.
* Puoi usufruire dei pulsanti di **Esporta JSON / Importa JSON** se desideri aggiornare manualmente il catalogo.

---

*Creato per Il solaio di Nunzia — 2026*
