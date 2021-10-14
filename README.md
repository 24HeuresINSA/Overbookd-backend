# Overbookd - BACKEND

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

- _Express_ : ce framework web permet de structurer le serveur web, en permettant de créer des requêtes très facilement,
  tout en étant très efficace.
- _Mongoose_ : ce package permet de gérer les intéractions avec la base de données.
- _MongoDB_ : Base de donnée NoSQL

### Installer et lancer Oberbookd - Backend

Les instructions pour lancer et faire tourner Overbookd sont maintenant centralisées dans le repository [Management](https://gitlab.com/24-heures-insa/overbookd/management/)

### Lancer les tests

`npm i`
`npm run test` ou `npm run test:coverage`

### Git flow 

**There is 3 main branches in this repo**

 - master: Hosting production deployment
 - pre-prod: Hosting pre-production deployment
 - develop: Hosting under development version of Overbookd

**When contributing to the codebase you have to:**

 - Open an issue
 - Branch from develop with the issue ID in the name (ex: 24-fix-random-bugs)
 - Create a merge request from this branch to develop

This leverage consistency and relaibility through the whole process.