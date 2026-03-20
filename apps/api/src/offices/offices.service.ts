import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, ilike, or } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';
import { PaginationQueryDto } from '../common/dto/pagination.dto';

@Injectable()
export class OfficesService {
  constructor(@Inject('DATABASE') private db: NodePgDatabase<typeof schema>) {}

  async findAll(pagination: PaginationQueryDto) {
    const { page = 1, limit = 20 } = pagination;
    const offset = (page - 1) * limit;

    const items = await this.db
      .select()
      .from(schema.offices)
      .limit(limit)
      .offset(offset);

    return { data: items, meta: { page, limit } };
  }

  async search(query: string, pagination: PaginationQueryDto) {
    const { page = 1, limit = 20 } = pagination;
    const offset = (page - 1) * limit;
    const pattern = `%${query}%`;

    const items = await this.db
      .select()
      .from(schema.offices)
      .where(
        or(
          ilike(schema.offices.name, pattern),
          ilike(schema.offices.state, pattern),
        ),
      )
      .limit(limit)
      .offset(offset);

    return { data: items, meta: { page, limit, query } };
  }

  async findOne(id: string) {
    const [office] = await this.db
      .select()
      .from(schema.offices)
      .where(eq(schema.offices.id, id));
    if (!office) throw new NotFoundException('Office not found');
    return office;
  }
}
