import { z } from "zod";

// ── Pagination ──────────────────────────────────────────────────────────────

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type Pagination = z.infer<typeof PaginationSchema>;

// ── Pagination Meta ─────────────────────────────────────────────────────────

export const PaginationMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
});

export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

// ── API Response ────────────────────────────────────────────────────────────

export function ApiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    data: dataSchema,
    meta: PaginationMetaSchema.optional(),
  });
}

export type ApiResponse<T> = {
  data: T;
  meta?: PaginationMeta;
};
