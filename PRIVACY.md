# Privacy Policy

_Last updated: October 11, 2026_

The Reddtastic slideshow extension has no server of its own. It does not collect, sell or share personal data, and it contains no analytics, tracking or ads.

## What the extension stores

All of this stays on your device or in your own browser account:

- **Settings**: slide duration, volume and display options, in `chrome.storage.local`.
- **Favorites**: the pages you save (a subreddit or user path, its sort order, your collections, and a daily preview image link), kept in three places:
  - `chrome.storage.local`, on your device;
  - `chrome.storage.sync`, which your browser syncs to your own Google or Microsoft account only if you have turned browser sync on;
  - first-party cookies `rdp_favs0` to `rdp_favs7` on reddtastic.com, used as a backup copy.

## What is sent over the network

- **Reddtastic**: the extension loads posts from reddtastic.com's own API, on the reddtastic.com page you are viewing. Like any cookie set on reddtastic.com, the `rdp_favs*` cookies are sent to reddtastic.com with your requests to that site.
- **Reddit media**: images and videos load from Reddit's media servers (`i.redd.it`, `v.redd.it`) when you view them.
- **reddit.com pages**: the buttons on reddit.com only read the address of the current page to open the same page on reddtastic.com. Nothing is sent anywhere.

The extension does not send your data to its developer or to any other third party.

## Permissions

- `storage`: saves your settings and favorites.
- Access to `reddtastic.com` and `reddit.com`: shows the slideshow and the favorites dashboard on reddtastic.com, and adds the buttons on reddit.com.

## Deleting your data

Uninstall the extension to remove its local and synced storage. To remove the backup copy, delete the cookies for reddtastic.com in your browser settings.

## Not affiliated

This is an unofficial extension. It is not affiliated with Reddit, Inc. or with reddtastic.com.

## Contact

Ask questions or report a problem in [GitHub Issues](https://github.com/HaniWanice/reddtastic-extension/issues).

---

# Politique de confidentialité (français)

_Dernière mise à jour : 11 octobre 2026_

L'extension n'a aucun serveur. Elle ne collecte, ne vend et ne partage aucune donnée personnelle, et ne contient ni statistiques, ni pistage, ni publicité.

- **Stocké** : les réglages, dans `chrome.storage.local`. Les favoris (pages, tri, collections, lien de l'aperçu du jour), dans `chrome.storage.local`, dans `chrome.storage.sync` (votre propre compte de navigateur, seulement si la synchronisation est activée) et dans les cookies `rdp_favs0` à `rdp_favs7` de reddtastic.com, qui servent de copie de secours.
- **Envoyé** : les publications sont lues depuis l'API de reddtastic.com, le site affiché. Les cookies `rdp_favs*` sont transmis à reddtastic.com comme tout cookie de ce site. Les médias viennent de `i.redd.it` et `v.redd.it`. Sur reddit.com, les boutons lisent seulement l'adresse de la page.
- **Rien n'est envoyé** au développeur ni à un tiers.
- **Supprimer** : désinstaller l'extension, puis effacer les cookies de reddtastic.com.
- Extension non officielle, sans lien avec Reddit, Inc. ni avec reddtastic.com.
- Contact : [issues GitHub](https://github.com/HaniWanice/reddtastic-extension/issues).
