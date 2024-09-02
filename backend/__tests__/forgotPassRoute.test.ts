import request from "supertest";
import express from "express";
import MESSAGES from "../config/messages";
import STATUS_CODES from "../config/status-codes";
import { UsersRecord } from "../database/Records/Users/UsersRecord";
import { sendResetPasswordEmail } from "../config/mails/emailsSender";
import router from "../routes/userRoute/forgotPassRoute";

jest.mock("../database/Records/Users/UsersRecord");
jest.mock("../config/mails/emailsSender");

const app = express();
app.use(express.json());
app.use("/forgot", router);

describe("POST /forgot", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if email is not provided", async () => {
    const response = await request(app).post("/forgot").send({});
    expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
    expect(response.text).toBe(MESSAGES.INVALID_EMAIL);
  });

  it("should return 200 if email is not found in the database", async () => {
    (UsersRecord.selectByEmail as jest.Mock).mockResolvedValue([]);
    const response = await request(app).post("/forgot").send({ email: "user@example.com" });
    expect(response.status).toBe(STATUS_CODES.SUCCESS);
    expect(response.text).toBe(MESSAGES.EMAIL_SUCCESS);
  });

  it("should send a reset password email if user exists and return 200", async () => {
    (UsersRecord.selectByEmail as jest.Mock).mockResolvedValue([{
      id: 1,
      email: "user@example.com",
      username: "user",
      password: "hashedpassword"
    }]);
    
    const response = await request(app).post("/forgot").send({ email: "user@example.com" });

    expect(response.status).toBe(STATUS_CODES.SUCCESS);
    expect(response.text).toBe(MESSAGES.EMAIL_SUCCESS);
    expect(sendResetPasswordEmail).toHaveBeenCalledWith(
      "user@example.com",
      "user",
      expect.stringMatching(/^http:\/\/localhost:3000\/reset\/1\//)
    );
  });

  it("should return 500 if an error occurs", async () => {
    (UsersRecord.selectByEmail as jest.Mock).mockRejectedValue(new Error("Database error"));
    
    const response = await request(app).post("/forgot").send({ email: "user@example.com" });
    
    expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
    expect(response.text).toBe(MESSAGES.SERVER_ERROR);
  });
});
