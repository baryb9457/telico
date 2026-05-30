# TELICO FROID GUINÉE

Site vitrine de **Société Telico Froid de Guinée** conçu pour informer les visiteurs, présenter les services et faciliter les demandes de devis.

## Objectif du projet

Ce projet a été créé pour offrir une présentation claire de l’activité de l’entreprise :

- climatisation (installation, dépannage, maintenance) ;
- isolation thermique ;
- fabrication de gaines de ventilation ;
- publication d’actualités/chantiers ;
- prise de contact rapide depuis le site.

## Fonctionnalités principales

- Page publique moderne et responsive
- Sections : accueil, services, avantages, activités, témoignages, contact
- Formulaire de demande de devis
- Blog/actualités alimenté via Supabase
- Espace d’administration (`/admin`) pour la gestion interne

## Stack technique

- React + TypeScript
- Vite
- Tailwind CSS
- Supabase

## Lancer le projet en local

```bash
npm install
npm run dev
```

Le site est ensuite disponible sur l’URL locale affichée par Vite.

## Scripts utiles

- `npm run dev` : démarrage en développement
- `npm run build` : build de production
- `npm run preview` : prévisualisation du build
- `npm run lint` : vérification ESLint
- `npm run typecheck` : vérification TypeScript

## Déploiement

Le projet est configuré pour un déploiement Netlify (`netlify.toml`).

## Structure rapide

- `src/components` : composants de la partie publique
- `src/admin` : interface d’administration
- `src/lib` : configuration / accès données (Supabase)
- `supabase` : éléments liés à la base Supabase

## Contact entreprise

- Téléphone : +224 613 51 76 53 / +224 662 73 20 38
- Email : telicofroid.sarlu@gmail.com
- Adresse : Sonfonia T7, Conakry, Guinée
