# Reddtastic Diaporama

Extension Edge/Chrome : diaporama plein écran à défilement automatique sur reddtastic.com (pages `/r/…` et `/u/…`), avec tableau de bord des favoris.
Sur reddit.com (avec ou sans compte), des boutons ouvrent la même page sur Reddtastic.

## Installation

1. Ouvrir `edge://extensions` (ou `chrome://extensions`).
2. Activer le « Mode développeur ».
3. « Charger l'extension non empaquetée » et choisir ce dossier.
4. Après une modification du code : bouton « Recharger » de l'extension, puis recharger l'onglet.

## Utilisation

En bas à droite : **Favoris** et **Diaporama**. Le diaporama suit le subreddit et le tri (`?sort=`, `&t=`) de la page.
En haut à gauche du diaporama : `u/auteur` et `r/subreddit` ouvrent leur propre diaporama dans un nouvel onglet ; « Voir sur Reddit » ouvre le post sur reddit.com.

Sur reddit.com, en bas à gauche : **Favoris** et **Diaporama** (sous-reddit ou utilisateur affiché, tri compris ; fonctionne aussi depuis les pages de connexion et d'avertissement adulte grâce à leur paramètre `dest`).

| Touche | Action |
|---|---|
| ← / → | précédent / suivant |
| espace | pause / lecture |
| m | son coupé / rétabli |
| ↑ / ↓ | volume (aussi : molette ou curseur au survol du bouton son) |
| r | voir le post sur Reddit |
| u | petites photos agrandies / taille réelle |
| h | masquer / afficher les contrôles (masqués : réapparaissent au survol) |
| s | ajouter / retirer des favoris |
| f | plein écran |
| Échap | fermer |

Volume mémorisé. Le curseur est linéaire mais le volume suit sa position au cube : la moitié du curseur = 12,5 %, ce qui donne de la précision dans les sons bas.

Durée réglable dans la barre. Une vidéo est lue jusqu'au bout ; si elle dure moins que la durée réglée, elle est rejouée jusqu'à l'atteindre.

## Favoris (`reddtastic.com/#favoris`)

- Un favori = une page + son tri (`r/photo` Hot et `r/photo` Top · semaine sont deux favoris).
- Aperçu renouvelé une fois par jour : meilleur post du jour du subreddit, dernier post de l'utilisateur.
- Collections : créer, renommer (cliquer sur le nom), monter / descendre, supprimer. Ranger les favoris par glisser-déposer, par les flèches ou par le menu de chaque favori.
- Filtres Tous / Subreddits / Utilisateurs. Suppression annulable quelques secondes.
- Sauvegarde triple : `chrome.storage.local` + cookies `rdp_favs0…7` sur reddtastic.com + `chrome.storage.sync` (compte Edge, si la synchro est active). Si une copie disparaît, les autres la reconstruisent au prochain chargement.

## Fichiers

- `media.js` : post de l'API → médias et aperçu. `favs.js` : favoris, cookie, aperçus du jour.
- `content.js` : diaporama et lanceur. `home.js` : tableau de bord. `icons.js` : icônes SVG.
- `vendor/hls.min.js` : hls.js 1.7.3 (Apache-2.0), nécessaire pour le son des vidéos Reddit.
- `volume.js` : courbe du curseur de volume. `reddit.js` : boutons sur reddit.com.
- Tests : `node test/media.test.js && node test/favs.test.js && node test/reddit.test.js`.
