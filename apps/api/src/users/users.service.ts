import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';

@Injectable()
export class UsersService {
  constructor(@Inject('DATABASE') private db: NodePgDatabase<typeof schema>) {}

  async findByTenant(tenantId: string) {
    return this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.tenantId, tenantId));
  }

  async findOne(id: string, tenantId: string) {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(and(eq(schema.users.id, id), eq(schema.users.tenantId, tenantId)));
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByCognitoSub(cognitoSub: string) {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.cognitoSub, cognitoSub));
    return user;
  }
}
