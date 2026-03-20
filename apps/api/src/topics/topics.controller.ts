import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TenantGuard } from '../auth/tenant.guard';
import { Tenant } from '../auth/decorators/tenant.decorator';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { TopicsService } from './topics.service';

@Controller('topics')
@UseGuards(AuthGuard('jwt'), TenantGuard)
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  findAll(@Tenant() tenantId: string, @Query() pagination: PaginationQueryDto) {
    return this.topicsService.findAll(tenantId, pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Tenant() tenantId: string) {
    return this.topicsService.findOne(id, tenantId);
  }

  @Post()
  create(@Body() body: any, @Tenant() tenantId: string) {
    return this.topicsService.create({ ...body, tenantId });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Tenant() tenantId: string) {
    return this.topicsService.update(id, tenantId, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Tenant() tenantId: string) {
    return this.topicsService.remove(id, tenantId);
  }
}
