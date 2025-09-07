import { z } from "zod";

/** Auth */
export const SignInFieldsSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const SignInInputSchema = SignInFieldsSchema;

/** Users */
export const UserFieldsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.enum(["admin", "editor", "viewer"], "Role is required"),
});

export const CreateUserFieldsSchema = UserFieldsSchema.extend({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const CreateUserInputSchema = CreateUserFieldsSchema;

export const UpdateUserFieldsSchema = UserFieldsSchema;

export const UpdateUserInputSchema = z.object({
  user: UpdateUserFieldsSchema.extend({
    id: z.uuid(),
  }),
  fieldsToUpdate: z.array(z.string()),
});

export const DeleteUserInputSchema = z.uuid();

/** Articles */
export const ArticleFieldsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export const CreateArticleInputSchema = ArticleFieldsSchema;

export const UpdateArticleInputSchema = ArticleFieldsSchema.extend({
  id: z.uuid(),
});

export const DeleteArticleInputSchema = z.uuid();

/** Types */
export type SignInFormValues = z.infer<typeof SignInFieldsSchema>;
export type SignInInput = z.infer<typeof SignInInputSchema>;
export type CreateUserFormValues = z.infer<typeof CreateUserFieldsSchema>;
export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;
export type UpdateUserFormValues = z.infer<typeof UpdateUserFieldsSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>;
export type DeleteUserInput = z.infer<typeof DeleteUserInputSchema>;
export type ArticleFormValues = z.infer<typeof ArticleFieldsSchema>;
export type CreateArticleInput = z.infer<typeof CreateArticleInputSchema>;
export type UpdateArticleInput = z.infer<typeof UpdateArticleInputSchema>;
export type DeleteArticleInput = z.infer<typeof DeleteArticleInputSchema>;
