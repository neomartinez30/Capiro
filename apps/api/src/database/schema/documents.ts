import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  jsonb,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tenants } from './tenants';
import { users } from './users';

export const sourceTypeEnum = pgEnum('source_type', [
  'upload',
  'scrape',
  'generated',
  'submission',
]);

export const documents = pgTable('documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  s3Key: varchar('s3_key', { length: 1024 }).notNull(),
  filename: varchar('filename', { length: 512 }).notNull(),
  mimeType: varchar('mime_type', { length: 128 }).notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  sourceType: sourceTypeEnum('source_type').notNull().default('upload'),
  entityType: varchar('entity_type', { length: 64 }),
  entityId: uuid('entity_id'),
  uploadedBy: uuid('uploaded_by').references(() => users.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const documentsRelations = relations(documents, ({ one }) => ({
  tenant: one(tenants, {
    fields: [documents.tenantId],
    references: [tenants.id],
  }),
  uploader: one(users, {
    fields: [documents.uploadedBy],
    references: [users.id],
  }),
}));

export const documentChunks = pgTable('document_chunks', {
  id: uuid('id').defaultRandom().primaryKey(),
  documentId: uuid('document_id')
    .notNull()
    .references(() => documents.id, { onDelete: 'cascade' }),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  chunkIndex: integer('chunk_index').notNull(),
  content: text('content').notNull(),
  embedding: text('embedding'),
  tokenCount: integer('token_count').notNull(),
  metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const documentChunksRelations = relations(documentChunks, ({ one }) => ({
  document: one(documents, {
    fields: [documentChunks.documentId],
    references: [documents.id],
  }),
  tenant: one(tenants, {
    fields: [documentChunks.tenantId],
    references: [tenants.id],
  }),
}));
