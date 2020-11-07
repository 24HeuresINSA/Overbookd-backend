const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiJson = require('chai-json');
const app = require('../index');

// Configure chai
chai.use(chaiHttp);
chai.use(chaiJson);
chai.should();
const expect = chai.expect;

let id = 1;


describe("test the /notification endpoint", () => {

    it("gets all the notifications", (done) => {
        chai.request(app)
            .get("/notification")
            .end((err, res) => {
                res.should.have.status(200);
                expect(res).to.be.json;
                notifications = res.body.notification
                expect(notifications).to.be.an('array');
                expect(notifications.length).to.be.equal(3);
                done();

            })
    });


    it("gets notification by id", (done) => {
        chai.request(app)
            .get("/notification/id/1")
            .end((err, res) => {
                res.should.have.status(200);
                expect(res).to.be.json;
                let notifications = res.body.notification
                expect(notifications.user_id).to.be.equal(3);
                done();

            })
    });


    it("gets notification by user_id", (done) => {
        chai.request(app)
            .get("/notification/user/2")
            .end((err, res) => {
                res.should.have.status(200);
                expect(res).to.be.json;
                let notifications = res.body.notifications[0];
                expect(notifications.user_id).to.be.equal(2);
                expect(notifications.id).to.be.equal(2);

                done();

            })
    });


    it("gets all the unread notifications for a given user", (done) => {
        chai.request(app)
            .get("/notification/unread/user/2")
            .end((err, res) => {
                res.should.have.status(200);
                expect(res).to.be.json;
                let notifications = res.body.notifications[0];
                expect(notifications.user_id).to.be.equal(2);
                expect(notifications.id).to.be.equal(2);

                done();

            })
    });

    it("gets all the notifications for a given team", (done) => {
        chai.request(app)
            .get("/notification/team/1")
            .end((err, res) => {
                res.should.have.status(200);
                expect(res).to.be.json;
                let notifications = res.body.notifications[0];
                expect(notifications.id).to.be.equal(3);

                done();

            })
    });


    it("adds notifications", (done) => {

        chai.request(app)
            .post("/notification")
            .send({
                content: "unittest notification",
                user_id: 1,
                team_id: 1,
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res).to.be.json;
                let notification = res.body.notification
                expect(notification.user_id).to.be.equal(1);
                expect(notification.team_id).to.be.equal(1);
                id = notification.id;
                done();

            })
    });


    it("updates a notification according to its id.", (done) => {
        chai.request(app)
            .put(`/notification/${id}`)
            .send({
                content: "unittest notification",
                user_id: 1,
                team_id: 2,

            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res).to.be.json;
                let notification = res.body.notification
                expect(notification.user_id).to.be.equal(1);
                expect(notification.team_id).to.be.equal(2);
                id = notification.id;
                done();
            })
    });


    it("change the status of a notification to read", (done) => {
        chai.request(app)
            .put(`/notification/read/${id}`)
            .end((err, res) => {
                res.should.have.status(200);
                expect(res).to.be.json;
                let notification = res.body.notification
                expect(notification.status).to.be.equal("read");
                done();
            })
    });

    it("change the status of a notification to unread", (done) => {
        chai.request(app)
            .put(`/notification/unread/${id}`)
            .end((err, res) => {
                res.should.have.status(200);
                expect(res).to.be.json;
                let notification = res.body.notification
                expect(notification.status).to.be.equal("unread");
                done();
            })
    });


    it("delete notification", (done) => {
        chai.request(app)
            .delete(`/notification/${id}`)

            .end((err, res) => {
                res.should.have.status(200);
                expect(res).to.be.json;
                result = res.body.result
                expect(result).to.be.equal(result, "something went terrebly wrong, you will need to delete notification manually");
                done();
            });
    })

})

