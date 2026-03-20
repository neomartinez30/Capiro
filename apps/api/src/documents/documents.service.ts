import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';
import { PaginationQueryDto } from '../common/dto/pagination.dto';

@Injectable()
export class DocumentsService {
  constructor(@Inject('DATABASE') private db: NodePgDatabase<typeof schema>) {}

  async findAll(tenantId: string, pagination: PaginationQueryDto) {
    const { page = 1, limit = 20 } = pagination;
    const offset = (page - 1) * limit;

    const items = await this.db
      .select()
      .from(schema.documents)
      .where(eq(schema.documents.tenantId, tenantId))
      .limit(limit)
      .offset(offset);

    return { data: items, meta: { page, limit } };
  }

  async findOne(id: string, tenantId: string) {
    const [doc] = await this.db
      .select()
      .from(schema.documents)
      .where(and(eq(schema.documents.id, id), eq(schema.documents.tenantId, tenantId)));
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async create(data: any) {
    const [doc] = await this.db.insert(schema.documents).values(data).returning();
    return doc;
  }

  async remove(id: string, tenantId: string) {
    const [doc] = await this.db
      .delete(schema.documents)
      .where(and(eq(schema.documents.id, id), eq(schema.documents.tenantId, tenantId)))
      .returning();
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }
}
