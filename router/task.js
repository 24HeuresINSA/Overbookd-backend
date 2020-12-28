const express = require('express');
const {keycloak, models} = require("../app")

let taskRouter = express.Router();

taskRouter.route("/")
    .get(keycloak.protect("realm:user"), (req, res) => {
        models.Task.findAll({where: req.query})
            .then(task => res.send(task))
            .catch(err => res.status(500).send(err));
    })
    .post(keycloak.protect("realm:user_modifier"), (req, res) => {
        models.Task.create(req.body)
            .then(task => res.status(201).send(task))
            .catch(err => res.status(500).send(err));
    })
    .put(keycloak.protect("realm:user_modifier"), (req, res) => {
        models.Task.update(req.body, {where: {id: req.body.id}})
            .then(() => {
                models.Task.findByPk(req.body.id)
                    .then(task => res.status(202).send(task))
                    .catch(err => res.status(500).send(err));
            })
            .catch(err => res.status(500).send(err));
    })
    .delete(keycloak.protect("realm:user_modifier"), (req, res) => {
        models.Task.destroy({where: {id: req.query.id}})
            .then(result => {
                if (result) res.sendStatus(204);
                else res.sendStatus(404);
            })
            .catch(err => res.status(500).send(err));
    });

taskRouter.get("/require_user", keycloak.protect("realm:user"), (req, res) => {
    models.User_Requirement.findAll({where: {user_id: req.query.user_id}})
        .then(requirements => {
            let task_ids = [];
            requirements.forEach(requirement => {
                task_ids.push(requirement.task_id);
            });
            models.Task.findAll({where: {id: task_ids}})
                .then(tasks => res.send(tasks))
                .catch(err => res.status(500).send(err));
        })
        .catch(err => res.status(500).send(err));
});

taskRouter.get("/require_team", keycloak.protect("realm:user"), (req, res) => {
    models.User_Requirement.findAll({where: {user_id: req.query.team_id}})
        .then(requirements => {
            let task_ids = [];
            requirements.forEach(requirement => {
                task_ids.push(requirement.task_id);
            });
            models.Task.findAll({where: {id: task_ids}})
                .then(tasks => res.send(tasks))
                .catch(err => res.status(500).send(err));
        })
        .catch(err => res.status(500).send(err));
});

module.exports = taskRouter;
