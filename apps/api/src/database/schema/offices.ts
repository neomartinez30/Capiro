import {
  pgTable,
  uuid,
  varchar,
  jsonb,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const chamberEnum = pgEnum('chamber', ['senate', 'house']);

export const offices = pgTable('offices', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  chamber: chamberEnum('chamber').notNull(),
  state: varchar('state', { length: 2 }).notNull(),
  district: varchar('district', { length: 16 }),
  party: varchar('party', { length: 64 }),
  websiteUrl: varchar('website_url', { length: 2048 }),
  phone: varchar('phone', { length: 32 }),
  address: varchar('address', { length: 512 }),
  profileData: jsonb('profile_data').$type<Record<string, unknown>>().default({}),
  automationTemplate: jsonb('automation_template').$type<Record<string, unknown>>().default({}),
  lastSyncedAt: timestamp('last_synced_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
