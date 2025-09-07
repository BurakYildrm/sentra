import { canPerform } from "@/lib/shared";
import {
  createUserCore,
  deleteUserCore,
  listUsersCore,
  updateUserCore,
} from "@/lib/user-core";
import { describe, expect, it, vi } from "vitest";

const ok = { error: null as any };
const err = (message: string) => ({ error: { message } });

describe("Core User Functions", () => {
  describe("listUsersCore", () => {
    it("returns users with roles when successful", async () => {
      const users = [
        { id: "1", name: "John Doe" },
        { id: "2", name: "Jane Smith" },
      ];
      const userRoles = [
        { user_id: "1", role: "admin" },
        { user_id: "2", role: "editor" },
      ];

      const selectUsers = vi
        .fn()
        .mockResolvedValue({ data: users, error: null });
      const selectUserRoles = vi
        .fn()
        .mockResolvedValue({ data: userRoles, error: null });

      const res = await listUsersCore(selectUsers, selectUserRoles);

      expect(res).toEqual({
        ok: true,
        data: [
          { id: "1", name: "John Doe", role: "admin" },
          { id: "2", name: "Jane Smith", role: "editor" },
        ],
      });
      expect(selectUsers).toHaveBeenCalledTimes(1);
      expect(selectUserRoles).toHaveBeenCalledTimes(1);
    });

    it("returns empty array when no users found", async () => {
      const selectUsers = vi.fn().mockResolvedValue({ data: [], error: null });
      const selectUserRoles = vi
        .fn()
        .mockResolvedValue({ data: [], error: null });

      const res = await listUsersCore(selectUsers, selectUserRoles);

      expect(res).toEqual({ ok: true, data: [] });
    });

    it("handles users without roles", async () => {
      const users = [{ id: "1", name: "John Doe" }];
      const userRoles = [] as unknown[];

      const selectUsers = vi
        .fn()
        .mockResolvedValue({ data: users, error: null });
      const selectUserRoles = vi
        .fn()
        .mockResolvedValue({ data: userRoles, error: null });

      const res = await listUsersCore(selectUsers, selectUserRoles);

      expect(res).toEqual({
        ok: true,
        data: [{ id: "1", name: "John Doe", role: undefined }],
      });
    });

    it("propagates users query error", async () => {
      const selectUsers = vi
        .fn()
        .mockResolvedValue({ data: null, error: { message: "db fail" } });
      const selectUserRoles = vi
        .fn()
        .mockResolvedValue({ data: [], error: null });

      const res = await listUsersCore(selectUsers, selectUserRoles);

      expect(res).toEqual({ ok: false, error: "db fail" });
    });

    it("propagates user roles query error", async () => {
      const selectUsers = vi.fn().mockResolvedValue({ data: [], error: null });
      const selectUserRoles = vi
        .fn()
        .mockResolvedValue({ data: null, error: { message: "roles fail" } });

      const res = await listUsersCore(selectUsers, selectUserRoles);

      expect(res).toEqual({ ok: false, error: "roles fail" });
    });

    it("handles null data gracefully", async () => {
      const selectUsers = vi
        .fn()
        .mockResolvedValue({ data: null, error: null });
      const selectUserRoles = vi
        .fn()
        .mockResolvedValue({ data: null, error: null });

      const res = await listUsersCore(selectUsers, selectUserRoles);

      expect(res).toEqual({ ok: true, data: [] });
    });
  });

  describe("createUserCore", () => {
    const mockInput = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      role: "admin" as const,
    };

    it("denies without insert permission", async () => {
      const authCreateUser = vi.fn();
      const insertUser = vi.fn();
      const insertUserRole = vi.fn();

      const res = await createUserCore(
        canPerform([]),
        mockInput,
        authCreateUser,
        insertUser,
        insertUserRole,
      );

      expect(res).toEqual({
        ok: false,
        error: "Not authorized to create users",
      });
      expect(authCreateUser).not.toHaveBeenCalled();
      expect(insertUser).not.toHaveBeenCalled();
      expect(insertUserRole).not.toHaveBeenCalled();
    });

    it("succeeds with insert permission", async () => {
      const newUser = { id: "new-user-id" };
      const authCreateUser = vi
        .fn()
        .mockResolvedValue({ data: { user: newUser }, error: null });
      const insertUser = vi.fn().mockResolvedValue(ok);
      const insertUserRole = vi.fn().mockResolvedValue(ok);

      const res = await createUserCore(
        canPerform(["insert"]),
        mockInput,
        authCreateUser,
        insertUser,
        insertUserRole,
      );

      expect(res).toEqual({ ok: true });
      expect(authCreateUser).toHaveBeenCalledWith({
        email: "john@example.com",
        password: "password123",
      });
      expect(insertUser).toHaveBeenCalledWith({
        id: "new-user-id",
        name: "John Doe",
      });
      expect(insertUserRole).toHaveBeenCalledWith({
        user_id: "new-user-id",
        role: "admin",
      });
    });

    it("propagates auth creation error", async () => {
      const authCreateUser = vi
        .fn()
        .mockResolvedValue({ data: null, error: { message: "auth fail" } });
      const insertUser = vi.fn();
      const insertUserRole = vi.fn();

      const res = await createUserCore(
        canPerform(["insert"]),
        mockInput,
        authCreateUser,
        insertUser,
        insertUserRole,
      );

      expect(res).toEqual({ ok: false, error: "auth fail" });
      expect(insertUser).not.toHaveBeenCalled();
      expect(insertUserRole).not.toHaveBeenCalled();
    });

    it("propagates user insertion error", async () => {
      const newUser = { id: "new-user-id" };
      const authCreateUser = vi
        .fn()
        .mockResolvedValue({ data: { user: newUser }, error: null });
      const insertUser = vi.fn().mockResolvedValue(err("user insert fail"));
      const insertUserRole = vi.fn();

      const res = await createUserCore(
        canPerform(["insert"]),
        mockInput,
        authCreateUser,
        insertUser,
        insertUserRole,
      );

      expect(res).toEqual({ ok: false, error: "user insert fail" });
      expect(insertUserRole).not.toHaveBeenCalled();
    });

    it("propagates user role insertion error", async () => {
      const newUser = { id: "new-user-id" };
      const authCreateUser = vi
        .fn()
        .mockResolvedValue({ data: { user: newUser }, error: null });
      const insertUser = vi.fn().mockResolvedValue(ok);
      const insertUserRole = vi.fn().mockResolvedValue(err("role insert fail"));

      const res = await createUserCore(
        canPerform(["insert"]),
        mockInput,
        authCreateUser,
        insertUser,
        insertUserRole,
      );

      expect(res).toEqual({ ok: false, error: "role insert fail" });
    });
  });

  describe("updateUserCore", () => {
    const mockInput = {
      user: {
        id: "user-1",
        name: "John Updated",
        role: "editor" as const,
      },
      fieldsToUpdate: ["name", "role"],
    };

    it("denies without update permission", async () => {
      const updateUser = vi.fn();
      const updateUserRole = vi.fn();
      const refreshSession = vi.fn();

      const res = await updateUserCore(
        canPerform([]),
        mockInput,
        updateUser,
        updateUserRole,
        refreshSession,
      );

      expect(res).toEqual({
        ok: false,
        error: "Not authorized to update users",
      });
      expect(updateUser).not.toHaveBeenCalled();
      expect(updateUserRole).not.toHaveBeenCalled();
      expect(refreshSession).not.toHaveBeenCalled();
    });

    it("succeeds with update permission", async () => {
      const updateUser = vi.fn().mockResolvedValue(ok);
      const updateUserRole = vi.fn().mockResolvedValue(ok);
      const refreshSession = vi.fn().mockResolvedValue(undefined);

      const res = await updateUserCore(
        canPerform(["update"]),
        mockInput,
        updateUser,
        updateUserRole,
        refreshSession,
      );

      expect(res).toEqual({ ok: true });
      expect(updateUserRole).toHaveBeenCalledWith({ role: "editor" }, "user-1");
      expect(updateUser).toHaveBeenCalledWith(
        { name: "John Updated" },
        "user-1",
      );
      expect(refreshSession).toHaveBeenCalledTimes(1);
    });

    it("handles no fields to update", async () => {
      const updateUser = vi.fn();
      const updateUserRole = vi.fn();
      const refreshSession = vi.fn();

      const res = await updateUserCore(
        canPerform(["update"]),
        { ...mockInput, fieldsToUpdate: [] },
        updateUser,
        updateUserRole,
        refreshSession,
      );

      expect(res).toEqual({ ok: false, error: "No fields to update" });
      expect(updateUser).not.toHaveBeenCalled();
      expect(updateUserRole).not.toHaveBeenCalled();
      expect(refreshSession).not.toHaveBeenCalled();
    });

    it("handles only role update", async () => {
      const updateUser = vi.fn();
      const updateUserRole = vi.fn().mockResolvedValue(ok);
      const refreshSession = vi.fn().mockResolvedValue(undefined);

      const res = await updateUserCore(
        canPerform(["update"]),
        { ...mockInput, fieldsToUpdate: ["role"] },
        updateUser,
        updateUserRole,
        refreshSession,
      );

      expect(res).toEqual({ ok: true });
      expect(updateUserRole).toHaveBeenCalledWith({ role: "editor" }, "user-1");
      expect(updateUser).not.toHaveBeenCalled();
      expect(refreshSession).toHaveBeenCalledTimes(1);
    });

    it("handles only user fields update", async () => {
      const updateUser = vi.fn().mockResolvedValue(ok);
      const updateUserRole = vi.fn();
      const refreshSession = vi.fn().mockResolvedValue(undefined);

      const res = await updateUserCore(
        canPerform(["update"]),
        { ...mockInput, fieldsToUpdate: ["name"] },
        updateUser,
        updateUserRole,
        refreshSession,
      );

      expect(res).toEqual({ ok: true });
      expect(updateUser).toHaveBeenCalledWith(
        { name: "John Updated" },
        "user-1",
      );
      expect(updateUserRole).not.toHaveBeenCalled();
      expect(refreshSession).toHaveBeenCalledTimes(1);
    });

    it("propagates user role update error", async () => {
      const updateUser = vi.fn();
      const updateUserRole = vi.fn().mockResolvedValue(err("role update fail"));
      const refreshSession = vi.fn();

      const res = await updateUserCore(
        canPerform(["update"]),
        mockInput,
        updateUser,
        updateUserRole,
        refreshSession,
      );

      expect(res).toEqual({ ok: false, error: "role update fail" });
      expect(refreshSession).not.toHaveBeenCalled();
    });

    it("propagates user update error", async () => {
      const updateUser = vi.fn().mockResolvedValue(err("user update fail"));
      const updateUserRole = vi.fn().mockResolvedValue(ok);
      const refreshSession = vi.fn();

      const res = await updateUserCore(
        canPerform(["update"]),
        mockInput,
        updateUser,
        updateUserRole,
        refreshSession,
      );

      expect(res).toEqual({ ok: false, error: "user update fail" });
      expect(refreshSession).not.toHaveBeenCalled();
    });

    it("handles multiple field updates correctly", async () => {
      const updateUser = vi.fn().mockResolvedValue(ok);
      const updateUserRole = vi.fn().mockResolvedValue(ok);
      const refreshSession = vi.fn().mockResolvedValue(undefined);

      const inputWithMultipleFields = {
        user: {
          id: "user-1",
          name: "John Updated",
          role: "admin" as const,
        },
        fieldsToUpdate: ["name", "role"],
      };

      const res = await updateUserCore(
        canPerform(["update"]),
        inputWithMultipleFields,
        updateUser,
        updateUserRole,
        refreshSession,
      );

      expect(res).toEqual({ ok: true });
      expect(updateUserRole).toHaveBeenCalledWith({ role: "admin" }, "user-1");
      expect(updateUser).toHaveBeenCalledWith(
        { name: "John Updated" },
        "user-1",
      );
      expect(refreshSession).toHaveBeenCalledTimes(1);
    });
  });

  describe("deleteUserCore", () => {
    const mockUserId = "user-1";

    it("denies without delete permission", async () => {
      const authDeleteUser = vi.fn();

      const res = await deleteUserCore(
        canPerform([]),
        mockUserId,
        authDeleteUser,
      );

      expect(res).toEqual({
        ok: false,
        error: "Not authorized to delete users",
      });
      expect(authDeleteUser).not.toHaveBeenCalled();
    });

    it("succeeds with delete permission", async () => {
      const authDeleteUser = vi.fn().mockResolvedValue(ok);

      const res = await deleteUserCore(
        canPerform(["delete"]),
        mockUserId,
        authDeleteUser,
      );

      expect(res).toEqual({ ok: true });
      expect(authDeleteUser).toHaveBeenCalledWith("user-1");
    });

    it("propagates auth deletion error", async () => {
      const authDeleteUser = vi.fn().mockResolvedValue(err("auth delete fail"));

      const res = await deleteUserCore(
        canPerform(["delete"]),
        mockUserId,
        authDeleteUser,
      );

      expect(res).toEqual({ ok: false, error: "auth delete fail" });
    });
  });
});
