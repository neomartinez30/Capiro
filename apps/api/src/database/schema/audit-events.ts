import {
  pgTable,
  uuid,
  varchar,
  jsonb,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tenants } from './tenants';
import { users } from './users';

export const auditEvents = pgTable('audit_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  action: varchar('action', { length: 128 }).notNull(),
  resourceType: varchar('resource_type', { length: 64 }).notNull(),
  resourceId: uuid('resource_id'),
  metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const auditEventsRelations = relations(auditEvents, ({ one }) => ({
  tenant: one(tenants, {
    fields: [auditEvents.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [auditEvents.userId],
    references: [users.id],
  }),
}));
