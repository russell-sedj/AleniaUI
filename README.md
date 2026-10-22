# Alenia UI — Angular 18

Interface web de la plateforme **Alenia**, une application de mise en relation entre établissements de santé et professionnels intérimaires. Le frontend consomme l'API ASP.NET Core du projet [`AleniaAPI`](https://github.com/russell-sedj/AleniaAPI).

![Aperçu de la page d'accueil](docs/alenia.png)

## Stack

- **Framework** : Angular 18 (standalone components)
- **Langage** : TypeScript
- **Styles** : Tailwind CSS
- **SSR** : Angular SSR (Express)
- **HTTP** : HttpClient + RxJS
- **Auth** : JWT, guards, interceptors

## Fonctionnalités

- Page d'accueil publique et inscription
- Authentification avec deux parcours : intérimaire et établissement
- Dashboards séparés intérimaire / établissement
- Gestion des missions : disponibles, passées, à venir
- Profil utilisateur multi-étapes
- Candidatures aux missions
- Messagerie et notifications
- Évaluations
- Certifications
- Guards spécialisés : `InterimaireGuard`, `EtablissementGuard`
- Routing avec lazy loading

## Configuration de l'API

L'URL de l'API est centralisée dans `src/environments/environment.ts` :

```ts
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7134/api',
};
```

Pour pointer vers une autre API, modifier `apiUrl`. Les services utilisent tous cette valeur.

## Lancer le projet

```bash
npm install
npm start
```

Le frontend tourne sur `http://localhost:4200`.

L'API `AleniaAPI` doit être lancée en parallèle sur `https://localhost:7134` (ou l'URL configurée dans `environment.ts`).

## Build

```bash
npm run build
```

La sortie est générée dans `dist/alenia-ui/browser`.

Pour lancer le rendu SSR :

```bash
npm run serve:ssr:alenia-ui
```

## Structure

```text
src/
  app/
    components/       # composants partagés (navbar, footer, etc.)
    pages/            # pages publiques et dashboards
    services/         # services HTTP (auth, missions, candidatures, etc.)
    guards/           # guards de rôles
    interceptors/     # ajout du token JWT
    models/           # modèles TypeScript
  environments/
    environment.ts    # URL de l'API
  styles.css
server.ts             # serveur Express pour le SSR
```

## Rôles

| Rôle | Parcours |
|---|---|
| `interimaire` | Dashboard intérimaire, missions, profil, candidatures |
| `etablissement` | Dashboard établissement, missions, candidatures |
| `admin` | Administration |

## Auteur

Russell Dossou-Yovo — [GitHub](https://github.com/russell-sedj)
