import {
  pgTable,
  uuid,
  varchar,
  jsonb,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const planEnum = pgEnum('plan', [
  'trial',
  'starter',
  'professional',
  'enterprise',
]);

export const tenants = pgTable('tenants', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 128 }).notNull().unique(),
  plan: planEnum('plan').notNull().default('trial'),
  settings: jsonb('settings').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
