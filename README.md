# La Boîte à concours

Application web installable (PWA) qui regroupe les préparations aux concours de la fonction publique créées par G. FUMONT · FMT Collaboration.

- `index.html` : accueil, compte unique, choix des concours et état de chaque préparation (partie gratuite, abonnement).
- `aae/` : Prépa Attaché AAE 2027 (collections Firestore sans préfixe : `comptes`, `abonnes`, `contenu`, `config/cle`, `config/paiement`).
- `sa-paris/` : Prépa SA Ville de Paris 2027 (préfixe `sa_`).
- `sacn/` : Prépa SA interministériel 2027 (préfixe `sacn_`).
- `adjoint/` : Prépa Adjoint administratif 2027, externe et interne (préfixe `adj_` ; clé des contenus ajoutés `config/boite_admin` ; la veille est celle de `sacn/veille/`, fiches lues avec `config/adj_cle`).
- `<préparation>/veille/` : synthèses quotidiennes d'actualité, fiches chiffrées avec la clé `config/<préfixe>cle`.
- `manifest.webmanifest`, `sw.js`, `icons/` : installation et fonctionnement hors ligne, communs à toutes les préparations.
- `cgv.html`, `mentions-legales.html`, `confidentialite.html` : pages légales communes.
- `outils/chiffrer-fiches.js` : chiffrement des fiches de veille.
- `firestore.rules` : règles Firestore communes.

Pas d'essai gratuit : chaque préparation a une partie gratuite ouverte à tous (dont une fiche de veille offerte chaque lundi, champ `fiche_libre`) et ses propres formules Stripe : mensuel (14,90 €, 9,90 € pour l'adjoint administratif) ou Pass session (99 €, 69 € pour l'adjoint administratif). Le webhook Stripe (projet Vercel `prepa-aae-paiement`) active le bon concours grâce au préfixe de `client_reference_id` (`sa_`, `sacn_`, `adj_`, aucun pour l'AAE).
