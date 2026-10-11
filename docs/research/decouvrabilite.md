# Découvrabilité : comment les repos d'extensions populaires se rendent trouvables

Réponse au ticket [`02-decouvrabilite`](../wayfinder/tickets/02-decouvrabilite.md). Recherche du 2026-10-11.
Sources : documentation officielle GitHub, Chrome Web Store et Microsoft Edge Add-ons, plus l'API GitHub et les README des repos de référence.

## Constats clés

1. **La recherche GitHub ne lit pas le README par défaut.** Sans qualificatif `in:`, elle cherche seulement dans le **nom**, la **description** et les **topics** du repo. Pour qu'un repo sorte sur « reddit extension », ces mots doivent figurer dans ces trois champs. ([GitHub Docs, Searching for repositories](https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories))
2. **Topics** : 20 au maximum, 50 caractères au maximum chacun, en minuscules, chiffres et tirets. Ils servent à classer le repo par usage, sujet ou communauté. ([GitHub Docs, Topics](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics))
3. **Classement dans le Chrome Web Store** : il dépend des notes, de l'usage (installations contre désinstallations dans le temps) et des métadonnées de la fiche. Une fiche « complete, accurate, and optimized » compte pour la recherche. On ne peut ni demander ni payer une mise en avant. ([CWS, Discovery](https://developer.chrome.com/docs/webstore/discovery))
4. **Bourrage de mots-clés interdit** : répéter un même mot-clé plus de 5 fois est l'exemple donné de *keyword spam*. Il peut entraîner une suspension. Une fiche sans description, sans icône ou sans capture est rejetée. ([CWS, Listing requirements](https://developer.chrome.com/docs/webstore/program-policies/listing-requirements))
5. **Edge Add-ons** propose un champ caché « Search terms » : 7 termes au maximum, 30 caractères par terme, 21 mots au total. Description : 250 à 10 000 caractères. ([Microsoft Learn, Publish a Microsoft Edge extension](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension))

## Ce que font les repos de référence

Relevé via l'API GitHub (`api.github.com/repos/<owner>/<repo>`) et les README, le 2026-10-11.

