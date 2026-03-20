import { z } from "zod";

// ── Schemas ─────────────────────────────────────────────────────────────────

export const OrganizationSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  name: z.string().min(1).max(255),
  websiteUrl: z.string().url().optional(),
  description: z.string().optional(),
  profileData: z.record(z.unknown()).optional(),
  logoUrl: z.string().url().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const CreateOrganizationSchema = z.object({
  tenantId: z.string().uuid(),
  name: z.string().min(1).max(255),
  websiteUrl: z.string().url().optional(),
  description: z.string().optional(),
  profileData: z.record(z.unknown()).optional(),
  logoUrl: z.string().url().optional(),
});

export const UpdateOrganizationSchema = CreateOrganizationSchema.omit({
  tenantId: true,
}).partial();

// ── Types ───────────────────────────────────────────────────────────────────

export type Organization = z.infer<typeof OrganizationSchema>;
export type CreateOrganization = z.infer<typeof CreateOrganizationSchema>;
export type UpdateOrganization = z.infer<typeof UpdateOrganizationSchema>;
