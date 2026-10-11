# Wayfinder (tracker local)

Tracker markdown local, en attendant le repo GitHub (voir ticket 03). Migré ensuite vers les issues GitHub.

- Carte : `map.md` (label `wayfinder:map`).
- Tickets : `tickets/NN-slug.md`. Front-matter : `type` (research | prototype | grilling | task), `mode` (AFK | HITL), `status` (open | closed), `assignee` (vide = libre), `blocked_by` (numéros).
- Frontière : tickets `open`, sans `assignee`, dont tous les `blocked_by` sont `closed`.
- Résolution : section `## Résolution` ajoutée au ticket, `status: closed`, une ligne dans « Decisions so far » de la carte.
