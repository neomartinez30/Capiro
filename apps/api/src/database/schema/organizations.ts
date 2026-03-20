import {
  pgTable,
  uuid,
  varchar,
  text,
  jsonb,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tenants } from './tenants';

export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  websiteUrl: varchar('website_url', { length: 2048 }),
  description: text('description'),
  profileData: jsonb('profile_data').$type<Record<string, unknown>>().default({}),
  logoUrl: varchar('logo_url', { length: 2048 }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const organizationsRelations = relations(organizations, ({ one }) => ({
  tenant: one(tenants, {
    fields: [organizations.tenantId],
    references: [tenants.id],
  }),
}));
