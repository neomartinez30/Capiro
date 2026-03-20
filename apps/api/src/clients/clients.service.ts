import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';
import { PaginationQueryDto } from '../common/dto/pagination.dto';

@Injectable()
export class ClientsService {
  constructor(@Inject('DATABASE') private db: NodePgDatabase<typeof schema>) {}

  async findAll(tenantId: string, pagination: PaginationQueryDto) {
    const { page = 1, limit = 20 } = pagination;
    const offset = (page - 1) * limit;

    const items = await this.db
      .select()
      .from(schema.clients)
      .where(eq(schema.clients.tenantId, tenantId))
      .limit(limit)
      .offset(offset);

    return { data: items, meta: { page, limit } };
  }

  async findOne(id: string, tenantId: string) {
    const [client] = await this.db
      .select()
      .from(schema.clients)
      .where(and(eq(schema.clients.id, id), eq(schema.clients.tenantId, tenantId)));
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  async create(data: any) {
    const [client] = await this.db.insert(schema.clients).values(data).returning();
    return client;
  }

  async update(id: string, tenantId: string, data: any) {
    const [client] = await this.db
      .update(schema.clients)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(schema.clients.id, id), eq(schema.clients.tenantId, tenantId)))
      .returning();
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  async remove(id: string, tenantId: string) {
    const [client] = await this.db
      .delete(schema.clients)
      .where(and(eq(schema.clients.id, id), eq(schema.clients.tenantId, tenantId)))
      .returning();
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }
}
