---
label: wayfinder:map
---
# Publier l'extension Reddtastic

## Destination

Extension publiée et trouvable : repo GitHub public `HaniWanice/reddtastic-extension` (MIT, prêt pour contributions et rapports de bugs) et extension installable en un clic sur Chrome Web Store et Edge Add-ons. Une recherche « reddit extension » ou « reddtastic extension » mène à la page.

## Notes

- Exécution incluse dans la carte : la carte va jusqu'à la publication réelle, pas seulement aux décisions.
- Décisions déjà prises au cadrage : canal GitHub + Chrome Web Store + Edge Add-ons ; nom de travail « Reddtastic Slideshow for Reddit », remis en cause par le ticket 01 (pas de « Reddit » dans le nom), tranché au ticket 07 ; repo `reddtastic-extension`, topics `reddit-extension`, `reddit`, `reddtastic`, `chrome-extension` ; anglais par défaut, français en second (README.fr.md, `_locales` en/fr) ; public, compte `HaniWanice`, licence MIT.
- Le propriétaire délègue les choix : suivre les recommandations de l'agent, mais les tickets HITL restent des échanges réels.
- Skills : `research` (tickets research), `grilling` + `domain-modeling` (grilling), `prototype` (README, visuels), `impeccable` (visuels du store).
- Tests : `node test/media.test.js && node test/favs.test.js && node test/reddit.test.js`.

## Decisions so far

- [Vérifier ce qui ne doit pas devenir public](tickets/05-audit-publication.md) : historique neuf (e-mail perso et favoris réels dans l'ancien), HANDOFF/PRODUCT hors repo, licence hls.js à ajouter.
- [Règles Chrome Web Store et Edge Add-ons pour cette extension](tickets/01-regles-stores.md) : icônes manquantes (bloquant), pas de « Reddit » dans le nom, boutons sur les pages adultes et de connexion à risque, politique de confidentialité obligatoire.
- [Comment les repos d'extensions populaires se rendent trouvables](tickets/02-decouvrabilite.md) : mots-clés dans nom/description/topics, fiche store complète, LICENSE + icône + i18n manquants.

## Not yet specified

- Plan de lancement : où et quand annoncer (r/chrome_extensions, r/SideProject, Show HN, Product Hunt…), dans quel ordre, avec quel texte. Dépend du nom final, des visuels et de la position sur le contenu NSFW.
- Process de release : numérotation des versions, zip automatique dans les Releases GitHub, mise à jour des stores.
- Maintenance après lancement : tri des issues, labels, réponse aux avis du store.

## Out of scope

- Port Firefox / Safari : la destination vise Chrome et Edge.
