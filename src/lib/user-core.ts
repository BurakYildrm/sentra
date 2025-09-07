import { Can, CoreResult } from "@/types/shared";
import {
  AuthCreateUserFn,
  AuthDeleteUserFn,
  AuthRefreshSessionFn,
  User,
  UserRolesInsertFn,
  UserRolesSelectFn,
  UserRolesUpdateFn,
  UsersInsertFn,
  UsersSelectFn,
  UsersUpdateFn,
} from "@/types/user";
import {
  CreateUserInput,
  DeleteUserInput,
  UpdateUserInput,
} from "@/types/validation";

function pick<T, K extends readonly (keyof T)[]>(
  obj: T,
  keys: K,
): Pick<T, K[number]> {
  const out = {} as Pick<T, K[number]>;
  for (const k of keys) out[k] = obj[k];
  return out;
}

/** READ */
export async function listUsersCore(
  selectUsers: UsersSelectFn,
  selectUserRoles: UserRolesSelectFn,
): Promise<CoreResult<User[]>> {
  const [users, userRoles] = await Promise.all([
    selectUsers(),
    selectUserRoles(),
  ]);

  if (users.error || userRoles.error) {
    const error = users.error || userRoles.error;
    return { ok: false, error: error?.message || "Failed to fetch users" };
  }

  const usersWithRoles =
    users.data?.map((user) => {
      return {
        ...user,
        role: userRoles.data?.find((role) => role.user_id === user.id)?.role,
      };
    }) || [];

  return { ok: true, data: usersWithRoles };
}

/** CREATE */
export async function createUserCore(
  can: Can,
  input: CreateUserInput,
  authCreateUser: AuthCreateUserFn,
  insertUser: UsersInsertFn,
  insertUserRole: UserRolesInsertFn,
): Promise<CoreResult> {
  if (!can("insert")) {
    return { ok: false, error: "Not authorized to create users" };
  }

  const { data: authData, error: authError } = await authCreateUser({
    email: input.email,
    password: input.password,
  });

  if (authError) {
    return { ok: false, error: authError.message };
  }

  const newUser = authData?.user;

  const { error: usersError } = await insertUser({
    id: newUser?.id,
    name: input.name,
  });

  if (usersError) {
    return { ok: false, error: usersError.message };
  }

  const { error: userRolesError } = await insertUserRole({
    user_id: newUser?.id,
    role: input.role,
  });

  if (userRolesError) {
    return { ok: false, error: userRolesError.message };
  }

  return { ok: true };
}

/** UPDATE */
export async function updateUserCore(
  can: Can,
  input: UpdateUserInput,
  updateUser: UsersUpdateFn,
  updateUserRole: UserRolesUpdateFn,
  refreshSession: AuthRefreshSessionFn,
): Promise<CoreResult> {
  if (!can("update")) {
    return { ok: false, error: "Not authorized to update users" };
  }

  const { user, fieldsToUpdate } = input;

  if (fieldsToUpdate.length === 0) {
    return { ok: false, error: "No fields to update" };
  }

  const promises = [];
  const fieldsToUpdateCopy = [...fieldsToUpdate];

  if (fieldsToUpdateCopy.includes("role")) {
    const userRolesPromise = updateUserRole({ role: user.role }, user.id);
    promises.push(userRolesPromise);

    const roleIndex = fieldsToUpdateCopy.indexOf("role");
    if (roleIndex > -1) {
      fieldsToUpdateCopy.splice(roleIndex, 1);
    }
  }

  if (fieldsToUpdateCopy.length >= 1) {
    const userData = pick(user, fieldsToUpdateCopy as (keyof typeof user)[]);
    const usersPromise = updateUser(userData, user.id);
    promises.push(usersPromise);
  }

  const results = await Promise.all(promises);

  if (results.some((result) => result.error)) {
    const error = results.find((result) => result.error)?.error;
    return { ok: false, error: error?.message || "Update failed" };
  }

  await refreshSession();
  return { ok: true };
}

/** DELETE */
export async function deleteUserCore(
  can: Can,
  input: DeleteUserInput,
  authDeleteUser: AuthDeleteUserFn,
): Promise<CoreResult> {
  if (!can("delete")) {
    return { ok: false, error: "Not authorized to delete users" };
  }

  const { error } = await authDeleteUser(input);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
