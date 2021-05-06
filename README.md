# IP-Calculator

## Pré-Requis

[NodeJs](https://nodejs.org/en/) (Compatible Windows & Linux)

# Build

L'application IP Calculator a été réalisé en React qui permet d'utiliser des commandes npm.
Le build de l'application sera donc réalisé avec les outils proposés:

1. executer ```npm install``` à la racine du repo pour installer les différentes dépendances nécessaires au fonctionnement de l'app

2. ```npm audit fix``` afin de rechercher des vulnérabilités connues à travers les différents packages et appliquer les correctifs nécessaire (la commande retourne une valeur différente de 0 si des correctifs n'ont pas pu être effectués)

3. ```npm run build``` execute le script prévu dans le package.json pour créer un dossier _build_ contenant l'application de production.

Utiliser la commande ```npm run audit:build``` permet d'exécuter ces trois commandes dans l'ordre.

L'IP Calculator n'utilisant aucun système de route, mettre comme valeur ```"."``` à homepage est suffisant pour que tout les chemins soient relatifs à la position de l'index.html ([ref](https://create-react-app.dev/docs/deployment/#serving-the-same-build-from-different-paths)).
Dans le cas contraire, il aurait été nécessaire de préciser le chemin relatif (i.e: "homepage": "http://example.com/relativepath").

Récupérer le dossier build et le déployer sur le serveur choisi. La configuration du server devra faire en sorte qu'en fonction du chemin choisi pour host l'application, il redirige vers build/index.html.
