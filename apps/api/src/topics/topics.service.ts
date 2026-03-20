import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';
import { PaginationQueryDto } from '../common/dto/pagination.dto';

@Injectable()
export class TopicsService {
  constructor(@Inject('DATABASE') private db: NodePgDatabase<typeof schema>) {}

  async findAll(tenantId: string, pagination: PaginationQueryDto) {
    const { page = 1, limit = 20 } = pagination;
    const offset = (page - 1) * limit;

    const items = await this.db
      .select()
      .from(schema.topics)
      .where(eq(schema.topics.tenantId, tenantId))
      .limit(limit)
      .offset(offset);

    return { data: items, meta: { page, limit } };
  }

  async findOne(id: string, tenantId: string) {
    const [topic] = await this.db
      .select()
      .from(schema.topics)
      .where(and(eq(schema.topics.id, id), eq(schema.topics.tenantId, tenantId)));
    if (!topic) throw new NotFoundException('Topic not found');
    return topic;
  }

  async create(data: any) {
    const [topic] = await this.db.insert(schema.topics).values(data).returning();
    return topic;
  }

  async update(id: string, tenantId: string, data: any) {
    const [topic] = await this.db
      .update(schema.topics)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(schema.topics.id, id), eq(schema.topics.tenantId, tenantId)))
      .returning();
    if (!topic) throw new NotFoundException('Topic not found');
    return topic;
  }

  async remove(id: string, tenantId: string) {
    const [topic] = await this.db
      .delete(schema.topics)
      .where(and(eq(schema.topics.id, id), eq(schema.topics.tenantId, tenantId)))
      .returning();
    if (!topic) throw new NotFoundException('Topic not found');
    return topic;
  }
}
