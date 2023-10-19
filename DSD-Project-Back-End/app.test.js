const mockingoose = require("mockingoose");
const userModel = require("./models/users");
const formModel = require("./models/form");
const answerModel = require("./models/answer");
const userServices = require("./src/Users/userServices");
const formsServices = require("./src/Forms/formServices");
const supervisorServices = require("./src/Supervisor/supervisorServices");

describe("userServices", () => {
    it("Good credentials should yield to login", async () => {
        mockingoose(userModel).toReturn(
            {
                studyId: 3147606,
                password:
                    "$2b$10$Y/J0xLLsF4GxAhAN.LnA9O/iS0LhalWIDHKKPT/bhWa8M8Lbn9zse",
            },
            "findOne"
        );
        const results = await userServices.login(3147606, "G30kV5R76hc=");
        expect(results.code).toBe(200);
    });

    it("Bad credentials should yield to Error", async () => {
        mockingoose(userModel).toReturn(
            {
                studyId: 3147606,
                password: "bad",
            },
            "findOne"
        );
        const results = await userServices
            .login(3147606, "G30kV5R76hc=")
            .catch((err) => {
                expect(err.code).toBe(401);
            });
    });
  
      it('Should add new user successfully', async () => {
        const user = await userServices.add(3147650, 'flawless');
        expect(user.studyId).toBe(3147650);
    });

    it("should find one daily form and one weekly form", async () => {
        mockingoose(answerModel).toReturn(
            [
                { user_id: 3147606, form_id: "fid_007" },
                { user_id: 3147606, form_id: "fid_005" },
            ],
            "find"
        );

        mockingoose(formModel).toReturn(
            [
                { frequency: "daily", name: "fid_007" },
                { frequency: "weekly", name: "fid_005" },
            ],
            "find"
        );

        const results = await userServices.getNumberForms(3147606);
        expect(results.daily).toBe(1);
        expect(results.weekly).toBe(1);
    });
});

describe("formServices", () => {
    it("should find form by id", async () => {
        mockingoose(formModel).toReturn(
            {
                form_id: "abc",
                name: "fid_001",
            },
            "find"
        );
        const results = await formsServices.findFormbyId("fid_001");
        expect(results.name).toBe("fid_001");
    });


  it ('should find form by id and user', async () => {
    mockingoose(answerModel).toReturn(
      {
        form_id : "fid_001",
        user_id: "3147606",
      }, 'find');
    const results = await formsServices.findUserAnswer("3147606","fid_001");
    expect(results.user_id).toBe("3147606");
    expect(results.form_id).toBe("fid_001");
  });

  it ('should create a form', async () => {
    mockingoose(formModel).toReturn(
      {
        frequency : "daily",
        name: "fid_test",
        questions:{"Q1":"Test"}
      }, 'find');
    const results = await formsServices.createform("fid_test","weekly",{"Q1":"Test"});
    expect(results.name).toBe("fid_test");
    expect(results.frequency).toBe("weekly");
    expect(results.questions.Q1).toBe("Test");
  });

  it ('should save the users amswer to the form', async () => {
    mockingoose(answerModel).toReturn(
      {
        form_id : "fid_001",
        user_id: "3147606",
        questions:{"Q1":"Test"}
      }, 'find');
    const results = await formsServices.saveAnswer("3147606","fid_001",{"Q1":"test"},null);
    expect(results.form_id).toBe("fid_001");
    expect(results.user_id).toBe("3147606");
  });

  describe('Testing if user submited daily or weekly form', () => {
      let user, dailyForm, weeklyForm;
      beforeAll(async () => {
          user = await userServices.add(Math.floor( Math.random() * 500 ) + 1, 'flawless');
          const questionDailyObject = {
              Q1: {
                  text: "test",
                  type: 'binary',
                  ismandatory: 0
              },
              Q2: {
                  text: "test2",
                  type: 'binary',
                  ismandatory: 0
              }
          };
          dailyForm = await formsServices.createform(Math.random().toString().substring(7),
              "daily", questionDailyObject);

          const questionWeeklyObject = {
              Q1: {
                  text: "test",
                  type: 'binary',
                  ismandatory: 0
              },
              Q2: {
                  text: "test2",
                  type: 'binary',
                  ismandatory: 0
              }
          };
         weeklyForm = await formsServices.createform(Math.random().toString().substring(7),
             "weekly", questionWeeklyObject);
      });

      it('Should have submitted daily form', async () => {
        const randomUserId = Math.random() * 1000;
        const randomFormId = `fid_${Math.random() * 10}`;
        mockingoose(answerModel).toReturn(
          [{
              form_id : randomFormId,
              user_id: randomUserId,
              date: new Date(),
              answers: {
                [`${randomFormId}-Q1`]: {
                    Q1: "aa"
                },
                [`${randomFormId}-Q2`]: {
                    Q2: "bb"
                }
            }
          }], 'find');

          

            const questions = {
              Q1: {
                  text: "test",
                  type: 'binary',
                  ismandatory: 0
              },
              Q2: {
                  text: "test2",
                  type: 'binary',
                  ismandatory: 0
              }
          };

          mockingoose(formModel).toReturn(
            [{
              name: randomFormId,
              frequency: "daily",
              questions
            }], 'find');

          
          const didSubmitDaily = await formsServices.didUserSubmitDaily(randomUserId);
          expect(didSubmitDaily).toBe(true)
      });

      it('Should return false because user submitted yesterdays form', async () => {
        const randomUserId = Math.random() * 1000;
        const randomFormId = `fid_${Math.random() * 10}`;
        mockingoose(answerModel).toReturn(
          [{
              form_id : randomFormId,
              user_id: randomUserId,
              date: new Date(new Date().setDate(new Date().getDate()-1)),
              answers: {
                [`${randomFormId}-Q1`]: {
                    Q1: "aa"
                },
                [`${randomFormId}-Q2`]: {
                    Q2: "bb"
                }
            }
          }], 'find');

          

            const questions = {
              Q1: {
                  text: "test",
                  type: 'binary',
                  ismandatory: 0
              },
              Q2: {
                  text: "test2",
                  type: 'binary',
                  ismandatory: 0
              }
          };

          mockingoose(formModel).toReturn(
            [{
              name: randomFormId,
              frequency: "daily",
              questions
            }], 'find');

          
          const didSubmitDaily = await formsServices.didUserSubmitDaily(randomUserId);
          expect(didSubmitDaily).toBe(false)
      });
  })
});

describe("supervisorServices", () => {
  it("creating a new user", async () => {
    const results = await supervisorServices.createUser();
    expect(results.length).toBe(2);
    
  });
  it("changing password for not - existing user", async () => {
    mockingoose(userModel).toReturn(
      {
          studyId: 3147606,
          password:
              "$2b$10$Y/J0xLLsF4GxAhAN.LnA9O/iS0LhalWIDHKKPT/bhWa8M8Lbn9zse",
      },
      "findOneAndRemove"
    );
    const results = await supervisorServices.changePassword(3147606).catch((err) => {
      expect(err.code).toBe(400);
  });
    
  });

});