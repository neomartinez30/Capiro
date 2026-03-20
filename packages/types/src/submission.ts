import { z } from "zod";

// ── Enums ───────────────────────────────────────────────────────────────────

export const SubmissionType = z.enum([
  "letter",
  "testimony",
  "comment",
  "white_paper",
  "amendment",
]);
export type SubmissionType = z.infer<typeof SubmissionType>;

export const SubmissionStatus = z.enum([
  "draft",
  "in_review",
  "approved",
  "submitted",
  "archived",
]);
export type SubmissionStatus = z.infer<typeof SubmissionStatus>;

// ── Schemas ─────────────────────────────────────────────────────────────────

export const SubmissionSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  clientId: z.string().uuid(),
  topicId: z.string().uuid(),
  title: z.string().min(1).max(255),
  content: z.string().optional(),
  submissionType: SubmissionType,
  status: SubmissionStatus,
  createdBy: z.string().uuid(),
  approvedBy: z.string().uuid().optional(),
  approvedAt: z.coerce.date().optional(),
  submittedAt: z.coerce.date().optional(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const CreateSubmissionSchema = z.object({
  tenantId: z.string().uuid(),
  clientId: z.string().uuid(),
  topicId: z.string().uuid(),
  title: z.string().min(1).max(255),
  content: z.string().optional(),
  submissionType: SubmissionType,
  status: SubmissionStatus.default("draft"),
  createdBy: z.string().uuid(),
  metadata: z.record(z.unknown()).optional(),
});

export const UpdateSubmissionSchema = CreateSubmissionSchema.omit({
  tenantId: true,
  clientId: true,
  topicId: true,
  createdBy: true,
}).partial();

export const UpdateSubmissionStatusSchema = z.object({
  status: SubmissionStatus,
});

// ── Types ───────────────────────────────────────────────────────────────────

export type Submission = z.infer<typeof SubmissionSchema>;
export type CreateSubmission = z.infer<typeof CreateSubmissionSchema>;
export type UpdateSubmission = z.infer<typeof UpdateSubmissionSchema>;
export type UpdateSubmissionStatus = z.infer<typeof UpdateSubmissionStatusSchema>;
