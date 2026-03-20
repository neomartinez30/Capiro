import {
  pgTable,
  uuid,
  varchar,
  jsonb,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tenants } from './tenants';
import { organizations } from './organizations';

export const clientStatusEnum = pgEnum('client_status', [
  'active',
  'inactive',
  'prospect',
]);

export const clients = pgTable('clients', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  contactEmail: varchar('contact_email', { length: 320 }),
  contactPhone: varchar('contact_phone', { length: 32 }),
  industry: varchar('industry', { length: 128 }),
  profileData: jsonb('profile_data').$type<Record<string, unknown>>().default({}),
  status: clientStatusEnum('status').notNull().default('prospect'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const clientsRelations = relations(clients, ({ one }) => ({
  tenant: one(tenants, {
    fields: [clients.tenantId],
    references: [tenants.id],
  }),
  organization: one(organizations, {
    fields: [clients.organizationId],
    references: [organizations.id],
  }),
}));
