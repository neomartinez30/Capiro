import { z } from "zod";

// ── Enums ───────────────────────────────────────────────────────────────────

export const TenantPlan = z.enum([
  "trial",
  "starter",
  "professional",
  "enterprise",
]);
export type TenantPlan = z.infer<typeof TenantPlan>;

// ── Schemas ─────────────────────────────────────────────────────────────────

export const TenantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(128),
  plan: TenantPlan,
  settings: z.record(z.unknown()).default({}),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const CreateTenantSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(128),
  plan: TenantPlan.default("trial"),
});

export const UpdateTenantSchema = CreateTenantSchema.partial();

// ── Types ───────────────────────────────────────────────────────────────────

export type Tenant = z.infer<typeof TenantSchema>;
export type CreateTenant = z.infer<typeof CreateTenantSchema>;
export type UpdateTenant = z.infer<typeof UpdateTenantSchema>;
