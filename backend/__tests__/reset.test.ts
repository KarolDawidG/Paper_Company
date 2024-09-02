import request from "supertest";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import router from "../routes//userRoute/resetRoute"; // assuming the router is in routes/resetRoute
import { UsersRecord } from "../database/Records/Users/UsersRecord";
import MESSAGES from "../config/messages";
import STATUS_CODES from "../config/status-codes";

jest.mock("../database/Records/Users/UsersRecord");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const app = express();
app.use(express.json());
app.use("/reset", router);

describe("POST /reset/:id/:token", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 404 if password or password2 is not provided", async () => {
    const response = await request(app).post("/reset/1/fakeToken").send({});
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(response.text).toBe(MESSAGES.NOT_FOUND);
  });

  it("should return 400 if passwords do not match", async () => {
    const response = await request(app).post("/reset/1/fakeToken").send({
      password: "NewPassword123!",
      password2: "DifferentPassword123!"
    });
    expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
    expect(response.text).toBe(MESSAGES.PASSWORDS_DO_NOT_MATCH);
  });

  it("should return 400 if password does not meet requirements", async () => {
    const response = await request(app).post("/reset/1/fakeToken").send({
      password: "weakpass",
      password2: "weakpass"
    });
    expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
    expect(response.text).toBe(MESSAGES.INVALID_PASS);
  });

  it("should return 404 if user is not found", async () => {
    (UsersRecord.selectById as jest.Mock).mockResolvedValue([]);
    const response = await request(app).post("/reset/1/fakeToken").send({
      password: "NewPassword123!",
      password2: "NewPassword123!"
    });
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(response.text).toBe(MESSAGES.USER_NOT_FOUND);
  });

  it("should return 401 if token is invalid", async () => {
    (UsersRecord.selectById as jest.Mock).mockResolvedValue([{ id: 1, password: "oldHashedPassword" }]);
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => callback(new Error("Invalid token")));

    const response = await request(app).post("/reset/1/fakeToken").send({
      password: "NewPassword123!",
      password2: "NewPassword123!"
    });
    expect(response.status).toBe(STATUS_CODES.UNAUTHORIZED);
    expect(response.text).toBe(MESSAGES.JWT_ERROR);
  });

  it("should return 200 and reset password if token is valid", async () => {
    (UsersRecord.selectById as jest.Mock).mockResolvedValue([{ id: 1, password: "oldHashedPassword" }]);
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => callback(null, { id: 1 }));
    (bcrypt.hash as jest.Mock).mockResolvedValue("newHashedPassword");
    (UsersRecord.updatePasswordById as jest.Mock).mockResolvedValue(true);

    const response = await request(app).post("/reset/1/fakeToken").send({
      password: "NewPassword123!",
      password2: "NewPassword123!"
    });
    expect(response.status).toBe(STATUS_CODES.SUCCESS);
    expect(response.text).toBe(MESSAGES.SUCCESSFUL_RESET);
  });

  it("should return 500 if an error occurs during password reset", async () => {
    (UsersRecord.selectById as jest.Mock).mockRejectedValue(new Error("Database error"));

    const response = await request(app).post("/reset/1/fakeToken").send({
      password: "NewPassword123!",
      password2: "NewPassword123!"
    });
    expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
    expect(response.text).toBe(MESSAGES.SERVER_ERROR);
  });
});
