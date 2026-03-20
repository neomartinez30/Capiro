import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tenants } from './tenants';

export const userRoleEnum = pgEnum('user_role', [
  'platform_admin',
  'firm_admin',
  'lobbyist',
  'analyst',
  'client',
]);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  cognitoSub: varchar('cognito_sub', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 320 }).notNull().unique(),
  firstName: varchar('first_name', { length: 128 }).notNull(),
  lastName: varchar('last_name', { length: 128 }).notNull(),
  role: userRoleEnum('role').notNull().default('analyst'),
  avatarUrl: varchar('avatar_url', { length: 2048 }),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const usersRelations = relations(users, ({ one }) => ({
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id],
  }),
}));

export const userRoles = pgTable('user_roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  role: userRoleEnum('role').notNull(),
  resourceType: varchar('resource_type', { length: 64 }),
  resourceId: uuid('resource_id'),
  grantedBy: uuid('granted_by').references(() => users.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  tenant: one(tenants, {
    fields: [userRoles.tenantId],
    references: [tenants.id],
  }),
  grantor: one(users, {
    fields: [userRoles.grantedBy],
    references: [users.id],
  }),
}));
