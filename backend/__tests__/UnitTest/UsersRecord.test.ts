import { pool } from "../../database/pool";
import { performTransaction } from "../../database/Records/performTransaction";
import { UsersRecord } from "../../database/Records/Users/UsersRecord";
import {
  INSERT,
  ACTIVE,
  DELETE,
  UPDATE_BY_ID,
  SELECT_ALL,
  UPDATE_TOKEN_BY_ID,
  UPDATE_ROLE,
  SELECT_BY_ROLE,
  SELECT_BY_EMAIL,
  SELECT_BY_ID,
  SELECT_BY_USERNAME,
  SELECT_TOKEN_BY_ID,
  SELECT_URL_BY_ID,
  UPDATE_IMG_URL_BY_ID,
  UPDATE_USER_DATA_BY_ID,
} from "../../database/Records/Users/querryUsersRecord";
import { validateEmail, validateUserName } from "../../config/config";
import { email, hashPassword, id, img_url, mockResults, refreshToken, role, standardUrl, username } from "../../config/UsersRecordValue";

jest.mock("../../database/pool", () => ({
  pool: {
    execute: jest.fn(),
  },
}));

jest.mock("../../database/Records/performTransaction", () => ({
  performTransaction: jest.fn(),
}));

jest.mock("uuid", () => ({
  v4: jest.fn(() => "mocked-uuid"),
}));

jest.mock("../../config/config", () => ({
  validateEmail: jest.fn(() => true),
  validateUserName: jest.fn(() => true),
}));

