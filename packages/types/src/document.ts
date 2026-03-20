import { z } from "zod";

// ── Enums ───────────────────────────────────────────────────────────────────

export const DocumentSourceType = z.enum([
  "upload",
  "scrape",
  "generated",
  "submission",
]);
export type DocumentSourceType = z.infer<typeof DocumentSourceType>;

// ── Schemas ─────────────────────────────────────────────────────────────────

export const DocumentSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  s3Key: z.string().min(1),
  filename: z.string().min(1).max(512),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().nonnegative(),
  sourceType: DocumentSourceType,
  entityType: z.string().optional(),
  entityId: z.string().uuid().optional(),
  uploadedBy: z.string().uuid(),
  createdAt: z.coerce.date(),
});

// ── Types ───────────────────────────────────────────────────────────────────

export type Document = z.infer<typeof DocumentSchema>;
