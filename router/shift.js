const express = require('express');
const moment = require("moment");

module.exports = (models, keycloak) => {
    let router = express.Router();

    router.route("/")
    .get(keycloak.protect("realm:user"), (req, res) => {
        models.Shift.findAll({where: req.query})
        .then(shift => res.send(shift))
        .catch(err => res.status(500).send(err));
    })
    .post(keycloak.protect("realm:user"), (req, res) => {
        models.Shift.bulkCreate(req.body)
        .then(shift => res.send(shift))
        .catch(err => res.status(500).send(err));
    })
    .put(keycloak.protect("realm:user"), (req, res) => {
        models.Shift.update(req.body, {where: {id: req.body.id}})
        .then(() => {
            models.Shift.findByPk(req.body.id)
            .then(shift => res.send(shift))
            .catch(err => res.status(500).send(err));
        })
        .catch(err => res.status(500).send(err));
    })
    .delete(keycloak.protect("realm:user"), (req, res) => {
        models.Shift.destroy({where: {id: req.query.id}})
        .then(result => {
            if(result) res.sendStatus(204);
            else res.sendStatus(404);
        })
        .catch(err => res.status(500).send(err));
    });

    router.post("/window", keycloak.protect("realm:user_admin"), (req, res) => {
        let nb_shifts = Math.ceil(
            (((new Date(req.body.end_date) - new Date(req.body.start_date)) /
              (3600 * 1000)) *
              60) /
              req.body.shift_length
          );
          let start_date = new Date(req.body.start_date);
          let shift_array = [];
          for (let i = 0; i < nb_shifts; i++) {
            let new_start_date = moment(start_date)
              .add(req.body.shift_length * i, "m")
              .toDate();
            let new_end_date = moment(new_start_date)
              .add(req.body.shift_length, "m")
              .toDate();
            shift_array[i] = {
              start_date: new_start_date,
              end_date: new_end_date,
              charisma: req.body.charisma,
              shift_category_id: req.body.shift_category_id
            };
          }
          models.Shift.bulkCreate(shift_array)
          .then(shifts => res.send(shifts))
          .catch(err => res.status(500).send(err));
    });

    return router;
}