describe("UsersRecord", () => {
  describe("insert", () => {
    it("should insert a new user and return the id", async () => {
      const mockConnection = { execute: jest.fn() };
      (performTransaction as jest.Mock).mockImplementation((callback) =>
        callback(mockConnection)
      );

      const result = await UsersRecord.insert(username, hashPassword, email);

      expect(validateEmail).toHaveBeenCalledWith(email);
      expect(validateUserName).toHaveBeenCalledWith(username);
      expect(performTransaction).toHaveBeenCalled();
      expect(mockConnection.execute).toHaveBeenCalledWith(INSERT, [
        id,
        username,
        hashPassword,
        email,
      ]);
      expect(result).toBe("mocked-uuid");
    });

    it("should throw an error if email is invalid", async () => {
        (validateEmail as jest.Mock).mockReturnValue(false);
  
        await expect(
          UsersRecord.insert("testuser", "hashedpassword", "invalid-email")
        ).rejects.toThrow("Invalid email address.");
      });
  
      it("should throw an error if username is invalid", async () => {

        (validateEmail as jest.Mock).mockReturnValue(true);
        (validateUserName as jest.Mock).mockReturnValue(false);
  
        await expect(
          UsersRecord.insert("invalid-username", "hashedpassword", "test@example.com")
        ).rejects.toThrow("Invalid username.");
      });
      
  });

  describe("activateAccount", () => {
    it("should activate a user account", async () => {
      const mockConnection = { execute: jest.fn() };
      (performTransaction as jest.Mock).mockImplementation((callback) =>
        callback(mockConnection)
      );

      const result = await UsersRecord.activateAccount(id);

      expect(performTransaction).toHaveBeenCalled();
      expect(mockConnection.execute).toHaveBeenCalledWith(ACTIVE, [id]);
      expect(result).toBe(mockConnection.execute.mock.results[0].value);
    });
  });

  describe("delete", () => {
    it("should delete a user by id", async () => {
      const mockConnection = { execute: jest.fn() };
      (performTransaction as jest.Mock).mockImplementation((callback) =>
        callback(mockConnection)
      );

      await UsersRecord.delete(id);

      expect(performTransaction).toHaveBeenCalled();
      expect(mockConnection.execute).toHaveBeenCalledWith(DELETE, [id]);
    });
  });

  describe("updatePasswordById", () => {
    it("should update the password of a user by id", async () => {
      const mockConnection = { execute: jest.fn() };
      (performTransaction as jest.Mock).mockImplementation((callback) =>
        callback(mockConnection)
      );

      const result = await UsersRecord.updatePasswordById([hashPassword, id]);

      expect(performTransaction).toHaveBeenCalled();
      expect(mockConnection.execute).toHaveBeenCalledWith(UPDATE_BY_ID, [
        hashPassword,
        id,
      ]);
      expect(result).toBe(mockConnection.execute.mock.results[0].value);
    });
  });

  describe("updateRefreshTokenById", () => {
    it("should update the refresh token of a user by id", async () => {
      const mockConnection = { execute: jest.fn() };
      (performTransaction as jest.Mock).mockImplementation((callback) =>
        callback(mockConnection)
      );

      const result = await UsersRecord.updateRefreshTokenById([refreshToken, id]);

      expect(performTransaction).toHaveBeenCalled();
      expect(mockConnection.execute).toHaveBeenCalledWith(UPDATE_TOKEN_BY_ID, [
        refreshToken,
        id,
      ]);
      expect(result).toBe(mockConnection.execute.mock.results[0].value);
    });
  });

  describe("updateRole", () => {
    it("should update the role of a user by id", async () => {
      const mockConnection = { execute: jest.fn() };
      (performTransaction as jest.Mock).mockImplementation((callback) =>
        callback(mockConnection)
      );

      const result = await UsersRecord.updateRole(role, id);

      expect(performTransaction).toHaveBeenCalled();
      expect(mockConnection.execute).toHaveBeenCalledWith(UPDATE_ROLE, [
        role,
        id,
      ]);
      expect(result).toBe(mockConnection.execute.mock.results[0].value);
    });

    it("should throw an error if the update fails", async () => {
      (performTransaction as jest.Mock).mockImplementation(() => {
        throw new Error("Update failed");
      });

      await expect(UsersRecord.updateRole(role, id)).rejects.toThrow(
        "Update failed"
      );
    })

  });

  describe("listByRole", () => {
    it("should return a list of users with the specified role", async () => {

      (pool.execute as jest.Mock).mockResolvedValue([mockResults]);

      const result = await UsersRecord.listByRole("admin");

      expect(pool.execute).toHaveBeenCalledWith(SELECT_BY_ROLE, ["admin"]);
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(UsersRecord);
      expect(result[0].username).toBe("user1");
      expect(result[1].username).toBe("user2");
    });

    it("should throw an error if the query fails", async () => {
      (pool.execute as jest.Mock).mockRejectedValue(new Error("Query failed"));

      await expect(UsersRecord.listByRole("admin")).rejects.toThrow(
        "Query failed"
      );
    });
  });

  describe("selectByEmail", () => {
    it("should return the user with the specified email", async () => {

      (pool.execute as jest.Mock).mockResolvedValue([mockResults]);

      const result = await UsersRecord.selectByEmail(["user1@example.com"]);

      expect(pool.execute).toHaveBeenCalledWith(SELECT_BY_EMAIL, [
        "user1@example.com",
      ]);
      expect(result).toEqual(mockResults);
    });

    it("should return an empty array if no user is found", async () => {
      (pool.execute as jest.Mock).mockResolvedValue([[]]);

      const result = await UsersRecord.selectByEmail(["nonexistent@example.com"]);

      expect(pool.execute).toHaveBeenCalledWith(SELECT_BY_EMAIL, [
        "nonexistent@example.com",
      ]);
      expect(result).toEqual([]);
    });

    it("should throw an error if the query fails", async () => {
      (pool.execute as jest.Mock).mockRejectedValue(new Error("Query failed"));

      await expect(
        UsersRecord.selectByEmail(["user1@example.com"])
      ).rejects.toThrow("Query failed");
    });
  });

  describe("selectById", () => {
    it("should return the user with the specified id", async () => {
  
      (pool.execute as jest.Mock).mockResolvedValue([mockResults]);

      const result = await UsersRecord.selectById(["1"]);

      expect(pool.execute).toHaveBeenCalledWith(SELECT_BY_ID, [
        "1",
      ]);
      expect(result).toEqual(mockResults);
    });

    it("should return an empty array if no user is found", async () => {
      (pool.execute as jest.Mock).mockResolvedValue([[]]);

      const result = await UsersRecord.selectById(["2"]);

      expect(pool.execute).toHaveBeenCalledWith(SELECT_BY_ID, [
        "2",
      ]);
      expect(result).toEqual([]);
    });

    it("should throw an error if the query fails", async () => {
      (pool.execute as jest.Mock).mockRejectedValue(new Error("Query failed"));

      await expect(
        UsersRecord.selectById(["user1@example.com"])
      ).rejects.toThrow("Query failed");
    });
  });

  describe("selectByUsername", () => {
    it("should return the user with the specified user name", async () => {
 
      (pool.execute as jest.Mock).mockResolvedValue([mockResults]);

      const result = await UsersRecord.selectByUsername(["user1"]);

      expect(pool.execute).toHaveBeenCalledWith(SELECT_BY_USERNAME, [
        "user1",
      ]);
      expect(result).toEqual(mockResults);
    });

    it("should return an empty array if no user is found", async () => {
      (pool.execute as jest.Mock).mockResolvedValue([[]]);

      const result = await UsersRecord.selectByUsername(["fake_user"]);

      expect(pool.execute).toHaveBeenCalledWith(SELECT_BY_USERNAME, [
        "fake_user",
      ]);
      expect(result).toEqual([]);
    });

    it("should throw an error if the query fails", async () => {
      (pool.execute as jest.Mock).mockRejectedValue(new Error("Query failed"));

      await expect(
        UsersRecord.selectByUsername(["user1example"])
      ).rejects.toThrow("Query failed");
    });
  });

  describe("selectTokenById", () => {
    it("should return the refresh user Token with the specified token", async () => {

      (pool.execute as jest.Mock).mockResolvedValue([mockResults]);

      const result = await UsersRecord.selectTokenById(["token1"]);

      expect(pool.execute).toHaveBeenCalledWith(SELECT_TOKEN_BY_ID, [
        "token1",
      ]);
      expect(result).toEqual(mockResults);
    });

    it("should return an empty array if no user is found", async () => {
      (pool.execute as jest.Mock).mockResolvedValue([[]]);

      const result = await UsersRecord.selectTokenById(["fake_token"]);

      expect(pool.execute).toHaveBeenCalledWith(SELECT_TOKEN_BY_ID, [
        "fake_token",
      ]);
      expect(result).toEqual([]);
    });

    it("should throw an error if the query fails", async () => {
      (pool.execute as jest.Mock).mockRejectedValue(new Error("Query failed"));

      await expect(
        UsersRecord.selectTokenById(["token_example"])
      ).rejects.toThrow("Query failed");
    });
  });

  describe("listAll", () => {
    it("should return a list of all users", async () => {
  
      (pool.execute as jest.Mock).mockResolvedValue([mockResults]);
  
      const result = await UsersRecord.listAll();
  
      expect(pool.execute).toHaveBeenCalledWith(SELECT_ALL);
      expect(result).toHaveLength(mockResults.length);
      expect(result[0]).toBeInstanceOf(UsersRecord);
    });
  
    it("should throw an error if the query fails", async () => {
      (pool.execute as jest.Mock).mockRejectedValue(new Error("Query failed"));
  
      await expect(UsersRecord.listAll()).rejects.toThrow("Query failed");
    });
  });

  describe("updateImgUrl", () => {
    it("should update the image URL of a user", async () => {
      const mockConnection = { execute: jest.fn() };
      (performTransaction as jest.Mock).mockImplementation((callback) =>
        callback(mockConnection)
      );
  
      const result = await UsersRecord.updateImgUrl(id, img_url);
  
      expect(performTransaction).toHaveBeenCalled();
      expect(mockConnection.execute).toHaveBeenCalledWith(UPDATE_IMG_URL_BY_ID, [img_url, id]);
      expect(result).toBe(mockConnection.execute.mock.results[0].value);
    });
  
    it("should throw an error if the update fails", async () => {
      (performTransaction as jest.Mock).mockImplementation(() => {
        throw new Error("Update failed");
      });
  
      await expect(UsersRecord.updateImgUrl(id, img_url)).rejects.toThrow("Update failed");
    });
  });

  describe("selectUrlById", () => {
    it("should return the image URL of a user with the specified id", async () => {
  
      (pool.execute as jest.Mock).mockResolvedValue([mockResults]);
  
      const result = await UsersRecord.selectUrlById(["1"]);
  
      expect(pool.execute).toHaveBeenCalledWith(SELECT_URL_BY_ID, ["1"]);
      expect(result).toEqual(mockResults);
    });
  
    it("should return an empty array if no URL is found", async () => {
      (pool.execute as jest.Mock).mockResolvedValue([[]]);
  
      const result = await UsersRecord.selectUrlById(["2"]);
  
      expect(pool.execute).toHaveBeenCalledWith(SELECT_URL_BY_ID, ["2"]);
      expect(result).toEqual([]);
    });
  
    it("should throw an error if the query fails", async () => {
      (pool.execute as jest.Mock).mockRejectedValue(new Error("Query failed"));
  
      await expect(UsersRecord.selectUrlById(["1"])).rejects.toThrow("Query failed");
    });
  });

  describe("deleteUrl", () => {
    it("should reset the user's image URL to the default", async () => {
      const mockConnection = { execute: jest.fn() };
      (performTransaction as jest.Mock).mockImplementation((callback) =>
        callback(mockConnection)
      );
   
      const result = await UsersRecord.deleteUrl(id);
  
      expect(performTransaction).toHaveBeenCalled();
      expect(mockConnection.execute).toHaveBeenCalledWith(UPDATE_IMG_URL_BY_ID, [standardUrl, id]);
      expect(result).toBe(mockConnection.execute.mock.results[0].value);
    });
  });

  describe("updateUserData", () => {
    it("should update the username and email of a user", async () => {
      const mockConnection = { execute: jest.fn() };
      (performTransaction as jest.Mock).mockImplementation((callback) =>
        callback(mockConnection)
      );
  
      const result = await UsersRecord.updateUserData([username, email, id]);
  
      expect(performTransaction).toHaveBeenCalled();
      expect(mockConnection.execute).toHaveBeenCalledWith(UPDATE_USER_DATA_BY_ID, [
        username,
        email,
        id,
      ]);
      expect(result).toBe(mockConnection.execute.mock.results[0].value);
    });
  });
}); 