# IP-Calculator

## Pré-Requis

[NodeJs](https://nodejs.org/en/) (Compatible Windows & Linux)

# Build

La section ci-dessous détaille les différentes étapes, l'application du build est dans [**Configuration**](#Configuration) et la version courte dans [**Build TL;DR**](#Build-TL;DR).

Pour déployer l'application, il est nécessaire de réaliser un build de production.
Cette version de production peut être générée avec ```npm run build``` cependant pour notre build final on va le décliner en 3 étapes:

  1. vérifier d'éventuels vulnérabilités dans le projet
  2. build l'application
  3. renommer le dossier _build_ généré en _subnet_ 

Renommer le dossier est facultatif mais dans le cas où le server héberge plusieurs applications, il sera plus compréhensible de lui attribuer un nom.

## Les différentes commandes

### Vulnérabilités
Pour vérifier si des vulnérabilités connues sont présentes, on utilise la commande [npm audit](https://docs.npmjs.com/cli/v7/commands/npm-audit) qui scannera les différents packages et affichera en sortie un rapport de sécurité.

Associé avec le paramètre _fix_, en plus de la recherche de vulnérabilités npm audit appliquera les différents correctifs associés.

Pour notre build nous utiliserons alors ```npm audit fix```.

**/!\ IMPORTANT**: il est possible que lors du _npm audit fix_ des vulnérabilités ne soient pas corrigées (il retournera alors une valeur différente de 0), donc faire un one-liner avec npm build n'est sans pas la meilleure option si des vulnérabilités connues sont toujours présentes.

### Build du projet

Pour construire le projet et obtenir une version de production de l'application, nous utiliserons ```npm run build```([documentation](https://create-react-app.dev/docs/available-scripts/#npm-run-build)) qui va créer un dossier nommé _build_ contenant notre application à déployer.

### Renommer le dossier de build

Cette étape est faculatative mais recommandée pour retrouver plus facilement l'application où elle sera mise.

Pour l'application IP Calculator, le nom de **subnet** a été choisi arbitrairement.

Commande powershell pour renommer un fichier
```powershell
Rename-Item <source> <destination>
```

Linux
```bash
mv <source> <destination>
```

Si le path actuel est le même que le folder _build_, alors on utilisera sur Linux ```mv build subnet```.

Note, si un dossier de ce son nom (i.e subnet) existe déjà dans ce path, alors la commande échouera. Nous verrons dans la section Configuration comment renommer directement le dossier build lors de la commande de build.

## Configuration

Les scripts présentés ci-dessous ne sont pas inclus dans le repo, ils sont à inclure en fonction du besoin et de l'OS utilisé.

Il est possible de rajouter des scripts dans le package.json pour effectuer ces différentes étapes (la commande _npm run build_ en faisant déjà partie).

Les commandes doivent être effectuée dans l'ordre, c'est à dire qu'on vérifie d'abord les vulnérabilités connues avec _npm audit_ puis ensuite le build avec _npm run build_.

### Variables d'environnements

En utilisant des variables d'environnement nous pouvons spécifier directement lors du build où rediriger le dossier de build et également le renommer.

Sur Linux nous pouvons utiliser un fichier .env pour définir la variable d'environnement ou l'inclure directement dans le script.
package.json
```diff
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
+   "build:subnet": "npm audit fix && BUILD_PATH='./subnet' react-scripts build",
    "test": "react-scripts test"
  },
```
Ainsi on peut effectuer le check de vulnérabilité, et build l'application dans un folder nommé 'subnet' avec la commande ```npm run build:subnet```.
Note: Cette option est disponnible depuis [react-scripts 4.0.2](https://github.com/facebook/create-react-app/blob/master/CHANGELOG.md#rocket-new-feature) donc pour une version antérieure il faudra utiliser un script comme
```bash
npm audit fix && npm run build && rm -rf subnet && mv ./build ./subnet
```

Sur windows Powershell
```powershell
($env:BUILD_PATH = "subnet") -and (npm audit fix) -and (npm run build)
```
La variable d'environnement sera disponnible le temps de la session.

### package.json homepage

Il est nécessaire de mentionner pour le build où l'application sera host (par défaut Create React App suppose que l'app sera host à la racine du server).
Donc il faut mentionner dans le package.json la clé _homepage_ avec comme valeur le path correspondant.

L'IP Calculator n'utilisant aucun système de route, mettre comme valeur ```"."``` à homepage est suffisant ([ref](https://create-react-app.dev/docs/deployment/#serving-the-same-build-from-different-paths)).
Dans le cas contraire, il aurait été nécessaire de préciser le chemin relatif (i.e: "homepage": "http://example.com/relativepath").


## **BUILD TL;DR**

Laisser le homepage à ".", effectuer l'une de ces commandes en fonction de l'OS sur le même path que le package.json du repo.

**Linux**
```
npm audit fix && npm run build && rm -rf subnet && mv ./build ./subnet
```

**PowerShell**
```
($env:BUILD_PATH = "subnet") -and (npm audit fix) -and (npm run build)
```

**/!\ IMPORTANT**: Il arrive parfois que _npm audit fix_ ne corrige pas des vulnérabilités qu'il a détecté (dans ce cas il retournera une valeur différente de 0), pour un build rigoureux il peut être envisageable de d'abord verifier le succès de l'audit fix avant de démarrer le build.

Récupérer le dossier subnet et le déployer sur le serveur choisi. La configuration du server devra faire en sorte qu'en fonction du chemin choisi pour host l'application, il redirige vers subnet/index.html.