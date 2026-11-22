# Déployer Alenia sur alwaysdata — compte `test-rvss`

> **URL :** <https://test-rvss.alwaysdata.net/alenia/>
> **Compte :** `test-rvss`, offre Free (1 Go de disque, 256 Mo de RAM)
> **Principe :** l'interface Angular est servie en statique par le site PHP
> existant, dans un sous-dossier `www/alenia/`. Aucun processus .NET, aucune
> base MySQL supplémentaire : la démo ne consomme presque rien.

## Ce qui est déployé

- Toutes les pages publiques de l'interface : accueil, services, à propos,
  missions, offres, inscription, FAQ, plan du site, etc.
- Les pages de connexion et d'inscription proposent un bloc **Démo : accès
  direct** avec deux profils (intérimaire et établissement). Le clic crée une
  session locale et ouvre le tableau de bord correspondant
  (`DemoSessionService`). Aucun compte à créer, aucune requête réseau.
- Le backend ASP.NET Core et la base MySQL ne sont **pas** déployés. Les appels
  API de l'interface échouent silencieusement (ou affichent une notification),
  et l'inscription réelle n'est pas disponible.

Cette démo est donc une démonstration d'interface, pas une démo fonctionnelle
de bout en bout. Pour une démo complète, il faudra un site .NET et une base
MySQL sur une offre payante, ou un environnement Docker.

## Construire

Depuis `AleniaUI/` :

```powershell
node deploy/build-demo.js
```

Le script :

1. lance le build Angular de production avec `--base-href /alenia/` ;
2. désactive le SSR et le prerender (inutiles pour un hébergement statique) ;
3. injecte `deploy/demo-session.html` dans `dist/alenia-ui/browser/index.html`
   (uniquement le drapeau `window.__ALENIA_DEMO__`, qui active le bloc démo) ;
4. copie `deploy/htaccess` en `.htaccess` (fallback SPA).

Sortie : `dist/alenia-ui/browser/`.

## Envoyer

La clé SSH du compte est `~/.ssh/id_ed25519_alwaysdata`. Pour éviter
d'accumuler les anciens fichiers JavaScript hashés lors des mises à jour :

```powershell
ssh -i $HOME\.ssh\id_ed25519_alwaysdata test-rvss@ssh-test-rvss.alwaysdata.net "rm -rf ~/www/alenia/*"
scp -i $HOME\.ssh\id_ed25519_alwaysdata -r .\dist\alenia-ui\browser\* test-rvss@ssh-test-rvss.alwaysdata.net:~/www/alenia/
scp -i $HOME\.ssh\id_ed25519_alwaysdata .\dist\alenia-ui\browser\.htaccess test-rvss@ssh-test-rvss.alwaysdata.net:~/www/alenia/.htaccess
ssh -i $HOME\.ssh\id_ed25519_alwaysdata test-rvss@ssh-test-rvss.alwaysdata.net "find ~/www/alenia -type d -exec chmod 755 {} +; find ~/www/alenia -type f -exec chmod 644 {} +"
```

Le lien `~/www/assets -> alenia/assets` reste valable après le nettoyage. Le
supprimer uniquement si un autre projet a besoin de `/assets/` à la racine.

Le dossier `~/www/alenia/` doit être lisible par Apache (`755`), sinon le site
renvoie une erreur 403.

## Assets à la racine

L'interface utilise des chemins absolus (`/assets/images/...`) dans plusieurs
composants. Un lien symbolique à la racine du site évite de modifier le code :

```bash
ln -sfn alenia/assets ~/www/assets
```

Il ne faut pas créer ce lien si un autre projet utilise déjà `/assets/` à la
racine du domaine.

## Mettre à jour

Relancer `node deploy/build-demo.js`, puis renvoyer le contenu. Le `.htaccess`
et le dossier `assets/` sont inclus dans le build.

## Page d'accueil

La page <https://test-rvss.alwaysdata.net/> est un fichier statique
`~/www/index.html` (sauvegarde : `index.html.bak-2026-11-22`). La carte Alenia
pointe simplement vers `/alenia/` ; les accès démo restent dans l'application,
pas sur la page commune aux projets.

## Dépannage

| Symptôme | Solution |
| --- | --- |
| 403 sur `/alenia/` | `chmod 755` sur les dossiers et `644` sur les fichiers |
| 404 sur `/alenia/dashboard-interimaire` | Le `.htaccess` n'est pas déployé ou `mod_rewrite` est désactivé |
| Page blanche | Vérifier que `index.html` contient bien le script `demo-session` et que `main-*.js` se charge |
| Images cassées | Le lien `~/www/assets -> alenia/assets` manque |
| Les tableaux de bord renvoient vers `/connexion` | Le drapeau `__ALENIA_DEMO__` n'est pas injecté, ou le token a expiré : utiliser le bloc **Démo : accès direct** de la page de connexion |
