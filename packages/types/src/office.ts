import { z } from "zod";

// ── Enums ───────────────────────────────────────────────────────────────────

export const Chamber = z.enum(["senate", "house"]);
export type Chamber = z.infer<typeof Chamber>;

// ── Schemas ─────────────────────────────────────────────────────────────────

export const OfficeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  chamber: Chamber,
  state: z.string().min(2).max(2),
  district: z.string().optional(),
  party: z.string().optional(),
  websiteUrl: z.string().url().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  profileData: z.record(z.unknown()).optional(),
  lastSyncedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// ── Types ───────────────────────────────────────────────────────────────────

export type Office = z.infer<typeof OfficeSchema>;
