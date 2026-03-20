import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';

@Injectable()
export class TenantsService {
  constructor(@Inject('DATABASE') private db: NodePgDatabase<typeof schema>) {}

  async findAll() {
    return this.db.select().from(schema.tenants);
  }

  async findOne(id: string) {
    const [tenant] = await this.db
      .select()
      .from(schema.tenants)
      .where(eq(schema.tenants.id, id));
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }
}
