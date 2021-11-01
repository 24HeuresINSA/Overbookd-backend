import TransactionModel, {DepositMock, ExpenseMock, ITransaction, TransferMock,} from "@entities/transaction";
import UserModel, {IUser, UserMock} from "@entities/User";
import * as db from "../../db";
import qs from "qs";
import app from "@server";
import supertest from "supertest";

// Mock keycloak protect implementation before the keycloak middleware gets loaded in express

const mockProtect = jest.fn((req, res, next) => next());
// keycloak.protect = () => mockProtect;

const mockEnforcer = jest.fn();
// keycloak.enforcer = () => mockEnforcer;

const data: { transactions: ITransaction[]; users: IUser[] } = {
  transactions: [],
  users: [],
};

// Utils

const ExpectRouteToBeProtected = () => {
  return expect(mockProtect.mock.calls.length).toBe(1);
};

const ExpectRouteToBeEnforced = () => {
  return expect(mockEnforcer.mock.calls.length).toBe(1);
};

// Hooks

beforeAll(async () => {
  await db.connect();
});

afterEach(async () => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await db.closeDatabase();
});

// Tests

describe("transaction", () => {
  beforeAll(async () => {
    // Create 4 users
    data.users = UserMock.buildList(4);
    data.transactions = [];

    // user 1 adds 40
    data.transactions.push(
      DepositMock.build({to: data.users[0]._id, amount: 40})
    );
    // user 2 adds 100
    data.transactions.push(
      DepositMock.build({to: data.users[1]._id, amount: 100})
    );
    // user 3 adds 20
    data.transactions.push(
      DepositMock.build({to: data.users[2]._id, amount: 20})
    );

    //user 3 uses 20
    data.transactions.push(
      ExpenseMock.build({from: data.users[2]._id, amount: 20})
    );

    // user 1 gives 10 to user 2
    data.transactions.push(
      TransferMock.build({
        from: data.users[0]._id,
        to: data.users[1]._id,
        amount: 10,
      })
    );

    // user 1 use 10
    data.transactions.push(
      ExpenseMock.build({from: data.users[0]._id, amount: 10})
    );

    // user 2 gives 20 to user 3
    data.transactions.push(
      TransferMock.build({
        from: data.users[1]._id,
        to: data.users[2]._id,
        amount: 10,
      })
    );

    // balances : 20 90 20 0

    // Push these to the database
    await UserModel.create(data.users);
    await TransactionModel.create(data.transactions);
  });

  afterAll(async () => {
    await db.clearDatabase();
  });

  describe("routes /transaction", () => {
    describe("GET", () => {
      it("/ returns all transactions", async () => {
        const res = await supertest(app).get("/api/transaction/");
        expect(res.status).toBe(200);
        ExpectRouteToBeProtected();

        expect(res.body).toHaveLength(7);
      });
      it("/sg returns all sg transactions", async () => {
        const res = await supertest(app).get("/api/transaction/sg");
        expect(res.status).toBe(200);
        ExpectRouteToBeProtected();

        expect(res.body).toHaveLength(5);
        // There should be only expenses and deposit
        res.body.forEach((t: any) => {
          expect(t.type).toMatch(/(expense|deposit)/);
        });
      });
      it("/user picks the id and returns all user's transactions", async () => {
        // Update keycloak mock to provide correct username
        const username = `${data.users[1].firstname}.${data.users[1].lastname}`;

        mockEnforcer.mockImplementation((req, res, next) => {
          const kauth = qs.parse(
            `grant[access_token][content][preferred_username]=${username}`
          );
          req.kauth = kauth;
          next();
        });

        const res = await supertest(app).get("/api/transaction/user");
        expect(res.status).toBe(200);
        ExpectRouteToBeEnforced();

        expect(res.body).toHaveLength(3);
        expect(res.body[0]).toMatchObject(data.transactions[1]);
        expect(res.body[1]).toMatchObject(data.transactions[4]);
        expect(res.body[2]).toMatchObject(data.transactions[6]);
      });
      it("/user/:id returns all user's transactions", async () => {
        const res = await supertest(app).get(
          `/api/transaction/user/${data.users[2]._id}`
        );
        expect(res.status).toBe(200);
        ExpectRouteToBeProtected();

        expect(res.body).toHaveLength(3);
        expect(res.body[0]).toMatchObject(data.transactions[2]);
        expect(res.body[1]).toMatchObject(data.transactions[3]);
        expect(res.body[2]).toMatchObject(data.transactions[6]);
      });
    });
    describe("POST", () => {
      it("/sg creates an array of valid transactions", async () => {
        // data to push
        const transactions = [
          TransferMock.build({
            from: data.users[1]._id,
            to: data.users[2]._id,
            amount: 20,
          }),
          DepositMock.build({
            to: data.users[3]._id,
            amount: 20,
          }),
          ExpenseMock.build({
            from: data.users[2]._id,
            amount: 10,
          }),
        ];

        const res = await supertest(app)
          .post("/api/transaction/sg")
          .send(transactions);

        ExpectRouteToBeProtected();

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(3);
        for (const i of res.body.keys()) {
          expect(res.body[i]).toMatchObject(transactions[i]);
        }
      });
      describe("PUT", () => {
        //TODO
      });
      describe("DELETE", () => {
        //TODO
      });
    });
  });
});
