---
type: task
mode: AFK
status: closed
assignee: claude (HaniWanice)
blocked_by: []
---
# Vérifier ce qui ne doit pas devenir public

## Question

Que contiennent les fichiers et l'historique git qui ne doit pas être publié (HANDOFF.md, PRODUCT.md, `.claude/`, données perso, chemins locaux, e-mails dans les commits) ? Décider : nettoyer, réécrire l'historique, ou repartir d'un historique neuf.

## Résolution

Constats (12 commits, tous les fichiers suivis, toutes branches) :
- Tous les commits portent l'e-mail perso de l'auteur : il serait public.
- Les anciennes versions de `HANDOFF.md` citent des favoris réels du propriétaire, donc ses goûts de navigation.
- `HANDOFF.md` et `PRODUCT.md` sont des notes internes de session (« un seul utilisateur… Edge Windows 1920×1080 ») : inutiles au public.
- `.claude/` est déjà ignoré. Aucun chemin local, mot de passe, jeton ni clé dans le code ou l'historique. Les tests n'utilisent que des noms neutres (`r/photo`, `u/Bob`).
- `vendor/hls.min.js` (Apache-2.0) est publié sans copie de sa licence : obligation de redistribution.

Décision : **repartir d'un historique neuf**.
- Historique actuel conservé localement sur une branche `archive/prive`, jamais poussée (réversible).
- Branche `main` orpheline, un commit « Initial public release », avec l'e-mail noreply GitHub (`<id>+HaniWanice@users.noreply.github.com`, id via `gh api user`), et `git config user.email` réglé pareil dans ce repo.
- `HANDOFF.md` et `PRODUCT.md` retirés du suivi et ajoutés à `.gitignore` (restent sur disque pour les sessions).
- Ajouter `vendor/LICENSE-hls.js` (texte Apache-2.0 de hls.js 1.7.3).
- `docs/wayfinder/` peut être publié ; supprimé après migration vers les issues.

Exécution : dans le ticket « Créer le repo GitHub public et y migrer la carte », avant le premier push.
