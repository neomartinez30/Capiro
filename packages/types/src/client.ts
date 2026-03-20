import { z } from "zod";

// ── Enums ───────────────────────────────────────────────────────────────────

export const ClientStatus = z.enum(["active", "inactive", "prospect"]);
export type ClientStatus = z.infer<typeof ClientStatus>;

// ── Schemas ─────────────────────────────────────────────────────────────────

export const ClientSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  organizationId: z.string().uuid(),
  name: z.string().min(1).max(255),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  industry: z.string().optional(),
  profileData: z.record(z.unknown()).optional(),
  status: ClientStatus,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const CreateClientSchema = z.object({
  tenantId: z.string().uuid(),
  organizationId: z.string().uuid(),
  name: z.string().min(1).max(255),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  industry: z.string().optional(),
  profileData: z.record(z.unknown()).optional(),
  status: ClientStatus.default("active"),
});

export const UpdateClientSchema = CreateClientSchema.omit({
  tenantId: true,
  organizationId: true,
}).partial();

// ── Types ───────────────────────────────────────────────────────────────────

export type Client = z.infer<typeof ClientSchema>;
export type CreateClient = z.infer<typeof CreateClientSchema>;
export type UpdateClient = z.infer<typeof UpdateClientSchema>;
