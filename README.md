# PROJECT A - BACKEND

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

