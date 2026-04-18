import request from "supertest";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import router from "../../routes/userRoute/loginRoute";
import { UsersRecord } from "../../database/Records/Users/UsersRecord";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";

jest.mock("../../database/Records/Users/UsersRecord");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const app = express();
app.use(express.json());
app.use("/auth", router);

describe("POST /auth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 422 if username or password is not provided", async () => {
    const response = await request(app).post("/auth").send({});
    expect(response.status).toBe(STATUS_CODES.UNPROCESSABLE_ENTITY);
    expect(response.text).toBe(MESSAGES.UNPROCESSABLE_ENTITY);
  });

  it("should return 401 if user is not found", async () => {
    (UsersRecord.selectByUsername as jest.Mock).mockResolvedValue([]);
    const response = await request(app).post("/auth").send({ username: "john_doe", password: "password123" });
    expect(response.status).toBe(STATUS_CODES.UNAUTHORIZED);
    expect(response.text).toBe(MESSAGES.UNPROCESSABLE_ENTITY);
  });

  it("should return 403 if user is inactive", async () => {
    (UsersRecord.selectByUsername as jest.Mock).mockResolvedValue([{ id: 1, username: "john_doe", password: "hashedpassword", is_active: false, role: "user" }]);
    const response = await request(app).post("/auth").send({ username: "john_doe", password: "password123" });
    expect(response.status).toBe(STATUS_CODES.FORBIDDEN);
    expect(response.text).toBe(MESSAGES.USER_INACTIVE);
  });

  it("should return 401 if password is incorrect", async () => {
    (UsersRecord.selectByUsername as jest.Mock).mockResolvedValue([{ id: 1, username: "john_doe", password: "hashedpassword", is_active: true, role: "user" }]);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const response = await request(app).post("/auth").send({ username: "john_doe", password: "wrongpassword" });
    expect(response.status).toBe(STATUS_CODES.UNAUTHORIZED);
    expect(response.text).toBe(MESSAGES.UNPROCESSABLE_ENTITY);
  });

  it("should return 200 and tokens if credentials are correct", async () => {
    (UsersRecord.selectByUsername as jest.Mock).mockResolvedValue([{ id: 1, username: "john_doe", password: "hashedpassword", is_active: true, role: "user" }]);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock)
      .mockReturnValueOnce("fakeAccessToken")
      .mockReturnValueOnce("fakeRefreshToken");

    const response = await request(app).post("/auth").send({ username: "john_doe", password: "password123" });
    expect(response.status).toBe(STATUS_CODES.SUCCESS);
    expect(response.body).toEqual({
      token: "fakeAccessToken",
      refreshToken: "fakeRefreshToken",
      idUser: 1,
      message: MESSAGES.SUCCESSFUL_SIGN_UP,
    });
  });

  it("should return 500 if an error occurs during login", async () => {
    (UsersRecord.selectByUsername as jest.Mock).mockRejectedValue(new Error("Database error"));

    const response = await request(app).post("/auth").send({ username: "john_doe", password: "password123" });
    expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
    expect(response.text).toBe(MESSAGES.SERVER_ERROR);
  });
});

describe("POST /auth/refresh", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 422 if idUser is not provided", async () => {
    const response = await request(app).post("/auth/refresh").send({});
    expect(response.status).toBe(STATUS_CODES.UNPROCESSABLE_ENTITY);
    expect(response.text).toBe(MESSAGES.MISSING_ID_USER);
  });

  it("should return 401 if refresh token is not provided", async () => {
    const response = await request(app).post("/auth/refresh").send({ idUser: 1 });
    expect(response.status).toBe(STATUS_CODES.UNAUTHORIZED);
    expect(response.text).toBe(MESSAGES.NO_REFRESH_TOKEN);
  });

  it("should return 404 if user is not found", async () => {
    (UsersRecord.selectTokenById as jest.Mock).mockResolvedValue([]);
    const response = await request(app).post("/auth/refresh").send({ idUser: 1, refreshToken: "validToken" });
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(response.text).toBe(MESSAGES.USER_NOT_FOUND);
  });

  it("should return 401 if no refresh token is found", async () => {
    (UsersRecord.selectTokenById as jest.Mock).mockResolvedValue([{ id: 1, refresh_token: null }]);
    const response = await request(app).post("/auth/refresh").send({ idUser: 1, refreshToken: "validToken" });
    expect(response.status).toBe(STATUS_CODES.UNAUTHORIZED);
    expect(response.text).toBe(MESSAGES.NO_REFRESH_TOKEN);
  });

  it("should return 403 if provided refresh token does not match the token stored in DB", async () => {
    (UsersRecord.selectTokenById as jest.Mock).mockResolvedValue([{ id: 1, refresh_token: "storedToken" }]);

    const response = await request(app).post("/auth/refresh").send({ idUser: 1, refreshToken: "invalidToken" });
    expect(response.status).toBe(STATUS_CODES.FORBIDDEN);
    expect(response.text).toBe(MESSAGES.INVALID_REFRESH_TOKEN);
  });

  it("should return 403 if refresh token signature is invalid", async () => {
    (UsersRecord.selectTokenById as jest.Mock).mockResolvedValue([{ id: 1, refresh_token: "validToken" }]);
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => callback(new Error("Invalid token")));

    const response = await request(app).post("/auth/refresh").send({ idUser: 1, refreshToken: "validToken" });
    expect(response.status).toBe(STATUS_CODES.FORBIDDEN);
    expect(response.text).toBe(`${MESSAGES.INVALID_REFRESH_TOKEN} (ID: ${1})`);
  });

  it("should return 403 if refresh token belongs to another user", async () => {
    (UsersRecord.selectTokenById as jest.Mock).mockResolvedValue([{ id: 1, refresh_token: "validToken" }]);
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(null, { userId: "2", user: "john_doe", role: "user" });
    });

    const response = await request(app).post("/auth/refresh").send({ idUser: 1, refreshToken: "validToken" });
    expect(response.status).toBe(STATUS_CODES.FORBIDDEN);
    expect(response.text).toBe(MESSAGES.INVALID_REFRESH_TOKEN);
  });

  it("should return 200 and new token if refresh token is valid", async () => {
    (UsersRecord.selectTokenById as jest.Mock).mockResolvedValue([{ id: 1, refresh_token: "validToken" }]);
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(null, { userId: "1", user: "john_doe", role: "user" });
    });
    (jwt.sign as jest.Mock)
      .mockReturnValueOnce("newAccessToken")
      .mockReturnValueOnce("newRefreshToken");
    (UsersRecord.updateRefreshTokenById as jest.Mock).mockResolvedValue(true);

    const response = await request(app).post("/auth/refresh").send({ idUser: 1, refreshToken: "validToken" });
    expect(response.status).toBe(STATUS_CODES.SUCCESS);
    expect(response.body).toEqual({
      token: "newAccessToken",
      refreshToken: "newRefreshToken",
    });
    expect(UsersRecord.updateRefreshTokenById).toHaveBeenCalledWith(["newRefreshToken", 1]);
  });

  it("should return 500 if an error occurs during refresh token", async () => {
    (UsersRecord.selectTokenById as jest.Mock).mockRejectedValue(new Error("Database error"));

    const response = await request(app).post("/auth/refresh").send({ idUser: 1, refreshToken: "validToken" });
    expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
    expect(response.text).toBe(MESSAGES.SERVER_ERROR);
  });
});
