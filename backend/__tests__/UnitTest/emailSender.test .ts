import { sendEmployeeEmail, sendRegisterEmail, sendResetPasswordEmail } from "../../config/mails/emailsSender";

// jest.mock("../../config/mails/configs/nodemoailerConfig", () => ({
//   createTransporter: jest.fn(),
// }));

describe("emailSender", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should call createTransporter when sending reset password email", async () => {
    const mockCreateTransporter = jest.spyOn(require("../../config/mails/configs/nodemoailerConfig"), "createTransporter");
    await sendResetPasswordEmail("test@example.com", "testuser", "http://example.com/reset");
    expect(mockCreateTransporter).toHaveBeenCalled();
  });

  
  it("should send reset password email with correct options", async () => {
    const mockTransporter = { sendMail: jest.fn() };
    jest.spyOn(require("../../config/mails/configs/nodemoailerConfig"), "createTransporter").mockReturnValue(mockTransporter);
    
    await sendResetPasswordEmail("test@example.com", "testuser", "http://example.com/reset");
  
    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: process.env.user,
      to: "test@example.com",
      subject: "Password Reset Request",
      html: expect.stringContaining("Hello testuser"),
    });
  });

  it("should throw an error if sendMail fails", async () => {
    const mockTransporter = { sendMail: jest.fn().mockRejectedValue(new Error("SendMail Error")) };
    jest.spyOn(require("../../config/mails/configs/nodemoailerConfig"), "createTransporter").mockReturnValue(mockTransporter);
  
    await expect(sendResetPasswordEmail("test@example.com", "testuser", "http://example.com/reset"))
      .rejects
      .toThrow("SendMail Error");
  });

  it("should send registration email with correct options", async () => {
    const mockTransporter = { sendMail: jest.fn() };
    jest.spyOn(require("../../config/mails/configs/nodemoailerConfig"), "createTransporter").mockReturnValue(mockTransporter);
    
    await sendRegisterEmail("test@example.com", "testuser", "http://example.com/register");
  
    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: process.env.user,
      to: "test@example.com",
      subject: "Welcome to Our Service!",
      html: expect.stringContaining("Hello testuser"),
    });
  });
  
  it("should send employee email with correct options", async () => {
    const mockTransporter = { sendMail: jest.fn() };
    jest.spyOn(require("../../config/mails/configs/nodemoailerConfig"), "createTransporter").mockReturnValue(mockTransporter);
    
    await sendEmployeeEmail("employee@example.com", "Subject Test", "Message Test");
  
    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: process.env.user,
      to: "employee@example.com",
      subject: "Subject Test",
      html: expect.stringContaining("Message Test"),
    });
  });

  it("should throw an error if environment variable 'user' is not set", async () => {
    const originalEnvUser = process.env.user;
    delete process.env.user;
  
    await expect(sendResetPasswordEmail("test@example.com", "testuser", "http://example.com/reset"))
      .rejects
      .toThrow("Environment variable 'user' is not set");
  
    process.env.user = originalEnvUser;
  });
  
  

});
