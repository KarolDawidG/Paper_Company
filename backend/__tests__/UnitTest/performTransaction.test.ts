import { pool } from "../../database/pool";
import { performTransaction } from "../../database/Records/performTransaction";

jest.mock("../../database/pool", () => ({
  pool: {
    getConnection: jest.fn(),
  },
}));

describe("performTransaction", () => {
  let mockConnection: any;

  beforeEach(() => {
    mockConnection = {
      beginTransaction: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
      release: jest.fn(),
    };
    (pool.getConnection as jest.Mock).mockResolvedValue(mockConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should commit the transaction if callback is successful", async () => {
    const mockCallback = jest.fn().mockResolvedValue("success");

    const result = await performTransaction(mockCallback);

    expect(pool.getConnection).toHaveBeenCalled();
    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockCallback).toHaveBeenCalledWith(mockConnection);
    expect(mockConnection.commit).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
    expect(result).toBe("success");
  });

  it("should rollback the transaction if callback throws an error", async () => {
    const mockCallback = jest.fn().mockRejectedValue(new Error("Test error"));

    await expect(performTransaction(mockCallback)).rejects.toThrow("Test error");

    expect(pool.getConnection).toHaveBeenCalled();
    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockCallback).toHaveBeenCalledWith(mockConnection);
    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
  });

  it("should release the connection even if rollback fails", async () => {
    const mockCallback = jest.fn().mockRejectedValue(new Error("Test error"));
    mockConnection.rollback.mockRejectedValue(new Error("Rollback error"));
  
    await expect(performTransaction(mockCallback)).rejects.toThrow("Test error");
  
    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
  });
  
});
