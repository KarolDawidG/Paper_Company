import request from "supertest";
import express from "express";
import router from "../../routes/userRoute/logoutRoute";
import { UsersRecord } from "../../database/Records/Users/UsersRecord";
import { generateTokenForUnitTest } from "../../config/config";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";

jest.mock("../../database/Records/Users/UsersRecord");

const app = express();
const token = generateTokenForUnitTest("user");

app.use(express.json());
app.use("/logout", router);

describe("POST /logout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if authorization token is invalid", async () => {
    const response = await request(app)
      .post("/logout")
      .set("Authorization", "Bearer fake-token")
      .send({ idUser: "1", refreshToken: "validToken" });

    expect(response.status).toBe(STATUS_CODES.UNAUTHORIZED);
    expect(response.text).toBe(MESSAGES.SESSION_EXPIRED);
  });

  it("should return 422 if idUser is not provided", async () => {
    const response = await request(app)
      .post("/logout")
      .set("Authorization", `Bearer ${token}`)
      .send({ refreshToken: "validToken" });

    expect(response.status).toBe(STATUS_CODES.UNPROCESSABLE_ENTITY);
    expect(response.text).toBe(MESSAGES.MISSING_ID_USER);
  });

  it("should return 401 if refresh token is not provided", async () => {
    const response = await request(app)
      .post("/logout")
      .set("Authorization", `Bearer ${token}`)
      .send({ idUser: "1" });

    expect(response.status).toBe(STATUS_CODES.UNAUTHORIZED);
    expect(response.text).toBe(MESSAGES.NO_REFRESH_TOKEN);
  });

  it("should return 404 if user is not found", async () => {
    (UsersRecord.selectTokenById as jest.Mock).mockResolvedValue([]);

    const response = await request(app)
      .post("/logout")
      .set("Authorization", `Bearer ${token}`)
      .send({ idUser: "1", refreshToken: "validToken" });

    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(response.text).toBe(MESSAGES.USER_NOT_FOUND);
  });

  it("should return 403 if refresh token does not match the stored token", async () => {
    (UsersRecord.selectTokenById as jest.Mock).mockResolvedValue([
      { refresh_token: "storedToken" },
    ]);

    const response = await request(app)
      .post("/logout")
      .set("Authorization", `Bearer ${token}`)
      .send({ idUser: "1", refreshToken: "invalidToken" });

    expect(response.status).toBe(STATUS_CODES.FORBIDDEN);
    expect(response.text).toBe(MESSAGES.INVALID_REFRESH_TOKEN);
  });

  it("should clear refresh token and return 200 for valid logout", async () => {
    (UsersRecord.selectTokenById as jest.Mock).mockResolvedValue([
      { refresh_token: "validToken" },
    ]);
    (UsersRecord.updateRefreshTokenById as jest.Mock).mockResolvedValue(true);

    const response = await request(app)
      .post("/logout")
      .set("Authorization", `Bearer ${token}`)
      .send({ idUser: "1", refreshToken: "validToken" });

    expect(response.status).toBe(STATUS_CODES.SUCCESS);
    expect(response.text).toBe(MESSAGES.SUCCESSFUL_LOGOUT);
    expect(UsersRecord.updateRefreshTokenById).toHaveBeenCalledWith([null, "1"]);
  });
});
