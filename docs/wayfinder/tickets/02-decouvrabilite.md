---
type: research
mode: AFK
status: closed
assignee:
blocked_by: []
---
# Comment les repos d'extensions populaires se rendent trouvables

## Question

Quelles pratiques des repos d'extensions navigateur très étoilés (README, badges, GIF de démo, topics, social preview, description, fichiers communautaires, releases) et des fiches store les mieux classées font qu'on les trouve sur GitHub, Google et la recherche du store pour des requêtes comme « reddit extension » ou « reddtastic extension » ? Sortie : une liste priorisée de pratiques applicables ici.

## Résolution

Détail : `docs/research/decouvrabilite.md` .

- La recherche GitHub ne lit que nom, description et topics (pas le README) : « reddit », « slideshow », « extension », « reddtastic » doivent y figurer. ~13 topics proposés.
- Store Chrome : classement par notes, installations nettes, fiche complète ; mot-clé répété plus de 5 fois = spam. Visuels : icône 128, 1–5 captures 1280×800, tuile 440×280 obligatoire.
- Edge : 7 termes de recherche cachés ; description 250–10 000 caractères ; manifest non localisé = une seule langue.
- Manques P0 : LICENSE, remote, manifest et README en français seulement, pas d'icône dans le manifest.
- Mention « non affilié à Reddit, Inc. ni à reddtastic.com » nécessaire. Règle « X for Reddit » non confirmée par source primaire (à recouper avec le ticket 01).
- Plan de README type fourni (logo, badges, GIF, Install, Features, Shortcuts, Privacy, Contributing).
