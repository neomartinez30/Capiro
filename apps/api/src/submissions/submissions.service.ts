import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';
import { PaginationQueryDto } from '../common/dto/pagination.dto';

@Injectable()
export class SubmissionsService {
  constructor(@Inject('DATABASE') private db: NodePgDatabase<typeof schema>) {}

  async findAll(tenantId: string, pagination: PaginationQueryDto) {
    const { page = 1, limit = 20 } = pagination;
    const offset = (page - 1) * limit;

    const items = await this.db
      .select()
      .from(schema.submissions)
      .where(eq(schema.submissions.tenantId, tenantId))
      .limit(limit)
      .offset(offset);

    return { data: items, meta: { page, limit } };
  }

  async findOne(id: string, tenantId: string) {
    const [submission] = await this.db
      .select()
      .from(schema.submissions)
      .where(and(eq(schema.submissions.id, id), eq(schema.submissions.tenantId, tenantId)));
    if (!submission) throw new NotFoundException('Submission not found');
    return submission;
  }

  async create(data: any) {
    const [submission] = await this.db.insert(schema.submissions).values(data).returning();
    return submission;
  }

  async update(id: string, tenantId: string, data: any) {
    const [submission] = await this.db
      .update(schema.submissions)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(schema.submissions.id, id), eq(schema.submissions.tenantId, tenantId)))
      .returning();
    if (!submission) throw new NotFoundException('Submission not found');
    return submission;
  }

  async updateStatus(id: string, tenantId: string, status: string, userId: string) {
    const updateData: any = { status, updatedAt: new Date() };
    if (status === 'approved') {
      updateData.approvedBy = userId;
      updateData.approvedAt = new Date();
    } else if (status === 'submitted') {
      updateData.submittedAt = new Date();
    }

    const [submission] = await this.db
      .update(schema.submissions)
      .set(updateData)
      .where(and(eq(schema.submissions.id, id), eq(schema.submissions.tenantId, tenantId)))
      .returning();
    if (!submission) throw new NotFoundException('Submission not found');
    return submission;
  }

  async remove(id: string, tenantId: string) {
    const [submission] = await this.db
      .delete(schema.submissions)
      .where(and(eq(schema.submissions.id, id), eq(schema.submissions.tenantId, tenantId)))
      .returning();
    if (!submission) throw new NotFoundException('Submission not found');
    return submission;
  }
}
