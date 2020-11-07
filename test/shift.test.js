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


describe("test the /shift endpoint", () => {

    it("gets all the shift", (done) => {
        chai.request(app)
            .get("/shift")
            .end((err, res) => {
                res.should.have.status(200);
                expect(res).to.be.json;
                let shifts = res.body.shifts
                expect(shifts).to.be.an('array');
                expect(shifts.length).to.be.equal(3);
                done();

            })
    });


    it("gets shift by id", (done) => {
        chai.request(app)
            .get("/shift/id/1")
            .end((err, res) => {
                res.should.have.status(200);
                expect(res).to.be.json;
                let shift = res.body.shift
                expect(shift.charisma).to.be.equal(15);
                done();

            })
    });


    it("adds shift", (done) => {
        chai.request(app)
            .post("/shift")
            .send({
                start_date: "2019-05-19 10:00:00",
                end_date: "2019-05-19 12:00:00",
                charisma: 15,
                shift_category_d: 1,
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res).to.be.json;
                let shift = res.body.shift
                expect(shift.charisma).to.be.equal(15);
                id = shift.id;
                done();

            })
    });


    //TODO :: shift window test

    // it("adds shift window", (done) => {
    //     chai.request(app)
    //         .post("/shift/window")
    //         .send({
    //             start_date: "2019-05-19 10:00:00",
    //             end_date: "2019-05-19 12:00:00",
    //             charisma: 15,
    //             shift_category_d: 1,
    //             shift_length: 60,
    //         })
    //         .end((err, res) => {
    //             res.should.have.status(200);
    //             expect(res).to.be.json;
    //             let shift = res.body.shift
    //             expect(shift.charisma).to.be.equal(15);
    //             id = shift.id;
    //             done();
    //
    //         })
    // });


    it("updates a shift according to its id.", (done) => {
        chai.request(app)
            .put(`/shift/${id}`)
            .send({
                start_date: "2019-05-19 10:00:00",
                end_date: "2019-05-19 12:00:00",
                charisma: 30,
                shift_category_d: 1,
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res).to.be.json;
                let shift = res.body.shift
                expect(shift.charisma).to.be.equal(30);
                id = shift.id;
                done();
            });
    })


    it("delete shift", (done) => {
        chai.request(app)
            .delete(`/shift/${id}`)

            .end((err, res) => {
                res.should.have.status(200);
                expect(res).to.be.json;
                result = res.body.result
                expect(result).to.be.equal(result, "something went terribly wrong, you will need to delete notification manually");
                done();
            });
    });
})


