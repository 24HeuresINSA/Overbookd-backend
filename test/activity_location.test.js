const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiJson = require('chai-json');
const app = require('../index');

// Configure chai
chai.use(chaiHttp);
chai.use(chaiJson);
chai.should();
const expect = chai.expect;


describe("test the /activity end point", () => {

    let location = {
        "location_ids": [1]
    }

    it("return all activities", (done) => {
        chai.request(app)
            .get("/activity/all_locations")
            .end((err, res) => {
                res.should.have.status(200);
                // res.text.should.be.equal(`{"response":[{"id":1,"name":"Ramener le fromage à la maison","description":"on a acheté bcp bcp (bcp) de fromage et on doit le stocker dans le frigos","start_date":"2019-05-11T10:00:00.000Z","end_date":"2019-05-11T16:00:00.000Z","contractor_name":null,"contractor_phone":null,"contractor_mail":null,"contractor_comment":null,"contractor_present_on_event":null,"createdAt":"2020-10-20T21:16:48.000Z","updatedAt":"2020-10-20T21:16:48.000Z","supervisor_id":2,"event_id":1,"locations":[]},{"id":2,"name":"Ranger le QG orga","description":"la manif est fini c'était bien rigolo mais maintenant au boulot on range tout","start_date":"2019-05-19T18:00:00.000Z","end_date":"2019-05-20T16:00:00.000Z","contractor_name":null,"contractor_phone":null,"contractor_mail":null,"contractor_comment":null,"contractor_present_on_event":null,"createdAt":"2020-10-20T21:16:48.000Z","updatedAt":"2020-10-20T21:16:48.000Z","supervisor_id":3,"event_id":1,"locations":[]}]}`)
                
                expect(res).to.be.json;
                res.body.should.be.a('Object');
                res.body.should.have.property('response');
                done();
                
            })
    });

    it("Add location 1 to activity 1", (done) => {
        chai.request(app)
            .post('/activity/location/1')
            .send({
                "location_ids": [1]
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res).to.be.json;
                res.body.should.be.a('Object');
                res.body.should.have.property('locations');
                expect(res.body.locations[0].activityId).to.be.equal(1);
                expect(res.body.locations[0].locationId).to.be.equal(1);

                done();
            });
    })

    location.location_ids = [2]

    it("update location 1 to activity 1", (done) => {
        chai.request(app)
            .put('/activity/location/1')
            .send(location)
            .end((err, res) => {
                res.should.have.status(200);
                expect(res).to.be.json;
                res.body.should.be.a('Object');
                res.body.should.have.property('locations');
                expect(res.body.locations[0].activity_location.activityId).to.be.equal(1);
                expect(res.body.locations[0].activity_location.locationId).to.be.equal(2);

                done();
            });
    })

    it("delete location 1 to acivity 1", (done) => {
        chai.request(app)
            .delete('/activity/location/1')
            .send(location)
            .end((err, res) => {
                res.should.have.status(200);
                expect(res).to.be.json;
                res.body.should.be.a('Object');
                res.body.result.should.be.empty; // if this fails you need to remove from the activity_location the 1 to 1 connection

                done();
            })
    })  
})

