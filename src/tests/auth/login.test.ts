/* eslint-disable @typescript-eslint/no-explicit-any */
import { POST as loginHandler } from "@/app/api/auth/login/route";
import { createMocks } from "node-mocks-http";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn()
    }
  }
}));

describe("POST /api/auth/login", () => {
  const mockUser = {
    id: "user-123",
    email: "test@example.com",
    name: "Test User",
    role: "USER",
    password: bcrypt.hashSync("password123", 10)
  };

  beforeEach(() => {
    (prisma.user.findUnique as jest.Mock).mockReset();
  });

  it("should return 400 if email or password is missing", async () => {
    const { req } = createMocks({
      method: "POST",
      body: { email: "" }
    });

    const response = await loginHandler(req as any);
    expect(response.status).toBe(400);
  });

  it("should return 404 if user not found", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const { req } = createMocks({
      method: "POST",
      body: { email: "notfound@example.com", password: "test" }
    });

    const response = await loginHandler(req as any);
    expect(response.status).toBe(404);
  });

  it("should return 401 if password is incorrect", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const { req } = createMocks({
      method: "POST",
      body: { email: mockUser.email, password: "wrongpassword" }
    });

    const response = await loginHandler(req as any);
    expect(response.status).toBe(401);
  });

  it("should return 200 and token if credentials are valid", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const { req } = createMocks({
      method: "POST",
      body: { email: mockUser.email, password: "password123" }
    });

    const response = await loginHandler(req as any);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toHaveProperty("token");
  });
});
