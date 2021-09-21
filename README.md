# PROJECT A - BACKEND

![](https://gitlab.com/24-heures-insa/overbookd/backend/badges/develop/pipeline.svg?key_text=develop+pipeleine&key_width=105)
![](https://gitlab.com/24-heures-insa/overbookd/backend/badges/pre-prod/pipeline.svg?key_text=pre-prod+pipeleine&key_width=110)
![](https://gitlab.com/24-heures-insa/overbookd/backend/badges/master/pipeline.svg?key_text=master+pipeleine&key_width=100)

La refonte d'Assomaker est un projet qui depuis quelques années est dans les discussions. 
Le logiciel devient vieux et les technologies utilisées associé au manque de documentation
rends la maintenance et l'exploitation assez difficile. L'objectif de ce projet est, en 
plus de reproduire les fonctions essentielles d'Assomaker, de mettre au goût du jour les
technologies utilisées.

L'objectif principal s'accompagne d'un ajout d'une partie logistique permettant une gestion du matériel.
Une nouvelle interface au _workflow_ plus intuitif permettra aux utilisateurs de pouvoir très rapidement
créer, afficher ou affecter.

### Technologies
Les langages web actuels (en 2019) sont principalement Javascript, Python ou Java. Le choix de Javascript a été
motivé par le fait d'avoir le _front-end_ et le _back-end_ dans le même langage, étant assez facilement compréhensible
pour quiconque ait un minimum de compétence en programmation web.
Les technologies utilisées sont pour l'API :
+ _Express_ : ce framework web permet de structurer le serveur web, en permettant de créer des requêtes très facilement, 
tout en étant très efficace.
+ _Sequelize_ : cet ORM (_Object-Relationnal Manager_) permet d'avoir une surcouche gérant les intéractions avec la base de données.
Il permet aussi de rendre le code plus facilement lisible, et donc plus facilement maintenable. De plus, si jamais on doit changer
 de moteur de base de données, le changement se fait de façon transparente.
+ _Keycloack_ : serveur d'authentification qui gere les tokens des utilidateur.
+ _MySQL_ : base de donnée


### Installer et lancer le Projet A - Backend

#### Docker 🐳
La manière la plus simple pour lancer le backend est d'installer [docker](https://docs.docker.com/get-docker/) et remplir le fichier example.env avec vos propres varible d'environement.
une fois example.env rempli, il faut le renomme en .env.
apres vous aurez bersoin de run la commande `sudo npm run setup` et puis lance la commande:
`docker-compose up -d` pour lancer les conteneurs 

### Script utile
    >   npm run repopulate 
supprime puis repeuple la base de donnée

    >   npm run populate 
peuple la base de donnée.

    >   npm run depopulate 
supprime tous les donnêes de la base de donnêe.

    >   sudo npm run setup
pour que le contenaire keycloak marche bien vous aurez besoin d'ajouter `127.0.0.1 keycloak` pour indique a votre machine 
que le serveur keycloak se trouve en local

    >   npm create_admin
cree un utilisateur `user_admin` avec le mot de passe `user_admin` et les permissions d'admin.

    >   npm test 
lance une serie de test unitaire avec `newman`


#### API
Avant de lancer l'api il faut que vous  installiez sur votre machine :
- Server MySQL 
- Keycloack

Pour installer l'API :
`npm install`.

Pour créer la base de données :
`sudo npm run create_database`.
Si on ne lance pas le script avec `sudo` ou avec root, on ne peut pas se connecter à MySQL en root.

Pour lancer l'API :
`npm start index.js` ou `nodemon index.js`.
Au niveau du serveur à distance, on utilise [pm2](https://pm2.keymetrics.io/) qui est un gestionnaire de processus 
permettant de facilement les gérer ainsi que d'ajouter du load-balancing. 
On y ajoute le plugin [pm2-logrotate](https://www.npmjs.com/package/pm2-logrotate) pour limiter la taille des fichiers de log.
Pour utiliser pm2 : `pm2 start index.js`.

