---
type: research
mode: AFK
status: closed
assignee:
blocked_by: []
---
# Règles Chrome Web Store et Edge Add-ons pour cette extension

## Question

Qu'exigent le Chrome Web Store et Edge Add-ons pour accepter cette extension, et qu'est-ce qui risque un rejet ? Points précis : site cible pouvant afficher du contenu NSFW (reddtastic.com relaie Reddit) ; « Reddit » dans le nom (règles de marque Reddit + politique « impersonation » du store) ; permission `https://*.reddit.com/*` et `storage` (justification, revue approfondie) ; politique de confidentialité obligatoire ou non (cookies, `chrome.storage.sync`) ; règle « single purpose » ; visuels obligatoires (icônes 128, captures 1280×800, tuiles) ; coût, délais de revue.

## Résolution

Détail : `docs/research/regles-stores.md` .

- Bloquant : aucune icône (pas de clé `icons`, aucun fichier image). Il faut une icône 128×128, une tuile 440×280, au moins une capture 1280×800 et, pour Edge, un logo 300×300.
- Contenu adulte : les deux stores interdisent le contenu explicite et le fait de « diriger du trafic » vers ce type de contenu. Captures et description doivent rester neutres.
- Risque majeur : les boutons sur les pages de connexion et d'avertissement adulte de reddit.com (Edge §2.8, contournement de restriction).
- Nom : les Developer Terms de Reddit interdisent les marques Reddit dans le nom d'une app sans accord écrit (interprétation : l'extension n'appelle pas l'API Reddit). « Reddit » est seulement descriptif, dans le texte. Le nom de travail « … for Reddit » est donc remis en cause.
- Mention « non officielle, sans lien avec Reddit Inc. ni reddtastic.com » obligatoire.
- Permissions `storage` et `*.reddit.com` acceptables, justifications prêtes. Pas de code distant (hls.js est inclus).
- Politique de confidentialité obligatoire sur Chrome, même avec un stockage seulement local ou sync.
- Coûts : Chrome environ 5 $ une fois, avec double authentification. Edge gratuit. Revue : de quelques jours à quelques semaines.
