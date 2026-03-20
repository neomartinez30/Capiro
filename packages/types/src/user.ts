import { z } from "zod";

// ── Enums ───────────────────────────────────────────────────────────────────

export const UserRole = z.enum([
  "platform_admin",
  "firm_admin",
  "lobbyist",
  "analyst",
  "client",
]);
export type UserRole = z.infer<typeof UserRole>;

// ── Schemas ─────────────────────────────────────────────────────────────────

export const UserSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  cognitoSub: z.string().min(1),
  email: z.string().email(),
  firstName: z.string().min(1).max(128),
  lastName: z.string().min(1).max(128),
  role: UserRole,
  avatarUrl: z.string().url().optional(),
  lastLoginAt: z.coerce.date().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const CreateUserSchema = z.object({
  tenantId: z.string().uuid(),
  cognitoSub: z.string().min(1),
  email: z.string().email(),
  firstName: z.string().min(1).max(128),
  lastName: z.string().min(1).max(128),
  role: UserRole,
  avatarUrl: z.string().url().optional(),
});

export const UpdateUserSchema = CreateUserSchema.omit({
  tenantId: true,
  cognitoSub: true,
}).partial();

// ── Types ───────────────────────────────────────────────────────────────────

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
