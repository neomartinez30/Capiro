import { z } from "zod";

// ── Enums ───────────────────────────────────────────────────────────────────

export const TopicStatus = z.enum(["active", "monitoring", "archived"]);
export type TopicStatus = z.infer<typeof TopicStatus>;

// ── Schemas ─────────────────────────────────────────────────────────────────

export const TopicSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  clientId: z.string().uuid(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  policyArea: z.string().optional(),
  status: TopicStatus,
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const CreateTopicSchema = z.object({
  tenantId: z.string().uuid(),
  clientId: z.string().uuid(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  policyArea: z.string().optional(),
  status: TopicStatus.default("active"),
  metadata: z.record(z.unknown()).optional(),
});

export const UpdateTopicSchema = CreateTopicSchema.omit({
  tenantId: true,
  clientId: true,
}).partial();

// ── Types ───────────────────────────────────────────────────────────────────

export type Topic = z.infer<typeof TopicSchema>;
export type CreateTopic = z.infer<typeof CreateTopicSchema>;
export type UpdateTopic = z.infer<typeof UpdateTopicSchema>;
