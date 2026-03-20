import { z } from "zod";

// ── Enums ───────────────────────────────────────────────────────────────────

export const WorkflowStepType = z.enum([
  "review",
  "approve",
  "generate",
  "route",
  "notify",
  "automate",
]);
export type WorkflowStepType = z.infer<typeof WorkflowStepType>;

export const WorkflowStatus = z.enum([
  "pending",
  "running",
  "paused",
  "completed",
  "failed",
]);
export type WorkflowStatus = z.infer<typeof WorkflowStatus>;

// ── Schemas ─────────────────────────────────────────────────────────────────

export const WorkflowStepSchema = z.object({
  id: z.string().uuid(),
  type: WorkflowStepType,
  config: z.record(z.unknown()).default({}),
  nextStepId: z.string().uuid().optional(),
  timeoutMinutes: z.number().int().positive().optional(),
});

export const WorkflowDefinitionSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  steps: z.array(WorkflowStepSchema),
  createdBy: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// ── Types ───────────────────────────────────────────────────────────────────

export type WorkflowStep = z.infer<typeof WorkflowStepSchema>;
export type WorkflowDefinition = z.infer<typeof WorkflowDefinitionSchema>;