| Repo | Étoiles | Description GitHub | Topics | README : haut de page |
|---|---|---|---|---|
| [gorhill/uBlock](https://github.com/gorhill/uBlock) | 68 482 | « uBlock Origin - An efficient blocker for Chromium and Firefox. Fast and lean. » | blocker, browser-extension, chromium, firefox, javascript, ublock, ublock-origin | Icône et titre centrés, badges (licence, notes des stores), tableau des liens de store, captures de la popup |
| [refined-github/refined-github](https://github.com/refined-github/refined-github) | 32 285 | « Browser extension that simplifies the GitHub interface and adds useful features » | browser-extension, chrome-extension, firefox-addon, github, github-extension, safari-extension, userstyle | Logo, slogan d'une ligne, section **Install** avec badges de store, puis **Highlights** avec une capture ou un GIF par fonction |
| [darkreader/darkreader](https://github.com/darkreader/darkreader) | 22 454 | « Dark Reader Chrome and Firefox extension » (+ site darkreader.org) | accessibility, chrome-extension, dark-mode, dark-theme, darkmode, eye-care, firefox-addon, night-mode, nightmode | Mascotte centrée, rangée de badges de store (Chrome, Firefox, Safari, Edge, Thunderbird), courte description |
| [honestbleeps/Reddit-Enhancement-Suite](https://github.com/honestbleeps/Reddit-Enhancement-Suite) | 4 527 | « Reddit Enhancement Suite » (+ site redditenhancementsuite.com) | chrome-extension, edge-extension, firefox-addon, firefox-extension, hacktoberfest, reddit | — |
| [tom-james-watson/old-reddit-redirect](https://github.com/tom-james-watson/old-reddit-redirect) | 564 | « Ensure Reddit always loads the old design » | aucun | Titre, paragraphe d'intro, 2 liens de store ; ni badge ni image |

Leçons tirées du tableau :

- Tous ont une **licence** (MIT ou GPL-3.0) et des **liens de store tout en haut** du README.
- Les plus étoilés déclarent des **topics** qui combinent le type (`browser-extension`, `chrome-extension`, `edge-extension`), le site visé (`github`, `reddit`) et des synonymes de la fonction (`dark-mode`, `darkmode`, `night-mode`).
- Refined GitHub met **une image par fonction** ; uBlock montre des captures de l'interface. Dark Reader et Old Reddit Redirect s'en passent : leur notoriété ou leur fonction unique compensent.
- Old Reddit Redirect, sans topics, reste le moins étoilé. C'est une corrélation, pas une preuve de cause.

## Checklist priorisée pour Reddtastic

État actuel : pas de `LICENSE`, pas de remote GitHub configuré, `manifest.json` en français (« Reddtastic Diaporama », description « Diaporama plein écran à défilement automatique pour reddtastic.com »), README sans image ni lien de store.

### P0 : coût faible, effet direct sur la recherche

1. **Description GitHub (champ About)** en anglais, avec les mots qu'on tape : *reddit*, *slideshow*, *extension*, *Chrome*, *Edge*, *reddtastic*. Exemple : « Chrome/Edge extension: fullscreen auto-advancing slideshow and favorites for Reddit via reddtastic.com ». C'est un des trois champs indexés par la recherche GitHub. ([source](https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories))
2. **Topics** (10 à 15 sur 20) : `browser-extension`, `chrome-extension`, `edge-extension`, `manifest-v3`, `reddit`, `reddit-viewer`, `slideshow`, `image-viewer`, `subreddit`, `favorites`, `fullscreen`, `reddtastic`, `javascript`. ([source](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics))
3. **Nom du repo** explicite, par exemple `reddtastic-slideshow` ou `reddtastic-extension`. Le nom est aussi indexé. La requête « reddtastic extension » doit tomber dessus.
4. **Fichier `LICENSE`** (MIT, comme Dark Reader et Refined GitHub). Il fait partie des fichiers vérifiés par le profil communautaire. `vendor/hls.min.js` est sous Apache-2.0, compatible avec MIT ; garder sa mention. ([source](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/about-community-profiles-for-public-repositories))
5. **README en anglais en tête**, avec une version française en lien (`README.fr.md`). Les requêtes visées sont en anglais. Garder le contenu actuel, qui est précis.
6. **GIF de démo ou capture** du diaporama et du tableau de bord, en haut du README. Chemins relatifs, par exemple `docs/media/demo.gif`. GitHub tronque un README au-delà de 500 Kio, mais les images liées ne comptent pas. ([source](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes))

### P1 : fiche store (dès la publication)

7. **Titre de store** clair et unique, sans bourrage de mots-clés. ([source](https://developer.chrome.com/docs/webstore/best-listing))
8. **Résumé (summary)** de 132 caractères au maximum, en texte brut, centré sur l'usage principal, sans superlatifs. Il vient du champ `description` du manifest. ([source](https://developer.chrome.com/docs/webstore/best-listing))
9. **Description** : un paragraphe d'ensemble puis une liste courte des fonctions. Ne pas répéter un mot-clé plus de 5 fois. Pas de témoignages anonymes. ([source](https://developer.chrome.com/docs/webstore/program-policies/listing-requirements)) Sur Edge : 250 caractères au minimum. ([source](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension))
10. **Images** :
    - Icône 128×128 en PNG : motif 96×96 et 16 px transparents de chaque côté. Le manifest n'en déclare aucune pour l'instant.
    - Captures : 5 dans le CWS, 6 dans Edge. Format 1280×800 de préférence, à fond perdu, sans coins arrondis.
    - Petite tuile promo 440×280 (obligatoire dans le CWS).
    - Marquee 1400×560 (optionnelle).
    ([source CWS](https://developer.chrome.com/docs/webstore/images), [source Edge](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension))
11. **Search terms Edge** : 7 termes au maximum, par exemple `reddit slideshow`, `reddit viewer`, `subreddit slideshow`, `reddtastic`, `image slideshow`, `fullscreen gallery`, `reddit favorites`. ([source](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension))
12. **Site web et page de support** renseignés (l'URL du repo convient), plus une catégorie précise. ([source CWS](https://developer.chrome.com/docs/webstore/best-listing), [source Edge](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension))
13. **Localiser le manifest** (`_locales/en`, `_locales/fr`, `default_locale`). Sinon Edge ne détecte qu'une seule langue de fiche. ([source](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension))
14. **Privacy** : justifier chaque permission (`storage`) et donner l'URL d'une politique de confidentialité si des données sont collectées. Ici, rien ne sort du navigateur ; le dire. ([source](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension))

### P2 : finition et confiance

15. **Image de social preview** 1280×640, moins de 1 Mo, en PNG, JPG ou GIF. Sans elle, un lien partagé n'affiche que l'avatar et les infos de base. ([source](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview))
16. **Badges de store** en haut du README, une fois publiée (version, utilisateurs, note), comme uBlock et Dark Reader.
17. **Releases GitHub** avec le `.zip` et un changelog par version (la version du manifest est 0.4.0). Les liens de store renvoient aux releases quand la fiche n'est pas encore en ligne.
18. **`CONTRIBUTING.md`** et **modèles d'issues** dans `.github/ISSUE_TEMPLATE` (frontmatter YAML valide). Ils complètent le profil communautaire. `CODE_OF_CONDUCT` est optionnel pour un projet solo. ([source](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/about-community-profiles-for-public-repositories))
19. **Champ homepage** du repo pointant vers la fiche store, comme le font Dark Reader et RES avec leur site.

### Points de vigilance

- **Marque Reddit** : ne pas laisser croire à une affiliation. La règle du CWS interdit de se présenter comme « authorized by, endorsed by, or produced by another company » si c'est faux. ([source](https://developer.chrome.com/docs/webstore/program-policies/impersonation-and-intellectual-property)) Ajouter une phrase « Not affiliated with Reddit, Inc. or reddtastic.com » (Refined GitHub a un avertissement de marque équivalent). Selon des articles de presse, Reddit a fait renommer des apps tierces vers la forme « X for Reddit ». Ce n'est **pas vérifié** sur la page de marque officielle de Reddit, que je n'ai pas pu charger. ([Android Police](https://www.androidpolice.com/2020/01/07/reddit-is-fun-now-called-rif-is-fun-for-reddit-due-to-licensing-issues/)) Donc : pas de « Reddit » en tête du nom, pas de logo Snoo dans l'icône.
- **Contenu adulte** : Edge propose une case « Mature content ». Le diaporama affiche ce que montre reddtastic.com ; décider de cette case en connaissance de cause. ([source](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension))
- **Badges du CWS** (*Established Publisher*, *Featured*) : impossibles à acheter, et longs à obtenir pour un nouveau développeur. Ne pas compter dessus à court terme. ([source](https://developer.chrome.com/docs/webstore/discovery))

## Squelette de README proposé

```
<p align="center"><img src="icons/128.png" width="96" alt=""></p>
<h1 align="center">Reddtastic Slideshow</h1>
<p align="center">Fullscreen, auto-advancing slideshow and favorites dashboard for Reddit, via reddtastic.com. Chrome & Edge (Manifest V3).</p>
<p align="center">[badge Chrome Web Store] [badge Edge Add-ons] [badge licence MIT] · <a href="README.fr.md">Français</a></p>

![Demo](docs/media/demo.gif)

## Install
  - Chrome Web Store / Edge Add-ons (liens)
  - Manual install (unpacked) : les 4 étapes actuelles

## Features
  - Slideshow (subreddit, user, sort ; videos with sound ; volume)
  - Favorites dashboard (collections, daily previews, triple backup)
  - Buttons on reddit.com
  (une capture par fonction, comme Refined GitHub)

## Keyboard shortcuts
  (tableau actuel)

## Privacy
  Permission `storage` uniquement ; aucune donnée envoyée ailleurs.

## Development
  Fichiers, tests (`node test/*.test.js`)

## Contributing · License
  Lien CONTRIBUTING.md ; MIT ; hls.js sous Apache-2.0.
  Not affiliated with Reddit, Inc. or reddtastic.com.
```

## Non couvert

- Le référencement Google des pages GitHub n'est pas documenté par GitHub ni par Google pour ce cas. Je n'avance donc aucune règle dessus. En pratique, le nom et la description du repo forment le titre de la page.
- La page de marque officielle de Reddit (redditinc.com/brand) n'a pas pu être chargée. La règle « X for Reddit » reste à vérifier.
- La recherche par mots-clés réels (volume de « reddit slideshow » contre « reddit viewer ») n'a pas été mesurée.
