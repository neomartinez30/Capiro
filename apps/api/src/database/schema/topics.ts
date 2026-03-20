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

export const topicStatusEnum = pgEnum('topic_status', [
  'active',
  'monitoring',
  'archived',
]);

export const topics = pgTable('topics', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  clientId: uuid('client_id')
    .notNull()
    .references(() => clients.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 512 }).notNull(),
  description: text('description'),
  policyArea: varchar('policy_area', { length: 128 }),
  status: topicStatusEnum('status').notNull().default('active'),
  metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const topicsRelations = relations(topics, ({ one }) => ({
  tenant: one(tenants, {
    fields: [topics.tenantId],
    references: [tenants.id],
  }),
  client: one(clients, {
    fields: [topics.clientId],
    references: [clients.id],
  }),
}));
