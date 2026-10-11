# Règles Chrome Web Store et Edge Add-ons pour Reddtastic Diaporama

Recherche pour le ticket [01-regles-stores](../wayfinder/tickets/01-regles-stores.md). Sources consultées le 2026-10-11, toutes primaires (Google, Microsoft, Reddit Inc.).

État de l'extension étudiée (`manifest.json` v0.4.0) : MV3, nom « Reddtastic Diaporama », permission `storage`, content scripts sur `https://reddtastic.com/*`, `https://www.reddtastic.com/*` et `https://*.reddit.com/*`. Aucune clé `icons`, aucune image dans le dépôt. Les requêtes réseau passent par `/api/reddit/...` de reddtastic.com (pas d'appel direct à l'API Reddit). hls.js est embarqué localement (pas de code distant).

## Sources

- Chrome — [Program Policies (index)](https://developer.chrome.com/docs/webstore/program-policies/policies)
- Chrome — [Mature & Sexually Explicit Material](https://developer.chrome.com/docs/webstore/program-policies/explicit-material)
- Chrome — [Content Ratings Guidelines](https://developer.chrome.com/docs/webstore/rating)
- Chrome — [Impersonation & Intellectual Property](https://developer.chrome.com/docs/webstore/program-policies/impersonation-and-intellectual-property)
- Chrome — [Quality Guidelines (single purpose)](https://developer.chrome.com/docs/webstore/program-policies/quality-guidelines)
- Chrome — [Listing Requirements](https://developer.chrome.com/docs/webstore/program-policies/listing-requirements)
- Chrome — [User Data FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq)
- Chrome — [Onglet Privacy du tableau de bord](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)
- Chrome — [Supplying images](https://developer.chrome.com/docs/webstore/images)
- Chrome — [Review process](https://developer.chrome.com/docs/webstore/review-process)
- Chrome — [Register your developer account](https://developer.chrome.com/docs/webstore/register)
- Chrome — [Policy updates 2026](https://developer.chrome.com/blog/cws-policy-updates-2026) (application au 1er août 2026)
- Edge — [Developer policies for the Microsoft Edge Add-ons website](https://learn.microsoft.com/en-us/legal/microsoft-edge/extensions/developer-policies) (màj 2026-07-24)
- Edge — [Publish a Microsoft Edge extension](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension)
- Edge — [Register as a Microsoft Edge extension developer](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/create-dev-account)
- Reddit — [Developer Terms](https://redditinc.com/policies/developer-terms)
- Reddit — [Brand page](https://www.redditinc.com/brand) (renvoie vers licensing@reddit.com pour tout usage commercial de la marque)

## Verdicts par point

### 1. Site cible pouvant afficher du contenu NSFW

**Verdict : risque réel, gérable si l'extension et sa fiche restent neutres. Le point le plus dangereux est le bouton sur les pages d'avertissement adulte de Reddit.**

- Chrome interdit « nudity, graphic sex acts, sexually explicit material » et le contenu qui « drives traffic to commercial pornography sites » ([explicit-material](https://developer.chrome.com/docs/webstore/program-policies/explicit-material)). Pour la note d'âge, il faut considérer « content that your extension links to » ; « Extensions that contain prominent links to porn sites » sont interdites ([rating](https://developer.chrome.com/docs/webstore/rating)).
- Le classement « Mature » existe : l'extension n'est alors visible que des comptes Google adultes connectés ([explicit-material](https://developer.chrome.com/docs/webstore/program-policies/explicit-material)). Il couvre le contenu suggestif, pas le contenu explicite, qui reste interdit.
- Edge, §2.7 : interdit le contenu pornographique et ce qui « drives traffic to a pornography site ». §2.12.1 : déclarer « Mature » en tenant compte du contenu généré par les utilisateurs et des contenus liés. §2.12.2 : si l'extension fournit du contenu web pouvant relever d'un âge supérieur, l'utilisateur doit s'y inscrire volontairement (« content filter » ou connexion à un compte existant) ([developer-policies](https://learn.microsoft.com/en-us/legal/microsoft-edge/extensions/developer-policies)).
- Edge, §2.8 : l'extension « must not provide unauthorized access to website content, such as by circumventing paywalls or login restrictions ». Les boutons injectés sur les pages de connexion et d'avertissement adulte de reddit.com (paramètre `dest`) envoient l'utilisateur vers le même contenu sans passer la barrière de Reddit. Un relecteur peut y voir un contournement de restriction.
- Reddtastic n'est pas un site pornographique commercial. Le code de l'extension ne contient aucun contenu adulte. Ce qui compte, c'est ce que le relecteur voit en testant et sur la fiche.

### 2. « Reddit » dans le nom

**Verdict : ne pas mettre « Reddit » dans le nom, l'icône ni le titre. Le nom actuel « Reddtastic Diaporama » est acceptable, sous réserve d'une mention « non officiel ».**

- Reddit Developer Terms : « you are not permitted to use the Reddit Trademarks in the name of your App or to promote or identify your App [...] without Reddit's prior written consent ». Interdit aussi un usage qui « reasonably imply Reddit's endorsement » ou une marque « confusingly similar » ([developer-terms](https://redditinc.com/policies/developer-terms)). Ces conditions visent les apps qui utilisent les services Reddit. L'extension passe par reddtastic.com, mais elle s'exécute aussi sur reddit.com : appliquer la règle par prudence.
- La page marque de Reddit renvoie tout usage commercial de la marque à licensing@reddit.com ([brand](https://www.redditinc.com/brand)). La page de règles détaillées (redditbrand.lingoapp.com) n'est pas lisible sans JavaScript ; non vérifiée.
- Pas de règle officielle « for Reddit » trouvée. L'usage descriptif dans la description (« fonctionne sur reddit.com ») reste un usage nominatif ; un nom de produit contenant « Reddit » demande un accord écrit.
- Chrome : « don't represent that your product is authorized by, endorsed by, or produced by another company » et pas d'atteinte aux marques ([impersonation](https://developer.chrome.com/docs/webstore/program-policies/impersonation-and-intellectual-property)). Edge §1.1.2 : ne pas prétendre représenter une entité sans permission ; §2.2 : contenu sous licence ou ajout d'un avertissement ([developer-policies](https://learn.microsoft.com/en-us/legal/microsoft-edge/extensions/developer-policies)).
- « Reddtastic » est le nom d'un site tiers. Si l'éditeur n'est pas le propriétaire de reddtastic.com, l'extension ne doit pas paraître officielle : écrire « extension non officielle, sans lien avec Reddtastic ni Reddit » dans la description. Ne pas utiliser le logo Reddit (Snoo, bulle orange) ni celui de Reddtastic dans l'icône.

### 3. Permissions `https://*.reddit.com/*` et `storage`

**Verdict : acceptables et justifiables. Revue un peu plus longue possible, pas de revue « approfondie » déclenchée par la seule portée.**

- Chrome : « Request access to the narrowest permissions necessary » ; pas de permission « future proof » ([policies](https://developer.chrome.com/docs/webstore/program-policies/policies)). Les permissions d'hôte larges allongent la revue ([review-process](https://developer.chrome.com/docs/webstore/review-process)). `*.reddit.com` est un domaine unique, bien plus étroit que `<all_urls>`.
- L'onglet Privacy demande une justification par permission déclarée ; « Requesting broader permissions than necessary may cause your extension to be rejected » ([cws-dashboard-privacy](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)). Edge a les mêmes champs : « Single Purpose », « Permission justification », « remote code », « Data usage » ([publish-extension](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension)) ; §1.6 interdit aussi le « future proofing ».
- Justifications prêtes :
  - `storage` : « Enregistre localement les favoris, collections et le volume ; `storage.sync` les synchronise entre les appareils de l'utilisateur. »
  - `https://*.reddit.com/*` : « Ajoute deux boutons (Favoris, Diaporama) sur reddit.com pour ouvrir la même page dans le diaporama. Aucune donnée n'est lue ni envoyée. »
  - Hôtes reddtastic.com : « Le diaporama et le tableau de bord s'affichent sur ce site. »
- Code distant : répondre « Non ». hls.js est embarqué ; MV3 interdit le code distant.

### 4. Politique de confidentialité

**Verdict : obligatoire sur Chrome, fortement recommandée sur Edge. À publier avant soumission.**

- Chrome User Data FAQ n°14 : même un produit qui « only stores information locally (or only uses Chrome Storage Sync API) » doit publier une politique ; « This policy requires all Products that handle user information to post a privacy policy ». Elle « may not need to be long or complicated » ([user-data-faq](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq)).
- Les favoris (pages Reddit suivies) relèvent de la « web browsing activity », et les cookies de site sont cités comme données de navigation (FAQ n°2 et n°4). Les cookies `rdp_favs0…7` posés sur reddtastic.com sont donc concernés.
- Mise à jour Chrome 2026 : toute collecte doit servir l'objectif unique déclaré et être signalée en évidence, même si elle lui est liée ([cws-policy-updates-2026](https://developer.chrome.com/blog/cws-policy-updates-2026)).
- Edge : URL exigée « if the extension collects any privacy information » ([publish-extension](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension)) ; §1.5.1 exige d'annoncer le traitement des données à l'installation ; §1.5.2 interdit de réutiliser la politique de Microsoft et demande une politique qui vise Edge ([developer-policies](https://learn.microsoft.com/en-us/legal/microsoft-edge/extensions/developer-policies)).
- Contenu minimal : données stockées (liste de favoris, collections, aperçus, volume), où (`chrome.storage.local`, `chrome.storage.sync`, cookies sur reddtastic.com), aucun envoi au développeur ni à des tiers, aucune analyse d'audience, comment tout effacer (supprimer l'extension et les cookies du site). Héberger la page sur une URL stable (ex. GitHub Pages).
- Dans « Data usage » : cocher « Web history » (ou équivalent) seulement si le relecteur considère les favoris comme tels ; rester cohérent avec la politique.

### 5. Règle « single purpose »

**Verdict : conforme si l'objectif est formulé comme un seul usage.**

- Chrome : « An extension must have a single purpose that is narrow and easy to understand » ; pas de « bundles of unrelated functionality » ([quality-guidelines](https://developer.chrome.com/docs/webstore/program-policies/quality-guidelines)). Edge §1.1.1 : « a single purpose with narrow functionality ».
- Diaporama, favoris et boutons sur reddit.com servent tous à visionner des pages Reddit en diaporama via Reddtastic. Formulation proposée : « Visionner en diaporama plein écran les médias des subreddits et utilisateurs Reddit via reddtastic.com, et retrouver ses pages favorites. »

### 6. Visuels obligatoires

**Verdict : l'extension n'a aucune icône aujourd'hui. Rejet certain sur Chrome tant que ce n'est pas corrigé.**

| Visuel | Chrome Web Store | Edge Add-ons |
|---|---|---|
| Icône 128×128 PNG (dessin 96×96 + marge transparente) | Obligatoire | — |
| Logo de fiche 1:1 (300×300 recommandé, 128×128 min.) | — | Obligatoire par langue |
| Petite tuile 440×280 | Obligatoire | Optionnelle |
| Grande tuile 1400×560 | Optionnelle | Optionnelle |
| Captures 1280×800 ou 640×400 (Chrome) / 640×480 ou 1280×800 (Edge) | Au moins 1, jusqu'à 5 | Optionnelles, max 6 |
| Description | Non vide | 250 à 10 000 caractères par langue |

Sources : [images](https://developer.chrome.com/docs/webstore/images), [listing-requirements](https://developer.chrome.com/docs/webstore/program-policies/listing-requirements) (« If your product has a blank description field or is missing an icon or screenshots, it will be rejected »), [publish-extension](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension).

Ajouter aussi `"icons": {"16": …, "48": …, "128": …}` dans `manifest.json`. Edge limite les mots-clés à 7 termes de 30 caractères max (21 mots au total) ; Chrome rejette un mot-clé répété plus de 5 fois.

### 7. Coût et délais

**Verdict : 5 $ une fois chez Google, gratuit chez Microsoft. Compter de quelques jours à une ou deux semaines par store.**

- Chrome : frais d'inscription uniques ([register](https://developer.chrome.com/docs/webstore/register)) ; le montant de 5 $ figure dans la documentation Chrome mais pas sur la page d'inscription elle-même. Validation en deux étapes obligatoire pour publier ([policies](https://developer.chrome.com/docs/webstore/program-policies/policies)). Revue : « within a few days, but it can take up to a few weeks » ; contacter le support après 3 semaines ([review-process](https://developer.chrome.com/docs/webstore/review-process)).
- Edge : « There is no registration fee » ([create-dev-account](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/create-dev-account)). Compte individuel vérifié rapidement ; compte entreprise de quelques jours à quelques semaines. Certification « up to seven business days » ([publish-extension](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension)). Appels 2026 : 3,03 jours en moyenne.

## Risques de rejet et parades

| # | Risque | Store | Gravité | Parade |
|---|---|---|---|---|
| 1 | Aucune icône dans le paquet ni sur la fiche | Chrome, Edge | Bloquant | Créer icône 16/48/128 + logo 300×300 originaux, sans logo Reddit ; ajouter `icons` au manifest. |
| 2 | Captures ou description montrant ou évoquant du NSFW | Chrome, Edge | Bloquant | Captures sur subreddits neutres (photo, nature, animaux). Ne citer aucun subreddit adulte. |
| 3 | Boutons injectés sur les pages de connexion et d'avertissement adulte de reddit.com, vus comme contournement | Edge (§2.8), Chrome (rating) | Élevée | Ne plus injecter sur ces pages, ou au minimum ne rien en dire et ne pas en faire une capture. Option la plus sûre : retirer. |
| 4 | Relecteur qui tombe sur du contenu adulte en testant | Chrome, Edge | Moyenne | Notes de certification avec un parcours de test neutre (ex. `reddtastic.com/r/aww`, `reddtastic.com/r/pics` ; éviter les subreddits au nom ambigu). |
| 5 | « Reddit » dans le nom ou logo Reddit | Chrome, Edge, Reddit | Élevée | Garder « Reddtastic Diaporama » ; logo original ; « Reddit » seulement en usage descriptif dans la description. |
| 6 | Impression d'extension officielle de Reddtastic ou Reddit | Chrome, Edge | Moyenne | Phrase « Extension non officielle, sans lien avec Reddit Inc. ni reddtastic.com » en tête de description. |
| 7 | Pas de politique de confidentialité | Chrome (bloquant), Edge | Élevée | Page courte et hébergée, cohérente avec les cases « Data usage ». |
| 8 | Justifications de permissions absentes ou vagues | Chrome, Edge | Moyenne | Reprendre les textes de la section 3. |
| 9 | Code jugé obfusqué (hls.min.js minifié) | Edge §1.1.7, Chrome | Faible | Indiquer dans les notes : hls.js 1.7.3, Apache-2.0, fichier officiel non modifié, lien vers la source. |
| 10 | Dépendance à reddtastic.com non annoncée ; site en panne pendant la revue | Edge §1.2.3, §1.3.2 | Faible | Écrire dans la description que l'extension nécessite reddtastic.com. |
| 11 | Classement d'âge mal déclaré | Chrome, Edge | Moyenne | Cocher « Mature » si les pages ciblées peuvent montrer du contenu adulte ; sinon le développeur reste responsable de l'exactitude (Edge §2.12.1). Décision à prendre par l'éditeur. |

## Points non vérifiés

- Règles détaillées de marque Reddit sur redditbrand.lingoapp.com : page rendue en JavaScript, non lue.
- Applicabilité exacte des Reddit Developer Terms à une extension qui n'appelle pas l'API Reddit : interprétation, pas de texte explicite.
- Montant de 5 $ : non affiché sur la page d'inscription Chrome, seulement dans d'autres pages Chrome.
- Le contrôle d'âge de reddtastic.com lui-même n'a pas été examiné.
