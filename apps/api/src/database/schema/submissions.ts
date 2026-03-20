import {
  pgTable,
  uuid,
  varchar,
  text,
  jsonb,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tenants } from './tenants';
import { clients } from './clients';
import { topics } from './topics';
import { users } from './users';

export const submissionTypeEnum = pgEnum('submission_type', [
  'letter',
  'testimony',
  'comment',
  'white_paper',
  'amendment',
]);

export const submissionStatusEnum = pgEnum('submission_status', [
  'draft',
  'in_review',
  'approved',
  'submitted',
  'archived',
]);

export const submissions = pgTable('submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  clientId: uuid('client_id')
    .notNull()
    .references(() => clients.id, { onDelete: 'cascade' }),
  topicId: uuid('topic_id')
    .notNull()
    .references(() => topics.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 512 }).notNull(),
  content: text('content'),
  submissionType: submissionTypeEnum('submission_type').notNull(),
  status: submissionStatusEnum('status').notNull().default('draft'),
  createdBy: uuid('created_by').references(() => users.id, {
    onDelete: 'set null',
  }),
  approvedBy: uuid('approved_by').references(() => users.id, {
    onDelete: 'set null',
  }),
  approvedAt: timestamp('approved_at', { withTimezone: true }),
  submittedAt: timestamp('submitted_at', { withTimezone: true }),
  metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const submissionsRelations = relations(submissions, ({ one }) => ({
  tenant: one(tenants, {
    fields: [submissions.tenantId],
    references: [tenants.id],
  }),
  client: one(clients, {
    fields: [submissions.clientId],
    references: [clients.id],
  }),
  topic: one(topics, {
    fields: [submissions.topicId],
    references: [topics.id],
  }),
  creator: one(users, {
    fields: [submissions.createdBy],
    references: [users.id],
  }),
  approver: one(users, {
    fields: [submissions.approvedBy],
    references: [users.id],
  }),
}));
